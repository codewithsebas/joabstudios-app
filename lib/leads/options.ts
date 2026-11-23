import type { ServiceSlug } from '@/lib/content/services'

type Option<V extends string> = { value: V; label: string; hint?: string }

export const projectTypes = [
  { value: 'empresa', label: 'Empresa o pyme', hint: 'Servicios, comercio o industria' },
  { value: 'emprendimiento', label: 'Emprendimiento', hint: 'Una idea o un negocio que empieza' },
  { value: 'tienda', label: 'Tienda o e-commerce', hint: 'Venta de productos en línea' },
  { value: 'turismo', label: 'Turismo y hotelería', hint: 'Hoteles, cabañas, glampings' },
  { value: 'profesional', label: 'Profesional independiente', hint: 'Consultorios, estudios, portafolios' },
  { value: 'otro', label: 'Otro', hint: 'Cuéntanos en la descripción' },
] as const satisfies readonly Option<string>[]

export const serviceOptions = [
  { value: 'website', label: 'Sitio web', hint: 'Corporativo, landing page o portafolio' },
  { value: 'ecommerce', label: 'Tienda en línea', hint: 'Catálogo, carrito y pagos' },
  { value: 'app', label: 'Aplicación web o móvil', hint: 'Plataformas, portales y apps' },
  { value: 'software', label: 'Software a medida', hint: 'Gestión, CRM, reservas, reportes' },
  { value: 'branding', label: 'Diseño de marca', hint: 'Logo e identidad visual' },
  { value: 'uiux', label: 'Diseño UI/UX', hint: 'Interfaces y prototipos' },
  { value: 'automation', label: 'Automatizaciones e integraciones', hint: 'Procesos, pagos y herramientas' },
  { value: 'custom', label: 'Otro / aún no lo sé', hint: 'Te ayudamos a definirlo' },
] as const satisfies readonly Option<string>[]

export const budgetOptions = [
  { value: 'sin-definir', label: 'Aún no lo tengo definido' },
  { value: 'menos-5m', label: 'Menos de $5.000.000 COP' },
  { value: '5m-15m', label: '$5.000.000 – $15.000.000 COP' },
  { value: '15m-30m', label: '$15.000.000 – $30.000.000 COP' },
  { value: '30m-60m', label: '$30.000.000 – $60.000.000 COP' },
  { value: 'mas-60m', label: 'Más de $60.000.000 COP' },
] as const satisfies readonly Option<string>[]

export type ProjectType = (typeof projectTypes)[number]['value']
export type ServiceOption = (typeof serviceOptions)[number]['value']
export type BudgetOption = (typeof budgetOptions)[number]['value']

export const projectTypeValues = projectTypes.map((o) => o.value) as [ProjectType, ...ProjectType[]]
export const serviceValues = serviceOptions.map((o) => o.value) as [ServiceOption, ...ServiceOption[]]
export const budgetValues = budgetOptions.map((o) => o.value) as [BudgetOption, ...BudgetOption[]]

/** Preselects a quote service when arriving from /servicios?servicio=… */
export const serviceFromSlug: Record<ServiceSlug, ServiceOption> = {
  'diseno-web': 'website',
  apps: 'app',
  software: 'software',
  diseno: 'branding',
}

function labelFrom(options: readonly Option<string>[], value: string | null | undefined): string | null {
  if (!value) return null
  return options.find((o) => o.value === value)?.label ?? value
}

export const labelProjectType = (value: string | null | undefined) => labelFrom(projectTypes, value)
export const labelService = (value: string) => labelFrom(serviceOptions, value) ?? value
export const labelBudget = (value: string | null | undefined) => labelFrom(budgetOptions, value)
