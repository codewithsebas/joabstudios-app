import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { useTranslations } from 'next-intl'
import { AlertCircle, Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 font-ui text-sm text-danger">
      <AlertCircle aria-hidden className="mt-0.5 size-3.5 shrink-0" />
      {message}
    </p>
  )
}

export function Field({
  id,
  label,
  required = false,
  hint,
  error,
  children,
  className,
}: {
  id: string
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: ReactNode
  className?: string
}) {
  const t = useTranslations('Common')
  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 font-ui text-sm font-medium text-charcoal">
        <span>
          {label}
          {required ? (
            <span aria-hidden className="ml-0.5 text-forest">
              *
            </span>
          ) : null}
        </span>
        {!required ? <span className="text-xs font-normal text-mist">{t('optional')}</span> : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 font-ui text-xs text-stone">
          {hint}
        </p>
      ) : null}
      <div className="mt-2">{children}</div>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  )
}

const controlBase =
  'w-full rounded-2xl border bg-ivory px-4 font-ui text-[0.95rem] text-charcoal placeholder:text-mist transition-[border-color,box-shadow] duration-200 focus:border-forest focus:outline-none focus:ring-4 focus:ring-sage/40 aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/15'

export function describedBy(id: string, { hint, error }: { hint?: boolean; error?: boolean }): string | undefined {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean)
  return ids.length ? ids.join(' ') : undefined
}

export const TextInput = forwardRef<HTMLInputElement, ComponentPropsWithoutRef<'input'>>(function TextInput(
  { className, ...props },
  ref,
) {
  return <input ref={ref} className={cn(controlBase, 'h-13 border-charcoal/15', className)} {...props} />
})

export const TextArea = forwardRef<HTMLTextAreaElement, ComponentPropsWithoutRef<'textarea'>>(function TextArea(
  { className, ...props },
  ref,
) {
  return <textarea ref={ref} className={cn(controlBase, 'min-h-36 resize-y border-charcoal/15 py-3.5 leading-relaxed', className)} {...props} />
})

export const Select = forwardRef<HTMLSelectElement, ComponentPropsWithoutRef<'select'>>(function Select(
  { className, children, ...props },
  ref,
) {
  return (
    <div className="relative">
      <select ref={ref} className={cn(controlBase, 'h-13 appearance-none border-charcoal/15 pr-10', className)} {...props}>
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-stone" />
    </div>
  )
})

/**
 * Selectable card backed by a native radio/checkbox, so keyboard and screen
 * reader behavior come from the platform.
 */
export const ChoiceCard = forwardRef<
  HTMLInputElement,
  Omit<ComponentPropsWithoutRef<'input'>, 'type'> & { type: 'radio' | 'checkbox'; label: string; hint?: string }
>(function ChoiceCard({ type, label, hint, className, ...props }, ref) {
  return (
    <label
      className={cn(
        'group relative flex cursor-pointer items-start gap-4 rounded-2xl border border-charcoal/15 bg-ivory p-5 transition-[border-color,background-color] duration-200 hover:border-charcoal/40 has-[:checked]:border-forest has-[:checked]:bg-sage-100 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-sage/50',
        className,
      )}
    >
      <input ref={ref} type={type} className="peer sr-only" {...props} />
      <span
        aria-hidden
        className={cn(
          'mt-0.5 inline-flex size-5 shrink-0 items-center justify-center border border-charcoal/30 bg-ivory text-ivory transition-colors peer-checked:border-forest peer-checked:bg-forest',
          type === 'radio' ? 'rounded-full' : 'rounded-md',
        )}
      >
        <Check className="size-3" strokeWidth={3} />
      </span>
      <span>
        <span className="block font-medium text-charcoal">{label}</span>
        {hint ? <span className="mt-0.5 block font-ui text-sm text-stone">{hint}</span> : null}
      </span>
    </label>
  )
})

/** Visually hidden honeypot. Real users never see or focus it. */
export function Honeypot({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const t = useTranslations('Common')
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        {t('honeypot')}
        <input
          type="text"
          name="nickname"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
    </div>
  )
}

export function FormAlert({ tone, title, children }: { tone: 'error' | 'success'; title: string; children?: ReactNode }) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'rounded-2xl border p-5 font-ui text-sm',
        tone === 'error' ? 'border-danger/30 bg-danger/5 text-danger' : 'border-forest/20 bg-sage-100 text-forest',
      )}
    >
      <p className="font-semibold">{title}</p>
      {children ? <div className="mt-1 leading-relaxed">{children}</div> : null}
    </div>
  )
}
