import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { isLocale, routing } from '@/i18n/routing'
import { PageTransition } from '@/components/motion/page-transition'
import { localizedAlternates, localizedOpenGraph } from '@/lib/seo'
import { ArrowUpRight, Mail, MessageCircle } from 'lucide-react'
import { Container } from '@/components/ui/layout'
import { PageHeader } from '@/components/ui/page-header'
import { QuoteForm } from '@/components/quote/quote-form'
import { siteConfig } from '@/lib/site-config'

export async function generateMetadata({ params }: PageProps<'/[locale]/contacto'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = await getTranslations({ locale, namespace: 'ContactPage' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: localizedAlternates(locale, '/contacto'),
    openGraph: localizedOpenGraph(locale, '/contacto'),
  }
}

const channelClass =
  'inline-flex items-center gap-2 rounded-full border border-charcoal/15 px-4 py-2 font-ui text-sm text-charcoal transition-colors hover:border-forest hover:bg-forest hover:text-ivory'

export default async function ContactPage({ params }: PageProps<'/[locale]/contacto'>) {
  const { locale: param } = await params
  const locale = isLocale(param) ? param : routing.defaultLocale
  const t = await getTranslations({ locale, namespace: 'ContactPage' })
  const { email, whatsapp, socials } = siteConfig
  const hasDirectChannels = Boolean(email || whatsapp || socials.length)

  return (
    <PageTransition>
      <PageHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        intro={t('intro')}
      >
        {hasDirectChannels ? (
          <div className="mt-10 flex flex-wrap items-center gap-2">
            <p className="mr-2 font-ui text-sm text-stone">{t('direct')}</p>
            {email ? (
              <a href={`mailto:${email}`} className={channelClass}>
                <Mail aria-hidden className="size-4" />
                {email}
              </a>
            ) : null}
            {whatsapp ? (
              <a href={whatsapp.href} target="_blank" rel="noopener noreferrer" className={channelClass}>
                <MessageCircle aria-hidden className="size-4" />
                WhatsApp {whatsapp.display}
              </a>
            ) : null}
            {socials.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className={channelClass}>
                {social.label}
                <ArrowUpRight aria-hidden className="size-3.5" />
              </a>
            ))}
          </div>
        ) : null}
      </PageHeader>

      <section aria-label={t('formLabel')} className="pb-24 sm:pb-32">
        <Container>
          <div className="rounded-[var(--radius-panel)] border border-charcoal/10 bg-ivory p-5 sm:p-10 lg:p-14">
            <QuoteForm />
          </div>
          <p className="mt-6 font-ui text-sm text-stone">
            {t.rich('requiredNote', { mark: (chunks) => <span className="text-forest">{chunks}</span> })}
          </p>
        </Container>
      </section>
    </PageTransition>
  )
}
