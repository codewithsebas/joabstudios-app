import { useLocale, useTranslations } from 'next-intl'
import { getCompanyContent } from '@/lib/content/company'
import { Container, SectionHeader } from '@/components/ui/layout'
import { Reveal } from '@/components/motion/reveal'

export function ProcessSteps({ intro }: { intro?: string }) {
  const t = useTranslations('Process')
  const { processSteps } = getCompanyContent(useLocale())
  return (
    <section aria-labelledby="process-title" className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <SectionHeader
            className="lg:col-span-6"
            eyebrow={t('eyebrow')}
            title={<span id="process-title">{t('title')}</span>}
            intro={intro}
          />
        </div>

        <ol className="mt-14 grid border-t border-charcoal/15 sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((step, index) => (
            <Reveal
              as="li"
              key={step.index}
              delay={index * 0.06}
              className="group relative border-b border-charcoal/15 py-8 sm:pr-8 lg:border-b-0 lg:border-r lg:px-6 lg:py-10 lg:first:pl-0 lg:last:border-r-0"
            >
              <span
                aria-hidden
                className="absolute -top-[5px] left-0 size-[9px] rounded-full border border-charcoal/30 bg-ivory transition-colors duration-300 group-hover:border-forest group-hover:bg-sage lg:left-6 lg:group-first:left-0"
              />
              <p className="font-ui text-xs text-mist">{step.index}</p>
              <h3 className="mt-8 text-2xl font-medium tracking-[-0.03em] text-charcoal lg:mt-16">{step.title}</h3>
              <p className="mt-3 max-w-xs text-pretty text-[0.95rem] leading-relaxed text-stone">{step.description}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  )
}
