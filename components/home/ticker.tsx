import { useLocale } from 'next-intl'
import { getCompanyContent } from '@/lib/content/company'

/** Continuous capability strip (CSS-only marquee; paused for reduced motion via globals). */
export function Ticker() {
  const { capabilityTicker } = getCompanyContent(useLocale())
  const items = [...capabilityTicker, ...capabilityTicker]
  return (
    <section className="overflow-hidden border-b border-charcoal/10 py-7">
      <p className="sr-only">{capabilityTicker.join(', ')}</p>
      <div aria-hidden className="flex w-max animate-marquee items-center gap-10 hover:[animation-play-state:paused]">
        {items.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-10 whitespace-nowrap">
            <span className="text-lg font-medium tracking-[-0.02em] text-stone">{item}</span>
            <svg viewBox="0 0 12 12" className="size-2.5 text-sage">
              <path d="M6 0 7.4 4.6 12 6 7.4 7.4 6 12 4.6 7.4 0 6 4.6 4.6Z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </section>
  )
}
