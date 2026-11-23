'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getAdminSession } from '@/lib/auth/admin'
import { log } from '@/lib/log'

export type LoginState = { error: string | null; email: string }

const loginSchema = z.object({
  email: z.string().trim().pipe(z.email()),
  password: z.string().min(1).max(200),
})

const INVALID = 'Correo o contraseña incorrectos.'

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const rawEmail = String(formData.get('email') ?? '').slice(0, 254)
  const parsed = loginSchema.safeParse({ email: rawEmail, password: formData.get('password') })
  if (!parsed.success) return { error: INVALID, email: rawEmail }

  const supabase = await createSupabaseServerClient()
  if (!supabase) return { error: 'El acceso no está configurado. Revisa las variables de entorno de Supabase.', email: rawEmail }

  const { error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) {
    // Generic message: don't reveal whether the account exists.
    if (error.status && error.status >= 500) log.error('admin_sign_in_failed', error)
    return { error: INVALID, email: rawEmail }
  }

  const admin = await getAdminSession()
  if (!admin) {
    await supabase.auth.signOut()
    return { error: 'Esta cuenta no tiene acceso al CRM.', email: rawEmail }
  }

  redirect('/admin/leads')
}

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient()
  await supabase?.auth.signOut()
  redirect('/admin/login')
}
