'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Menu, X } from 'lucide-react'
import { Link, usePathname } from '@/i18n/navigation'
import { mainNav, primaryCtaHref } from '@/lib/site-config'
import { cn } from '@/lib/cn'
import { ButtonLink } from '@/components/ui/button'
import { LanguageSwitcher } from './language-switcher'
import { BrandLogo } from './logo'

/** Routes whose first section is a dark full-bleed hero the navbar floats over. */
const overlayRoutes = new Set(['/'])

export function Navbar() {
  const t = useTranslations('Nav')
  const tc = useTranslations('Common')
  // Ruta interna (sin idioma): '/', '/servicios', '/proyectos/[slug]'…
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Hide while scrolling down, reveal on any upward scroll. A small threshold
  // ignores trackpad jitter; near the top the header is always visible.
  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false
    const update = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      if (y < 120) setHidden(false)
      else if (y > lastY + 6) setHidden(true)
      else if (y < lastY - 6) setHidden(false)
      if (Math.abs(y - lastY) > 6 || y < 120) lastY = y
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        window.requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu on navigation.
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('a')?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  /**
   * Visual states:
   *  - hero: top of a page with a dark hero → transparent, light text
   *  - page: top of a light page → transparent, dark text
   *  - bar:  after scrolling (or menu open) → solid Forest bar, light text
   */
  const mode: 'hero' | 'page' | 'bar' = scrolled || open ? 'bar' : overlayRoutes.has(pathname) ? 'hero' : 'page'
  const light = mode !== 'page'
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`))

  return (
    <header
      className={cn(
        // Nombre propio en las transiciones de página: el header queda fijo mientras el contenido se anima.
        'fixed inset-x-0 top-0 z-50 px-3 pt-3 [view-transition-name:site-header] transition-transform duration-500 ease-out-soft sm:px-4 sm:pt-4',
        // Keyboard users tabbing into the header always see it.
        // Sin translate cuando está visible: un transform convertiría al header en el
        // bloque contenedor del panel móvil (fixed) y lo recortaría.
        hidden && !open && '-translate-y-[130%] focus-within:translate-y-0',
      )}
    >
      <div
        className={cn(
          'grid grid-cols-[1fr_auto] items-center rounded-[1.25rem] pl-5 pr-2 transition-[background-color,box-shadow,height,padding] duration-500 ease-out-soft sm:pl-8 md:grid-cols-[1fr_auto_1fr] lg:pl-10',
          mode === 'bar'
            ? 'on-dark h-[3.75rem] bg-forest shadow-[0_18px_40px_-24px_rgba(23,45,41,0.65)] lg:pr-2.5'
            : 'h-16 bg-transparent sm:pr-6 lg:pr-8',
        )}
      >
        <Link
          href="/"
          className={cn('inline-flex items-center justify-self-start rounded-lg py-1', light ? 'text-ivory' : 'text-forest')}
        >
          <BrandLogo
            idPrefix="header-logo"
            className={cn('w-auto transition-[height] duration-500 ease-out-soft', mode === 'bar' ? 'h-9' : 'h-10 sm:h-11')}
          />
          <span className="sr-only">{t('homeAria')}</span>
        </Link>

        <nav aria-label={t('mainLabel')} className="hidden md:block">
          <ul
            className={cn(
              'flex items-center gap-1 rounded-full p-1 font-ui text-[0.9rem] font-medium ring-1 transition-colors duration-500',
              light ? 'bg-ivory/[0.06] ring-ivory/15' : 'bg-ivory-200/80 ring-charcoal/10',
            )}
          >
            {mainNav.map((item) => {
              const active = isActive(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'inline-flex h-9 items-center rounded-full px-4 transition-colors duration-300',
                      active
                        ? light
                          ? 'bg-ivory text-forest'
                          : 'bg-forest text-ivory'
                        : light
                          ? 'text-ivory/75 hover:bg-ivory/10 hover:text-ivory'
                          : 'text-stone hover:bg-charcoal/5 hover:text-charcoal',
                    )}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center justify-self-end gap-2">
          <LanguageSwitcher tone={light ? 'light' : 'dark'} className="hidden md:block" />
          <div className="hidden sm:block md:hidden xl:block">
            <ButtonLink href={primaryCtaHref} size="sm" variant="accent" arrow className="whitespace-nowrap">
              {tc('cta')}
            </ButtonLink>
          </div>
          <button
            ref={toggleRef}
            type="button"
            className={cn(
              'inline-flex h-11 items-center gap-2 rounded-full px-4 font-ui text-sm font-medium ring-1 transition-colors md:hidden',
              light ? 'text-ivory ring-ivory/20 hover:bg-ivory/10' : 'text-charcoal ring-charcoal/15 hover:bg-charcoal/5',
            )}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            <span>{open ? t('close') : t('menu')}</span>
            {open ? <X aria-hidden className="size-4" /> : <Menu aria-hidden className="size-4" />}
          </button>
        </div>
      </div>

      <div
        id={menuId}
        ref={panelRef}
        hidden={!open}
        className="on-dark fixed inset-x-3 bottom-3 top-[5rem] overflow-y-auto rounded-[var(--radius-panel)] bg-forest p-6 text-ivory md:hidden"
      >
        <nav aria-label={t('mobileLabel')} className="flex h-full flex-col">
          <ul className="flex flex-col">
            {mainNav.map((item, index) => (
              <li key={item.href} className="border-b border-ivory/10">
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className="flex items-baseline justify-between py-5 text-3xl font-medium tracking-[-0.03em]"
                >
                  {t(item.key)}
                  <span className="font-ui text-xs text-ivory/60">0{index + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-10">
            <div className="mb-6 flex items-center justify-between gap-4">
              <p className="label-caps text-ivory/60">{t('language')}</p>
              <LanguageSwitcher tone="light" />
            </div>
            <p className="mb-5 max-w-xs text-sm leading-relaxed text-ivory/60">{t('mobilePitch')}</p>
            <ButtonLink href={primaryCtaHref} variant="accent" size="lg" arrow className="w-full">
              {tc('cta')}
            </ButtonLink>
          </div>
        </nav>
      </div>
    </header>
  )
}
