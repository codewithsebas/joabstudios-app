import { ArrowRight } from 'lucide-react'
import { Container, SectionHeader } from '@/components/ui/layout'
import { Reveal } from '@/components/motion/reveal'
import { useLocale, useTranslations } from 'next-intl'
import { getCompanyContent } from '@/lib/content/company'
import { getService } from '@/lib/content/services'

export function Problems() {
  const locale = useLocale()
  const t = useTranslations('Problems')
  const { problems } = getCompanyContent(locale)
  return (
    <section aria-labelledby="solve-title" className="on-dark px-3 sm:px-4">
      <div className="rounded-[var(--radius-panel)] bg-forest py-20 text-ivory sm:py-28">
        <Container inset="panel">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <SectionHeader
                  tone="light"
                  eyebrow={t('eyebrow')}
                  title={<span id="solve-title">{t('title')}</span>}
                  intro={t('intro')}
                />
              </div>
            </div>

            <ol className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
              {problems.map((item, index) => (
                <Reveal
                  as="li"
                  key={item.problem}
                  delay={(index % 2) * 0.06}
                  className="flex flex-col justify-between gap-10 rounded-[var(--radius-card)] border border-ivory/10 bg-forest-800 p-7"
                >
                  <div>
                    <p className="font-ui text-xs text-ivory/60">{String(index + 1).padStart(2, '0')}</p>
                    <h3 className="mt-5 text-xl font-medium leading-snug tracking-[-0.02em] text-ivory">
                      {item.problem}
                    </h3>
                  </div>
                  <div className="border-t border-ivory/10 pt-5">
                    <p className="flex gap-3 text-[0.95rem] leading-relaxed text-sage-300">
                      <ArrowRight aria-hidden className="mt-1 size-4 shrink-0 text-sage" />
                      {item.solution}
                    </p>
                    <p className="label-caps mt-4 text-ivory/60">{getService(locale, item.service).title}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </div>
    </section>
  )
}
