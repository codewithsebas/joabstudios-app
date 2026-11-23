import type { routing } from '@/i18n/routing'
import type messages from './messages/es.json'

// Tipado estricto de next-intl: idiomas válidos y claves de mensajes (es.json es la referencia).
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
  }
}
