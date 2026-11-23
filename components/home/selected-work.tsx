import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'
import { Container, SectionHeader, Tag } from '@/components/ui/layout'
import { Reveal } from '@/components/motion/reveal'
import { ProjectCover } from '@/components/work/project-cover'
import { getFeaturedProjects } from '@/lib/content/projects'
import { cn } from '@/lib/cn'

export function SelectedWork() {
  const t = useTranslations('Work')
  const projects = getFeaturedProjects(useLocale())

  return (
    <section aria-labelledby="work-title" className="py-20 sm:py-28">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeader
            eyebrow={t('eyebrow')}
            title={<span id="work-title">{t('title')}</span>}
            intro={t('intro')}
          />
          <ButtonLink href="/proyectos" variant="outline" arrow className="self-start md:self-auto">
            {t('viewAll')}
          </ButtonLink>
        </div>

        {projects.length === 0 ? (
          <p className="mt-14 rounded-[var(--radius-card)] border border-dashed border-charcoal/20 p-10 text-center text-stone">
            {t('empty')}
          </p>
        ) : (
          <ul className="mt-14 flex flex-col gap-16 sm:gap-24">
            {projects.map((project, index) => (
              <Reveal as="li" key={project.slug}>
                <article className="group grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
                  <Link
                    href={{ pathname: '/proyectos/[slug]', params: { slug: project.slug } }}
                    className={cn(
                      'block overflow-hidden rounded-[var(--radius-card)] lg:col-span-7',
                      index % 2 === 1 && 'lg:order-2',
                    )}
                    aria-label={t('caseStudyAria', { name: project.name })}
                    tabIndex={-1}
                  >
                    <ProjectCover project={project} sizes="(min-width: 1024px) 56vw, 100vw" className="aspect-[16/10]" />
                  </Link>
                  <div className={cn('lg:col-span-5', index % 2 === 1 && 'lg:order-1')}>
                    <p className="font-ui text-xs text-mist">
                      {String(index + 1).padStart(2, '0')} — {project.category}
                    </p>
                    <h3 className="mt-4 text-[clamp(2rem,3.6vw,3rem)] font-medium leading-none tracking-[-0.04em] text-charcoal">
                      <Link href={{ pathname: '/proyectos/[slug]', params: { slug: project.slug } }} className="rounded-md hover:text-forest">
                        {project.name}
                      </Link>
                    </h3>
                    <p className="mt-2 text-stone">
                      {project.sector}
                      {project.location ? ` · ${project.location}` : ''}
                    </p>
                    <p className="mt-6 max-w-md text-pretty leading-relaxed text-charcoal/85">{project.summary}</p>
                    <ul className="mt-6 flex flex-wrap gap-2" aria-label={t('servicesAria')}>
                      {project.services.map((service) => (
                        <li key={service}>
                          <Tag>{service}</Tag>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={{ pathname: '/proyectos/[slug]', params: { slug: project.slug } }}
                      className="label-caps mt-8 inline-flex items-center gap-2 text-forest underline-offset-4 hover:underline"
                    >
                      {t('viewCaseStudy')}
                      <ArrowUpRight aria-hidden className="size-4" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        )}
      </Container>
    </section>
  )
}
