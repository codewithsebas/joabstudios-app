/**
 * Supabase configuration. Returns null when the project hasn't been configured
 * yet, so callers can fail loudly with a clear message instead of pretending
 * a submission succeeded.
 */

export type SupabasePublicEnv = { url: string; publishableKey: string }

export function getSupabasePublicEnv(): SupabasePublicEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()
  if (!url || !publishableKey) return null
  return { url, publishableKey }
}

export function isSupabaseConfigured(): boolean {
  return getSupabasePublicEnv() !== null
}
