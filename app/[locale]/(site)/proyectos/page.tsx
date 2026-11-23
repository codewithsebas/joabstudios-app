import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { isLocale, routing } from '@/i18n/routing'
import { PageTransition } from '@/components/motion/page-transition'
import { localizedAlternates, localizedOpenGraph } from '@/lib/seo'
import { Container } from '@/components/ui/layout'
import { PageHeader } from '@/components/ui/page-header'
import { Reveal } from '@/components/motion/reveal'
import { CtaBanner } from '@/components/sections/cta-banner'
import { ProjectCard } from '@/components/work/project-card'
import { getProjects } from '@/lib/content/projects'

export async function generateMetadata({ params }: PageProps<'/[locale]/proyectos'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = await getTranslations({ locale, namespace: 'ProjectsPage' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: localizedAlternates(locale, '/proyectos'),
    openGraph: localizedOpenGraph(locale, '/proyectos'),
  }
}

export default async function WorkPage({ params }: PageProps<'/[locale]/proyectos'>) {
  const { locale: param } = await params
  const locale = isLocale(param) ? param : routing.defaultLocale
  const t = await getTranslations({ locale, namespace: 'ProjectsPage' })
  const projects = getProjects(locale)

  return (
    <PageTransition>
      <PageHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        intro={t('intro')}
      />

      <section aria-label={t('listLabel')} className="pb-12">
        <Container>
          {projects.length === 0 ? (
            <p className="rounded-[var(--radius-card)] border border-dashed border-charcoal/20 p-12 text-center text-stone">
              {t('empty')}
            </p>
          ) : (
            <ul className="grid gap-x-6 gap-y-16 md:grid-cols-2">
              {projects.map((project, index) => (
                <Reveal as="li" key={project.slug} delay={(index % 2) * 0.08} className={index % 2 === 1 ? 'md:mt-24' : undefined}>
                  <ProjectCard project={project} priority={index < 2} />
                </Reveal>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <CtaBanner title={t('ctaTitle')} description={t('ctaDescription')} />
    </PageTransition>
  )
}
