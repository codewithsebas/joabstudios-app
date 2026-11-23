import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon
  title: string
  description?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-16 text-center font-ui', className)}>
      <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-ivory text-stone ring-1 ring-charcoal/[0.07]">
        <Icon aria-hidden className="size-6" />
      </span>
      <p className="mt-4 text-[0.95rem] font-semibold text-charcoal">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-sm leading-relaxed text-stone">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn('animate-pulse rounded-2xl bg-charcoal/[0.06]', className)} />
}
