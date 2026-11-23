import 'server-only'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { Database } from './database.types'
import { getSupabasePublicEnv } from './env'

/**
 * Per-request Supabase client acting as the signed-in user (RLS applies).
 * Returns null when Supabase isn't configured.
 */
export async function createSupabaseServerClient() {
  const env = getSupabasePublicEnv()
  if (!env) return null
  const cookieStore = await cookies()

  return createServerClient<Database>(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // The proxy refreshes the session, so this is safe to ignore.
        }
      },
    },
  })
}
