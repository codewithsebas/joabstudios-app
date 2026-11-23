import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Analytics } from '@/components/analytics'
import { fontVariables } from '@/lib/fonts'
import { absoluteUrl, siteConfig } from '@/lib/site-config'
import { isLocale, localeInfo, routing } from '@/i18n/routing'
import '../globals.css'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = await getTranslations({ locale, namespace: 'Metadata' })
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t('defaultTitle'), template: '%s · JoabStudios' },
    description: t('description'),
    applicationName: siteConfig.name,
    keywords: t('keywords').split(',').map((k) => k.trim()),
    openGraph: {
      type: 'website',
      locale: localeInfo[locale].ogLocale,
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => localeInfo[l].ogLocale),
      siteName: siteConfig.name,
      url: absoluteUrl('/'),
    },
    twitter: { card: 'summary_large_image' },
    formatDetection: { telephone: false, email: false, address: false },
  }
}

export const viewport: Viewport = {
  themeColor: '#172d29',
  width: 'device-width',
  initialScale: 1,
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = await getTranslations({ locale, namespace: 'Common' })

  return (
    <html lang={localeInfo[locale].htmlLang} className={`${fontVariables} antialiased`}>
      <body className="min-h-dvh">
        <a
          href="#contenido"
          className="label-caps sr-only z-[100] rounded-full bg-forest px-5 py-3 text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          {t('skipToContent')}
        </a>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
