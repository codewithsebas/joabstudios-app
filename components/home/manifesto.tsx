import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight, Globe, LayoutDashboard, Rocket } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Container, Eyebrow } from '@/components/ui/layout'
import { Reveal } from '@/components/motion/reveal'
import { getEditorialImages } from '@/lib/content/images'
import { getServices } from '@/lib/content/services'
import { getCompanyContent } from '@/lib/content/company'
import { cn } from '@/lib/cn'

function InlineIcon({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'mx-[0.12em] inline-flex size-[0.9em] translate-y-[0.06em] items-center justify-center rounded-full align-baseline',
        className,
      )}
    >
      <Icon className="size-[0.48em]" strokeWidth={2} />
    </span>
  )
}

export function Manifesto() {
  const locale = useLocale()
  const t = useTranslations('Manifesto')
  const photo = getEditorialImages(locale).hillsideHouse
  const services = getServices(locale)
  const { processSteps } = getCompanyContent(locale)
  return (
    <section aria-labelledby="about-title" className="py-20 sm:py-28">
      <Container>
        <Reveal className="flex flex-col items-center text-center">
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h2
            id="about-title"
            className="mt-7 max-w-5xl text-balance text-[clamp(1.9rem,4.4vw,3.6rem)] font-medium leading-[1.08] tracking-[-0.04em] text-charcoal"
          >
            {t('lead')}
            <InlineIcon icon={Globe} className="bg-sage text-forest" /> {t('part1')}
            <InlineIcon icon={LayoutDashboard} className="bg-forest text-sage" /> {t('part2')}{' '}
            <span className="text-mist">
              {t('part3a')} <InlineIcon icon={Rocket} className="bg-ivory-300 text-forest" /> {t('part3b')}
            </span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-3 sm:mt-20 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr] lg:grid-rows-[auto_auto]">
          <Reveal className="relative min-h-[26rem] overflow-hidden rounded-[var(--radius-card)] bg-forest lg:row-span-2">
            <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 36vw, (min-width: 768px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-ivory p-6">
              <p className="text-[clamp(1.8rem,3vw,2.6rem)] font-medium leading-none tracking-[-0.04em] text-charcoal">
                {t('cardTitle')}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-stone">
                {t('cardText')}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.05} className="flex flex-col justify-between gap-10 rounded-[var(--radius-card)] bg-ivory-200 p-7 lg:row-span-2">
            <div>
              <p className="text-sm text-stone">{t('serviceLines')}</p>
              <p className="mt-2 text-6xl font-medium tracking-[-0.05em] text-charcoal">04</p>
            </div>
            <ul className="divide-y divide-charcoal/10 border-t border-charcoal/10">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={{ pathname: '/servicios', hash: service.slug }}
                    className="group flex items-center justify-between py-3.5 text-[0.95rem] font-medium text-charcoal"
                  >
                    {service.title}
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 text-mist transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-forest"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="flex min-h-56 flex-col justify-between rounded-[var(--radius-card)] bg-sage p-7">
            <p className="text-sm text-forest/80">{t('methodology')}</p>
            <div>
              <p className="text-6xl font-medium tracking-[-0.05em] text-forest">
                0{processSteps.length}
                <span className="ml-2 text-2xl tracking-[-0.03em]">{t('stages')}</span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-forest/80">
                {processSteps.map((s) => s.title).join(' · ')}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="on-dark flex min-h-56 flex-col justify-between rounded-[var(--radius-card)] bg-forest p-7 text-ivory">
            <p className="text-sm text-ivory/60">{t('audienceLabel')}</p>
            <div>
              <p className="text-[2.4rem] font-medium leading-none tracking-[-0.04em]">{t('audienceTitle')}</p>
              <p className="mt-3 text-sm leading-relaxed text-ivory/65">
                {t('audienceText')}
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
