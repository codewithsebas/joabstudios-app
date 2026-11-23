import type { Locale } from '@/i18n/routing'
import type { ServiceSlug } from './services'

/**
 * Single source of truth for portfolio projects. Inicio, /proyectos y
 * /proyectos/[slug] read from here. Only verified information goes in this
 * file: no invented metrics, testimonials or features.
 *
 * Structure (slugs, images, links) is shared; the texts live per language.
 */

export type ProjectScreenshot = {
  src: string
  alt: string
  caption: string
  width: number
  height: number
  device: 'desktop' | 'mobile'
}

export type ProjectFeature = {
  title: string
  description: string
}

export type Project = {
  slug: string
  name: string
  sector: string
  location: string | null
  category: string
  summary: string
  description: string
  challenge: string
  solution: string
  services: string[]
  serviceLines: ServiceSlug[]
  features: ProjectFeature[]
  liveUrl: string | null
  /** Cover is a real screenshot when available; otherwise the UI renders a typographic cover. */
  cover: ProjectScreenshot | null
  gallery: ProjectScreenshot[]
  featured: boolean
}

type Shot = Pick<ProjectScreenshot, 'src' | 'width' | 'height' | 'device'>
type ShotText = Pick<ProjectScreenshot, 'alt' | 'caption'>

type ProjectText = Pick<
  Project,
  'sector' | 'category' | 'summary' | 'description' | 'challenge' | 'solution' | 'services' | 'features'
> & { cover: ShotText; gallery: ShotText[] }

type ProjectBase = Pick<Project, 'slug' | 'name' | 'location' | 'serviceLines' | 'liveUrl' | 'featured'> & {
  cover: Shot
  gallery: Shot[]
  text: Record<Locale, ProjectText>
}

const desktop = { width: 1440, height: 900, device: 'desktop' } as const
const mobile = { width: 780, height: 1688, device: 'mobile' } as const
const wide = { width: 1900, height: 900, device: 'desktop' } as const

const base: ProjectBase[] = [
  {
    slug: 'la-vaca-fifi',
    name: 'La Vaca Fifí',
    location: 'Murillo, Tolima',
    serviceLines: ['diseno-web', 'apps', 'software'],
    liveUrl: 'https://lavacafifi.com/',
    featured: true,
    cover: { src: '/proyectos/la-vaca-fifi/home.webp', ...desktop },
    gallery: [
      { src: '/proyectos/la-vaca-fifi/booking-widget.webp', ...desktop },
      { src: '/proyectos/la-vaca-fifi/cabins.webp', ...desktop },
      { src: '/proyectos/la-vaca-fifi/booking-flow.webp', ...desktop },
      { src: '/proyectos/la-vaca-fifi/mobile-home.webp', ...mobile },
      { src: '/proyectos/la-vaca-fifi/mobile-booking.webp', ...mobile },
    ],
    text: {
      es: {
        sector: 'Cabañas, restaurante y café',
        category: 'Sitio web + sistema de reservas',
        summary:
          'Sitio web y motor de reservas directas para un complejo de cabañas familiar a cinco minutos de Murillo, Tolima.',
        description:
          'La Vaca Fifí es un alojamiento familiar con cuatro tipos de cabaña, restaurante y café en la vía Líbano – Murillo. Diseñamos y desarrollamos su sitio web y un sistema de reservas propio que permite a los huéspedes elegir fechas, comparar cabañas y reservar en línea, además de un panel administrativo para gestionar la operación.',
        challenge:
          'El alojamiento necesitaba un canal digital propio: un lugar donde mostrar sus cabañas, el restaurante y la ubicación, consultar disponibilidad y recibir reservas directas, sin que todo el proceso dependiera de conversaciones por WhatsApp o de plataformas externas.',
        solution:
          'Creamos un sitio web con una identidad cercana y colorida, fiel al espíritu de la finca, y un flujo de reserva en cuatro pasos: fechas y huéspedes, cabaña, datos del huésped y revisión y pago. Las tarifas se calculan según el tipo de cabaña y el número de huéspedes, y el equipo administra reservas, tarifas y disponibilidad desde un panel privado.',
        services: [
          'Diseño y desarrollo web',
          'Sistema de reservas',
          'Calendario de disponibilidad',
          'Gestión de tarifas',
          'Panel administrativo',
          'Gestión de reservas',
        ],
        features: [
          { title: 'Reserva en cuatro pasos', description: 'Fechas y huéspedes, elección de cabaña, datos del huésped y revisión y pago, con progreso visible.' },
          { title: 'Calendario de disponibilidad', description: 'Selección de llegada y salida con fechas sin disponibilidad marcadas en el calendario.' },
          { title: 'Tarifas por cabaña y ocupación', description: 'El total de la estadía se calcula según el tipo de cabaña, las fechas y el número de huéspedes.' },
          { title: 'Confirmación con abono', description: 'La reserva se confirma con un abono del 50 % o el pago total, según la política del alojamiento.' },
          { title: 'Consulta de reserva', description: 'Los huéspedes pueden consultar su reserva desde la sección “Mi reserva”.' },
          { title: 'Panel administrativo', description: 'Gestión privada de reservas, tarifas y disponibilidad para el equipo del alojamiento.' },
        ],
        cover: {
          alt: 'Página de inicio de La Vaca Fifí con galería de fotos de las cabañas, el restaurante y los jardines',
          caption: 'Inicio con galería, calificación y acceso directo a reservar.',
        },
        gallery: [
          {
            alt: 'Resumen del alojamiento con amenidades y módulo de reserva con fechas, tipo de cabaña y huéspedes',
            caption: 'Módulo de reserva siempre visible junto a la información del alojamiento.',
          },
          {
            alt: 'Listado de cabañas con fotografía, capacidad, descripción y tarifas por número de huéspedes',
            caption: 'Fichas de cabaña con capacidad, amenidades y tarifas por ocupación.',
          },
          {
            alt: 'Primer paso del flujo de reserva con calendario de disponibilidad, selector de huéspedes y resumen',
            caption: 'Flujo de reserva en cuatro pasos con calendario y resumen en vivo.',
          },
          {
            alt: 'Versión móvil del inicio con fotografía principal y barra fija de reserva',
            caption: 'Móvil: barra de reserva fija con precio desde.',
          },
          {
            alt: 'Versión móvil del flujo de reserva con calendario de disponibilidad',
            caption: 'Móvil: reserva por pasos pensada para el pulgar.',
          },
        ],
      },
      en: {
        sector: 'Cabins, restaurant and café',
        category: 'Website + booking system',
        summary: 'Website and direct booking engine for a family-run cabin retreat five minutes from Murillo, Tolima (Colombia).',
        description:
          'La Vaca Fifí is a family-run accommodation with four cabin types, a restaurant and a café on the Líbano – Murillo road. We designed and built its website and its own booking system, which lets guests pick dates, compare cabins and book online, plus an admin dashboard to run the operation.',
        challenge:
          'The property needed a digital channel of its own: a place to showcase its cabins, restaurant and location, check availability and receive direct bookings, without the whole process depending on WhatsApp conversations or third-party platforms.',
        solution:
          'We created a website with a warm, colorful identity true to the spirit of the farm, and a four-step booking flow: dates and guests, cabin, guest details, and review and payment. Rates are calculated by cabin type and number of guests, and the team manages bookings, rates and availability from a private dashboard.',
        services: ['Web design & development', 'Booking system', 'Availability calendar', 'Rate management', 'Admin dashboard', 'Booking management'],
        features: [
          { title: 'Four-step booking', description: 'Dates and guests, cabin choice, guest details, and review and payment, with visible progress.' },
          { title: 'Availability calendar', description: 'Check-in and check-out selection with unavailable dates marked on the calendar.' },
          { title: 'Rates by cabin and occupancy', description: 'The total stay is calculated from the cabin type, the dates and the number of guests.' },
          { title: 'Deposit confirmation', description: 'Bookings are confirmed with a 50% deposit or full payment, according to the property’s policy.' },
          { title: 'Booking lookup', description: 'Guests can check their booking from the “My booking” section.' },
          { title: 'Admin dashboard', description: 'Private management of bookings, rates and availability for the property’s team.' },
        ],
        cover: {
          alt: 'La Vaca Fifí home page with a photo gallery of the cabins, restaurant and gardens',
          caption: 'Home page with gallery, rating and a direct path to booking.',
        },
        gallery: [
          {
            alt: 'Property overview with amenities and a booking module with dates, cabin type and guests',
            caption: 'Booking module always visible next to the property information.',
          },
          {
            alt: 'Cabin list with photo, capacity, description and rates by number of guests',
            caption: 'Cabin cards with capacity, amenities and occupancy-based rates.',
          },
          {
            alt: 'First step of the booking flow with availability calendar, guest selector and summary',
            caption: 'Four-step booking flow with calendar and live summary.',
          },
          {
            alt: 'Mobile home page with a main photo and a sticky booking bar',
            caption: 'Mobile: sticky booking bar with starting price.',
          },
          {
            alt: 'Mobile booking flow with availability calendar',
            caption: 'Mobile: step-by-step booking designed for the thumb.',
          },
        ],
      },
      pt: {
        sector: 'Chalés, restaurante e café',
        category: 'Site + sistema de reservas',
        summary: 'Site e motor de reservas diretas para um complexo familiar de chalés a cinco minutos de Murillo, Tolima (Colômbia).',
        description:
          'La Vaca Fifí é uma hospedagem familiar com quatro tipos de chalé, restaurante e café na estrada Líbano – Murillo. Projetamos e desenvolvemos seu site e um sistema de reservas próprio que permite aos hóspedes escolher datas, comparar chalés e reservar online, além de um painel administrativo para gerenciar a operação.',
        challenge:
          'A hospedagem precisava de um canal digital próprio: um lugar para mostrar seus chalés, o restaurante e a localização, consultar disponibilidade e receber reservas diretas, sem que todo o processo dependesse de conversas no WhatsApp ou de plataformas externas.',
        solution:
          'Criamos um site com uma identidade acolhedora e colorida, fiel ao espírito da fazenda, e um fluxo de reserva em quatro etapas: datas e hóspedes, chalé, dados do hóspede e revisão e pagamento. As tarifas são calculadas pelo tipo de chalé e pelo número de hóspedes, e a equipe gerencia reservas, tarifas e disponibilidade em um painel privado.',
        services: ['Design e desenvolvimento web', 'Sistema de reservas', 'Calendário de disponibilidade', 'Gestão de tarifas', 'Painel administrativo', 'Gestão de reservas'],
        features: [
          { title: 'Reserva em quatro etapas', description: 'Datas e hóspedes, escolha do chalé, dados do hóspede e revisão e pagamento, com progresso visível.' },
          { title: 'Calendário de disponibilidade', description: 'Seleção de check-in e check-out com datas indisponíveis marcadas no calendário.' },
          { title: 'Tarifas por chalé e ocupação', description: 'O total da estadia é calculado pelo tipo de chalé, pelas datas e pelo número de hóspedes.' },
          { title: 'Confirmação com sinal', description: 'A reserva é confirmada com um sinal de 50% ou o pagamento total, conforme a política da hospedagem.' },
          { title: 'Consulta de reserva', description: 'Os hóspedes podem consultar sua reserva na seção “Minha reserva”.' },
          { title: 'Painel administrativo', description: 'Gestão privada de reservas, tarifas e disponibilidade para a equipe da hospedagem.' },
        ],
        cover: {
          alt: 'Página inicial de La Vaca Fifí com galeria de fotos dos chalés, do restaurante e dos jardins',
          caption: 'Página inicial com galeria, avaliação e acesso direto à reserva.',
        },
        gallery: [
          {
            alt: 'Resumo da hospedagem com comodidades e módulo de reserva com datas, tipo de chalé e hóspedes',
            caption: 'Módulo de reserva sempre visível ao lado das informações da hospedagem.',
          },
          {
            alt: 'Lista de chalés com foto, capacidade, descrição e tarifas por número de hóspedes',
            caption: 'Fichas de chalé com capacidade, comodidades e tarifas por ocupação.',
          },
          {
            alt: 'Primeira etapa do fluxo de reserva com calendário de disponibilidade, seletor de hóspedes e resumo',
            caption: 'Fluxo de reserva em quatro etapas com calendário e resumo ao vivo.',
          },
          {
            alt: 'Versão mobile da página inicial com foto principal e barra fixa de reserva',
            caption: 'Mobile: barra de reserva fixa com preço inicial.',
          },
          {
            alt: 'Versão mobile do fluxo de reserva com calendário de disponibilidade',
            caption: 'Mobile: reserva por etapas pensada para o polegar.',
          },
        ],
      },
    },
  },
  {
    slug: 'condor-del-ruiz',
    name: 'El Cóndor del Ruiz',
    location: 'Murillo, Tolima',
    serviceLines: ['diseno-web', 'apps', 'software'],
    liveUrl: null,
    featured: true,
    cover: { src: '/proyectos/condor-del-ruiz/dashboard.jpg', ...wide },
    gallery: [
      { src: '/proyectos/condor-del-ruiz/calendar.jpg', ...wide },
      { src: '/proyectos/condor-del-ruiz/finances.jpg', ...wide },
      { src: '/proyectos/condor-del-ruiz/site-content.jpg', ...wide },
    ],
    text: {
      es: {
        sector: 'Cabañas tipo chalet',
        category: 'Sitio web + sistema de gestión',
        summary:
          'Sitio web administrable y plataforma de gestión a medida para cinco cabañas con vista al Nevado del Ruiz: reservas, calendario, pagos, finanzas y contenido.',
        description:
          'El Cóndor del Ruiz ofrece cabañas tipo chalet en Murillo, Tolima, con vista al Nevado del Ruiz y a una cascada, sendero ecológico, avistamiento de aves y zona de fogata. Diseñamos y desarrollamos su sitio web y una plataforma de gestión propia desde la que el equipo administra reservas, cabañas, tarifas, pagos, finanzas y el contenido publicado en la página.',
        challenge:
          'Con cinco cabañas en dos categorías, reservas que llegan por canal propio y por Booking, y pagos en abonos y saldos, la operación necesitaba un solo lugar para ver la ocupación, saber qué está por cobrar y mantener el sitio web al día sin depender de un desarrollador para cada cambio.',
        solution:
          'Construimos un panel con dashboard diario, calendario por cabaña con tarifas por noche, módulos de reservas, pagos, clientes y finanzas, y un editor de contenido con vista previa en escritorio y celular. El sitio web público se alimenta de ese mismo contenido.',
        services: [
          'Diseño y desarrollo web',
          'Experiencia de reservas',
          'Calendario de disponibilidad',
          'Gestión de tarifas',
          'Panel administrativo',
          'Finanzas y pagos',
          'Editor de contenido',
        ],
        features: [
          { title: 'Dashboard diario', description: 'Llegadas, salidas, huéspedes en estadía, saldos por cobrar y ocupación del día en una sola vista.' },
          {
            title: 'Calendario por cabaña',
            description: 'Ocupación por categoría y cabaña con tarifa por noche, vistas de fin de semana a mes y estados de reserva diferenciados.',
          },
          { title: 'Reservas, pagos y clientes', description: 'Gestión de reservas con abonos y saldos, condiciones de pago, bloqueos y registro de clientes.' },
          { title: 'Finanzas', description: 'Ingresos recibidos, abonos y saldos, valor promedio por reserva e ingreso por noche, filtrables por periodo y cabaña.' },
          { title: 'Reservas de Booking', description: 'Las reservas que llegan por Booking aparecen en el mismo calendario que las reservas directas.' },
          { title: 'Editor del sitio web', description: 'El equipo edita portada, experiencias, servicios y políticas con vista previa antes de publicar.' },
        ],
        cover: {
          alt: 'Dashboard del panel de El Cóndor del Ruiz con llegadas, salidas, ocupación, dinero generado en el mes y saldos por cobrar',
          caption: 'Dashboard con la operación del día y los ingresos del mes.',
        },
        gallery: [
          {
            alt: 'Calendario mensual por cabaña con tarifas por noche y reservas; los nombres de los huéspedes están pixelados',
            caption: 'Calendario por categoría y cabaña con tarifa por noche (nombres de huéspedes ocultos).',
          },
          {
            alt: 'Módulo de finanzas con ingresos recibidos, abonos y saldos, ocupación y gráfico diario de ingresos',
            caption: 'Finanzas: ingresos por día, abonos, saldos y ocupación del periodo.',
          },
          {
            alt: 'Editor de contenido del sitio con campos de la portada y vista previa del sitio público',
            caption: 'Editor de contenido con vista previa en vivo del sitio público.',
          },
        ],
      },
      en: {
        sector: 'Chalet-style cabins',
        category: 'Website + management system',
        summary:
          'Editable website and custom management platform for five cabins overlooking the Nevado del Ruiz volcano: bookings, calendar, payments, finances and content.',
        description:
          'El Cóndor del Ruiz offers chalet-style cabins in Murillo, Tolima (Colombia), with views of the Nevado del Ruiz and a waterfall, an eco trail, birdwatching and a fire pit. We designed and built its website and its own management platform, where the team handles bookings, cabins, rates, payments, finances and the content published on the site.',
        challenge:
          'With five cabins in two categories, bookings coming from its own channel and from Booking.com, and payments split into deposits and balances, the operation needed one place to see occupancy, know what was still due and keep the website up to date without relying on a developer for every change.',
        solution:
          'We built a platform with a daily dashboard, a per-cabin calendar with nightly rates, modules for bookings, payments, customers and finances, and a content editor with desktop and mobile preview. The public website is powered by that same content.',
        services: [
          'Web design & development',
          'Booking experience',
          'Availability calendar',
          'Rate management',
          'Admin dashboard',
          'Finances and payments',
          'Content editor',
        ],
        features: [
          { title: 'Daily dashboard', description: 'Arrivals, departures, in-house guests, balances due and today’s occupancy in a single view.' },
          {
            title: 'Per-cabin calendar',
            description: 'Occupancy by category and cabin with nightly rates, weekend-to-month views and distinct booking statuses.',
          },
          { title: 'Bookings, payments and customers', description: 'Booking management with deposits and balances, payment terms, blocked dates and customer records.' },
          { title: 'Finances', description: 'Revenue received, deposits and balances, average booking value and revenue per night, filterable by period and cabin.' },
          { title: 'Booking.com reservations', description: 'Reservations coming from Booking.com appear on the same calendar as direct bookings.' },
          { title: 'Website editor', description: 'The team edits the home page, experiences, services and policies with a preview before publishing.' },
        ],
        cover: {
          alt: 'El Cóndor del Ruiz dashboard with arrivals, departures, occupancy, monthly revenue and balances due',
          caption: 'Dashboard with today’s operation and the month’s revenue.',
        },
        gallery: [
          {
            alt: 'Monthly per-cabin calendar with nightly rates and bookings; guest names are pixelated',
            caption: 'Calendar by category and cabin with nightly rates (guest names hidden).',
          },
          {
            alt: 'Finance module with revenue received, deposits and balances, occupancy and a daily revenue chart',
            caption: 'Finances: daily revenue, deposits, balances and occupancy for the period.',
          },
          {
            alt: 'Site content editor with home page fields and a preview of the public site',
            caption: 'Content editor with a live preview of the public site.',
          },
        ],
      },
      pt: {
        sector: 'Chalés',
        category: 'Site + sistema de gestão',
        summary:
          'Site editável e plataforma de gestão sob medida para cinco chalés com vista para o vulcão Nevado del Ruiz: reservas, calendário, pagamentos, finanças e conteúdo.',
        description:
          'El Cóndor del Ruiz oferece chalés em Murillo, Tolima (Colômbia), com vista para o Nevado del Ruiz e para uma cachoeira, trilha ecológica, observação de aves e área de fogueira. Projetamos e desenvolvemos seu site e uma plataforma de gestão própria, onde a equipe administra reservas, chalés, tarifas, pagamentos, finanças e o conteúdo publicado no site.',
        challenge:
          'Com cinco chalés em duas categorias, reservas vindas do canal próprio e do Booking.com, e pagamentos em sinal e saldo, a operação precisava de um só lugar para ver a ocupação, saber o que estava a receber e manter o site atualizado sem depender de um desenvolvedor para cada mudança.',
        solution:
          'Construímos uma plataforma com dashboard diário, calendário por chalé com tarifa por noite, módulos de reservas, pagamentos, clientes e finanças, e um editor de conteúdo com pré-visualização no desktop e no celular. O site público é alimentado por esse mesmo conteúdo.',
        services: [
          'Design e desenvolvimento web',
          'Experiência de reservas',
          'Calendário de disponibilidade',
          'Gestão de tarifas',
          'Painel administrativo',
          'Finanças e pagamentos',
          'Editor de conteúdo',
        ],
        features: [
          { title: 'Dashboard diário', description: 'Chegadas, saídas, hóspedes na casa, saldos a receber e ocupação do dia em uma única tela.' },
          {
            title: 'Calendário por chalé',
            description: 'Ocupação por categoria e chalé com tarifa por noite, visões de fim de semana a mês e status de reserva diferenciados.',
          },
          { title: 'Reservas, pagamentos e clientes', description: 'Gestão de reservas com sinal e saldo, condições de pagamento, bloqueios e cadastro de clientes.' },
          { title: 'Finanças', description: 'Receita recebida, sinais e saldos, valor médio por reserva e receita por noite, filtráveis por período e chalé.' },
          { title: 'Reservas do Booking.com', description: 'As reservas que chegam pelo Booking.com aparecem no mesmo calendário que as reservas diretas.' },
          { title: 'Editor do site', description: 'A equipe edita a página inicial, experiências, serviços e políticas com pré-visualização antes de publicar.' },
        ],
        cover: {
          alt: 'Dashboard do painel de El Cóndor del Ruiz com chegadas, saídas, ocupação, receita do mês e saldos a receber',
          caption: 'Dashboard com a operação do dia e a receita do mês.',
        },
        gallery: [
          {
            alt: 'Calendário mensal por chalé com tarifas por noite e reservas; os nomes dos hóspedes estão pixelados',
            caption: 'Calendário por categoria e chalé com tarifa por noite (nomes dos hóspedes ocultos).',
          },
          {
            alt: 'Módulo de finanças com receita recebida, sinais e saldos, ocupação e gráfico diário de receita',
            caption: 'Finanças: receita por dia, sinais, saldos e ocupação do período.',
          },
          {
            alt: 'Editor de conteúdo do site com campos da página inicial e pré-visualização do site público',
            caption: 'Editor de conteúdo com pré-visualização ao vivo do site público.',
          },
        ],
      },
    },
  },
]

function localize(project: ProjectBase, locale: Locale): Project {
  const text = project.text[locale]
  return {
    slug: project.slug,
    name: project.name,
    location: project.location,
    serviceLines: project.serviceLines,
    liveUrl: project.liveUrl,
    featured: project.featured,
    sector: text.sector,
    category: text.category,
    summary: text.summary,
    description: text.description,
    challenge: text.challenge,
    solution: text.solution,
    services: text.services,
    features: text.features,
    cover: { ...project.cover, ...text.cover },
    gallery: project.gallery.map((shot, index) => ({ ...shot, ...text.gallery[index] })),
  }
}

export const projectSlugs: string[] = base.map((p) => p.slug)

export function getProjects(locale: Locale): Project[] {
  return base.map((p) => localize(p, locale))
}

export function getProject(locale: Locale, slug: string): Project | undefined {
  const project = base.find((p) => p.slug === slug)
  return project ? localize(project, locale) : undefined
}

export function getFeaturedProjects(locale: Locale): Project[] {
  return getProjects(locale).filter((p) => p.featured)
}

export function getOtherProjects(locale: Locale, slug: string): Project[] {
  return getProjects(locale).filter((p) => p.slug !== slug)
}
