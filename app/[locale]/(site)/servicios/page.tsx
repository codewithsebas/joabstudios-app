import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ArrowRight, Check, Repeat } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { isLocale, routing } from '@/i18n/routing'
import { PageTransition } from '@/components/motion/page-transition'
import { ButtonLink } from '@/components/ui/button'
import { Container, Eyebrow, SectionHeader } from '@/components/ui/layout'
import { PageHeader } from '@/components/ui/page-header'
import { Reveal } from '@/components/motion/reveal'
import { CtaBanner } from '@/components/sections/cta-banner'
import { JsonLd } from '@/components/json-ld'
import { getCompanyContent } from '@/lib/content/company'
import { getServices } from '@/lib/content/services'
import { absoluteUrl } from '@/lib/site-config'
import { localizedAlternates, localizedOpenGraph, localizedPath } from '@/lib/seo'

export async function generateMetadata({ params }: PageProps<'/[locale]/servicios'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = await getTranslations({ locale, namespace: 'ServicesPage' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: localizedAlternates(locale, '/servicios'),
    openGraph: localizedOpenGraph(locale, '/servicios'),
  }
}

function DetailList({ title, items, tone = 'check' }: { title: string; items: string[]; tone?: 'check' | 'arrow' }) {
  const Icon = tone === 'check' ? Check : ArrowRight
  return (
    <div>
      <h3 className="label-caps text-mist">{title}</h3>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-pretty leading-relaxed text-charcoal/90">
            <Icon aria-hidden className="mt-1 size-4 shrink-0 text-forest" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default async function ServicesPage({ params }: PageProps<'/[locale]/servicios'>) {
  const { locale: param } = await params
  const locale = isLocale(param) ? param : routing.defaultLocale
  const t = await getTranslations({ locale, namespace: 'ServicesPage' })
  const services = getServices(locale)
  const { plans, recurringServices } = getCompanyContent(locale)

  return (
    <PageTransition>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: services.map((service, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Service',
              name: service.title,
              description: service.description,
              serviceType: service.shortTitle,
              areaServed: 'Worldwide',
              audience: { '@type': 'BusinessAudience', audienceType: t('audience') },
              provider: { '@type': 'Organization', name: 'JoabStudios', url: absoluteUrl(localizedPath(locale, '/')) },
              url: absoluteUrl(`${localizedPath(locale, '/servicios')}#${service.slug}`),
            },
          })),
        }}
      />

      <PageHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        intro={t('intro')}
      >
        <nav aria-label={t('navLabel')} className="mt-12 flex flex-wrap gap-2">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={{ pathname: '/servicios', hash: service.slug }}
              className="rounded-full border border-charcoal/15 px-4 py-2 font-ui text-sm text-charcoal transition-colors hover:border-forest hover:bg-forest hover:text-ivory"
            >
              {service.index} · {service.title}
            </Link>
          ))}
        </nav>
      </PageHeader>

      <div className="flex flex-col">
        {services.map((service) => (
          <section
            key={service.slug}
            id={service.slug}
            aria-labelledby={`${service.slug}-title`}
            className="scroll-mt-24 border-t border-charcoal/10 py-20 sm:py-24"
          >
            <Container className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-28">
                  <p className="font-ui text-sm text-mist">{service.index}</p>
                  <h2
                    id={`${service.slug}-title`}
                    className="mt-4 text-[clamp(2.2rem,4.4vw,3.6rem)] font-medium leading-[1] tracking-[-0.045em] text-charcoal"
                  >
                    {service.title}
                  </h2>
                  <p className="mt-2 text-lg text-stone">{service.shortTitle}</p>
                  <p className="mt-6 text-pretty leading-relaxed text-charcoal/85">{service.description}</p>
                  <ul className="mt-6 flex flex-wrap gap-2" aria-label={t('capabilities')}>
                    {service.capabilities.map((capability) => (
                      <li key={capability} className="rounded-full bg-sage-100 px-3 py-1 font-ui text-xs text-forest">
                        {capability}
                      </li>
                    ))}
                  </ul>
                  <ButtonLink
                    href={{ pathname: '/contacto', query: { servicio: service.slug } }}
                    variant="dark"
                    arrow
                    className="mt-8"
                  >
                    {t('quoteThis')}
                  </ButtonLink>
                </div>
              </div>

              <Reveal className="grid gap-x-10 gap-y-12 rounded-[var(--radius-panel)] bg-ivory-200 p-8 sm:grid-cols-2 sm:p-10 lg:col-span-7">
                <DetailList title={t('solves')} items={service.solves} tone="arrow" />
                <DetailList title={t('benefits')} items={service.benefits} />
                <div className="sm:col-span-2">
                  <DetailList title={t('features')} items={service.features} />
                </div>
                <div className="border-t border-charcoal/10 pt-8 sm:col-span-2">
                  <h3 className="label-caps text-mist">{t('examples')}</h3>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                    {service.examples.map((example) => (
                      <li key={example} className="rounded-2xl bg-ivory p-4 text-sm leading-relaxed text-charcoal/90">
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </Container>
          </section>
        ))}
      </div>

      <section aria-labelledby="plans-title" className="on-dark px-3 sm:px-4">
        <div className="rounded-[var(--radius-panel)] bg-forest py-20 text-ivory sm:py-28">
          <Container inset="panel">
            <SectionHeader
              tone="light"
              eyebrow={t('plansEyebrow')}
              title={<span id="plans-title">{t('plansTitle')}</span>}
              intro={t('plansIntro')}
            />
            <ul className="mt-14 grid gap-3 lg:grid-cols-3">
              {plans.map((plan, index) => (
                <Reveal
                  as="li"
                  key={plan.name}
                  delay={index * 0.06}
                  className={
                    index === 1
                      ? 'flex flex-col rounded-[var(--radius-card)] bg-sage p-8 text-forest'
                      : 'flex flex-col rounded-[var(--radius-card)] border border-ivory/12 bg-forest-800 p-8'
                  }
                >
                  <p className={index === 1 ? 'font-ui text-xs text-forest/80' : 'font-ui text-xs text-ivory/60'}>
                    0{index + 1}
                  </p>
                  <h3 className="mt-8 text-3xl font-medium tracking-[-0.04em]">{plan.name}</h3>
                  <p className={index === 1 ? 'mt-1 font-medium text-forest/80' : 'mt-1 font-medium text-sage'}>
                    {plan.tagline}
                  </p>
                  <p className={index === 1 ? 'mt-5 text-sm leading-relaxed text-forest/80' : 'mt-5 text-sm leading-relaxed text-ivory/65'}>
                    {plan.description}
                  </p>
                  <ul className="mt-8 space-y-3 border-t border-current/15 pt-6">
                    {plan.includes.map((item) => (
                      <li key={item} className="flex gap-3 text-[0.95rem]">
                        <Check aria-hidden className="mt-0.5 size-4 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className={index === 1 ? 'mt-auto pt-10 label-caps text-forest/80' : 'mt-auto pt-10 label-caps text-ivory/60'}>
                    {t('priceByScope')}
                  </p>
                </Reveal>
              ))}
            </ul>

            <div className="mt-14 grid gap-8 rounded-[var(--radius-card)] border border-ivory/12 p-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-4">
                <Eyebrow tone="light">{t('recurringEyebrow')}</Eyebrow>
                <p className="mt-4 text-xl font-medium tracking-[-0.02em]">{t('recurringTitle')}</p>
              </div>
              <ul className="flex flex-wrap gap-2 lg:col-span-8">
                {recurringServices.map((item) => (
                  <li key={item} className="inline-flex items-center gap-2 rounded-full border border-ivory/15 px-4 py-2 text-sm text-ivory/85">
                    <Repeat aria-hidden className="size-3.5 text-sage" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </div>
      </section>

      <CtaBanner title={t('ctaTitle')} description={t('ctaDescription')} cta={t('ctaButton')} />
    </PageTransition>
  )
}
