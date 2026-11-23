import type { ReactNode } from 'react'
import { AlertCircle, AlertTriangle, CheckCircle2, Info, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export type AlertTone = 'info' | 'success' | 'warning' | 'danger'

export const alertTones: Record<AlertTone, { box: string; icon: string; Icon: LucideIcon }> = {
  info: { box: 'bg-sky-50 text-sky-900 ring-sky-200', icon: 'text-sky-600', Icon: Info },
  success: { box: 'bg-emerald-50 text-emerald-900 ring-emerald-200', icon: 'text-emerald-600', Icon: CheckCircle2 },
  warning: { box: 'bg-amber-50 text-amber-900 ring-amber-200', icon: 'text-amber-600', Icon: AlertTriangle },
  danger: { box: 'bg-red-50 text-red-900 ring-red-200', icon: 'text-red-600', Icon: AlertCircle },
}

/** Aviso fijo dentro de la página (errores de carga, configuración pendiente, etc.). */
export function Alert({
  tone = 'info',
  title,
  children,
  className,
}: {
  tone?: AlertTone
  title: ReactNode
  children?: ReactNode
  className?: string
}) {
  const { box, icon, Icon } = alertTones[tone]
  return (
    <div
      role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'}
      className={cn('flex gap-3 rounded-2xl p-4 font-ui text-sm ring-1 ring-inset', box, className)}
    >
      <Icon aria-hidden className={cn('mt-0.5 size-[1.125rem] shrink-0', icon)} />
      <div className="min-w-0">
        <p className="font-semibold">{title}</p>
        {children ? <div className="mt-1 leading-relaxed opacity-90">{children}</div> : null}
      </div>
    </div>
  )
}
