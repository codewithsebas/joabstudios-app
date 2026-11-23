import Link from 'next/link'
import type { ReactNode } from 'react'
import { ExternalLink, LogOut } from 'lucide-react'
import { LogoMark } from '@/components/site/logo'
import { signOut } from '@/app/admin/auth-actions'
import { AdminButton, AdminButtonLink } from '@/components/admin/ui/button'
import { Alert } from '@/components/admin/ui/alert'

export { StatusBadge } from '@/components/admin/ui/badge'

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-charcoal/[0.07] bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/admin/leads"
            className="flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage/60"
          >
            <LogoMark className="size-8" />
            <span className="leading-tight">
              <span className="block font-sans text-[0.95rem] font-semibold tracking-[-0.02em] text-charcoal">JoabStudios</span>
              <span className="block text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-mist">CRM</span>
            </span>
          </Link>
          <div className="flex items-center gap-1.5">
            <AdminButtonLink href="/" variant="ghost" size="sm" icon={ExternalLink} className="hidden sm:inline-flex">
              Ver sitio
            </AdminButtonLink>
            <form action={signOut}>
              <AdminButton type="submit" variant="secondary" size="sm" icon={LogOut}>
                Salir
              </AdminButton>
            </form>
          </div>
        </div>
      </header>
      <main id="contenido" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </>
  )
}

/** Encabezado de página del panel: título, descripción y acciones opcionales. */
export function PageHeading({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-sans text-[1.75rem] font-semibold tracking-[-0.03em] text-charcoal sm:text-[2rem]">{title}</h1>
        {description ? <p className="mt-1 text-sm text-stone">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function AdminError({ message }: { message: string }) {
  return (
    <Alert tone="danger" title="Algo salió mal">
      {message}
    </Alert>
  )
}
