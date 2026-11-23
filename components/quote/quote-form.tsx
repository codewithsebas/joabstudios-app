'use client'

import { useEffect, useRef, useState, useTransition, type FormEvent } from 'react'
import { useForm, type FieldPath } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { ArrowLeft, ArrowRight, Check, Loader2, Pencil } from 'lucide-react'
import { Button, ButtonLink } from '@/components/ui/button'
import { ChoiceCard, Field, FieldError, FormAlert, Honeypot, Select, TextArea, TextInput, describedBy } from '@/components/forms/fields'
import { submitQuote } from '@/lib/leads/actions'
import { budgetOptions, projectTypes, serviceFromSlug, serviceOptions } from '@/lib/leads/options'
import { quoteSchema, quoteStepFields, type QuoteFormValues } from '@/lib/leads/schema'
import type { ServiceSlug } from '@/lib/content/services'
import { cn } from '@/lib/cn'

const stepKeys = ['project', 'services', 'business', 'contact', 'review'] as const
type StepKey = (typeof stepKeys)[number]

/** Ancho de la barra de progreso por paso (clases Tailwind, una por paso). */
const progressWidths = ['w-1/5', 'w-2/5', 'w-3/5', 'w-4/5', 'w-full'] as const

const defaultValues: QuoteFormValues = {
  projectType: '' as unknown as QuoteFormValues['projectType'],
  services: [],
  businessName: '',
  location: '',
  website: '',
  units: '',
  fullName: '',
  email: '',
  whatsapp: '',
  budget: '' as unknown as QuoteFormValues['budget'],
  message: '',
}

const fieldStep: Record<keyof QuoteFormValues, number> = {
  projectType: 0,
  services: 1,
  businessName: 2,
  location: 2,
  website: 2,
  units: 2,
  fullName: 3,
  email: 3,
  whatsapp: 3,
  budget: 3,
  message: 3,
}

function isServiceSlug(value: string | null): value is ServiceSlug {
  return value !== null && value in serviceFromSlug
}

export function QuoteForm() {
  const t = useTranslations('QuoteForm')
  const [step, setStep] = useState(0)
  const [status, setStatus] = useState<'idle' | 'success'>('idle')
  const [serverError, setServerError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [honeypot, setHoneypot] = useState('')
  const startedAt = useRef(0)
  const submitting = useRef(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const successRef = useRef<HTMLHeadingElement>(null)
  const isFirstRender = useRef(true)

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    setError,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues,
    mode: 'onTouched',
  })

  useEffect(() => {
    startedAt.current = Date.now()
    // Preselecciona un servicio al llegar desde la página de servicios (?servicio=…)
    const slug = new URLSearchParams(window.location.search).get('servicio')
    if (isServiceSlug(slug)) setValue('services', [serviceFromSlug[slug]])
  }, [setValue])

  // Move focus to the new step's heading so keyboard and screen-reader users
  // land on the content that just changed.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    headingRef.current?.focus()
  }, [step])

  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
  }, [status])

  const currentKey: StepKey = stepKeys[step]
  const isReview = currentKey === 'review'
  const stepTitle = (key: StepKey) => t(`steps.${key}.title`)

  /** Los errores de validación llegan como claves (p. ej. "email.invalid") y se traducen aquí. */
  const translateError = (message: string | undefined) => {
    if (!message) return undefined
    const key = `errors.${message}` as Parameters<typeof t>[0]
    return t.has(key) ? t(key) : t('errors.fallback')
  }

  const labelProjectType = (value: string) =>
    t.has(`projectTypes.${value}.label` as Parameters<typeof t>[0])
      ? t(`projectTypes.${value}.label` as Parameters<typeof t>[0])
      : value
  const labelService = (value: string) =>
    t.has(`serviceOptions.${value}.label` as Parameters<typeof t>[0])
      ? t(`serviceOptions.${value}.label` as Parameters<typeof t>[0])
      : value
  const labelBudget = (value: string) =>
    t.has(`budgetOptions.${value}` as Parameters<typeof t>[0]) ? t(`budgetOptions.${value}` as Parameters<typeof t>[0]) : value

  async function next() {
    const key = currentKey as Exclude<StepKey, 'review'>
    const valid = await trigger([...quoteStepFields[key]] as FieldPath<QuoteFormValues>[], { shouldFocus: true })
    if (valid) setStep((s) => Math.min(s + 1, stepKeys.length - 1))
  }

  function back() {
    setServerError(null)
    setStep((s) => Math.max(s - 1, 0))
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) =>
    handleSubmit(
      (values) => {
        if (submitting.current) return
        submitting.current = true
        setServerError(null)
        startTransition(async () => {
          try {
            const result = await submitQuote(values, { nickname: honeypot, startedAt: startedAt.current })
            if (result.ok) {
              setStatus('success')
              return
            }
            setServerError(t(`submitErrors.${result.error}`))
            if (result.fieldErrors) {
              const entries = Object.entries(result.fieldErrors) as Array<[keyof QuoteFormValues, string]>
              for (const [field, message] of entries) {
                if (field in fieldStep) setError(field, { type: 'server', message })
              }
              const firstStep = Math.min(...entries.map(([field]) => fieldStep[field] ?? stepKeys.length - 1))
              if (Number.isFinite(firstStep)) setStep(firstStep)
            }
          } catch {
            setServerError(t('connectionError'))
          } finally {
            submitting.current = false
          }
        })
      },
      (fieldErrors) => {
        const first = (Object.keys(fieldErrors) as Array<keyof QuoteFormValues>)[0]
        if (first) setStep(fieldStep[first])
      },
    )(event)

  if (status === 'success') {
    return (
      <div className="rounded-[var(--radius-panel)] bg-forest p-8 text-ivory sm:p-14">
        <span className="inline-flex size-14 items-center justify-center rounded-full bg-sage text-forest">
          <Check aria-hidden className="size-6" strokeWidth={2.5} />
        </span>
        <h2
          ref={successRef}
          tabIndex={-1}
          className="mt-8 text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.02] tracking-[-0.04em] outline-none"
        >
          {t('successTitle')}
        </h2>
        <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-ivory/75">
          {t('successText', { name: getValues('businessName') || t('successFallbackName') })}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/proyectos" variant="accent" arrow>
            {t('viewProjects')}
          </ButtonLink>
          <ButtonLink href="/" variant="outline-light">
            {t('backHome')}
          </ButtonLink>
        </div>
      </div>
    )
  }

  const values = getValues()
  const err = (name: keyof QuoteFormValues) => translateError(errors[name]?.message)

  return (
    <form
      onSubmit={(event) => {
        // Enter on intermediate steps advances instead of submitting.
        if (!isReview) {
          event.preventDefault()
          void next()
          return
        }
        void onSubmit(event)
      }}
      onKeyDown={(event) => {
        // Intermediate steps have no submit button, so browsers skip implicit
        // submission. Enter in a single-line field advances to the next step.
        const target = event.target as HTMLElement
        if (event.key === 'Enter' && !isReview && target instanceof HTMLInputElement && target.type !== 'checkbox' && target.type !== 'radio') {
          event.preventDefault()
          void next()
        }
      }}
      noValidate
      className="relative grid gap-10 lg:grid-cols-[17rem_1fr] lg:gap-16"
    >
      <Honeypot value={honeypot} onChange={setHoneypot} />

      {/* Progress */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="font-ui text-sm text-stone" aria-live="polite">
          {t('progress', { current: step + 1, total: stepKeys.length })}
          <span className="sr-only">: {stepTitle(currentKey)}</span>
        </p>
        <div
          className="mt-3 h-1 overflow-hidden rounded-full bg-charcoal/10"
          role="progressbar"
          aria-label={t('progressLabel')}
          aria-valuemin={1}
          aria-valuemax={stepKeys.length}
          aria-valuenow={step + 1}
        >
          <div className={cn('h-full rounded-full bg-forest transition-[width] duration-500 ease-out-soft', progressWidths[step])} />
        </div>
        <ol className="mt-6 hidden space-y-1 lg:block">
          {stepKeys.map((key, index) => (
            <li key={key}>
              <span
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 font-ui text-sm transition-colors',
                  index === step && 'bg-ivory-200 font-medium text-charcoal',
                  index < step && 'text-forest',
                  index > step && 'text-mist',
                )}
                aria-current={index === step ? 'step' : undefined}
              >
                <span
                  className={cn(
                    'inline-flex size-6 items-center justify-center rounded-full border text-xs',
                    index < step ? 'border-forest bg-forest text-ivory' : 'border-current',
                  )}
                >
                  {index < step ? <Check aria-hidden className="size-3" strokeWidth={3} /> : index + 1}
                </span>
                {stepTitle(key)}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="min-w-0">
        <div className="mb-8">
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="text-[clamp(1.7rem,3vw,2.4rem)] font-medium leading-tight tracking-[-0.035em] text-charcoal outline-none"
          >
            {stepTitle(currentKey)}
          </h2>
          <p className="mt-2 text-stone">{t(`steps.${currentKey}.description`)}</p>
        </div>

        {currentKey === 'project' ? (
          <fieldset aria-describedby={describedBy('projectType', { error: Boolean(err('projectType')) })}>
            <legend className="sr-only">{t('projectLegend')}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {projectTypes.map((option) => (
                <ChoiceCard
                  key={option.value}
                  type="radio"
                  value={option.value}
                  label={t(`projectTypes.${option.value}.label`)}
                  hint={t(`projectTypes.${option.value}.hint`)}
                  {...register('projectType')}
                />
              ))}
            </div>
            <FieldError id="projectType-error" message={err('projectType')} />
          </fieldset>
        ) : null}

        {currentKey === 'services' ? (
          <fieldset aria-describedby={describedBy('services', { error: Boolean(err('services')) })}>
            <legend className="sr-only">{t('servicesLegend')}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {serviceOptions.map((option) => (
                <ChoiceCard
                  key={option.value}
                  type="checkbox"
                  value={option.value}
                  label={t(`serviceOptions.${option.value}.label`)}
                  hint={t(`serviceOptions.${option.value}.hint`)}
                  {...register('services')}
                />
              ))}
            </div>
            <FieldError
              id="services-error"
              message={translateError(errors.services?.message ?? errors.services?.root?.message)}
            />
          </fieldset>
        ) : null}

        {currentKey === 'business' ? (
          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="businessName" label={t('businessName')} required error={err('businessName')} className="sm:col-span-2">
              <TextInput
                id="businessName"
                autoComplete="organization"
                aria-invalid={Boolean(err('businessName'))}
                aria-describedby={describedBy('businessName', { error: Boolean(err('businessName')) })}
                {...register('businessName')}
              />
            </Field>
            <Field id="location" label={t('location')} required error={err('location')} className="sm:col-span-2">
              <TextInput
                id="location"
                placeholder={t('locationPlaceholder')}
                aria-invalid={Boolean(err('location'))}
                aria-describedby={describedBy('location', { error: Boolean(err('location')) })}
                {...register('location')}
              />
            </Field>
            <Field id="website" label={t('website')} error={err('website')} className="sm:col-span-2">
              <TextInput
                id="website"
                inputMode="url"
                placeholder={t('websitePlaceholder')}
                aria-invalid={Boolean(err('website'))}
                aria-describedby={describedBy('website', { error: Boolean(err('website')) })}
                {...register('website')}
              />
            </Field>
          </div>
        ) : null}

        {currentKey === 'contact' ? (
          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="fullName" label={t('fullName')} required error={err('fullName')} className="sm:col-span-2">
              <TextInput
                id="fullName"
                autoComplete="name"
                aria-invalid={Boolean(err('fullName'))}
                aria-describedby={describedBy('fullName', { error: Boolean(err('fullName')) })}
                {...register('fullName')}
              />
            </Field>
            <Field id="email" label={t('email')} required error={err('email')}>
              <TextInput
                id="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                aria-invalid={Boolean(err('email'))}
                aria-describedby={describedBy('email', { error: Boolean(err('email')) })}
                {...register('email')}
              />
            </Field>
            <Field id="whatsapp" label={t('whatsapp')} required error={err('whatsapp')}>
              <TextInput
                id="whatsapp"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder={t('whatsappPlaceholder')}
                aria-invalid={Boolean(err('whatsapp'))}
                aria-describedby={describedBy('whatsapp', { error: Boolean(err('whatsapp')) })}
                {...register('whatsapp')}
              />
            </Field>
            <Field id="budget" label={t('budget')} required hint={t('budgetHint')} error={err('budget')} className="sm:col-span-2">
              <Select
                id="budget"
                aria-invalid={Boolean(err('budget'))}
                aria-describedby={describedBy('budget', { hint: true, error: Boolean(err('budget')) })}
                {...register('budget')}
              >
                <option value="" disabled>
                  {t('budgetPlaceholder')}
                </option>
                {budgetOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(`budgetOptions.${option.value}`)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field id="message" label={t('message')} required hint={t('messageHint')} error={err('message')} className="sm:col-span-2">
              <TextArea
                id="message"
                rows={6}
                aria-invalid={Boolean(err('message'))}
                aria-describedby={describedBy('message', { hint: true, error: Boolean(err('message')) })}
                {...register('message')}
              />
            </Field>
          </div>
        ) : null}

        {isReview ? (
          <div className="space-y-3">
            {(
              [
                { key: 'project', step: 0, rows: [[t('review.type'), labelProjectType(values.projectType)]] },
                { key: 'services', step: 1, rows: [[t('review.services'), values.services.map(labelService).join(', ')]] },
                {
                  key: 'business',
                  step: 2,
                  rows: [
                    [t('review.business'), values.businessName],
                    [t('review.location'), values.location],
                    [t('review.website'), values.website || '—'],
                  ],
                },
                {
                  key: 'contact',
                  step: 3,
                  rows: [
                    [t('review.name'), values.fullName],
                    [t('review.email'), values.email],
                    [t('review.whatsapp'), values.whatsapp],
                    [t('review.budget'), labelBudget(values.budget)],
                    [t('review.description'), values.message],
                  ],
                },
              ] satisfies Array<{ key: StepKey; step: number; rows: Array<[string, string]> }>
            ).map((section) => (
              <section key={section.key} className="rounded-2xl border border-charcoal/12 p-5 sm:p-6" aria-label={stepTitle(section.key)}>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-medium text-charcoal">{stepTitle(section.key)}</h3>
                  <button
                    type="button"
                    onClick={() => setStep(section.step)}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-ui text-sm text-forest transition-colors hover:bg-sage-100"
                  >
                    <Pencil aria-hidden className="size-3.5" />
                    {t('edit')}
                    <span className="sr-only"> {stepTitle(section.key)}</span>
                  </button>
                </div>
                <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-[9rem_1fr]">
                  {section.rows.map(([label, value]) => (
                    <div key={label} className="contents">
                      <dt className="font-ui text-sm text-stone">{label}</dt>
                      <dd className="whitespace-pre-wrap break-words text-[0.95rem] text-charcoal">{value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
            <p className="pt-2 font-ui text-xs leading-relaxed text-stone">{t('consent')}</p>
          </div>
        ) : null}

        {serverError ? (
          <div className="mt-8">
            <FormAlert tone="error" title={t('errorTitle')}>
              {serverError}
            </FormAlert>
          </div>
        ) : null}

        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-charcoal/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={back}
              disabled={pending}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 font-ui text-sm text-charcoal transition-colors hover:bg-charcoal/5 disabled:opacity-50"
            >
              <ArrowLeft aria-hidden className="size-4" />
              {t('previous')}
            </button>
          ) : (
            <span />
          )}
          {/* Keys distintas: si React reutilizara el mismo <button> y solo cambiara su type,
              el clic en "Siguiente" del paso 4 terminaría enviando el formulario al llegar a Confirmación. */}
          {isReview ? (
            <Button key="submit" type="submit" variant="dark" size="lg" disabled={pending} aria-disabled={pending}>
              {pending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 aria-hidden className="size-4 animate-spin" />
                  {t('sending')}
                </span>
              ) : (
                t('submit')
              )}
            </Button>
          ) : (
            <Button key="next" type="button" variant="dark" size="lg" onClick={next}>
              <span className="inline-flex items-center gap-2">
                {t('next')}
                <ArrowRight aria-hidden className="size-4" />
              </span>
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
