import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * One horizontal system for the whole site. Page gutter (12px / 16px) plus
 * panel padding (20 / 32 / 40px) puts every piece of content on the same
 * left edge: 32px on mobile, 48px on tablet, 56px on desktop.
 *  - inset="page": content sitting directly on the page.
 *  - inset="panel": content inside a full-width rounded panel (the panel
 *    already provides the gutter).
 */
export function Container({
  children,
  className,
  inset = 'page',
}: {
  children: ReactNode
  className?: string
  inset?: 'page' | 'panel'
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full',
        inset === 'page' ? 'max-w-[120rem] px-8 sm:px-12 lg:px-14' : 'max-w-[117rem] px-5 sm:px-8 lg:px-10',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function Eyebrow({
  children,
  className,
  tone = 'dark',
}: {
  children: ReactNode
  className?: string
  tone?: 'dark' | 'light'
}) {
  return (
    <p
      className={cn(
        'label-caps inline-flex items-center gap-2.5',
        tone === 'dark' ? 'text-stone' : 'text-sage',
        className,
      )}
    >
      <span aria-hidden className={cn('size-1.5 rounded-full', tone === 'dark' ? 'bg-forest' : 'bg-sage')} />
      {children}
    </p>
  )
}

/** Standard section header: eyebrow, display title and optional intro. */
export function SectionHeader({
  eyebrow,
  title,
  intro,
  align = 'left',
  tone = 'dark',
  className,
  as: Heading = 'h2',
}: {
  eyebrow?: string
  title: ReactNode
  intro?: ReactNode
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
  className?: string
  as?: 'h1' | 'h2'
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
      <Heading
        className={cn(
          'text-balance text-[clamp(2.1rem,4.6vw,3.9rem)] font-medium leading-[1.02] tracking-[-0.035em]',
          tone === 'dark' ? 'text-charcoal' : 'text-ivory',
          align === 'center' ? 'max-w-4xl' : 'max-w-3xl',
        )}
      >
        {title}
      </Heading>
      {intro ? (
        <p
          className={cn(
            'text-pretty max-w-2xl text-base leading-relaxed sm:text-lg',
            tone === 'dark' ? 'text-stone' : 'text-ivory/70',
          )}
        >
          {intro}
        </p>
      ) : null}
    </div>
  )
}

export function Tag({ children, tone = 'dark' }: { children: ReactNode; tone?: 'dark' | 'light' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 font-ui text-xs',
        tone === 'dark' ? 'border-charcoal/15 text-stone' : 'border-ivory/20 text-ivory/75',
      )}
    >
      {children}
    </span>
  )
}
