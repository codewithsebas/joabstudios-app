import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { Project } from '@/lib/content/projects'
import { cn } from '@/lib/cn'

/**
 * Project cover. Uses the real screenshot when one exists; otherwise renders a
 * typographic cover so no stock photo is ever passed off as client work.
 */
export function ProjectCover({
  project,
  sizes,
  priority = false,
  className,
}: {
  project: Project
  sizes: string
  priority?: boolean
  className?: string
}) {
  const t = useTranslations('CaseStudy')
  if (project.cover) {
    return (
      <div className={cn('relative overflow-hidden bg-ivory-200', className)}>
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-top transition-transform duration-[1.2s] ease-out-soft group-hover:scale-[1.03]"
        />
      </div>
    )
  }

  return (
    <div
      className={cn('relative flex overflow-hidden bg-forest text-ivory', className)}
      role="img"
      aria-label={t('coverAria', { name: project.name })}
    >
      <svg
        aria-hidden
        viewBox="0 0 200 200"
        className="absolute -right-10 -top-6 h-[120%] text-forest-700 transition-transform duration-[1.2s] ease-out-soft group-hover:-translate-y-2"
      >
        <path d="M40 200V95a60 60 0 0 1 120 0v105h-28V97a32 32 0 0 0-64 0v103Z" fill="currentColor" />
      </svg>
      <div className="relative mt-auto p-6 sm:p-8">
        <p className="label-caps text-sage">{project.category}</p>
        <p className="mt-3 text-[clamp(2rem,4vw,3.25rem)] font-medium leading-none tracking-[-0.04em]">
          {project.name}
        </p>
        <p className="mt-4 font-ui text-xs text-ivory/60">{t('coverPending')}</p>
      </div>
    </div>
  )
}
