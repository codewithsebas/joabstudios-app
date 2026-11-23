import type { SVGProps } from 'react'
import type React from 'react'
import type { SocialName } from '@/lib/site-config'

/** Simplified line icons for social profiles (24px grid, currentColor). */
type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3.5" />
      <path d="M8 10.5V17" />
      <circle cx="8" cy="7.4" r="1.1" fill="currentColor" stroke="none" />
      <path d="M11.5 17v-6.5M11.5 13.4c0-1.7 1.2-2.9 2.8-2.9s2.7 1.2 2.7 2.9V17" />
    </svg>
  )
}

export function BehanceIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2.8 6.5h4.4a2.55 2.55 0 0 1 0 5.1H2.8z" />
      <path d="M2.8 11.6h5a2.95 2.95 0 0 1 0 5.9h-5z" />
      <path d="M14 14.3h7a3.5 3.5 0 1 0-1.1 2.6" />
      <path d="M15 8h5" />
    </svg>
  )
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.6 20.4l1.2-4.1A8.4 8.4 0 1 1 8 19.3z" />
      <path
        d="M9.2 8.4c.3-.5.9-.5 1.2 0l.8 1.5c.15.3.1.6-.15.85l-.55.55a5.6 5.6 0 0 0 2.95 2.95l.55-.55c.25-.25.55-.3.85-.15l1.5.8c.5.3.5.9 0 1.2-.8.5-1.8.55-2.65.2a8 8 0 0 1-4.5-4.5c-.35-.85-.3-1.85.2-2.65z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  )
}

export const socialIcons: Record<SocialName, (props: IconProps) => React.JSX.Element> = {
  Instagram: InstagramIcon,
  LinkedIn: LinkedInIcon,
  Behance: BehanceIcon,
  WhatsApp: WhatsAppIcon,
}

