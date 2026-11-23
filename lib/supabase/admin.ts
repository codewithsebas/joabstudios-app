import 'server-only'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'
import { getSupabasePublicEnv } from './env'

/**
 * Server-only client with the secret key. Bypasses RLS: only use it for the
 * validated public submission path (insert + rate-limit lookup).
 */
export function createSupabaseSecretClient() {
  const env = getSupabasePublicEnv()
  const secretKey = process.env.SUPABASE_SECRET_KEY?.trim()
  if (!env || !secretKey) return null

  return createClient<Database>(env.url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
}
