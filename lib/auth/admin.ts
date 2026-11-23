import 'server-only'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { AdminUserRow } from '@/lib/supabase/database.types'

export type AdminSession = {
  userId: string
  email: string | null
  role: AdminUserRow['role']
}

/**
 * Data Access Layer for the CRM. Verifies the JWT (getClaims validates the
 * signature) and checks admin membership in the database. Every admin page
 * and Server Action goes through here; the proxy redirect is only a UX hint.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  // La sesión siempre se valida en la petición real: el cliente de Supabase usa
  // Date.now() para revisar la expiración del token, y eso no puede ocurrir al prerenderizar.
  await connection()
  const supabase = await createSupabaseServerClient()
  if (!supabase) return null

  const { data, error } = await supabase.auth.getClaims()
  const userId = data?.claims?.sub
  if (error || !userId) return null

  const { data: membership } = await supabase
    .from('admin_users')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle()

  if (!membership) return null

  const email = typeof data.claims.email === 'string' ? data.claims.email : null
  return { userId, email, role: membership.role }
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')
  return session
}
