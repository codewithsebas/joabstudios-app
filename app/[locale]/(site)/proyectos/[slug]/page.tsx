import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { isLocale, routing } from '@/i18n/routing'
import { ButtonLink, ExternalButtonLink } from '@/components/ui/button'
import { Container, Eyebrow } from '@/components/ui/layout'
import { PageTransition } from '@/components/motion/page-transition'
import { Reveal } from '@/components/motion/reveal'
import { JsonLd } from '@/components/json-ld'
import { BrowserFrame, PhoneFrame } from '@/components/work/device-frames'
import { ProjectCard } from '@/components/work/project-card'
import { ProjectCover } from '@/components/work/project-cover'
import { getOtherProjects, getProject, projectSlugs } from '@/lib/content/projects'
import { absoluteUrl, primaryCtaHref } from '@/lib/site-config'
import { localizedAlternates, localizedOpenGraph, localizedPath } from '@/lib/seo'

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }))
}

// Every known slug is prerendered at build time, so navigations are served
// from static output. Awaiting params at the top level (instead of streaming
// behind Suspense) keeps a real 404 status for unknown slugs.
export const instant = false

export async function generateMetadata({ params }: PageProps<'/[locale]/proyectos/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const project = getProject(locale, slug)
  if (!project) return {}
  const t = await getTranslations({ locale, namespace: 'CaseStudy' })
  const href = { pathname: '/proyectos/[slug]', params: { slug } } as const
  return {
    title: t('metaTitle', { name: project.name }),
    description: project.summary,
    alternates: localizedAlternates(locale, href),
    openGraph: {
      ...localizedOpenGraph(locale, href),
      images: project.cover
        ? [{ url: project.cover.src, width: project.cover.width, height: project.cover.height, alt: project.cover.alt }]
        : undefined,
    },
  }
}

function hostOf(url: string | null): string | null {
  if (!url) return null
  try {
    return new URL(url).host
  } catch {
    return null
  }
}

export default async function CaseStudyPage({ params }: PageProps<'/[locale]/proyectos/[slug]'>) {
  const { locale: param, slug } = await params
  const locale = isLocale(param) ? param : routing.defaultLocale
  const project = getProject(locale, slug)
  if (!project) notFound()

  const t = await getTranslations({ locale, namespace: 'CaseStudy' })
  const tc = await getTranslations({ locale, namespace: 'Common' })
  const host = hostOf(project.liveUrl)
  const desktopShots = project.gallery.filter((s) => s.device === 'desktop')
  const mobileShots = project.gallery.filter((s) => s.device === 'mobile')
  const others = getOtherProjects(locale, project.slug)

  const meta: Array<{ label: string; value: string }> = [
    { label: t('client'), value: project.name },
    { label: t('sector'), value: project.sector },
    ...(project.location ? [{ label: t('location'), value: project.location }] : []),
    { label: t('project'), value: project.category },
  ]

  return (
    // key: al pasar de un proyecto a otro también se anima la transición.
    <PageTransition key={project.slug}>
      <article>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: `${project.name} — ${project.category}`,
            description: project.summary,
            inLanguage: locale,
            url: absoluteUrl(localizedPath(locale, { pathname: '/proyectos/[slug]', params: { slug: project.slug } })),
            creator: { '@type': 'Organization', name: 'JoabStudios', url: absoluteUrl(localizedPath(locale, '/')) },
            ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
            ...(project.cover ? { image: absoluteUrl(project.cover.src) } : {}),
          }}
        />

        <header className="pb-12 pt-32 sm:pt-40">
          <Container>
            <Link
              href="/proyectos"
              className="label-caps inline-flex items-center gap-2 text-stone transition-colors hover:text-forest"
            >
              <ArrowLeft aria-hidden className="size-3.5" />
              {t('back')}
            </Link>
            <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <Eyebrow>{project.category}</Eyebrow>
                <h1 className="mt-6 text-[clamp(3rem,8vw,7rem)] font-medium leading-[0.92] tracking-[-0.05em] text-charcoal">
                  {project.name}
                </h1>
              </div>
              <p className="text-pretty text-lg leading-relaxed text-stone lg:col-span-5">{project.summary}</p>
            </div>

            <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-charcoal/15 pt-8 md:grid-cols-4">
              {meta.map((item) => (
                <div key={item.label}>
                  <dt className="label-caps text-mist">{item.label}</dt>
                  <dd className="mt-2 font-medium text-charcoal">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </header>

        <Container>
          {project.cover ? (
            <BrowserFrame shot={project.cover} host={host} priority sizes="(min-width: 1400px) 1340px, 100vw" />
          ) : (
            <ProjectCover project={project} sizes="100vw" className="aspect-[16/8] rounded-[var(--radius-panel)]" />
          )}
        </Container>

        <section aria-labelledby="overview-title" className="py-20 sm:py-28">
          <Container className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 id="overview-title" className="label-caps text-mist">
                {t('overview')}
              </h2>
              <h3 className="mt-6 label-caps text-mist">{t('servicesDeveloped')}</h3>
              <ul className="mt-4 space-y-2.5">
                {project.services.map((service) => (
                  <li key={service} className="flex items-center gap-2.5 text-charcoal">
                    <Check aria-hidden className="size-4 text-forest" />
                    {service}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-8">
              <p className="text-pretty text-[clamp(1.4rem,2.4vw,2rem)] font-medium leading-[1.3] tracking-[-0.025em] text-charcoal">
                {project.description}
              </p>
              <div className="mt-14 grid gap-10 border-t border-charcoal/15 pt-10 md:grid-cols-2">
                <div>
                  <h3 className="text-xl font-medium tracking-[-0.02em] text-charcoal">{t('need')}</h3>
                  <p className="mt-4 text-pretty leading-relaxed text-stone">{project.challenge}</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium tracking-[-0.02em] text-charcoal">{t('solution')}</h3>
                  <p className="mt-4 text-pretty leading-relaxed text-stone">{project.solution}</p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section aria-labelledby="features-title" className="on-dark px-3 sm:px-4">
          <div className="rounded-[var(--radius-panel)] bg-forest py-20 text-ivory sm:py-24">
            <Container inset="panel">
              <Eyebrow tone="light">{t('featuresEyebrow')}</Eyebrow>
              <h2 id="features-title" className="mt-6 max-w-2xl text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.02] tracking-[-0.04em]">
                {t('featuresTitle')}
              </h2>
              <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-ivory/10 sm:grid-cols-2 lg:grid-cols-3">
                {project.features.map((feature, index) => (
                  <li key={feature.title} className="bg-forest p-7 sm:p-8">
                    <p className="font-ui text-xs text-sage">{String(index + 1).padStart(2, '0')}</p>
                    <h3 className="mt-6 text-xl font-medium tracking-[-0.02em]">{feature.title}</h3>
                    <p className="mt-3 text-pretty text-[0.95rem] leading-relaxed text-ivory/65">{feature.description}</p>
                  </li>
                ))}
              </ul>
            </Container>
          </div>
        </section>

        <section aria-labelledby="gallery-title" className="py-20 sm:py-28">
          <Container>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <Eyebrow>{t('galleryEyebrow')}</Eyebrow>
                <h2 id="gallery-title" className="mt-6 text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.02] tracking-[-0.04em] text-charcoal">
                  {t('galleryTitle')}
                </h2>
              </div>
              {project.liveUrl ? (
                <ExternalButtonLink href={project.liveUrl} newTabLabel={tc('opensNewTab')} variant="outline" arrow>
                  {host ? t('visit', { host }) : t('visitSite')}
                </ExternalButtonLink>
              ) : null}
            </div>

            {project.gallery.length === 0 ? (
              <div className="mt-12 rounded-[var(--radius-card)] border border-dashed border-charcoal/20 px-6 py-16 text-center">
                <p className="text-lg font-medium text-charcoal">{t('galleryPendingTitle')}</p>
                <p className="mx-auto mt-2 max-w-md text-stone">{t('galleryPendingText')}</p>
              </div>
            ) : (
              <div className="mt-12 flex flex-col gap-6">
                {desktopShots.map((shot, index) => (
                  <Reveal key={shot.src} delay={0.05}>
                    <BrowserFrame shot={shot} host={host} sizes="(min-width: 1400px) 1340px, 100vw" />
                    <p className="mt-3 font-ui text-sm text-stone">
                      <span className="text-mist">{String(index + 1).padStart(2, '0')}</span> — {shot.caption}
                    </p>
                  </Reveal>
                ))}
                {mobileShots.length > 0 ? (
                  <Reveal className="mt-6 grid items-center gap-10 rounded-[var(--radius-panel)] bg-ivory-200 p-8 sm:p-12 md:grid-cols-[1fr_auto]">
                    <div>
                      <h3 className="text-2xl font-medium tracking-[-0.03em] text-charcoal">{t('mobileTitle')}</h3>
                      <ul className="mt-5 space-y-2 text-stone">
                        {mobileShots.map((shot) => (
                          <li key={shot.src}>{shot.caption}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-center gap-4 sm:gap-6">
                      {mobileShots.map((shot, index) => (
                        <PhoneFrame
                          key={shot.src}
                          shot={shot}
                          sizes="240px"
                          className={index % 2 === 1 ? 'w-36 translate-y-8 sm:w-52' : 'w-36 sm:w-52'}
                        />
                      ))}
                    </div>
                  </Reveal>
                ) : null}
              </div>
            )}
          </Container>
        </section>

        <section aria-labelledby="similar-title" className="pb-20">
          <Container>
            <div className="flex flex-col items-start gap-8 rounded-[var(--radius-panel)] bg-sage p-8 sm:p-12 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 id="similar-title" className="text-balance text-[clamp(1.8rem,3.4vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.04em] text-forest">
                  {t('similarTitle')}
                </h2>
                <p className="mt-3 max-w-lg text-forest/75">{t('similarText')}</p>
              </div>
              <ButtonLink href={primaryCtaHref} variant="dark" size="lg" arrow>
                {tc('cta')}
              </ButtonLink>
            </div>
          </Container>
        </section>

        {others.length > 0 ? (
          <nav aria-labelledby="more-work-title" className="border-t border-charcoal/10 py-20">
            <Container>
              <div className="flex items-end justify-between gap-6">
                <h2 id="more-work-title" className="text-[clamp(1.8rem,3.4vw,2.75rem)] font-medium tracking-[-0.04em] text-charcoal">
                  {t('moreTitle')}
                </h2>
                <Link href="/proyectos" className="label-caps inline-flex items-center gap-2 text-forest hover:underline">
                  {t('viewAll')} <ArrowUpRight aria-hidden className="size-4" />
                </Link>
              </div>
              <ul className="mt-10 grid gap-10 md:grid-cols-2">
                {others.slice(0, 2).map((other) => (
                  <li key={other.slug}>
                    <ProjectCard project={other} />
                  </li>
                ))}
              </ul>
            </Container>
          </nav>
        ) : null}
      </article>
    </PageTransition>
  )
}
