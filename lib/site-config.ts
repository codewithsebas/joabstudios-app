/**
 * Public, configurable business details. Every contact channel comes from an
 * environment variable; when one is not set, the UI hides it instead of
 * rendering a dead link.
 */

export type SocialLink = {
  label: SocialName
  href: string
}

function optional(value: string | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function normalizeSiteUrl(value: string | undefined): string {
  const fallback = 'http://localhost:3000'
  const raw = optional(value) ?? fallback
  return raw.replace(/\/+$/, '')
}

/**
 * Social profiles, edited here in code. Leave `href` as null until a profile
 * is ready: it renders as a plain label (no dead link). Add the URL and it
 * becomes a link everywhere automatically.
 */
export type SocialName = 'Instagram' | 'LinkedIn' | 'Behance' | 'WhatsApp'

export const socialProfiles: Array<{ label: SocialName; href: string | null }> = [
  { label: 'Instagram', href: null },
  { label: 'LinkedIn', href: null },
  { label: 'Behance', href: null },
  { label: 'WhatsApp', href: null },
]

const whatsappDigits = optional(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)?.replace(/\D/g, '') ?? null

export const siteConfig = {
  name: 'JoabStudios',
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  email: optional(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  whatsapp: whatsappDigits
    ? {
        digits: whatsappDigits,
        href: `https://wa.me/${whatsappDigits}`,
        display: `+${whatsappDigits}`,
      }
    : null,
  /** Only profiles that already have a URL (used where a link is required). */
  socials: socialProfiles.filter((s): s is SocialLink => s.href !== null),
} as const

/** Navegación principal: `key` apunta a los textos en messages/*.json (Nav.*). */
export const mainNav = [
  { key: 'home', href: '/' },
  { key: 'services', href: '/servicios' },
  { key: 'projects', href: '/proyectos' },
  { key: 'contact', href: '/contacto' },
] as const

/** Destino del botón principal (su texto es Common.cta). */
export const primaryCtaHref = '/contacto' as const

export function absoluteUrl(path = '/'): string {
  return `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`
}
