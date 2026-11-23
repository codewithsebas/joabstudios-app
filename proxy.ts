import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/lib/supabase/database.types'
import { getSupabasePublicEnv } from '@/lib/supabase/env'
import { routing } from '@/i18n/routing'

/** Sitio público: detecta el idioma, redirige y reescribe las URL traducidas. */
const intl = createIntlMiddleware(routing)

/**
 * Refreshes the Supabase session for admin routes and performs an optimistic
 * redirect to the login page. This is NOT the authorization boundary: every
 * admin page and Server Action re-checks the session and admin role on the
 * server (see lib/auth/admin.ts), and RLS enforces it again in the database.
 */
async function adminProxy(request: NextRequest) {
  const env = getSupabasePublicEnv()
  const isLogin = request.nextUrl.pathname === '/admin/login'

  if (!env) {
    return isLogin ? NextResponse.next() : NextResponse.redirect(new URL('/admin/login', request.url))
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient<Database>(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value)
        response = NextResponse.next({ request })
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options)
        for (const [key, value] of Object.entries(headers)) response.headers.set(key, value)
      },
    },
  })

  const { data } = await supabase.auth.getClaims()
  const signedIn = Boolean(data?.claims?.sub)

  if (!signedIn && !isLogin) {
    const redirect = NextResponse.redirect(new URL('/admin/login', request.url))
    for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie)
    return redirect
  }

  response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return response
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return adminProxy(request)
  return intl(request)
}

export const config = {
  // Todo menos API, internos de Next y archivos con extensión (imágenes, robots.txt, sitemap.xml…).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
