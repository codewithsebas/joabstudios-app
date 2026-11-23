'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { controlClasses } from './field'
import { PopoverBackdrop, usePopover } from './use-popover'
import { cn } from '@/lib/cn'

/* Fechas como texto YYYY-MM-DD (igual que las columnas DATE y los filtros de la URL).
   Todo el cálculo se hace en UTC para que la zona horaria no mueva el día. */

type Ymd = { y: number; m: number; d: number }

const pad = (n: number) => String(n).padStart(2, '0')
const toIso = ({ y, m, d }: Ymd) => `${y}-${pad(m + 1)}-${pad(d)}`
const fromUtc = (date: Date): Ymd => ({ y: date.getUTCFullYear(), m: date.getUTCMonth(), d: date.getUTCDate() })
const shift = ({ y, m, d }: Ymd, days: number) => fromUtc(new Date(Date.UTC(y, m, d + days)))

function parseIso(value: string | undefined | null): Ymd | null {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  return match ? { y: Number(match[1]), m: Number(match[2]) - 1, d: Number(match[3]) } : null
}

function addMonths({ y, m, d }: Ymd, months: number): Ymd {
  const target = new Date(Date.UTC(y, m + months, 1))
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate()
  return { y: target.getUTCFullYear(), m: target.getUTCMonth(), d: Math.min(d, lastDay) }
}

function todayLocal(): Ymd {
  const now = new Date()
  return { y: now.getFullYear(), m: now.getMonth(), d: now.getDate() }
}

const triggerFormat = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
const fullFormat = new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
const monthFormat = new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric', timeZone: 'UTC' })
const asDate = ({ y, m, d }: Ymd) => new Date(Date.UTC(y, m, d))
const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

const weekdays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do']
const weekdayNames = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']

/** 6 semanas (42 días) empezando en lunes, que cubren el mes visible. */
function monthGrid(view: Ymd): Ymd[] {
  const first = new Date(Date.UTC(view.y, view.m, 1))
  const offset = (first.getUTCDay() + 6) % 7
  return Array.from({ length: 42 }, (_, i) => fromUtc(new Date(Date.UTC(view.y, view.m, 1 - offset + i))))
}

/**
 * Selector de fecha propio del panel. Envía `name` en formato YYYY-MM-DD con
 * un input oculto, así funciona en formularios GET (filtros) y Server Actions.
 */
export function DatePicker({
  id,
  name,
  defaultValue,
  placeholder = 'Seleccionar fecha',
  size = 'lg',
  align = 'left',
  onValueChange,
  className,
}: {
  id?: string
  name?: string
  defaultValue?: string | null
  placeholder?: string
  size?: 'md' | 'lg'
  align?: 'left' | 'right'
  onValueChange?: (value: string) => void
  className?: string
}) {
  const autoId = useId()
  const triggerId = id ?? `${autoId}-trigger`
  const dialogId = `${autoId}-calendar`
  const [value, setValue] = useState<Ymd | null>(parseIso(defaultValue))
  const [focused, setFocused] = useState<Ymd>(value ?? { y: 2000, m: 0, d: 1 })
  const [today, setToday] = useState<Ymd | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const { open, show, hide, rootRef, triggerRef, panelRef, placement, panelClass } = usePopover(400)

  // Mueve el foco del teclado al día activo cada vez que cambia.
  useEffect(() => {
    if (open) gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${toIso(focused)}"]`)?.focus()
  }, [open, focused])

  function openCalendar() {
    const now = todayLocal()
    setToday(now)
    setFocused(value ?? now)
    show()
  }

  function commit(next: Ymd | null) {
    setValue(next)
    onValueChange?.(next ? toIso(next) : '')
  }

  function select(day: Ymd) {
    commit(day)
    hide()
  }

  function onGridKeyDown(event: KeyboardEvent) {
    const moves: Record<string, () => Ymd> = {
      ArrowLeft: () => shift(focused, -1),
      ArrowRight: () => shift(focused, 1),
      ArrowUp: () => shift(focused, -7),
      ArrowDown: () => shift(focused, 7),
      PageUp: () => addMonths(focused, event.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focused, event.shiftKey ? 12 : 1),
      Home: () => shift(focused, -((asDate(focused).getUTCDay() + 6) % 7)),
      End: () => shift(focused, 6 - ((asDate(focused).getUTCDay() + 6) % 7)),
    }
    const move = moves[event.key]
    if (move) {
      event.preventDefault()
      setFocused(move())
    }
  }

  const grid = monthGrid(focused)
  const valueIso = value ? toIso(value) : ''
  const todayIso = today ? toIso(today) : ''

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      {name ? <input type="hidden" name={name} value={valueIso} /> : null}
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        onClick={() => (open ? hide() : openCalendar())}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            openCalendar()
          }
        }}
        className={cn(
          controlClasses,
          size === 'lg' ? 'h-12' : 'h-11',
          'flex items-center gap-2.5 rounded-full pl-4 text-left',
          value ? 'pr-11' : 'pr-4',
          open && 'ring-2 ring-forest',
        )}
      >
        <CalendarDays aria-hidden className="size-4 shrink-0 text-mist" />
        <span className={cn('min-w-0 flex-1 truncate', !value && 'text-mist/80')}>
          {value ? triggerFormat.format(asDate(value)) : placeholder}
        </span>
        {value ? <span className="sr-only">, cambiar fecha</span> : null}
      </button>
      {value ? (
        <button
          type="button"
          onClick={() => commit(null)}
          aria-label="Quitar fecha"
          className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-mist transition-colors hover:bg-charcoal/5 hover:text-charcoal"
        >
          <X aria-hidden className="size-4" />
        </button>
      ) : null}

      {open && placement === 'center' ? <PopoverBackdrop onClose={() => hide()} /> : null}
      {open ? (
        <div
          ref={(node) => {
            panelRef.current = node
          }}
          id={dialogId}
          role="dialog"
          aria-modal={placement === 'center'}
          aria-label="Elegir fecha"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault()
              hide()
            }
          }}
          className={cn(
            'w-[19rem] max-w-[calc(100vw-2rem)] animate-pop-in rounded-[1.25rem] bg-white p-3 font-ui shadow-[0_28px_56px_-24px_rgba(23,22,20,0.45)] ring-1 ring-charcoal/10',
            panelClass(align),
          )}
        >
          <div className="flex items-center justify-between px-1 pb-2">
            <p aria-live="polite" className="text-sm font-semibold text-charcoal">
              {capitalize(monthFormat.format(asDate(focused)))}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setFocused(addMonths(focused, -1))}
                aria-label="Mes anterior"
                className="inline-flex size-8 items-center justify-center rounded-full text-stone transition-colors hover:bg-ivory hover:text-charcoal"
              >
                <ChevronLeft aria-hidden className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setFocused(addMonths(focused, 1))}
                aria-label="Mes siguiente"
                className="inline-flex size-8 items-center justify-center rounded-full text-stone transition-colors hover:bg-ivory hover:text-charcoal"
              >
                <ChevronRight aria-hidden className="size-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 pb-1">
            {weekdays.map((day, i) => (
              <abbr key={day} title={weekdayNames[i]} className="py-1.5 text-center text-[0.6875rem] font-semibold uppercase tracking-wide text-mist no-underline">
                {day}
              </abbr>
            ))}
          </div>

          <div ref={gridRef} role="group" aria-label="Días del mes" onKeyDown={onGridKeyDown} className="grid grid-cols-7 gap-0.5">
            {grid.map((day) => {
              const iso = toIso(day)
              const outside = day.m !== focused.m
              const isSelected = iso === valueIso
              const isToday = iso === todayIso
              const isFocused = iso === toIso(focused)
              return (
                <button
                  key={iso}
                  type="button"
                  data-date={iso}
                  tabIndex={isFocused ? 0 : -1}
                  aria-pressed={isSelected}
                  aria-current={isToday ? 'date' : undefined}
                  aria-label={fullFormat.format(asDate(day))}
                  onClick={() => select(day)}
                  className={cn(
                    'relative inline-flex aspect-square items-center justify-center rounded-full text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest',
                    isSelected
                      ? 'bg-forest font-semibold text-white'
                      : outside
                        ? 'text-mist/50 hover:bg-ivory'
                        : 'text-charcoal hover:bg-ivory',
                    isToday && !isSelected && 'font-semibold text-forest ring-1 ring-inset ring-forest/40',
                  )}
                >
                  {day.d}
                </button>
              )
            })}
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-charcoal/[0.07] px-1 pt-2">
            <button
              type="button"
              onClick={() => {
                commit(null)
                hide()
              }}
              className="rounded-full px-3 py-1.5 text-[0.8125rem] font-medium text-stone transition-colors hover:bg-ivory hover:text-charcoal"
            >
              Borrar
            </button>
            <button
              type="button"
              onClick={() => today && select(today)}
              className="rounded-full px-3 py-1.5 text-[0.8125rem] font-semibold text-forest transition-colors hover:bg-sage-100"
            >
              Hoy
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
