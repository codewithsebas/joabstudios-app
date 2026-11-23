'use client'

import { useParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { localeInfo, routing } from '@/i18n/routing'
import { cn } from '@/lib/cn'

/**
 * Selector ES · EN · PT. Cada opción es un enlace real a la misma página en
 * el otro idioma (con su URL traducida), así también lo siguen los buscadores.
 */
export function LanguageSwitcher({ tone = 'light', className }: { tone?: 'light' | 'dark'; className?: string }) {
  const t = useTranslations('Nav')
  const locale = useLocale()
  const pathname = usePathname()
  const params = useParams()

  // Las rutas dinámicas (/proyectos/[slug]) necesitan sus parámetros para traducirse.
  const href = { pathname, params } as unknown as Parameters<typeof Link>[0]['href']

  return (
    <nav aria-label={t('changeLanguage')} className={className}>
      <ul
        className={cn(
          'flex items-center gap-0.5 rounded-full p-1 font-ui text-xs font-semibold tracking-[0.08em] ring-1',
          tone === 'light' ? 'ring-ivory/20' : 'ring-charcoal/15',
        )}
      >
        {routing.locales.map((code) => {
          const active = code === locale
          return (
            <li key={code}>
              <Link
                href={href}
                locale={code}
                hrefLang={localeInfo[code].htmlLang}
                lang={localeInfo[code].htmlLang}
                aria-current={active ? 'true' : undefined}
                aria-label={localeInfo[code].label}
                title={localeInfo[code].label}
                scroll={false}
                className={cn(
                  'inline-flex h-8 min-w-9 items-center justify-center rounded-full px-2.5 transition-colors duration-300',
                  active
                    ? tone === 'light'
                      ? 'bg-ivory text-forest'
                      : 'bg-forest text-ivory'
                    : tone === 'light'
                      ? 'text-ivory/70 hover:bg-ivory/10 hover:text-ivory'
                      : 'text-stone hover:bg-charcoal/5 hover:text-charcoal',
                )}
              >
                {localeInfo[code].short}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
