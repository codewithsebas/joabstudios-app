import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { ChevronRight, Inbox, Search, SearchX, SlidersHorizontal } from 'lucide-react'
import { AdminError, AdminShell, PageHeading } from '@/components/admin/admin-shell'
import { StatusBadge } from '@/components/admin/ui/badge'
import { AdminButton, AdminButtonLink } from '@/components/admin/ui/button'
import { Card, StatCard } from '@/components/admin/ui/card'
import { DatePicker } from '@/components/admin/ui/date-picker'
import { EmptyState, Skeleton } from '@/components/admin/ui/empty-state'
import { Field, Input } from '@/components/admin/ui/field'
import { Select } from '@/components/admin/ui/select'
import {
  formatDate,
  formatDateTime,
  formatMoney,
  getLeadDashboard,
  leadSorts,
  leadStatuses,
  parseLeadFilters,
  type LeadDashboard,
  type LeadFilters,
} from '@/lib/leads/crm'
import { leadStatusTone } from '@/lib/leads/status'
import { labelProjectType } from '@/lib/leads/options'

export const metadata: Metadata = { title: 'Prospectos' }

export default function LeadsPage({ searchParams }: PageProps<'/admin/leads'>) {
  return (
    <AdminShell>
      <PageHeading title="Prospectos" description="Solicitudes de cotización recibidas desde el sitio web." />
      <Suspense fallback={<LeadsSkeleton />}>
        <LeadsContent searchParams={searchParams} />
      </Suspense>
    </AdminShell>
  )
}

async function LeadsContent({ searchParams }: { searchParams: PageProps<'/admin/leads'>['searchParams'] }) {
  const filters = parseLeadFilters(await searchParams)
  let dashboard: LeadDashboard
  try {
    dashboard = await getLeadDashboard(filters)
  } catch (error) {
    return (
      <div className="mt-8">
        <AdminError message={error instanceof Error ? error.message : 'Error inesperado.'} />
      </div>
    )
  }

  const { counts, leads, truncated } = dashboard
  const hasFilters = Boolean(filters.q || filters.status || filters.from || filters.to)

  return (
    <>
      <section aria-label="Métricas comerciales" className="mt-8">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          <li>
            <StatCard label="Total" value={counts.total} href={buildHref(filters, { status: undefined })} active={!filters.status} />
          </li>
          {leadStatuses.map((s) => (
            <li key={s.value}>
              <StatCard
                label={s.label}
                value={counts[s.value]}
                href={buildHref(filters, { status: s.value })}
                active={filters.status === s.value}
                dotClass={leadStatusTone[s.value].dot}
              />
            </li>
          ))}
        </ul>
      </section>

      <Card as="div" className="mt-6">
        <form method="get" className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))_auto] lg:items-end">
          {filters.status ? <input type="hidden" name="status" value={filters.status} /> : null}
          <Field label="Buscar" htmlFor="q">
            <Input id="q" type="search" name="q" icon={Search} inputSize="md" defaultValue={filters.q} placeholder="Nombre, negocio o correo" />
          </Field>
          <Field label="Desde" htmlFor="from">
            <DatePicker id="from" name="from" size="md" defaultValue={filters.from} placeholder="Cualquier fecha" />
          </Field>
          <Field label="Hasta" htmlFor="to">
            <DatePicker id="to" name="to" size="md" defaultValue={filters.to} placeholder="Cualquier fecha" />
          </Field>
          <Field label="Ordenar" htmlFor="sort">
            <Select id="sort" name="sort" size="md" defaultValue={filters.sort} options={leadSorts} />
          </Field>
          <div className="flex gap-2">
            <AdminButton type="submit" icon={SlidersHorizontal} className="flex-1 lg:flex-none">
              Aplicar
            </AdminButton>
            {hasFilters ? (
              <AdminButtonLink href="/admin/leads" variant="ghost">
                Limpiar
              </AdminButtonLink>
            ) : null}
          </div>
        </form>
      </Card>

      <Card aria-label="Listado de prospectos" className="mt-6 overflow-hidden">
        {leads.length === 0 ? (
          hasFilters ? (
            <EmptyState
              icon={SearchX}
              title="Sin resultados"
              description="Ningún prospecto coincide con los filtros. Prueba con otros criterios."
              action={
                <AdminButtonLink href="/admin/leads" variant="secondary" size="sm">
                  Quitar filtros
                </AdminButtonLink>
              }
            />
          ) : (
            <EmptyState
              icon={Inbox}
              title="Aún no hay prospectos"
              description="Cuando alguien envíe el formulario de cotización del sitio, aparecerá aquí."
            />
          )
        ) : (
          <>
            <div
              aria-hidden
              className="hidden grid-cols-[1.6fr_1fr_9rem_8rem_8rem_9rem] gap-4 border-b border-charcoal/[0.07] bg-ivory/60 px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-mist md:grid"
            >
              <span>Prospecto</span>
              <span>Tipo</span>
              <span>Estado</span>
              <span>Seguimiento</span>
              <span>Cotización</span>
              <span className="text-right">Recibido</span>
            </div>
            <ul className="divide-y divide-charcoal/[0.07]">
              {leads.map((lead) => (
                <li key={lead.id}>
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="group grid gap-2 px-5 py-4 transition-colors hover:bg-ivory/70 focus-visible:bg-ivory focus-visible:outline-none sm:px-6 md:grid-cols-[1.6fr_1fr_9rem_8rem_8rem_9rem] md:items-center md:gap-4"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[0.95rem] font-semibold text-charcoal">{lead.business_name ?? lead.full_name}</span>
                      <span className="block truncate text-[0.8125rem] text-stone">
                        {lead.full_name}
                        {lead.location ? ` · ${lead.location}` : ''}
                      </span>
                    </span>
                    <span className="text-sm text-stone">
                      {lead.source === 'contact' ? 'Contacto' : labelProjectType(lead.accommodation_type)}
                    </span>
                    <span>
                      <StatusBadge status={lead.status} />
                    </span>
                    <span className="text-sm text-stone">
                      <span className="md:hidden">Seguimiento: </span>
                      {lead.follow_up_date ? formatDate(lead.follow_up_date) : '—'}
                    </span>
                    <span className="text-sm font-medium text-charcoal">{formatMoney(lead.quote_value, lead.quote_currency)}</span>
                    <span className="flex items-center justify-between gap-2 text-xs text-mist md:justify-end">
                      {formatDateTime(lead.created_at)}
                      <ChevronRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>
      {truncated ? (
        <p className="mt-3 text-sm text-stone">Mostrando los primeros 200 resultados. Usa los filtros para acotar la búsqueda.</p>
      ) : null}
    </>
  )
}

function buildHref(filters: LeadFilters, override: Partial<LeadFilters>): string {
  const merged = { ...filters, ...override }
  const params = new URLSearchParams()
  if (merged.q) params.set('q', merged.q)
  if (merged.status) params.set('status', merged.status)
  if (merged.from) params.set('from', merged.from)
  if (merged.to) params.set('to', merged.to)
  if (merged.sort !== 'newest') params.set('sort', merged.sort)
  const query = params.toString()
  return query ? `/admin/leads?${query}` : '/admin/leads'
}

function LeadsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando prospectos" className="mt-8 space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {Array.from({ length: 7 }, (_, i) => (
          <Skeleton key={i} className="h-[5.75rem] rounded-[1.25rem]" />
        ))}
      </div>
      <Skeleton className="h-24 rounded-[1.5rem]" />
      <Skeleton className="h-80 rounded-[1.5rem]" />
    </div>
  )
}
