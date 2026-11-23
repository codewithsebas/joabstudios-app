import type { Metadata } from 'next'
import { getPathname } from '@/i18n/navigation'
import { localeInfo, routing, type Locale } from '@/i18n/routing'
import { absoluteUrl } from '@/lib/site-config'

export type LocalizedHref = Parameters<typeof getPathname>[0]['href']

/** URL pública (traducida y con prefijo de idioma si aplica) de una ruta interna. */
export function localizedPath(locale: Locale, href: LocalizedHref): string {
  return getPathname({ locale, href })
}

/**
 * Canonical + hreflang de una página en todos los idiomas, para que Google
 * muestre a cada visitante la versión en su idioma.
 */
export function localizedAlternates(locale: Locale, href: LocalizedHref): Metadata['alternates'] {
  const languages: Record<string, string> = {}
  for (const l of routing.locales) languages[localeInfo[l].htmlLang] = absoluteUrl(localizedPath(l, href))
  languages['x-default'] = absoluteUrl(localizedPath(routing.defaultLocale, href))
  return { canonical: localizedPath(locale, href), languages }
}

/** Open Graph con la URL y el idioma correctos para la página. */
export function localizedOpenGraph(locale: Locale, href: LocalizedHref): NonNullable<Metadata['openGraph']> {
  return {
    url: localizedPath(locale, href),
    locale: localeInfo[locale].ogLocale,
    alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => localeInfo[l].ogLocale),
  }
}
