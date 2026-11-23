'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { controlClasses } from './field'
import { PopoverBackdrop, usePopover } from './use-popover'
import { cn } from '@/lib/cn'

export type SelectOption = {
  value: string
  label: string
  /** Clase de color para un punto delante de la etiqueta (p. ej. estados). */
  dotClass?: string
  description?: string
}

/**
 * Desplegable propio del panel. Envía su valor en formularios normales con un
 * input oculto (`name`) y se maneja por teclado: flechas, Inicio/Fin, Enter,
 * Escape y búsqueda por la primera letra.
 */
export function Select({
  id,
  name,
  options,
  defaultValue,
  value: controlledValue,
  onValueChange,
  placeholder = 'Seleccionar…',
  size = 'lg',
  className,
  'aria-label': ariaLabel,
}: {
  id?: string
  name?: string
  options: SelectOption[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  size?: 'md' | 'lg'
  className?: string
  'aria-label'?: string
}) {
  const autoId = useId()
  const triggerId = id ?? `${autoId}-trigger`
  const listId = `${autoId}-list`
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? '')
  const value = controlledValue ?? uncontrolled
  const selectedIndex = options.findIndex((o) => o.value === value)
  const selected = options[selectedIndex]
  const [active, setActive] = useState(Math.max(selectedIndex, 0))
  const listRef = useRef<HTMLUListElement>(null)
  const { open, show, hide, rootRef, triggerRef, panelRef, placement, panelClass } = usePopover(Math.min(options.length, 7) * 44 + 16)

  useEffect(() => {
    if (open) listRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  function choose(index: number) {
    const option = options[index]
    if (!option) return
    if (controlledValue === undefined) setUncontrolled(option.value)
    onValueChange?.(option.value)
    hide()
  }

  function openList() {
    setActive(Math.max(selectedIndex, 0))
    show()
  }

  function onTriggerKeyDown(event: KeyboardEvent) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault()
      openList()
    }
  }

  function onListKeyDown(event: KeyboardEvent) {
    const last = options.length - 1
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActive((i) => Math.min(i + 1, last))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActive((i) => Math.max(i - 1, 0))
        break
      case 'Home':
        event.preventDefault()
        setActive(0)
        break
      case 'End':
        event.preventDefault()
        setActive(last)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        choose(active)
        break
      case 'Escape':
        event.preventDefault()
        hide()
        break
      case 'Tab':
        hide(false)
        break
      default:
        if (event.key.length === 1) {
          const letter = event.key.toLowerCase()
          const start = (active + 1) % options.length
          const ordered = [...options.slice(start), ...options.slice(0, start)]
          const match = ordered.find((o) => o.label.toLowerCase().startsWith(letter))
          if (match) setActive(options.indexOf(match))
        }
    }
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={ariaLabel}
        onClick={() => (open ? hide() : openList())}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          controlClasses,
          size === 'lg' ? 'h-12' : 'h-11',
          'flex items-center gap-2.5 rounded-full pl-5 pr-4 text-left',
          open && 'ring-2 ring-forest',
        )}
      >
        {selected?.dotClass ? <span aria-hidden className={cn('size-2 shrink-0 rounded-full', selected.dotClass)} /> : null}
        <span className={cn('min-w-0 flex-1 truncate', !selected && 'text-mist/80')}>{selected?.label ?? placeholder}</span>
        <ChevronDown
          aria-hidden
          className={cn('size-4 shrink-0 text-mist transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {open && placement === 'center' ? <PopoverBackdrop onClose={() => hide()} /> : null}
      {open ? (
        <ul
          ref={(node) => {
            listRef.current = node
            panelRef.current = node
          }}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={triggerId}
          aria-activedescendant={`${listId}-${active}`}
          onKeyDown={onListKeyDown}
          className={cn(
            'max-h-80 animate-pop-in overflow-auto rounded-2xl bg-white p-1.5 font-ui shadow-[0_24px_48px_-20px_rgba(23,22,20,0.4)] ring-1 ring-charcoal/10 focus:outline-none',
            placement === 'center' ? 'w-[min(20rem,calc(100vw-2rem))]' : '',
            panelClass('full'),
          )}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value
            return (
              <li
                key={option.value}
                id={`${listId}-${index}`}
                data-index={index}
                role="option"
                aria-selected={isSelected}
                onPointerEnter={() => setActive(index)}
                onClick={() => choose(index)}
                className={cn(
                  'flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-charcoal transition-colors',
                  index === active && 'bg-ivory',
                  isSelected && 'font-semibold',
                )}
              >
                {option.dotClass ? <span aria-hidden className={cn('size-2 shrink-0 rounded-full', option.dotClass)} /> : null}
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{option.label}</span>
                  {option.description ? <span className="block text-xs font-normal text-stone">{option.description}</span> : null}
                </span>
                {isSelected ? <Check aria-hidden className="size-4 shrink-0 text-forest" /> : null}
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
