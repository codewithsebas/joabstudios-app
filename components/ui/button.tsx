import { Link } from '@/i18n/navigation'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'accent' | 'dark' | 'outline' | 'outline-light' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'group/btn inline-flex shrink-0 items-center justify-center gap-3 rounded-full font-ui font-medium uppercase tracking-[0.12em] transition-[background-color,color,border-color,transform] duration-300 ease-out-soft active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  accent: 'bg-sage text-forest hover:bg-sage-300',
  dark: 'bg-forest text-ivory hover:bg-forest-800',
  outline: 'border border-charcoal/20 text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-ivory',
  'outline-light': 'border border-ivory/35 text-ivory hover:border-ivory hover:bg-ivory hover:text-forest',
  ghost: 'text-charcoal hover:bg-charcoal/5',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-[0.68rem]',
  md: 'h-12 px-6 text-[0.72rem]',
  lg: 'h-14 px-7 text-[0.75rem]',
}

/** Size of the trailing arrow disc, which hugs the right edge like the reference CTA. */
const arrowSizes: Record<ButtonSize, string> = {
  sm: 'size-7 -mr-2.5',
  md: 'size-8 -mr-3.5',
  lg: 'size-10 -mr-4',
}

const arrowVariants: Record<ButtonVariant, string> = {
  accent: 'bg-forest text-sage',
  dark: 'bg-sage text-forest',
  outline: 'bg-charcoal text-ivory group-hover/btn:bg-ivory group-hover/btn:text-charcoal',
  'outline-light': 'bg-ivory text-forest group-hover/btn:bg-forest group-hover/btn:text-ivory',
  ghost: 'bg-charcoal text-ivory',
}

type SharedProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Renders the circular arrow affordance on the right. */
  arrow?: boolean
  children: ReactNode
  className?: string
}

function ArrowDisc({ variant, size }: { variant: ButtonVariant; size: ButtonSize }) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-colors duration-300',
        arrowSizes[size],
        arrowVariants[variant],
      )}
    >
      <ArrowUpRight
        className="size-4 transition-transform duration-300 ease-out-soft group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
        strokeWidth={1.75}
      />
    </span>
  )
}

export function buttonClasses({
  variant = 'accent',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}): string {
  return cn(base, variants[variant], sizes[size], className)
}

type ButtonLinkProps = SharedProps & Omit<ComponentPropsWithoutRef<typeof Link>, 'className' | 'children'>

/** Enlace interno con forma de botón; respeta el idioma y las URL traducidas. */
export function ButtonLink({ variant = 'accent', size = 'md', arrow = false, className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses({ variant, size, className })} {...rest}>
      <span>{children}</span>
      {arrow ? <ArrowDisc variant={variant} size={size} /> : null}
    </Link>
  )
}

/** Enlace a otro sitio con forma de botón; abre en una pestaña nueva. */
export function ExternalButtonLink({
  variant = 'accent',
  size = 'md',
  arrow = false,
  className,
  children,
  href,
  newTabLabel,
}: SharedProps & { href: string; newTabLabel: string }) {
  return (
    <a href={href} className={buttonClasses({ variant, size, className })} target="_blank" rel="noopener noreferrer">
      <span>{children}</span>
      {arrow ? <ArrowDisc variant={variant} size={size} /> : null}
      <span className="sr-only"> {newTabLabel}</span>
    </a>
  )
}

type ButtonProps = SharedProps & Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'>

export function Button({
  variant = 'accent',
  size = 'md',
  arrow = false,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...rest}>
      <span>{children}</span>
      {arrow ? <ArrowDisc variant={variant} size={size} /> : null}
    </button>
  )
}
