'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { alertTones, type AlertTone } from './alert'
import { cn } from '@/lib/cn'

type Toast = { id: number; tone: AlertTone; title: string; description?: string }
type ToastInput = Omit<Toast, 'id'>

const ToastContext = createContext<((toast: ToastInput) => void) | null>(null)

const DURATION_MS = 4500
const MAX_VISIBLE = 4

/**
 * Avisos flotantes (esquina inferior derecha) para confirmar acciones:
 * "Cambios guardados", "Nota agregada", errores al guardar…
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => setToasts((list) => list.filter((t) => t.id !== id)), [])
  const push = useCallback((toast: ToastInput) => {
    const id = nextId.current++
    setToasts((list) => [...list, { ...toast, id }].slice(-MAX_VISIBLE))
  }, [])

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        aria-relevant="additions"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-end gap-2 sm:left-auto sm:right-6 sm:bottom-6"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  const { Icon, icon } = alertTones[toast.tone]
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const timer = window.setTimeout(() => onDismiss(toast.id), DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [paused, onDismiss, toast.id])

  return (
    <div
      role={toast.tone === 'danger' ? 'alert' : 'status'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-2xl bg-white p-4 font-ui shadow-[0_24px_48px_-24px_rgba(23,22,20,0.45)] ring-1 ring-charcoal/10"
    >
      <Icon aria-hidden className={cn('mt-0.5 size-5 shrink-0', icon)} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-charcoal">{toast.title}</p>
        {toast.description ? <p className="mt-0.5 text-[0.8125rem] leading-relaxed text-stone">{toast.description}</p> : null}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Cerrar aviso"
        className="-m-1 inline-flex size-7 shrink-0 items-center justify-center rounded-full text-mist transition-colors hover:bg-charcoal/5 hover:text-charcoal"
      >
        <X aria-hidden className="size-4" />
      </button>
    </div>
  )
}

export function useToast() {
  const push = useContext(ToastContext)
  if (!push) throw new Error('useToast debe usarse dentro de <ToastProvider>')
  return useMemo(
    () => ({
      success: (title: string, description?: string) => push({ tone: 'success', title, description }),
      error: (title: string, description?: string) => push({ tone: 'danger', title, description }),
      info: (title: string, description?: string) => push({ tone: 'info', title, description }),
      warning: (title: string, description?: string) => push({ tone: 'warning', title, description }),
    }),
    [push],
  )
}
