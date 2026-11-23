import 'server-only'
import { requireAdmin } from '@/lib/auth/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { LeadEventRow, LeadRow, LeadStatus } from '@/lib/supabase/database.types'
import { log } from '@/lib/log'
import { isLeadStatus, leadStatusList } from './status'

/** Estados con etiqueta en español (fuente única: lib/leads/status.ts). */
export const leadStatuses = leadStatusList
export { isLeadStatus }

export type LeadSort = 'newest' | 'oldest' | 'follow_up' | 'quote_value'
export const leadSorts: Array<{ value: LeadSort; label: string }> = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'oldest', label: 'Más antiguos' },
  { value: 'follow_up', label: 'Próximo seguimiento' },
  { value: 'quote_value', label: 'Mayor cotización' },
]

export type LeadFilters = {
  q?: string
  status?: LeadStatus
  from?: string
  to?: string
  sort: LeadSort
}

const LIST_LIMIT = 200
const dateOnly = /^\d{4}-\d{2}-\d{2}$/

/** Bogotá is UTC-5 year-round; filter by local calendar days. */
const startOfDay = (date: string) => `${date}T00:00:00-05:00`
const endOfDay = (date: string) => `${date}T23:59:59.999-05:00`

export function parseLeadFilters(params: Record<string, string | string[] | undefined>): LeadFilters {
  const pick = (key: string) => {
    const value = params[key]
    return (Array.isArray(value) ? value[0] : value)?.trim() || undefined
  }
  const status = pick('status')
  const sort = pick('sort')
  const from = pick('from')
  const to = pick('to')
  return {
    q: pick('q')?.slice(0, 80),
    status: isLeadStatus(status) ? status : undefined,
    from: from && dateOnly.test(from) ? from : undefined,
    to: to && dateOnly.test(to) ? to : undefined,
    sort: leadSorts.some((s) => s.value === sort) ? (sort as LeadSort) : 'newest',
  }
}

export type LeadListItem = Pick<
  LeadRow,
  'id' | 'created_at' | 'status' | 'source' | 'full_name' | 'business_name' | 'accommodation_type' | 'follow_up_date' | 'quote_value' | 'quote_currency' | 'location'
>

export type LeadDashboard = {
  counts: Record<LeadStatus, number> & { total: number }
  leads: LeadListItem[]
  truncated: boolean
}

export async function getLeadDashboard(filters: LeadFilters): Promise<LeadDashboard> {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()
  if (!supabase) throw new Error('Supabase is not configured')

  const counts = { total: 0, new: 0, contacted: 0, quoted: 0, negotiation: 0, won: 0, lost: 0 }
  const statusQuery = await supabase.from('leads').select('status')
  if (statusQuery.error) {
    log.error('crm_counts_failed', statusQuery.error)
    throw new Error('No se pudieron cargar las métricas.')
  }
  for (const row of statusQuery.data) {
    counts[row.status] += 1
    counts.total += 1
  }

  let query = supabase
    .from('leads')
    .select('id, created_at, status, source, full_name, business_name, accommodation_type, follow_up_date, quote_value, quote_currency, location')

  if (filters.status) query = query.eq('status', filters.status)
  if (filters.from) query = query.gte('created_at', startOfDay(filters.from))
  if (filters.to) query = query.lte('created_at', endOfDay(filters.to))
  if (filters.q) {
    // Strip characters with meaning in PostgREST filter syntax / LIKE patterns.
    const term = filters.q.replace(/[%_,()*\\:."']/g, ' ').trim()
    if (term) query = query.or(`full_name.ilike.%${term}%,business_name.ilike.%${term}%,email.ilike.%${term}%`)
  }

  switch (filters.sort) {
    case 'oldest':
      query = query.order('created_at', { ascending: true })
      break
    case 'follow_up':
      query = query.order('follow_up_date', { ascending: true, nullsFirst: false }).order('created_at', { ascending: false })
      break
    case 'quote_value':
      query = query.order('quote_value', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  const { data, error } = await query.limit(LIST_LIMIT + 1)
  if (error) {
    log.error('crm_list_failed', error)
    throw new Error('No se pudieron cargar los prospectos.')
  }

  return { counts, leads: data.slice(0, LIST_LIMIT), truncated: data.length > LIST_LIMIT }
}

export type LeadDetail = { lead: LeadRow; events: LeadEventRow[] }

export async function getLeadDetail(id: string): Promise<LeadDetail | null> {
  await requireAdmin()
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null
  const supabase = await createSupabaseServerClient()
  if (!supabase) throw new Error('Supabase is not configured')

  const [leadResult, eventsResult] = await Promise.all([
    supabase.from('leads').select('*').eq('id', id).maybeSingle(),
    supabase.from('lead_events').select('*').eq('lead_id', id).order('created_at', { ascending: false }).limit(200),
  ])

  if (leadResult.error || eventsResult.error) {
    log.error('crm_detail_failed', leadResult.error ?? eventsResult.error, { leadId: id })
    throw new Error('No se pudo cargar el prospecto.')
  }
  if (!leadResult.data) return null
  return { lead: leadResult.data, events: eventsResult.data }
}

const dateTime = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Bogota' })
const dateShort = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeZone: 'UTC' })

export const formatDateTime = (iso: string) => dateTime.format(new Date(iso))
/** For DATE columns (no time zone): render the calendar day as stored. */
export const formatDate = (date: string) => dateShort.format(new Date(`${date}T00:00:00Z`))
export function formatMoney(value: number | null, currency: string): string {
  if (value === null) return '—'
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)
}
