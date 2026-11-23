import type { Locale } from '@/i18n/routing'

export type ServiceSlug = 'diseno-web' | 'apps' | 'software' | 'diseno'

export const serviceSlugs: ServiceSlug[] = ['diseno-web', 'apps', 'software', 'diseno']

export type Service = {
  slug: ServiceSlug
  index: string
  title: string
  shortTitle: string
  summary: string
  description: string
  capabilities: string[]
  solves: string[]
  features: string[]
  benefits: string[]
  examples: string[]
}

const es: Service[] = [
  {
    slug: 'diseno-web',
    index: '01',
    title: 'Diseño y desarrollo web',
    shortTitle: 'Sitios web y tiendas en línea',
    summary: 'Sitios corporativos, landing pages, tiendas en línea y portafolios rápidos, responsive y optimizados para buscadores.',
    description:
      'Diseñamos y construimos sitios web a la medida de cada negocio: una presencia digital que comunica lo que haces, carga rápido en cualquier dispositivo y convierte visitas en clientes.',
    capabilities: ['Sitios corporativos', 'Landing pages', 'Tiendas en línea', 'SEO técnico', 'Rendimiento'],
    solves: [
      'Ausencia de una presencia digital profesional y propia.',
      'Sitios lentos, desactualizados o difíciles de usar en el celular.',
      'Poca visibilidad en buscadores frente a la competencia.',
    ],
    features: [
      'Diseño a medida alineado con la identidad de tu marca',
      'Experiencia responsive pensada para móvil, tablet y escritorio',
      'Catálogos de productos o servicios con fotografía y detalles',
      'Integración con WhatsApp, mapas, formularios y pasarelas de pago',
      'SEO técnico: metadatos, datos estructurados, sitemap y URLs limpias',
      'Optimización de imágenes y buenas prácticas de Core Web Vitals',
    ],
    benefits: [
      'Un canal propio que no depende de terceros',
      'Mejor primera impresión ante clientes potenciales',
      'Una base técnica lista para crecer',
    ],
    examples: [
      'Sitio corporativo para una empresa de servicios',
      'Tienda en línea con catálogo, carrito y pagos',
      'Landing page para el lanzamiento de un producto o campaña',
    ],
  },
  {
    slug: 'apps',
    index: '02',
    title: 'Aplicaciones web y móviles',
    shortTitle: 'Plataformas, apps y portales',
    summary: 'Aplicaciones a la medida: plataformas web, apps móviles, portales de clientes y sistemas de reservas.',
    description:
      'Convertimos ideas y procesos en aplicaciones que la gente usa todos los días: desde un portal para tus clientes hasta una app móvil o una plataforma de reservas en línea.',
    capabilities: ['Apps web', 'Apps móviles', 'Portales de clientes', 'Reservas en línea', 'Pagos'],
    solves: [
      'Una idea de producto que aún no tiene una versión funcional.',
      'Clientes que dependen de llamadas o chats para cada solicitud.',
      'Procesos que hoy viven en hojas de cálculo y no escalan.',
    ],
    features: [
      'Diseño de la experiencia y prototipo antes de desarrollar',
      'Registro e inicio de sesión de usuarios con roles',
      'Reservas, agendamiento o pedidos en línea',
      'Pagos en línea y notificaciones por correo o WhatsApp',
      'Paneles para que tu equipo gestione la información',
      'Versión web y móvil desde una misma base',
    ],
    benefits: [
      'Tu idea convertida en un producto real',
      'Mejor experiencia para tus clientes',
      'Procesos que funcionan solos, a cualquier hora',
    ],
    examples: [
      'Motor de reservas para un alojamiento turístico',
      'Portal donde los clientes consultan y gestionan sus pedidos',
      'App móvil para agendar citas o servicios',
    ],
  },
  {
    slug: 'software',
    index: '03',
    title: 'Software a medida',
    shortTitle: 'Gestión, automatización e integraciones',
    summary: 'Sistemas de gestión, CRM, paneles administrativos, automatizaciones e integraciones hechos para tu operación.',
    description:
      'Desarrollamos el software interno que tu negocio necesita: clientes, ventas, inventario, reservas, equipo y reportes en un solo lugar, conectado con las herramientas que ya usas.',
    capabilities: ['Sistemas de gestión', 'CRM', 'Paneles administrativos', 'Automatizaciones', 'Integraciones'],
    solves: [
      'Gestión desorganizada entre hojas de cálculo, cuadernos y chats.',
      'Tareas manuales y repetitivas que consumen tiempo del equipo.',
      'Herramientas que no se comunican entre sí.',
    ],
    features: [
      'Panel administrativo con acceso seguro por roles',
      'Gestión de clientes, ventas, pedidos o reservas',
      'Reportes y tableros con los datos de tu negocio',
      'Automatización de notificaciones, recordatorios y seguimientos',
      'Integraciones con pasarelas de pago, correo y herramientas existentes',
      'Mantenimiento, soporte y nuevas funcionalidades',
    ],
    benefits: [
      'Información centralizada y confiable',
      'Operación diaria más ordenada',
      'Decisiones basadas en datos propios',
    ],
    examples: [
      'CRM para dar seguimiento a prospectos y cotizaciones',
      'Panel de gestión de reservas, tarifas y pagos para cabañas',
      'Automatización de correos de confirmación y recordatorio',
    ],
  },
  {
    slug: 'diseno',
    index: '04',
    title: 'Diseño de marca e interfaces',
    shortTitle: 'Identidad visual y UI/UX',
    summary: 'Logos, identidad visual, diseño de interfaces y prototipos para marcas y productos digitales.',
    description:
      'Diseñamos cómo se ve y cómo se siente tu marca: desde el logo y la identidad visual hasta las pantallas de tu sitio o aplicación, con prototipos que puedes probar antes de construir.',
    capabilities: ['Logo', 'Identidad visual', 'Diseño UI', 'Experiencia de usuario', 'Prototipos'],
    solves: [
      'Una marca sin identidad clara o poco profesional.',
      'Interfaces confusas que alejan a los usuarios.',
      'Ideas difíciles de explicar sin algo visual que mostrar.',
    ],
    features: [
      'Diseño de logo y sistema de identidad visual',
      'Paleta de color, tipografías y lineamientos de uso',
      'Diseño de interfaces para web y móvil',
      'Prototipos navegables para validar ideas',
      'Piezas para redes sociales y presentaciones',
    ],
    benefits: [
      'Una imagen coherente en todos tus canales',
      'Productos más fáciles de usar',
      'Menos cambios costosos durante el desarrollo',
    ],
    examples: [
      'Identidad visual completa para un emprendimiento',
      'Rediseño de la interfaz de una plataforma existente',
      'Prototipo de una app para presentar a inversionistas',
    ],
  },
]

const en: Service[] = [
  {
    slug: 'diseno-web',
    index: '01',
    title: 'Web design & development',
    shortTitle: 'Websites and online stores',
    summary: 'Corporate sites, landing pages, online stores and portfolios that are fast, responsive and search-engine optimized.',
    description:
      'We design and build websites tailored to each business: a digital presence that explains what you do, loads fast on any device and turns visitors into customers.',
    capabilities: ['Corporate sites', 'Landing pages', 'Online stores', 'Technical SEO', 'Performance'],
    solves: [
      'No professional digital presence of your own.',
      'Slow, outdated sites that are hard to use on a phone.',
      'Low search visibility compared to competitors.',
    ],
    features: [
      'Custom design aligned with your brand identity',
      'Responsive experience for mobile, tablet and desktop',
      'Product or service catalogs with photos and details',
      'WhatsApp, maps, forms and payment gateway integrations',
      'Technical SEO: metadata, structured data, sitemap and clean URLs',
      'Image optimization and Core Web Vitals best practices',
    ],
    benefits: [
      'A channel you own, independent of third parties',
      'A better first impression on potential customers',
      'A technical foundation ready to grow',
    ],
    examples: [
      'Corporate website for a services company',
      'Online store with catalog, cart and payments',
      'Landing page for a product launch or campaign',
    ],
  },
  {
    slug: 'apps',
    index: '02',
    title: 'Web & mobile apps',
    shortTitle: 'Platforms, apps and portals',
    summary: 'Custom applications: web platforms, mobile apps, customer portals and booking systems.',
    description:
      'We turn ideas and processes into applications people use every day: from a portal for your customers to a mobile app or an online booking platform.',
    capabilities: ['Web apps', 'Mobile apps', 'Customer portals', 'Online bookings', 'Payments'],
    solves: [
      'A product idea that doesn’t have a working version yet.',
      'Customers who rely on calls or chats for every request.',
      'Processes that live in spreadsheets and don’t scale.',
    ],
    features: [
      'Experience design and prototype before development',
      'User sign-up and sign-in with roles',
      'Online bookings, scheduling or orders',
      'Online payments and email or WhatsApp notifications',
      'Dashboards for your team to manage information',
      'Web and mobile versions from a single codebase',
    ],
    benefits: [
      'Your idea turned into a real product',
      'A better experience for your customers',
      'Processes that run on their own, around the clock',
    ],
    examples: [
      'Booking engine for a tourist accommodation',
      'Portal where customers check and manage their orders',
      'Mobile app to schedule appointments or services',
    ],
  },
  {
    slug: 'software',
    index: '03',
    title: 'Custom software',
    shortTitle: 'Management, automation and integrations',
    summary: 'Management systems, CRMs, admin dashboards, automations and integrations built around your operation.',
    description:
      'We develop the internal software your business needs: customers, sales, inventory, bookings, team and reports in one place, connected to the tools you already use.',
    capabilities: ['Management systems', 'CRM', 'Admin dashboards', 'Automation', 'Integrations'],
    solves: [
      'Operations scattered across spreadsheets, notebooks and chats.',
      'Manual, repetitive tasks that eat up your team’s time.',
      'Tools that don’t talk to each other.',
    ],
    features: [
      'Admin dashboard with secure role-based access',
      'Customer, sales, order or booking management',
      'Reports and dashboards with your business data',
      'Automated notifications, reminders and follow-ups',
      'Integrations with payment gateways, email and existing tools',
      'Maintenance, support and new features',
    ],
    benefits: [
      'Centralized, reliable information',
      'More organized day-to-day operations',
      'Decisions based on your own data',
    ],
    examples: [
      'CRM to follow up on leads and quotes',
      'Dashboard to manage bookings, rates and payments for cabins',
      'Automated confirmation and reminder emails',
    ],
  },
  {
    slug: 'diseno',
    index: '04',
    title: 'Brand & interface design',
    shortTitle: 'Visual identity and UI/UX',
    summary: 'Logos, visual identity, interface design and prototypes for brands and digital products.',
    description:
      'We design how your brand looks and feels: from the logo and visual identity to the screens of your website or app, with prototypes you can test before building.',
    capabilities: ['Logo', 'Visual identity', 'UI design', 'User experience', 'Prototypes'],
    solves: [
      'A brand without a clear or professional identity.',
      'Confusing interfaces that drive users away.',
      'Ideas that are hard to explain without something visual.',
    ],
    features: [
      'Logo design and visual identity system',
      'Color palette, typography and usage guidelines',
      'Interface design for web and mobile',
      'Clickable prototypes to validate ideas',
      'Assets for social media and presentations',
    ],
    benefits: [
      'A consistent image across all your channels',
      'Products that are easier to use',
      'Fewer costly changes during development',
    ],
    examples: [
      'Complete visual identity for a startup',
      'Interface redesign for an existing platform',
      'App prototype to pitch to investors',
    ],
  },
]

const pt: Service[] = [
  {
    slug: 'diseno-web',
    index: '01',
    title: 'Design e desenvolvimento web',
    shortTitle: 'Sites e lojas virtuais',
    summary: 'Sites institucionais, landing pages, lojas virtuais e portfólios rápidos, responsivos e otimizados para buscadores.',
    description:
      'Projetamos e construímos sites sob medida para cada negócio: uma presença digital que comunica o que você faz, carrega rápido em qualquer dispositivo e transforma visitas em clientes.',
    capabilities: ['Sites institucionais', 'Landing pages', 'Lojas virtuais', 'SEO técnico', 'Performance'],
    solves: [
      'Falta de uma presença digital profissional e própria.',
      'Sites lentos, desatualizados ou difíceis de usar no celular.',
      'Pouca visibilidade nos buscadores em relação à concorrência.',
    ],
    features: [
      'Design sob medida alinhado à identidade da sua marca',
      'Experiência responsiva pensada para celular, tablet e desktop',
      'Catálogos de produtos ou serviços com fotos e detalhes',
      'Integração com WhatsApp, mapas, formulários e meios de pagamento',
      'SEO técnico: metadados, dados estruturados, sitemap e URLs limpas',
      'Otimização de imagens e boas práticas de Core Web Vitals',
    ],
    benefits: [
      'Um canal próprio que não depende de terceiros',
      'Melhor primeira impressão para clientes em potencial',
      'Uma base técnica pronta para crescer',
    ],
    examples: [
      'Site institucional para uma empresa de serviços',
      'Loja virtual com catálogo, carrinho e pagamentos',
      'Landing page para o lançamento de um produto ou campanha',
    ],
  },
  {
    slug: 'apps',
    index: '02',
    title: 'Aplicativos web e mobile',
    shortTitle: 'Plataformas, apps e portais',
    summary: 'Aplicativos sob medida: plataformas web, apps mobile, portais de clientes e sistemas de reservas.',
    description:
      'Transformamos ideias e processos em aplicativos que as pessoas usam todos os dias: de um portal para seus clientes a um app mobile ou uma plataforma de reservas online.',
    capabilities: ['Apps web', 'Apps mobile', 'Portais de clientes', 'Reservas online', 'Pagamentos'],
    solves: [
      'Uma ideia de produto que ainda não tem uma versão funcional.',
      'Clientes que dependem de ligações ou chats para cada pedido.',
      'Processos que vivem em planilhas e não escalam.',
    ],
    features: [
      'Design da experiência e protótipo antes de desenvolver',
      'Cadastro e login de usuários com perfis de acesso',
      'Reservas, agendamentos ou pedidos online',
      'Pagamentos online e notificações por e-mail ou WhatsApp',
      'Painéis para sua equipe gerenciar as informações',
      'Versão web e mobile a partir da mesma base',
    ],
    benefits: [
      'Sua ideia transformada em um produto real',
      'Melhor experiência para seus clientes',
      'Processos que funcionam sozinhos, a qualquer hora',
    ],
    examples: [
      'Motor de reservas para uma hospedagem turística',
      'Portal onde os clientes consultam e gerenciam seus pedidos',
      'App mobile para agendar consultas ou serviços',
    ],
  },
  {
    slug: 'software',
    index: '03',
    title: 'Software sob medida',
    shortTitle: 'Gestão, automação e integrações',
    summary: 'Sistemas de gestão, CRM, painéis administrativos, automações e integrações feitos para a sua operação.',
    description:
      'Desenvolvemos o software interno de que seu negócio precisa: clientes, vendas, estoque, reservas, equipe e relatórios em um só lugar, conectado às ferramentas que você já usa.',
    capabilities: ['Sistemas de gestão', 'CRM', 'Painéis administrativos', 'Automações', 'Integrações'],
    solves: [
      'Gestão desorganizada entre planilhas, cadernos e chats.',
      'Tarefas manuais e repetitivas que tomam o tempo da equipe.',
      'Ferramentas que não se comunicam entre si.',
    ],
    features: [
      'Painel administrativo com acesso seguro por perfis',
      'Gestão de clientes, vendas, pedidos ou reservas',
      'Relatórios e dashboards com os dados do seu negócio',
      'Automação de notificações, lembretes e follow-ups',
      'Integrações com meios de pagamento, e-mail e ferramentas existentes',
      'Manutenção, suporte e novas funcionalidades',
    ],
    benefits: [
      'Informação centralizada e confiável',
      'Operação diária mais organizada',
      'Decisões baseadas em dados próprios',
    ],
    examples: [
      'CRM para acompanhar leads e orçamentos',
      'Painel de gestão de reservas, tarifas e pagamentos para chalés',
      'Automação de e-mails de confirmação e lembrete',
    ],
  },
  {
    slug: 'diseno',
    index: '04',
    title: 'Design de marca e interfaces',
    shortTitle: 'Identidade visual e UI/UX',
    summary: 'Logos, identidade visual, design de interfaces e protótipos para marcas e produtos digitais.',
    description:
      'Desenhamos como sua marca se apresenta e é percebida: do logo e da identidade visual às telas do seu site ou aplicativo, com protótipos que você pode testar antes de construir.',
    capabilities: ['Logo', 'Identidade visual', 'Design de UI', 'Experiência do usuário', 'Protótipos'],
    solves: [
      'Uma marca sem identidade clara ou pouco profissional.',
      'Interfaces confusas que afastam os usuários.',
      'Ideias difíceis de explicar sem algo visual para mostrar.',
    ],
    features: [
      'Design de logo e sistema de identidade visual',
      'Paleta de cores, tipografia e diretrizes de uso',
      'Design de interfaces para web e mobile',
      'Protótipos navegáveis para validar ideias',
      'Peças para redes sociais e apresentações',
    ],
    benefits: [
      'Uma imagem coerente em todos os seus canais',
      'Produtos mais fáceis de usar',
      'Menos mudanças caras durante o desenvolvimento',
    ],
    examples: [
      'Identidade visual completa para um empreendimento',
      'Redesign da interface de uma plataforma existente',
      'Protótipo de app para apresentar a investidores',
    ],
  },
]

const byLocale: Record<Locale, Service[]> = { es, en, pt }

export function getServices(locale: Locale): Service[] {
  return byLocale[locale]
}

export function getService(locale: Locale, slug: ServiceSlug): Service {
  const service = byLocale[locale].find((s) => s.slug === slug)
  if (!service) throw new Error(`Unknown service: ${slug}`)
  return service
}
