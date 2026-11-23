import { getRequestConfig } from 'next-intl/server'
import { locale as rootLocale } from 'next/root-params'
import { isLocale, routing } from './routing'

/**
 * El idioma sale del parámetro raíz `[locale]` (next/root-params) en lugar de
 * las cabeceras, así las páginas siguen siendo estáticas con Cache Components.
 */
export default getRequestConfig(async ({ locale: override }) => {
  const candidate = override ?? (await rootLocale())
  const locale = isLocale(candidate) ? candidate : routing.defaultLocale

  return {
    locale,
    timeZone: 'America/Bogota',
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
