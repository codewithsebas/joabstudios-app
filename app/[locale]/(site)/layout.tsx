import { Footer } from '@/components/site/footer'
import { Navbar } from '@/components/site/navbar'

export default function SiteLayout({ children }: LayoutProps<'/[locale]'>) {
  return (
    <>
      <Navbar />
      <main id="contenido" className="min-h-[60vh]">
        {children}
      </main>
      <Footer />
    </>
  )
}
