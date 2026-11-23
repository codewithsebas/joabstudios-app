import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Loader2, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-ui font-medium transition-[background-color,color,box-shadow,transform] duration-200 ease-out-soft active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage/60 disabled:pointer-events-none disabled:opacity-55'

const variants: Record<Variant, string> = {
  primary: 'bg-forest text-white shadow-[0_8px_20px_-10px_rgba(23,45,41,0.7)] hover:bg-forest-800',
  secondary: 'bg-white text-charcoal ring-1 ring-charcoal/12 hover:bg-ivory hover:ring-charcoal/20',
  ghost: 'text-stone hover:bg-charcoal/5 hover:text-charcoal',
  danger: 'bg-danger text-white hover:bg-danger/90',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[0.8125rem]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-sm',
}

type Shared = {
  variant?: Variant
  size?: Size
  /** Icono a la izquierda del texto. */
  icon?: LucideIcon
  className?: string
  children?: ReactNode
}

export function adminButtonClasses({ variant = 'primary', size = 'md', className }: Pick<Shared, 'variant' | 'size' | 'className'>) {
  return cn(base, variants[variant], sizes[size], className)
}

/** Botón del panel. `loading` muestra un spinner y lo desactiva mientras dura la acción. */
export function AdminButton({
  variant,
  size,
  icon: Icon,
  loading = false,
  className,
  children,
  type = 'button',
  disabled,
  ...rest
}: Shared & { loading?: boolean } & Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'>) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={adminButtonClasses({ variant, size, className })}
      {...rest}
    >
      {loading ? <Loader2 aria-hidden className="size-4 animate-spin" /> : Icon ? <Icon aria-hidden className="size-4" /> : null}
      {children}
    </button>
  )
}

export function AdminButtonLink({
  variant,
  size,
  icon: Icon,
  className,
  children,
  ...rest
}: Shared & Omit<ComponentPropsWithoutRef<typeof Link>, 'className' | 'children'>) {
  return (
    <Link className={adminButtonClasses({ variant, size, className })} {...rest}>
      {Icon ? <Icon aria-hidden className="size-4" /> : null}
      {children}
    </Link>
  )
}
