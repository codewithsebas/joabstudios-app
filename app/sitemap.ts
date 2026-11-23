import type { MetadataRoute } from 'next'
import { localeInfo, routing } from '@/i18n/routing'
import { projectSlugs, getProject } from '@/lib/content/projects'
import { absoluteUrl } from '@/lib/site-config'
import { localizedPath, type LocalizedHref } from '@/lib/seo'

/** Cada página aparece una vez por idioma, con sus alternativas hreflang. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Array<{ href: LocalizedHref; priority: number; changeFrequency: 'monthly' | 'yearly'; image?: string }> = [
    { href: '/', priority: 1, changeFrequency: 'monthly' },
    { href: '/servicios', priority: 0.9, changeFrequency: 'monthly' },
    { href: '/proyectos', priority: 0.8, changeFrequency: 'monthly' },
    { href: '/contacto', priority: 0.8, changeFrequency: 'monthly' },
    ...projectSlugs.map((slug) => ({
      href: { pathname: '/proyectos/[slug]' as const, params: { slug } },
      priority: 0.7,
      changeFrequency: 'yearly' as const,
      image: getProject(routing.defaultLocale, slug)?.cover?.src,
    })),
  ]

  return pages.flatMap((page) => {
    const languages = Object.fromEntries(
      routing.locales.map((l) => [localeInfo[l].htmlLang, absoluteUrl(localizedPath(l, page.href))]),
    )
    return routing.locales.map((locale) => ({
      url: absoluteUrl(localizedPath(locale, page.href)),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: { languages },
      ...(page.image ? { images: [absoluteUrl(page.image)] } : {}),
    }))
  })
}
