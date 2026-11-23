import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { ToastProvider } from '@/components/admin/ui/toast'
import { fontVariables } from '@/lib/fonts'
import es from '@/messages/es.json'
import { siteConfig } from '@/lib/site-config'
import '../globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: 'CRM', template: '%s · CRM JoabStudios' },
  robots: { index: false, follow: false, nocache: true },
}

export const viewport: Viewport = {
  themeColor: '#172d29',
  width: 'device-width',
  initialScale: 1,
}

// Every admin route depends on the signed-in session; navigations are allowed
// to wait on the server for it.
export const instant = false

/** Layout raíz del CRM interno (solo en español; separado del sitio multilingüe). */
export default function AdminLayout({ children }: LayoutProps<'/admin'>) {
  return (
    <html lang="es" className={`${fontVariables} antialiased`}>
      <body className="min-h-dvh">
        {/* Los campos de formulario compartidos con el sitio usan next-intl; el CRM va siempre en español. */}
        <NextIntlClientProvider locale="es" timeZone="America/Bogota" messages={{ Common: es.Common }}>
          <ToastProvider>
            <div className="min-h-dvh bg-ivory font-ui">{children}</div>
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
