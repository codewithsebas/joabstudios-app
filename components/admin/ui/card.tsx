import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Superficie blanca del panel: borde sutil y sombra suave, como la tarjeta del login. */
export function Card({
  children,
  className,
  as: Tag = 'section',
  ...rest
}: {
  children: ReactNode
  className?: string
  as?: 'section' | 'div' | 'aside' | 'article'
  'aria-labelledby'?: string
  'aria-label'?: string
}) {
  return (
    <Tag
      className={cn(
        'rounded-[1.5rem] bg-white shadow-[0_1px_2px_rgba(23,22,20,0.04),0_18px_40px_-28px_rgba(23,22,20,0.28)] ring-1 ring-charcoal/[0.07]',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function CardHeader({
  title,
  description,
  action,
  id,
  className,
}: {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  id?: string
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap items-start justify-between gap-4 border-b border-charcoal/[0.07] px-5 py-4 sm:px-6', className)}>
      <div className="min-w-0">
        <h2 id={id} className="font-ui text-[0.95rem] font-semibold text-charcoal">
          {title}
        </h2>
        {description ? <p className="mt-0.5 font-ui text-[0.8125rem] text-stone">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('px-5 py-5 sm:px-6', className)}>{children}</div>
}

/** Tarjeta de métrica que actúa como filtro (enlace). */
export function StatCard({
  label,
  value,
  href,
  active = false,
  dotClass,
}: {
  label: string
  value: number
  href: string
  active?: boolean
  dotClass?: string
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'group block rounded-[1.25rem] p-4 font-ui ring-1 transition-[background-color,box-shadow,transform] duration-200 ease-out-soft hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage/60',
        active
          ? 'bg-forest text-white shadow-[0_14px_30px_-18px_rgba(23,45,41,0.8)] ring-forest'
          : 'bg-white text-charcoal shadow-[0_1px_2px_rgba(23,22,20,0.04)] ring-charcoal/[0.07] hover:shadow-[0_14px_30px_-22px_rgba(23,22,20,0.35)]',
      )}
    >
      <span className={cn('flex items-center gap-2 text-[0.8125rem]', active ? 'text-white/75' : 'text-stone')}>
        {dotClass ? <span aria-hidden className={cn('size-2 rounded-full', dotClass)} /> : null}
        {label}
      </span>
      <span className="mt-2 block font-sans text-[2rem] font-semibold leading-none tracking-[-0.04em]">{value}</span>
    </Link>
  )
}
