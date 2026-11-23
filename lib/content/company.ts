import type { Locale } from '@/i18n/routing'
import type { ServiceSlug } from './services'

export type Problem = {
  problem: string
  solution: string
  service: ServiceSlug
}

export type ProcessStep = {
  index: string
  title: string
  description: string
}

export type Plan = {
  name: string
  tagline: string
  description: string
  includes: string[]
}

type CompanyContent = {
  problems: Problem[]
  processSteps: ProcessStep[]
  plans: Plan[]
  recurringServices: string[]
  /** Short capability list used for the marquee strip. */
  capabilityTicker: string[]
}

const es: CompanyContent = {
  problems: [
    {
      problem: 'Ausencia de presencia digital profesional',
      solution: 'Un sitio web a medida, rápido, responsive y optimizado para buscadores.',
      service: 'diseno-web',
    },
    {
      problem: 'Una idea que todavía no es producto',
      solution: 'Diseñamos y desarrollamos tu aplicación web o móvil, desde el prototipo hasta el lanzamiento.',
      service: 'apps',
    },
    {
      problem: 'Procesos manuales y repetitivos',
      solution: 'Automatizaciones de confirmaciones, recordatorios, seguimientos y reportes.',
      service: 'software',
    },
    {
      problem: 'Información dispersa en hojas de cálculo y chats',
      solution: 'Un panel administrativo que centraliza clientes, ventas y operación.',
      service: 'software',
    },
    {
      problem: 'Una marca que no transmite confianza',
      solution: 'Identidad visual coherente: logo, colores, tipografías y lineamientos.',
      service: 'diseno',
    },
    {
      problem: 'Clientes que no pueden reservar, pedir o pagar en línea',
      solution: 'Reservas, pedidos y pagos en línea integrados en tu propio canal.',
      service: 'apps',
    },
  ],
  processSteps: [
    { index: '01', title: 'Descubrir', description: 'Conocemos tu negocio, cómo opera hoy y qué necesita para crecer.' },
    { index: '02', title: 'Estrategia', description: 'Definimos la solución adecuada, su alcance y las prioridades del proyecto.' },
    { index: '03', title: 'Diseño', description: 'Diseñamos la experiencia digital: contenido, interfaz y flujos clave.' },
    { index: '04', title: 'Desarrollo', description: 'Construimos e implementamos la solución con tecnología moderna y probada.' },
    { index: '05', title: 'Lanzamiento', description: 'Publicamos el proyecto y lo acompañamos con soporte y mejoras.' },
  ],
  plans: [
    {
      name: 'Esencial',
      tagline: 'Presencia digital profesional',
      description: 'Para negocios que necesitan un sitio web propio que los represente y genere contactos.',
      includes: ['Sitio web a medida', 'Diseño responsive', 'SEO técnico', 'Contacto por WhatsApp y formulario'],
    },
    {
      name: 'Crecimiento',
      tagline: 'Sitio web + funcionalidades en línea',
      description: 'Para negocios que quieren vender, reservar o atender a sus clientes desde su propio canal.',
      includes: ['Todo lo de Esencial', 'Tienda, reservas o agendamiento en línea', 'Pagos en línea', 'Notificaciones automáticas'],
    },
    {
      name: 'A la medida',
      tagline: 'Aplicaciones y software a medida',
      description: 'Para proyectos que necesitan una aplicación o un sistema hecho exactamente para su operación.',
      includes: ['Diseño de producto y prototipo', 'Aplicación web o móvil', 'Panel administrativo y reportes', 'Automatizaciones e integraciones'],
    },
  ],
  recurringServices: ['Mantenimiento web', 'Soporte técnico', 'Hosting y dominios', 'Mejoras y nuevas funcionalidades', 'Automatizaciones'],
  capabilityTicker: [
    'Diseño web',
    'Tiendas en línea',
    'Aplicaciones web',
    'Apps móviles',
    'Software a medida',
    'Sistemas de reservas',
    'Paneles administrativos',
    'Automatizaciones',
    'Identidad visual',
    'Diseño UI/UX',
    'SEO',
  ],
}

const en: CompanyContent = {
  problems: [
    {
      problem: 'No professional digital presence',
      solution: 'A custom website that is fast, responsive and optimized for search engines.',
      service: 'diseno-web',
    },
    {
      problem: 'An idea that isn’t a product yet',
      solution: 'We design and build your web or mobile app, from prototype to launch.',
      service: 'apps',
    },
    {
      problem: 'Manual, repetitive processes',
      solution: 'Automated confirmations, reminders, follow-ups and reports.',
      service: 'software',
    },
    {
      problem: 'Information scattered across spreadsheets and chats',
      solution: 'An admin dashboard that brings customers, sales and operations together.',
      service: 'software',
    },
    {
      problem: 'A brand that doesn’t inspire trust',
      solution: 'A consistent visual identity: logo, colors, typography and guidelines.',
      service: 'diseno',
    },
    {
      problem: 'Customers can’t book, order or pay online',
      solution: 'Online bookings, orders and payments built into your own channel.',
      service: 'apps',
    },
  ],
  processSteps: [
    { index: '01', title: 'Discover', description: 'We get to know your business, how it works today and what it needs to grow.' },
    { index: '02', title: 'Strategy', description: 'We define the right solution, its scope and the project priorities.' },
    { index: '03', title: 'Design', description: 'We design the digital experience: content, interface and key flows.' },
    { index: '04', title: 'Development', description: 'We build and ship the solution with modern, proven technology.' },
    { index: '05', title: 'Launch', description: 'We publish the project and keep supporting and improving it.' },
  ],
  plans: [
    {
      name: 'Essential',
      tagline: 'A professional digital presence',
      description: 'For businesses that need a website of their own that represents them and brings in leads.',
      includes: ['Custom website', 'Responsive design', 'Technical SEO', 'WhatsApp and contact form'],
    },
    {
      name: 'Growth',
      tagline: 'Website + online features',
      description: 'For businesses that want to sell, take bookings or serve customers through their own channel.',
      includes: ['Everything in Essential', 'Online store, bookings or scheduling', 'Online payments', 'Automatic notifications'],
    },
    {
      name: 'Custom',
      tagline: 'Custom apps and software',
      description: 'For projects that need an app or a system built exactly around their operation.',
      includes: ['Product design and prototype', 'Web or mobile app', 'Admin dashboard and reports', 'Automation and integrations'],
    },
  ],
  recurringServices: ['Website maintenance', 'Technical support', 'Hosting and domains', 'Improvements and new features', 'Automation'],
  capabilityTicker: [
    'Web design',
    'Online stores',
    'Web apps',
    'Mobile apps',
    'Custom software',
    'Booking systems',
    'Admin dashboards',
    'Automation',
    'Visual identity',
    'UI/UX design',
    'SEO',
  ],
}

const pt: CompanyContent = {
  problems: [
    {
      problem: 'Falta de presença digital profissional',
      solution: 'Um site sob medida, rápido, responsivo e otimizado para buscadores.',
      service: 'diseno-web',
    },
    {
      problem: 'Uma ideia que ainda não virou produto',
      solution: 'Projetamos e desenvolvemos seu aplicativo web ou mobile, do protótipo ao lançamento.',
      service: 'apps',
    },
    {
      problem: 'Processos manuais e repetitivos',
      solution: 'Automação de confirmações, lembretes, follow-ups e relatórios.',
      service: 'software',
    },
    {
      problem: 'Informações espalhadas em planilhas e chats',
      solution: 'Um painel administrativo que centraliza clientes, vendas e operação.',
      service: 'software',
    },
    {
      problem: 'Uma marca que não transmite confiança',
      solution: 'Identidade visual coerente: logo, cores, tipografia e diretrizes.',
      service: 'diseno',
    },
    {
      problem: 'Clientes que não conseguem reservar, pedir ou pagar online',
      solution: 'Reservas, pedidos e pagamentos online integrados ao seu próprio canal.',
      service: 'apps',
    },
  ],
  processSteps: [
    { index: '01', title: 'Descoberta', description: 'Conhecemos seu negócio, como ele opera hoje e o que precisa para crescer.' },
    { index: '02', title: 'Estratégia', description: 'Definimos a solução certa, o escopo e as prioridades do projeto.' },
    { index: '03', title: 'Design', description: 'Desenhamos a experiência digital: conteúdo, interface e fluxos principais.' },
    { index: '04', title: 'Desenvolvimento', description: 'Construímos e implementamos a solução com tecnologia moderna e comprovada.' },
    { index: '05', title: 'Lançamento', description: 'Publicamos o projeto e seguimos com suporte e melhorias.' },
  ],
  plans: [
    {
      name: 'Essencial',
      tagline: 'Presença digital profissional',
      description: 'Para negócios que precisam de um site próprio que os represente e gere contatos.',
      includes: ['Site sob medida', 'Design responsivo', 'SEO técnico', 'Contato por WhatsApp e formulário'],
    },
    {
      name: 'Crescimento',
      tagline: 'Site + funcionalidades online',
      description: 'Para negócios que querem vender, receber reservas ou atender clientes pelo próprio canal.',
      includes: ['Tudo do Essencial', 'Loja, reservas ou agendamento online', 'Pagamentos online', 'Notificações automáticas'],
    },
    {
      name: 'Sob medida',
      tagline: 'Aplicativos e software sob medida',
      description: 'Para projetos que precisam de um aplicativo ou sistema feito exatamente para a sua operação.',
      includes: ['Design de produto e protótipo', 'Aplicativo web ou mobile', 'Painel administrativo e relatórios', 'Automações e integrações'],
    },
  ],
  recurringServices: ['Manutenção de sites', 'Suporte técnico', 'Hospedagem e domínios', 'Melhorias e novas funcionalidades', 'Automações'],
  capabilityTicker: [
    'Design web',
    'Lojas virtuais',
    'Aplicativos web',
    'Apps mobile',
    'Software sob medida',
    'Sistemas de reservas',
    'Painéis administrativos',
    'Automações',
    'Identidade visual',
    'Design UI/UX',
    'SEO',
  ],
}

const byLocale: Record<Locale, CompanyContent> = { es, en, pt }

export function getCompanyContent(locale: Locale): CompanyContent {
  return byLocale[locale]
}
