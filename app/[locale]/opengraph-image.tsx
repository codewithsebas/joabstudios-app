import { ImageResponse } from 'next/og'
import { getTranslations } from 'next-intl/server'
import { brandLogoSvg, brandViewBox } from '@/components/site/brand-logo'
import { isLocale, routing } from '@/i18n/routing'

const logoSrc = `data:image/svg+xml;base64,${Buffer.from(brandLogoSvg('#f3f2ed')).toString('base64')}`

export const alt = 'JoabStudios'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

// ImageResponse (Satori) acepta clases Tailwind mediante la prop `tw`.
export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: param } = await params
  const locale = isLocale(param) ? param : routing.defaultLocale
  const tc = await getTranslations({ locale, namespace: 'Common' })
  const og = await getTranslations({ locale, namespace: 'Og' })

  return new ImageResponse(
    (
      <div tw="flex h-full w-full flex-col justify-between bg-[#172d29] p-[72px] text-[#f3f2ed]">
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img */}
        <img src={logoSrc} width={(72 * brandViewBox.width) / brandViewBox.height} height={72} alt="" />
        <div tw="flex flex-col">
          <div tw="text-[84px] font-medium leading-none tracking-[-3px]">{tc('concept')}</div>
        </div>
        <div tw="flex justify-between text-[24px] text-[rgba(243,242,237,0.65)]">
          <div>{og('services')}</div>
          <div>{`${tc('sloganStart')} ${tc('sloganEnd')}`}</div>
        </div>
      </div>
    ),
    size,
  )
}
