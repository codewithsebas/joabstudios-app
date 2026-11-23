import type { ReactNode } from 'react'
import { Container, Eyebrow } from './layout'

/** Shared top-of-page header for inner pages (sits below the fixed navbar). */
export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  children?: ReactNode
}) {
  return (
    <header className="pb-14 pt-36 sm:pb-20 sm:pt-44">
      <Container>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-7 max-w-5xl text-balance text-[clamp(2.6rem,6.4vw,5.75rem)] font-medium leading-[0.98] tracking-[-0.045em] text-charcoal">
          {title}
        </h1>
        {intro ? (
          <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-stone">{intro}</p>
        ) : null}
        {children}
      </Container>
    </header>
  )
}
