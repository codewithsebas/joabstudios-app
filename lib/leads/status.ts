import type { LeadStatus } from '@/lib/supabase/database.types'

/**
 * Estados del embudo comercial: etiqueta en español y color. Sin dependencias
 * de servidor para poder usarlo en componentes cliente (desplegables, badges).
 */
export const leadStatusList: Array<{ value: LeadStatus; label: string }> = [
  { value: 'new', label: 'Nuevo' },
  { value: 'contacted', label: 'Contactado' },
  { value: 'quoted', label: 'Cotizado' },
  { value: 'negotiation', label: 'En negociación' },
  { value: 'won', label: 'Ganado' },
  { value: 'lost', label: 'Perdido' },
]

export const leadStatusLabel = Object.fromEntries(leadStatusList.map((s) => [s.value, s.label])) as Record<LeadStatus, string>

/** Punto de color y fondo de la etiqueta de cada estado. */
export const leadStatusTone: Record<LeadStatus, { dot: string; badge: string }> = {
  new: { dot: 'bg-sky-500', badge: 'bg-sky-50 text-sky-800 ring-sky-200' },
  contacted: { dot: 'bg-violet-500', badge: 'bg-violet-50 text-violet-800 ring-violet-200' },
  quoted: { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-800 ring-amber-200' },
  negotiation: { dot: 'bg-orange-500', badge: 'bg-orange-50 text-orange-800 ring-orange-200' },
  won: { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-800 ring-emerald-200' },
  lost: { dot: 'bg-stone', badge: 'bg-charcoal/5 text-stone ring-charcoal/10' },
}

export function isLeadStatus(value: string | undefined | null): value is LeadStatus {
  return leadStatusList.some((s) => s.value === value)
}
