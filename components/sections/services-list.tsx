import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight } from 'lucide-react'
import { Container, SectionHeader } from '@/components/ui/layout'
import { Reveal } from '@/components/motion/reveal'
import { getServices } from '@/lib/content/services'

/** Editorial index of the four business lines. Rows invert to Forest on hover. */
export function ServicesList() {
  const t = useTranslations('ServicesSection')
  const services = getServices(useLocale())
  return (
    <section aria-labelledby="services-title" className="py-20 sm:py-28">
      <Container>
        <SectionHeader
          eyebrow={t('eyebrow')}
          title={<span id="services-title">{t('title')}</span>}
          intro={t('intro')}
        />

        <ul className="mt-14 border-t border-charcoal/15">
          {services.map((service, index) => (
            <Reveal as="li" key={service.slug} delay={index * 0.05} className="border-b border-charcoal/15">
              <Link
                href={{ pathname: '/servicios', hash: service.slug }}
                className="group relative grid gap-4 rounded-none px-1 py-8 transition-colors duration-500 ease-out-soft hover:bg-forest sm:px-6 md:grid-cols-12 md:items-center md:gap-8 md:py-10"
              >
                <span className="font-ui text-xs text-mist transition-colors group-hover:text-sage md:col-span-1">
                  {service.index}
                </span>
                <span className="text-[clamp(1.6rem,3vw,2.6rem)] font-medium leading-none tracking-[-0.04em] text-charcoal transition-colors group-hover:text-ivory md:col-span-5">
                  {service.title}
                </span>
                <span className="max-w-md text-pretty text-stone transition-colors group-hover:text-ivory/70 md:col-span-5">
                  {service.summary}
                </span>
                <span className="hidden justify-end md:col-span-1 md:flex">
                  <span className="inline-flex size-11 items-center justify-center rounded-full border border-charcoal/15 transition-colors duration-300 group-hover:border-sage group-hover:bg-sage">
                    <ArrowUpRight aria-hidden className="size-4 text-charcoal transition-colors group-hover:text-forest" />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
