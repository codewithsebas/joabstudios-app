import { defineRouting } from 'next-intl/routing'

/**
 * Idiomas del sitio público. Español es el idioma por defecto y no lleva
 * prefijo (/servicios); inglés y portugués de Brasil sí (/en/services,
 * /pt/servicos). Las carpetas de `app/` usan los nombres en español y
 * next-intl traduce las URL con `pathnames`.
 */
export const routing = defineRouting({
  locales: ['es', 'en', 'pt'],
  defaultLocale: 'es',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/servicios': { es: '/servicios', en: '/services', pt: '/servicos' },
    '/proyectos': { es: '/proyectos', en: '/projects', pt: '/projetos' },
    '/proyectos/[slug]': { es: '/proyectos/[slug]', en: '/projects/[slug]', pt: '/projetos/[slug]' },
    '/contacto': { es: '/contacto', en: '/contact', pt: '/contato' },
  },
})

export type Locale = (typeof routing.locales)[number]
export type AppPathname = keyof typeof routing.pathnames

/** Datos de presentación por idioma (selector, <html lang>, hreflang, Open Graph). */
export const localeInfo: Record<Locale, { label: string; short: string; htmlLang: string; ogLocale: string }> = {
  es: { label: 'Español', short: 'ES', htmlLang: 'es', ogLocale: 'es_CO' },
  en: { label: 'English', short: 'EN', htmlLang: 'en', ogLocale: 'en_US' },
  pt: { label: 'Português (Brasil)', short: 'PT', htmlLang: 'pt-BR', ogLocale: 'pt_BR' },
}

export function isLocale(value: string | undefined): value is Locale {
  return routing.locales.includes(value as Locale)
}
