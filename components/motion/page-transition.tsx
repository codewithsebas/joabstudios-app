import { ViewTransition, type ReactNode } from 'react'

/**
 * Animación entre rutas con la View Transitions API (vía React <ViewTransition>).
 * Al navegar, la página que sale se desvanece hacia arriba y la nueva entra
 * desde abajo; el header queda fijo (ver `site-header` en globals.css).
 *
 * Va en cada page.tsx, no en el layout: el layout persiste entre navegaciones
 * y ahí nunca se dispararían enter/exit.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div>{children}</div>
    </ViewTransition>
  )
}
