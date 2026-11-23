import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ArrowLeft, CalendarClock, CircleDollarSign, Mail, MessageCircle } from 'lucide-react'
import { AdminError, AdminShell } from '@/components/admin/admin-shell'
import { StatusBadge } from '@/components/admin/ui/badge'
import { AdminButtonLink, adminButtonClasses } from '@/components/admin/ui/button'
import { Card, CardBody, CardHeader } from '@/components/admin/ui/card'
import { Skeleton } from '@/components/admin/ui/empty-state'
import { formatDate, formatDateTime, formatMoney, getLeadDetail, type LeadDetail } from '@/lib/leads/crm'
import { leadStatusLabel } from '@/lib/leads/status'
import { labelBudget, labelProjectType, labelService } from '@/lib/leads/options'
import type { Json, LeadEventRow, LeadStatus } from '@/lib/supabase/database.types'
import { cn } from '@/lib/cn'
import { NoteForm, TrackingForm } from './lead-controls'

export const metadata: Metadata = { title: 'Detalle del prospecto' }

export default function LeadDetailPage({ params }: PageProps<'/admin/leads/[id]'>) {
  return (
    <AdminShell>
      <AdminButtonLink href="/admin/leads" variant="ghost" size="sm" icon={ArrowLeft} className="-ml-3">
        Prospectos
      </AdminButtonLink>
      <Suspense
        fallback={
          <div aria-busy="true" className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
            <Skeleton className="h-[28rem] rounded-[1.5rem]" />
            <Skeleton className="h-80 rounded-[1.5rem]" />
          </div>
        }
      >
        <LeadDetailContent params={params} />
      </Suspense>
    </AdminShell>
  )
}

const statusLabel = (status: LeadStatus | null) => (status ? leadStatusLabel[status] : '—')

function metaValue(metadata: Json, key: string): string | null {
  if (metadata && typeof metadata === 'object' && !Array.isArray(metadata)) {
    const value = metadata[key]
    if (typeof value === 'string' || typeof value === 'number') return String(value)
  }
  return null
}

function describeEvent(event: LeadEventRow): string {
  switch (event.type) {
    case 'created':
      return metaValue(event.metadata, 'source') === 'contact'
        ? 'Mensaje recibido desde el formulario de contacto'
        : 'Solicitud recibida desde el formulario de cotización'
    case 'status_changed':
      return `Estado: ${statusLabel(event.from_status)} → ${statusLabel(event.to_status)}`
    case 'follow_up_set': {
      const to = metaValue(event.metadata, 'to')
      return to ? `Seguimiento programado para el ${formatDate(to)}` : 'Fecha de seguimiento eliminada'
    }
    case 'quote_value_set': {
      const to = metaValue(event.metadata, 'to')
      const currency = metaValue(event.metadata, 'currency') ?? 'COP'
      return to ? `Valor de cotización: ${formatMoney(Number(to), currency)}` : 'Valor de cotización eliminado'
    }
    case 'note':
      return 'Nota interna'
  }
}

async function LeadDetailContent({ params }: { params: PageProps<'/admin/leads/[id]'>['params'] }) {
  const { id } = await params
  let detail: LeadDetail | null
  try {
    detail = await getLeadDetail(id)
  } catch (error) {
    return (
      <div className="mt-6">
        <AdminError message={error instanceof Error ? error.message : 'Error inesperado.'} />
      </div>
    )
  }
  if (!detail) notFound()

  const { lead, events } = detail
  const whatsappDigits = lead.whatsapp?.replace(/\D/g, '') ?? ''

  const info: Array<[string, string | null]> = [
    ['Tipo de negocio', labelProjectType(lead.accommodation_type)],
    ['Ubicación', lead.location],
    ['Sitio web actual', lead.website],
    ['Unidades', lead.units ? String(lead.units) : null],
    ['Presupuesto estimado', labelBudget(lead.budget)],
    ['Origen', lead.source === 'quote' ? 'Formulario de cotización' : 'Formulario de contacto'],
    ['Recibido', formatDateTime(lead.created_at)],
  ]

  return (
    <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="min-w-0 space-y-6">
        <Card aria-labelledby="lead-title">
          <CardBody className="sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 id="lead-title" className="font-sans text-[1.75rem] font-semibold tracking-[-0.03em] text-charcoal">
                  {lead.business_name ?? lead.full_name}
                </h1>
                <p className="mt-0.5 text-stone">{lead.full_name}</p>
              </div>
              <StatusBadge status={lead.status} />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <a href={`mailto:${lead.email}`} className={adminButtonClasses({ variant: 'secondary', size: 'sm' })}>
                <Mail aria-hidden className="size-4" />
                {lead.email}
              </a>
              {whatsappDigits ? (
                <a
                  href={`https://wa.me/${whatsappDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={adminButtonClasses({ variant: 'secondary', size: 'sm' })}
                >
                  <MessageCircle aria-hidden className="size-4" />
                  {lead.whatsapp}
                </a>
              ) : null}
            </div>

            <dl className="mt-6 grid gap-x-6 gap-y-5 border-t border-charcoal/[0.07] pt-6 sm:grid-cols-2">
              {info
                .filter((row): row is [string, string] => Boolean(row[1]))
                .map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-mist">{label}</dt>
                    <dd className="mt-1 break-words text-sm text-charcoal">{value}</dd>
                  </div>
                ))}
            </dl>

            {lead.services.length > 0 ? (
              <div className="mt-6 border-t border-charcoal/[0.07] pt-6">
                <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-mist">Servicios solicitados</h2>
                <ul className="mt-2.5 flex flex-wrap gap-2">
                  {lead.services.map((service) => (
                    <li key={service} className="rounded-full bg-sage-100 px-3 py-1 text-[0.8125rem] font-medium text-forest">
                      {labelService(service)}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {lead.message ? (
              <div className="mt-6 border-t border-charcoal/[0.07] pt-6">
                <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-mist">Descripción del proyecto</h2>
                <p className="mt-2.5 whitespace-pre-wrap break-words rounded-2xl bg-ivory/70 p-4 text-sm leading-relaxed text-charcoal">
                  {lead.message}
                </p>
              </div>
            ) : null}
          </CardBody>
        </Card>

        <Card aria-labelledby="history-title">
          <CardHeader id="history-title" title="Notas e historial" description="Las notas son internas; los cambios se registran solos." />
          <CardBody>
            <NoteForm leadId={lead.id} />
            {events.length === 0 ? (
              <p className="mt-6 text-sm text-stone">Sin actividad registrada.</p>
            ) : (
              <ol className="mt-6 space-y-5 border-l-2 border-charcoal/[0.07] pl-5">
                {events.map((event) => (
                  <li key={event.id} className="relative">
                    <span
                      aria-hidden
                      className={cn(
                        'absolute -left-[1.72rem] top-1 size-3 rounded-full ring-4 ring-white',
                        event.type === 'note' ? 'bg-forest' : 'bg-sage',
                      )}
                    />
                    <p className="text-sm font-semibold text-charcoal">{describeEvent(event)}</p>
                    {event.body ? (
                      <p className="mt-1.5 whitespace-pre-wrap break-words rounded-2xl bg-ivory/70 p-3.5 text-sm leading-relaxed text-charcoal">
                        {event.body}
                      </p>
                    ) : null}
                    <p className="mt-1 text-xs text-mist">{formatDateTime(event.created_at)}</p>
                  </li>
                ))}
              </ol>
            )}
          </CardBody>
        </Card>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Card aria-labelledby="tracking-title">
          <CardHeader id="tracking-title" title="Seguimiento" description="Estado, próxima fecha y valor cotizado." />
          <CardBody>
            <dl className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-ivory/70 p-3.5">
                <dt className="flex items-center gap-1.5 text-xs text-stone">
                  <CircleDollarSign aria-hidden className="size-3.5" /> Cotización
                </dt>
                <dd className="mt-1 text-sm font-semibold text-charcoal">{formatMoney(lead.quote_value, lead.quote_currency)}</dd>
              </div>
              <div className="rounded-2xl bg-ivory/70 p-3.5">
                <dt className="flex items-center gap-1.5 text-xs text-stone">
                  <CalendarClock aria-hidden className="size-3.5" /> Seguimiento
                </dt>
                <dd className="mt-1 text-sm font-semibold text-charcoal">{lead.follow_up_date ? formatDate(lead.follow_up_date) : '—'}</dd>
              </div>
            </dl>
            <div className="mt-5 border-t border-charcoal/[0.07] pt-5">
              <TrackingForm leadId={lead.id} status={lead.status} followUpDate={lead.follow_up_date} quoteValue={lead.quote_value} />
            </div>
          </CardBody>
        </Card>
      </aside>
    </div>
  )
}
