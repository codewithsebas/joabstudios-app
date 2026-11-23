import type { ReactNode } from 'react'
import type { LeadStatus } from '@/lib/supabase/database.types'
import { leadStatusLabel, leadStatusTone } from '@/lib/leads/status'
import { cn } from '@/lib/cn'

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 font-ui text-xs font-medium ring-1 ring-inset',
        className,
      )}
    >
      {children}
    </span>
  )
}

/** Estado del prospecto con su color y etiqueta en español. */
export function StatusBadge({ status }: { status: LeadStatus }) {
  const tone = leadStatusTone[status]
  return (
    <Badge className={tone.badge}>
      <span aria-hidden className={cn('size-1.5 rounded-full', tone.dot)} />
      {leadStatusLabel[status]}
    </Badge>
  )
}
