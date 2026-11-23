'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'

/** Alto de la barra superior fija del panel (h-16) más un margen. */
const STICKY_HEADER_OFFSET = 80
const GAP = 16

export type PopoverPlacement = 'bottom' | 'top' | 'center'

/**
 * Estado común de los desplegables del panel (select y calendario):
 * abrir/cerrar, cerrar al hacer clic fuera y decidir dónde se abren.
 *
 *  - Debajo del control si cabe.
 *  - Encima si debajo no cabe pero arriba sí (descontando la barra fija).
 *  - Centrado en la pantalla, con fondo atenuado, si no cabe en ningún lado
 *    (por ejemplo en la columna lateral fija o en pantallas bajas): así nunca
 *    queda cortado por el borde de la ventana.
 */
export function usePopover(panelHeight: number) {
  const [open, setOpen] = useState(false)
  const [placement, setPlacement] = useState<PopoverPlacement>('bottom')
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement | null>(null)

  const show = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (rect) {
      const below = window.innerHeight - rect.bottom
      const above = rect.top - STICKY_HEADER_OFFSET
      const needed = panelHeight + GAP
      setPlacement(below >= needed ? 'bottom' : above >= needed ? 'top' : 'center')
    }
    setOpen(true)
  }, [panelHeight])

  const hide = useCallback((returnFocus = true) => {
    setOpen(false)
    if (returnFocus) triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  /** Posición del panel. `align` solo aplica cuando se abre pegado al control. */
  const panelClass = (align: 'left' | 'right' | 'full' = 'left') =>
    placement === 'center'
      ? 'fixed left-1/2 top-1/2 z-[60] -translate-x-1/2 -translate-y-1/2'
      : cn(
          'absolute z-50',
          align === 'right' ? 'right-0' : 'left-0',
          align === 'full' && 'min-w-full',
          placement === 'top' ? 'bottom-full mb-2 origin-bottom' : 'top-full mt-2 origin-top',
        )

  return { open, show, hide, setOpen, rootRef, triggerRef, panelRef, placement, panelClass }
}

/** Fondo atenuado detrás del panel cuando se abre centrado. */
export function PopoverBackdrop({ onClose }: { onClose: () => void }) {
  return <div aria-hidden onClick={onClose} className="fixed inset-0 z-[55] animate-toast-in bg-charcoal/25 backdrop-blur-[2px]" />
}
