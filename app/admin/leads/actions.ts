'use server'

import { refresh } from 'next/cache'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { log } from '@/lib/log'

export type ActionState = { status: 'idle' | 'success' | 'error'; message: string | null }

const uuid = z.uuid()

const trackingSchema = z.object({
  leadId: uuid,
  status: z.enum(['new', 'contacted', 'quoted', 'negotiation', 'won', 'lost']),
  followUpDate: z.union([z.literal(''), z.iso.date()]),
  quoteValue: z
    .string()
    .trim()
    .transform((value) => value.replace(/[^\d]/g, ''))
    .refine((value) => value === '' || (value.length <= 13 && Number(value) >= 0), 'Valor de cotización inválido.'),
})

/** Updates status, follow-up date and quote value. History is written by a DB trigger. */
export async function updateLeadTracking(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()

  const parsed = trackingSchema.safeParse({
    leadId: formData.get('leadId'),
    status: formData.get('status'),
    followUpDate: formData.get('followUpDate') ?? '',
    quoteValue: formData.get('quoteValue') ?? '',
  })
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Datos inválidos.' }
  }

  const supabase = await createSupabaseServerClient()
  if (!supabase) return { status: 'error', message: 'Supabase no está configurado.' }

  const { leadId, status, followUpDate, quoteValue } = parsed.data
  const { data, error } = await supabase
    .from('leads')
    .update({
      status,
      follow_up_date: followUpDate === '' ? null : followUpDate,
      quote_value: quoteValue === '' ? null : Number(quoteValue),
    })
    .eq('id', leadId)
    .select('id')

  if (error) {
    log.error('crm_update_failed', error, { leadId })
    return { status: 'error', message: 'No se pudieron guardar los cambios.' }
  }
  if (!data || data.length === 0) {
    return { status: 'error', message: 'No tienes permiso para modificar este prospecto o ya no existe.' }
  }

  refresh()
  return { status: 'success', message: 'Cambios guardados.' }
}

const noteSchema = z.object({
  leadId: uuid,
  body: z.string().trim().min(1, 'Escribe una nota.').max(4000, 'La nota es demasiado larga.'),
})

export async function addLeadNote(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin()

  const parsed = noteSchema.safeParse({ leadId: formData.get('leadId'), body: formData.get('body') })
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Nota inválida.' }
  }

  const supabase = await createSupabaseServerClient()
  if (!supabase) return { status: 'error', message: 'Supabase no está configurado.' }

  const { error } = await supabase.from('lead_events').insert({
    lead_id: parsed.data.leadId,
    actor_id: admin.userId,
    type: 'note',
    body: parsed.data.body,
  })

  if (error) {
    log.error('crm_note_failed', error, { leadId: parsed.data.leadId })
    return { status: 'error', message: 'No se pudo guardar la nota.' }
  }

  refresh()
  return { status: 'success', message: 'Nota agregada.' }
}
