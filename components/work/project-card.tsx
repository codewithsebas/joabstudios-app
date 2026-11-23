import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '@/lib/content/projects'
import { Tag } from '@/components/ui/layout'
import { ProjectCover } from './project-cover'

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const t = useTranslations('Work')
  return (
    <article className="group relative">
      <ProjectCover
        project={project}
        priority={priority}
        sizes="(min-width: 768px) 50vw, 100vw"
        className="aspect-[4/3] rounded-[var(--radius-card)]"
      />
      <div className="mt-6 flex items-start justify-between gap-6">
        <div>
          <h2 className="text-3xl font-medium tracking-[-0.04em] text-charcoal">
            <Link href={{ pathname: '/proyectos/[slug]', params: { slug: project.slug } }} className="after:absolute after:inset-0 after:rounded-[var(--radius-card)]">
              {project.name}
            </Link>
          </h2>
          <p className="mt-1.5 text-stone">
            {project.sector}
            {project.location ? ` · ${project.location}` : ''}
          </p>
        </div>
        <span
          aria-hidden
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-charcoal/15 transition-colors duration-300 group-hover:border-forest group-hover:bg-forest group-hover:text-sage"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <ul className="mt-5 flex flex-wrap gap-2" aria-label={t('servicesAria')}>
        {project.services.map((service) => (
          <li key={service}>
            <Tag>{service}</Tag>
          </li>
        ))}
      </ul>
    </article>
  )
}
