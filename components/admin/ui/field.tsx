import type { ComponentProps, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

/*
 * Sin 'use client' a propósito: estos campos se usan tanto en páginas de
 * servidor (p. ej. el buscador con icono) como dentro de componentes cliente.
 * El campo de contraseña, que sí tiene estado, vive en password-input.tsx.
 */

/** Borde, foco y estado de error compartidos por todos los controles del panel. */
export const controlClasses =
  'w-full bg-white font-ui text-sm text-charcoal ring-1 ring-inset ring-charcoal/15 transition-[box-shadow,background-color] duration-200 placeholder:text-mist/80 hover:ring-charcoal/25 focus:outline-none focus:ring-2 focus:ring-forest aria-[invalid=true]:ring-red-400 disabled:cursor-not-allowed disabled:bg-ivory disabled:opacity-70'

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: ReactNode
  htmlFor?: string
  hint?: ReactNode
  error?: string | null
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block font-ui text-[0.8125rem] font-semibold text-charcoal">
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="mt-1.5 font-ui text-xs text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 font-ui text-xs text-stone">{hint}</p>
      ) : null}
    </div>
  )
}

export function Input({
  className,
  icon: Icon,
  inputSize = 'lg',
  ...props
}: ComponentProps<'input'> & { icon?: LucideIcon; inputSize?: 'md' | 'lg' }) {
  const height = inputSize === 'lg' ? 'h-12' : 'h-11'
  if (!Icon) return <input className={cn(controlClasses, height, 'rounded-full px-5', className)} {...props} />
  return (
    <span className="relative block">
      <Icon aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-mist" />
      <input className={cn(controlClasses, height, 'rounded-full pl-11 pr-5', className)} {...props} />
    </span>
  )
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={cn(controlClasses, 'min-h-28 resize-y rounded-2xl px-4 py-3 leading-relaxed', className)} {...props} />
}
