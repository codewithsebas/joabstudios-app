import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Hero } from '@/components/home/hero'
import { Manifesto } from '@/components/home/manifesto'
import { Problems } from '@/components/home/problems'
import { SelectedWork } from '@/components/home/selected-work'
import { Ticker } from '@/components/home/ticker'
import { PageTransition } from '@/components/motion/page-transition'
import { CtaBanner } from '@/components/sections/cta-banner'
import { ProcessSteps } from '@/components/sections/process-steps'
import { ServicesList } from '@/components/sections/services-list'
import { JsonLd } from '@/components/json-ld'
import { getServices } from '@/lib/content/services'
import { absoluteUrl, siteConfig } from '@/lib/site-config'
import { localizedAlternates, localizedOpenGraph, localizedPath } from '@/lib/seo'
import { isLocale, localeInfo, routing } from '@/i18n/routing'

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = await getTranslations({ locale, namespace: 'Home' })
  return {
    title: { absolute: t('metaTitle') },
    description: t('metaDescription'),
    alternates: localizedAlternates(locale, '/'),
    openGraph: localizedOpenGraph(locale, '/'),
  }
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale: param } = await params
  const locale = isLocale(param) ? param : routing.defaultLocale
  const t = await getTranslations({ locale, namespace: 'Home' })
  const tc = await getTranslations({ locale, namespace: 'Common' })
  const sameAs = [...siteConfig.socials.map((s) => s.href)]

  return (
    <PageTransition>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: siteConfig.name,
          slogan: `${tc('sloganStart')} ${tc('sloganEnd')}`,
          description: tc('description'),
          url: absoluteUrl(localizedPath(locale, '/')),
          logo: absoluteUrl('/icon.svg'),
          inLanguage: localeInfo[locale].htmlLang,
          availableLanguage: routing.locales.map((l) => localeInfo[l].htmlLang),
          areaServed: 'Worldwide',
          knowsAbout: t('knowsAbout').split('|'),
          ...(siteConfig.email ? { email: siteConfig.email } : {}),
          ...(sameAs.length ? { sameAs } : {}),
          makesOffer: getServices(locale).map((service) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: service.title, description: service.summary },
          })),
        }}
      />
      <Hero />
      <Ticker />
      <Manifesto />
      <ServicesList />
      <SelectedWork />
      <Problems />
      <ProcessSteps />
      <CtaBanner />
    </PageTransition>
  )
}
