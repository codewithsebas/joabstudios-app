'use client'

import { useActionState, useEffect, useRef } from 'react'
import { Save, StickyNote } from 'lucide-react'
import type { LeadStatus } from '@/lib/supabase/database.types'
import { leadStatusList, leadStatusTone } from '@/lib/leads/status'
import { AdminButton } from '@/components/admin/ui/button'
import { DatePicker } from '@/components/admin/ui/date-picker'
import { Field, Input, Textarea } from '@/components/admin/ui/field'
import { Select } from '@/components/admin/ui/select'
import { useToast } from '@/components/admin/ui/toast'
import { addLeadNote, updateLeadTracking, type ActionState } from '../actions'

const idle: ActionState = { status: 'idle', message: null }

const statusOptions = leadStatusList.map((s) => ({ ...s, dotClass: leadStatusTone[s.value].dot }))

/** Muestra el resultado de cada envío como aviso flotante. */
function useActionToast(state: ActionState) {
  const toast = useToast()
  useEffect(() => {
    if (!state.message) return
    if (state.status === 'success') toast.success(state.message)
    else if (state.status === 'error') toast.error('No se guardó', state.message)
  }, [state, toast])
}

export function TrackingForm({
  leadId,
  status,
  followUpDate,
  quoteValue,
}: {
  leadId: string
  status: LeadStatus
  followUpDate: string | null
  quoteValue: number | null
}) {
  const [state, action, pending] = useActionState(updateLeadTracking, idle)
  useActionToast(state)

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="leadId" value={leadId} />
      <Field label="Estado" htmlFor="status">
        <Select id="status" name="status" size="md" defaultValue={status} options={statusOptions} />
      </Field>
      <Field label="Fecha de seguimiento" htmlFor="followUpDate" hint="Cuándo volver a contactar a este prospecto.">
        <DatePicker id="followUpDate" name="followUpDate" size="md" align="right" defaultValue={followUpDate} placeholder="Sin fecha" />
      </Field>
      <Field label="Valor de cotización (COP)" htmlFor="quoteValue">
        <Input
          id="quoteValue"
          type="text"
          inputMode="numeric"
          name="quoteValue"
          inputSize="md"
          defaultValue={quoteValue === null ? '' : String(Math.round(quoteValue))}
          placeholder="Ej. 12000000"
        />
      </Field>
      <AdminButton type="submit" icon={Save} loading={pending} className="w-full">
        {pending ? 'Guardando…' : 'Guardar cambios'}
      </AdminButton>
    </form>
  )
}

export function NoteForm({ leadId }: { leadId: string }) {
  const [state, action, pending] = useActionState(addLeadNote, idle)
  const formRef = useRef<HTMLFormElement>(null)
  useActionToast(state)

  useEffect(() => {
    if (state.status === 'success') formRef.current?.reset()
  }, [state])

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <input type="hidden" name="leadId" value={leadId} />
      <Field label="Nueva nota interna" htmlFor="note-body">
        <Textarea id="note-body" name="body" rows={3} required maxLength={4000} placeholder="Llamada, acuerdos, próximos pasos…" />
      </Field>
      <div className="flex justify-end">
        <AdminButton type="submit" variant="secondary" size="sm" icon={StickyNote} loading={pending}>
          Agregar nota
        </AdminButton>
      </div>
    </form>
  )
}
