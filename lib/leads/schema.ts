import { z } from 'zod'
import { projectTypeValues, budgetValues, serviceValues } from './options'

/**
 * Validation shared by the client forms (instant feedback) and the Server
 * Actions (authoritative). Form values stay strings; the server normalizes.
 */

// Los mensajes son claves de traducción (QuoteForm.errors.*); el formulario
// las traduce al idioma del visitante, también las que devuelve el servidor.
const requiredText = (min: number, max: number, field: string) =>
  z
    .string()
    .trim()
    .min(1, `${field}.required`)
    .min(min, `${field}.min`)
    .max(max, `${field}.max`)

const phone = z
  .string()
  .trim()
  .min(1, 'whatsapp.required')
  .regex(/^\+?[\d\s().-]{7,20}$/, 'whatsapp.invalid')

const email = z.string().trim().min(1, 'email.required').max(254, 'email.max').pipe(z.email('email.invalid'))

const optionalWebsite = z
  .string()
  .trim()
  .max(300, 'website.max')
  .refine((value) => value === '' || /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(value), 'website.invalid')

const optionalUnits = z
  .string()
  .trim()
  .refine((value) => value === '' || (/^\d{1,5}$/.test(value) && Number(value) >= 1), 'units.invalid')

export const quoteStepFields = {
  project: ['projectType'],
  services: ['services'],
  business: ['businessName', 'location', 'website', 'units'],
  contact: ['fullName', 'email', 'whatsapp', 'budget', 'message'],
} as const

export const quoteSchema = z.object({
  projectType: z.enum(projectTypeValues, { error: 'projectType.required' }),
  services: z
    .array(z.enum(serviceValues))
    .min(1, 'services.required')
    .max(serviceValues.length),
  businessName: requiredText(2, 160, 'businessName'),
  location: requiredText(2, 160, 'location'),
  website: optionalWebsite,
  units: optionalUnits,
  fullName: requiredText(2, 120, 'fullName'),
  email,
  whatsapp: phone,
  budget: z.enum(budgetValues, { error: 'budget.required' }),
  message: requiredText(10, 4000, 'message'),
})

export type QuoteFormValues = z.infer<typeof quoteSchema>

/** Anti-spam fields sent alongside every public form. */
export const spamGuardSchema = z.object({
  /** Honeypot: hidden from people, filled by naive bots. */
  nickname: z.string().max(200),
  /** ms timestamp when the form was rendered on the client. */
  startedAt: z.number().int().nonnegative(),
})

export type SpamGuard = z.infer<typeof spamGuardSchema>

/** Códigos de error del envío; el formulario los traduce (QuoteForm.submitErrors.*). */
export type SubmitErrorCode = 'generic' | 'notConfigured' | 'reload' | 'rateLimited' | 'invalid'

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: SubmitErrorCode; fieldErrors?: Partial<Record<string, string>> }
