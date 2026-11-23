import { CurrentYear } from '@/components/ui/current-year'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowUp, ArrowUpRight, Mail } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { mainNav, primaryCtaHref, siteConfig, socialProfiles } from '@/lib/site-config'
import { getServices } from '@/lib/content/services'
import { ButtonLink } from '@/components/ui/button'
import { BrandLogo } from './logo'
import { socialIcons } from './social-icons'

const linkClass = 'text-ivory/70 transition-colors duration-300 hover:text-ivory'
/** Soft hover: gentle lift, faint fill and sage accent. Links get the same feel. */
const socialStatic =
  'inline-flex size-11 items-center justify-center rounded-full border border-ivory/15 text-ivory/80 transition-[translate,background-color,border-color,color] duration-500 ease-out-soft hover:-translate-y-0.5 hover:border-sage/50 hover:bg-ivory/[0.06] hover:text-sage motion-reduce:hover:translate-y-0'
const socialButton = socialStatic

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="label-caps mb-4 text-ivory/50">{title}</h2>
      <ul className="space-y-2.5 text-[0.95rem]">{children}</ul>
    </div>
  )
}

/**
 * Screen-tall footer, with the same gutter on all four sides. Top half:
 * message, links and meta. Bottom half: the brand logo at full half-height.
 */
export function Footer() {
  const { email, whatsapp, socials } = siteConfig
  const t = useTranslations('Footer')
  const tc = useTranslations('Common')
  const tn = useTranslations('Nav')
  const services = getServices(useLocale())

  return (
    <footer className="on-dark px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="flex min-h-[calc(100svh-1.5rem)] flex-col overflow-hidden rounded-[var(--radius-panel)] bg-forest px-5 pb-6 pt-10 text-ivory sm:min-h-[calc(100svh-2rem)] sm:px-8 sm:pb-8 lg:h-[calc(100svh-2rem)] lg:min-h-[40rem] lg:px-10 lg:pb-10 lg:pt-10">
        {/* Top half */}
        <div className="flex flex-col lg:h-1/2 lg:min-h-0">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <p className="label-caps flex items-center gap-2.5 text-sage">
                <span aria-hidden className="size-1.5 rounded-full bg-sage" />
                {tc('category')}
              </p>
              <p className="mt-4 text-balance text-[clamp(2rem,min(3.4vw,6svh),3.4rem)] font-medium leading-[1] tracking-[-0.045em]">
                {tc('sloganStart')} <span className="text-ivory/45">{tc('sloganEnd')}</span>
              </p>
              <p className="mt-5 max-w-md text-pretty text-[0.95rem] leading-relaxed text-ivory/60">
                {t('tagline')}
              </p>
              <ButtonLink href={primaryCtaHref} variant="accent" arrow className="mt-6">
                {tc('cta')}
              </ButtonLink>
            </div>

            <div className="grid grid-cols-2 gap-8 font-ui sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
              <nav aria-label={t('navLabel')}>
                <Column title={t('navTitle')}>
                  {mainNav.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className={linkClass}>
                        {tn(item.key)}
                      </Link>
                    </li>
                  ))}
                </Column>
              </nav>
              <Column title={t('servicesTitle')}>
                {services.map((service) => (
                  <li key={service.slug}>
                    <Link href={{ pathname: '/servicios', hash: service.slug }} className={linkClass}>
                      {service.title}
                    </Link>
                  </li>
                ))}
              </Column>
              <Column title={t('contactTitle')}>
                <li>
                  <Link href={primaryCtaHref} className={linkClass}>
                    {tc('cta')}
                  </Link>
                </li>
                {email ? (
                  <li>
                    <a href={`mailto:${email}`} className={`${linkClass} break-all`}>
                      {email}
                    </a>
                  </li>
                ) : null}
                {whatsapp ? (
                  <li>
                    <a href={whatsapp.href} target="_blank" rel="noopener noreferrer" className={`${linkClass} inline-flex items-center gap-1`}>
                      WhatsApp <ArrowUpRight aria-hidden className="size-3.5" />
                    </a>
                  </li>
                ) : null}
                {socials.map((social) => (
                  <li key={social.label}>
                    <a href={social.href} target="_blank" rel="noopener noreferrer" className={`${linkClass} inline-flex items-center gap-1`}>
                      {social.label} <ArrowUpRight aria-hidden className="size-3.5" />
                    </a>
                  </li>
                ))}
              </Column>
            </div>
          </div>

          <div aria-hidden className="mt-10 border-t border-ivory/10 lg:mt-auto" />
        </div>

        {/* Bottom half: logo on the left (height-led), socials + meta on the right. */}
        <div className="mt-auto flex flex-col gap-10 pt-10 lg:h-1/2 lg:min-h-0 lg:flex-row lg:items-end lg:justify-between lg:pt-8">
          <div className="min-w-0 lg:flex lg:h-full lg:items-end">
            <BrandLogo
              idPrefix="footer-logo"
              align="xMinYMax"
              title="JoabStudios"
              className="block h-auto w-full text-ivory lg:h-full lg:w-auto lg:max-w-full"
            />
          </div>

          <aside aria-label={t('asideLabel')} className="flex shrink-0 flex-col gap-6 font-ui lg:items-end lg:pb-1 lg:text-right">
            <div className="flex flex-col gap-3 lg:items-end">
              <p className="label-caps text-ivory/50">{t('socialTitle')}</p>
              <ul className="flex flex-wrap gap-2 lg:justify-end">
                {socialProfiles.map((profile) => {
                  const Icon = socialIcons[profile.label]
                  return (
                    <li key={profile.label}>
                      {profile.href ? (
                        <a
                          href={profile.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={profile.label}
                          title={profile.label}
                          className={socialButton}
                        >
                          <Icon className="size-5" />
                        </a>
                      ) : (
                        <span role="img" aria-label={profile.label} title={profile.label} className={socialStatic}>
                          <Icon className="size-5" />
                        </span>
                      )}
                    </li>
                  )
                })}
                <li>
                  <Link href={primaryCtaHref} aria-label={t('contact')} title={t('contact')} className={socialButton}>
                    <Mail aria-hidden className="size-5" strokeWidth={1.8} />
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-4 border-t border-ivory/10 pt-5 text-xs text-ivory/60 lg:items-end">
              <p className="max-w-xs text-pretty leading-relaxed">
                © <CurrentYear /> JoabStudios · {tc('concept')}
              </p>
              <a
                href="#contenido"
                className="group inline-flex items-center gap-2.5 self-start text-sm text-ivory/80 transition-colors hover:text-ivory lg:self-end"
              >
                {t('backToTop')}
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-ivory text-forest transition-transform duration-300 group-hover:-translate-y-1">
                  <ArrowUp aria-hidden className="size-4" />
                </span>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </footer>
  )
}
