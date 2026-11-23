import Image from 'next/image'
import { ButtonLink } from '@/components/ui/button'
import { Reveal } from '@/components/motion/reveal'
import { useLocale, useTranslations } from 'next-intl'
import { getEditorialImages } from '@/lib/content/images'
import { primaryCtaHref } from '@/lib/site-config'

/**
 * Closing call to action, as a full-width panel. It sits one gutter above the
 * footer panel so the two read as a stack with even spacing.
 */
export function CtaBanner({
  title,
  description,
  cta,
}: {
  title?: string
  description?: string
  cta?: string
}) {
  const t = useTranslations('Cta')
  const tc = useTranslations('Common')
  const image = getEditorialImages(useLocale()).boutiqueRoom
  return (
    <section aria-labelledby="cta-title" className="px-3 py-3 sm:px-4 sm:py-4">
      <Reveal className="on-dark grid overflow-hidden rounded-[var(--radius-panel)] bg-forest text-ivory lg:grid-cols-2">
        <div className="flex flex-col justify-between gap-12 px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <p className="label-caps flex items-center gap-2.5 text-sage">
            <span aria-hidden className="size-1.5 rounded-full bg-sage" />
            {t('eyebrow')}
          </p>
          <div>
            <h2
              id="cta-title"
              className="max-w-2xl text-balance text-[clamp(2.4rem,4.6vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.045em]"
            >
              {title ?? t('title')}
            </h2>
            <p className="mt-6 max-w-md text-lg text-ivory/70">{description ?? t('description')}</p>
          </div>
          <ButtonLink href={primaryCtaHref} variant="accent" size="lg" arrow className="self-start">
            {cta ?? tc('cta')}
          </ButtonLink>
        </div>
        <div className="relative min-h-80 lg:min-h-[34rem]">
          <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </Reveal>
    </section>
  )
}
