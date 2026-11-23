import type { Metadata } from 'next'
import Link from 'next/link'
import { BrandLogo } from '@/components/site/logo'
import { CurrentYear } from '@/components/ui/current-year'
import { Alert } from '@/components/admin/ui/alert'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { LoginForm } from './login-form'

export const metadata: Metadata = { title: 'Iniciar sesión' }

/**
 * Acceso al CRM. Misma composición que el panel de El Cóndor del Ruiz:
 * retícula de fondo que se desvanece, tarjeta blanca centrada con el logo,
 * campos tipo píldora y pie con créditos.
 */
export default function AdminLoginPage() {
  const configured = isSupabaseConfigured()

  return (
    <div className="relative isolate flex min-h-dvh flex-col bg-ivory font-ui">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(37,42,40,0.07)_1px,transparent_1px),linear-gradient(rgba(37,42,40,0.07)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]"
      />

      <main id="contenido" className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[27.5rem] animate-fade-up rounded-[1.75rem] bg-white px-6 py-9 shadow-[0_28px_60px_-20px_rgba(23,22,20,0.32)] ring-1 ring-charcoal/[0.06] sm:px-10">
          <div className="flex flex-col items-center text-center">
            <BrandLogo idPrefix="login-logo" title="JoabStudios" className="h-14 w-auto text-forest" />
            <h1 className="mt-7 font-ui text-[1.625rem] font-bold tracking-[-0.02em] text-charcoal">Bienvenido al panel</h1>
            <p className="mt-2 text-[0.9rem] text-stone">Accede con tu cuenta para gestionar tus prospectos.</p>
          </div>

          {configured ? (
            <LoginForm />
          ) : (
            <Alert tone="warning" title="Supabase no está configurado" className="mt-7">
              Define <code>NEXT_PUBLIC_SUPABASE_URL</code> y <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> en las variables de
              entorno para habilitar el acceso.
            </Alert>
          )}

          <p className="mt-6 text-center text-[0.8125rem] text-stone">
            ¿Buscabas el sitio?{' '}
            <Link href="/" className="font-semibold text-charcoal underline-offset-4 hover:underline">
              Volver a la web
            </Link>
          </p>
        </div>
      </main>

      <footer className="flex flex-col items-center justify-between gap-1 px-4 pb-4 text-center text-xs text-stone sm:flex-row sm:text-left">
        <p>
          © <CurrentYear /> JoabStudios. Todos los derechos reservados.
        </p>
        <p>
          CRM interno de <span className="font-semibold text-charcoal">JoabStudios</span>
        </p>
      </footer>
    </div>
  )
}
