'use server'

import { createHash } from 'node:crypto'
import { headers } from 'next/headers'
import { after } from 'next/server'
import type { z } from 'zod'
import { createSupabaseSecretClient } from '@/lib/supabase/admin'
import type { LeadInsert } from '@/lib/supabase/database.types'
import { notifyNewLead } from '@/lib/notifications/lead-email'
import { log } from '@/lib/log'
import { quoteSchema, spamGuardSchema, type SubmitResult } from './schema'

const MIN_FILL_MS = 3_000
const MAX_FORM_AGE_MS = 1000 * 60 * 60 * 24
const RATE_LIMIT = { max: 5, windowMs: 1000 * 60 * 60 }


function fieldErrorsFrom(error: z.ZodError): Partial<Record<string, string>> {
  const result: Partial<Record<string, string>> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form')
    result[key] ??= issue.message
  }
  return result
}

async function clientFingerprint(): Promise<{ ipHash: string | null; userAgent: string | null }> {
  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip')?.trim() || null
  const salt = process.env.LEAD_IP_SALT?.trim() || process.env.SUPABASE_SECRET_KEY?.trim() || ''
  return {
    ipHash: ip ? createHash('sha256').update(`${salt}:${ip}`).digest('hex') : null,
    userAgent: h.get('user-agent')?.slice(0, 400) ?? null,
  }
}

type GuardOutcome = { kind: 'ok' } | { kind: 'reject'; result: SubmitResult } | { kind: 'silent' }

function checkSpamGuard(raw: unknown): GuardOutcome {
  const parsed = spamGuardSchema.safeParse(raw)
  if (!parsed.success) return { kind: 'reject', result: { ok: false, error: 'generic' } }
  const { nickname, startedAt } = parsed.data
  // Bots that fill the honeypot get a neutral response and nothing is stored.
  if (nickname.trim() !== '') return { kind: 'silent' }
  const elapsed = Date.now() - startedAt
  if (elapsed < MIN_FILL_MS || elapsed > MAX_FORM_AGE_MS) {
    return {
      kind: 'reject',
      result: { ok: false, error: 'reload' },
    }
  }
  return { kind: 'ok' }
}

async function persistLead(insert: Omit<LeadInsert, 'ip_hash' | 'user_agent'>): Promise<SubmitResult> {
  const supabase = createSupabaseSecretClient()
  if (!supabase) {
    log.error('lead_submit_unavailable', new Error('Supabase is not configured'), { source: insert.source })
    return { ok: false, error: 'notConfigured' }
  }

  const { ipHash, userAgent } = await clientFingerprint()

  if (ipHash) {
    const since = new Date(Date.now() - RATE_LIMIT.windowMs).toISOString()
    const { count, error } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('created_at', since)
    if (error) {
      log.error('lead_rate_limit_check_failed', error, { source: insert.source })
      return { ok: false, error: 'generic' }
    }
    if ((count ?? 0) >= RATE_LIMIT.max) {
      return {
        ok: false,
        error: 'rateLimited',
      }
    }
  }

  const { data, error } = await supabase
    .from('leads')
    .insert({ ...insert, ip_hash: ipHash, user_agent: userAgent })
    .select('*')
    .single()

  if (error || !data) {
    log.error('lead_insert_failed', error ?? new Error('No row returned'), { source: insert.source })
    return { ok: false, error: 'generic' }
  }

  // Notify after the response is sent; the lead is already safely stored.
  after(async () => {
    await notifyNewLead(data)
  })

  return { ok: true }
}

function normalizeWebsite(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

export async function submitQuote(values: unknown, guard: unknown): Promise<SubmitResult> {
  const spam = checkSpamGuard(guard)
  if (spam.kind === 'silent') return { ok: true }
  if (spam.kind === 'reject') return spam.result

  const parsed = quoteSchema.safeParse(values)
  if (!parsed.success) {
    return { ok: false, error: 'invalid', fieldErrors: fieldErrorsFrom(parsed.error) }
  }
  const v = parsed.data

  return persistLead({
    source: 'quote',
    accommodation_type: v.projectType,
    services: Array.from(new Set(v.services)),
    business_name: v.businessName,
    location: v.location,
    website: normalizeWebsite(v.website),
    units: v.units ? Number(v.units) : null,
    full_name: v.fullName,
    email: v.email.toLowerCase(),
    whatsapp: v.whatsapp,
    budget: v.budget,
    message: v.message,
  })
}
