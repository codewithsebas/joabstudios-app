import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { ButtonLink } from '@/components/ui/button'
import { getEditorialImages } from '@/lib/content/images'
import { getProject } from '@/lib/content/projects'
import { primaryCtaHref } from '@/lib/site-config'

/**
 * Editorial hero: architectural photograph inside a rounded panel, headline
 * centered, and a fan of real screenshots from the latest case study.
 */
export function Hero() {
  const locale = useLocale()
  const t = useTranslations('Hero')
  const tc = useTranslations('Common')
  const image = getEditorialImages(locale).heroCabin
  const featured = getProject(locale, 'la-vaca-fifi')
  const shots = featured?.gallery ?? []
  const desktopShot = shots.find((s) => s.src.endsWith('booking-flow.webp'))
  const cabinsShot = shots.find((s) => s.src.endsWith('cabins.webp'))
  const mobileShot = shots.find((s) => s.src.endsWith('mobile-home.webp'))

  return (
    <section aria-labelledby="hero-title" className="on-dark px-3 pt-3 sm:px-4 sm:pt-4">
      {/* One viewport tall minus the gutter above and below. The text block keeps
          its natural height and the work fan takes whatever space is left. */}
      <div className="relative isolate flex h-[calc(100svh-1.5rem)] min-h-[34rem] flex-col overflow-hidden rounded-[var(--radius-panel)] bg-forest text-ivory sm:h-[calc(100svh-2rem)]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[50%_60%]"
        />
        {/* Legibility scrim: keeps the headline AA over any part of the photograph. */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-forest/55" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-forest/90 to-transparent" />

        <div className="mx-auto flex w-full max-w-6xl shrink-0 flex-col items-center px-5 pt-[clamp(6rem,15svh,10rem)] text-center">
          <p className="label-caps text-sage">{tc('category')}</p>
          <h1
            id="hero-title"
            className="mt-[clamp(1rem,2.4svh,1.5rem)] text-balance text-[clamp(2.4rem,min(6.6vw,9svh),6rem)] font-medium leading-[0.98] tracking-[-0.045em]"
          >
            <span className="lg:block lg:whitespace-nowrap">{t('titleStart')}</span>{' '}
            <span className="text-sage-300">{t('titleEnd')}</span>
          </h1>
          <p className="mt-[clamp(1rem,3svh,1.75rem)] max-w-xl text-pretty text-base leading-relaxed text-ivory/80 sm:text-lg">
            {t('intro')}
          </p>
          <div className="mt-[clamp(1.25rem,4svh,2.5rem)] flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
            <ButtonLink href="/proyectos" variant="outline-light" size="lg">
              {t('viewProjects')}
            </ButtonLink>
            <ButtonLink href={primaryCtaHref} variant="accent" size="lg" arrow>
              {tc('cta')}
            </ButtonLink>
          </div>
        </div>

        {featured && desktopShot && cabinsShot && mobileShot ? (
          <div className="flex min-h-0 flex-1 flex-col px-5 pb-6 pt-[clamp(1.25rem,5svh,3.5rem)] sm:pb-8 [@media(max-height:640px)]:hidden">
            <Link
              href={{ pathname: '/proyectos/[slug]', params: { slug: featured.slug } }}
              className="group mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col rounded-[var(--radius-card)]"
              aria-label={t('featuredAria', { name: featured.name })}
            >
              {/* Sized by height so the fan always fits the remaining space. */}
              <div aria-hidden className="flex min-h-0 flex-1 items-end justify-center">
                <figure className="relative z-0 -mr-[3%] hidden aspect-[1440/900] h-[74%] -rotate-[5deg] overflow-hidden rounded-xl shadow-2xl shadow-forest/50 ring-1 ring-ivory/15 transition-transform duration-700 ease-out-soft group-hover:-translate-y-2 group-hover:-rotate-[7deg] sm:block">
                  <Image src={cabinsShot.src} alt="" fill sizes="(min-width: 1280px) 420px, 30vw" className="object-cover object-top" />
                </figure>
                <figure className="relative z-10 aspect-[1440/900] h-full max-w-full overflow-hidden rounded-xl shadow-2xl shadow-forest/60 ring-1 ring-ivory/20 transition-transform duration-700 ease-out-soft group-hover:-translate-y-3">
                  <Image src={desktopShot.src} alt="" fill sizes="(min-width: 1280px) 560px, 80vw" className="object-cover object-top" />
                </figure>
                <figure className="relative z-0 -ml-[2%] hidden aspect-[780/1688] h-[86%] rotate-[5deg] overflow-hidden rounded-2xl shadow-2xl shadow-forest/50 ring-1 ring-ivory/15 transition-transform duration-700 ease-out-soft group-hover:-translate-y-2 group-hover:rotate-[7deg] sm:block">
                  <Image src={mobileShot.src} alt="" fill sizes="180px" className="object-cover object-top" />
                </figure>
              </div>
              <p className="mt-4 flex shrink-0 items-center justify-center gap-2 font-ui text-xs text-ivory/70 transition-colors group-hover:text-ivory">
                <span className="size-1.5 rounded-full bg-sage" aria-hidden />
                {t('featured', { name: featured.name, category: featured.category.toLowerCase() })}
                <ArrowUpRight aria-hidden className="size-3.5" />
              </p>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  )
}
