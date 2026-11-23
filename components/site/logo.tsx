import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/cn'
import { BRAND_W, BrandLogoShapes, brandJ, brandViewBox } from './brand-logo'

type Tone = 'dark' | 'light'

/** Full JoabStudios logo (STUDIOS over JOAB), single colour from `currentColor`. */
export function BrandLogo({
  className,
  title,
  idPrefix = 'logo',
  align = 'xMidYMid',
}: {
  className?: string
  title?: string
  /** Unique per instance: the logo uses clip paths. */
  idPrefix?: string
  /** Where the artwork sits when the box is wider than the logo's aspect ratio. */
  align?: 'xMidYMid' | 'xMinYMax'
}) {
  const { x, y, width, height } = brandViewBox
  return (
    <svg
      viewBox={`${x} ${y} ${width} ${height}`}
      preserveAspectRatio={`${align} meet`}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={className ?? 'h-10 w-auto'}
    >
      <BrandLogoShapes idPrefix={idPrefix} />
    </svg>
  )
}

/** App icon: the logo's own "J" inside a rounded tile. */
export function LogoMark({ className, tone = 'dark' }: { className?: string; tone?: Tone }) {
  const dark = tone === 'dark'
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn('size-8 shrink-0', className)}>
      <rect width="32" height="32" rx="9" className={dark ? 'fill-forest' : 'fill-ivory'} />
      <svg x="8.8" y="6.5" width="14.4" height="19" viewBox={brandJ.viewBox}>
        <path
          d={brandJ.d}
          fill="none"
          strokeWidth={BRAND_W}
          strokeLinejoin="miter"
          className={dark ? 'stroke-ivory' : 'stroke-forest'}
        />
      </svg>
    </svg>
  )
}

export function Logo({ tone = 'dark', className }: { tone?: Tone; className?: string }) {
  const t = useTranslations('Nav')
  return (
    <Link
      href="/"
      className={cn('inline-flex items-center rounded-lg py-1', tone === 'dark' ? 'text-forest' : 'text-ivory', className)}
    >
      <BrandLogo idPrefix="header-logo" className="h-10 w-auto sm:h-11" />
      <span className="sr-only">{t('homeAria')}</span>
    </Link>
  )
}
