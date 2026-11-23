import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ButtonLink } from '@/components/ui/button'
import { Logo } from '@/components/site/logo'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('NotFound')
  return { title: t('metaTitle'), robots: { index: false } }
}

export default async function NotFound() {
  const t = await getTranslations('NotFound')
  return (
    <main id="contenido" className="flex min-h-dvh flex-col px-4 py-6 sm:px-8">
      <Logo />
      <div className="my-auto max-w-3xl py-20">
        <p className="label-caps text-stone">{t('eyebrow')}</p>
        <h1 className="mt-6 text-balance text-[clamp(2.6rem,7vw,5.5rem)] font-medium leading-[0.98] tracking-[-0.045em] text-charcoal">
          {t('title')}
        </h1>
        <p className="mt-6 max-w-lg text-lg text-stone">{t('text')}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" variant="dark" arrow>
            {t('home')}
          </ButtonLink>
          <ButtonLink href="/proyectos" variant="outline">
            {t('projects')}
          </ButtonLink>
        </div>
      </div>
    </main>
  )
}
