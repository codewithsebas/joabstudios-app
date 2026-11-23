import type { Locale } from '@/i18n/routing'

/**
 * Editorial photography (Unsplash License). Centralized so it can be swapped
 * for JoabStudios's own photography without touching components.
 * These are atmosphere images, never presented as screenshots of client work.
 */

export type EditorialImage = {
  src: string
  alt: string
  width: number
  height: number
  credit: string
}

type ImageKey = 'heroCabin' | 'hillsideHouse' | 'boutiqueRoom' | 'aFrame'

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80`

const files: Record<ImageKey, Omit<EditorialImage, 'alt'>> = {
  heroCabin: { src: unsplash('photo-1724931282671-2d3bcd6de8f2'), width: 2400, height: 1600, credit: 'Unsplash' },
  hillsideHouse: { src: unsplash('photo-1698994705178-d244d73ea573'), width: 1800, height: 2084, credit: 'Unsplash' },
  boutiqueRoom: { src: unsplash('photo-1731336478850-6bce7235e320'), width: 2400, height: 1600, credit: 'Unsplash' },
  aFrame: { src: unsplash('photo-1785960184129-e70f4eaa8fd2'), width: 1800, height: 2400, credit: 'Unsplash' },
}

const alts: Record<Locale, Record<ImageKey, string>> = {
  es: {
    heroCabin: 'Cabaña contemporánea de madera oscura con ventanales iluminados al atardecer, rodeada de bosque',
    hillsideHouse: 'Casa de arquitectura contemporánea sobre una ladera rocosa rodeada de vegetación',
    boutiqueRoom: 'Habitación de hotel boutique con cabecero escultórico de madera y luz cálida',
    aFrame: 'Cabaña en forma de A con fachada de vidrio en un claro del bosque',
  },
  en: {
    heroCabin: 'Contemporary dark-wood cabin with lit windows at dusk, surrounded by forest',
    hillsideHouse: 'Contemporary house on a rocky hillside surrounded by greenery',
    boutiqueRoom: 'Boutique hotel room with a sculptural wooden headboard and warm light',
    aFrame: 'A-frame cabin with a glass façade in a forest clearing',
  },
  pt: {
    heroCabin: 'Cabana contemporânea de madeira escura com janelas iluminadas ao entardecer, cercada de floresta',
    hillsideHouse: 'Casa de arquitetura contemporânea em uma encosta rochosa cercada de vegetação',
    boutiqueRoom: 'Quarto de hotel boutique com cabeceira escultural de madeira e luz quente',
    aFrame: 'Cabana em formato A com fachada de vidro em uma clareira da floresta',
  },
}

export function getEditorialImages(locale: Locale): Record<ImageKey, EditorialImage> {
  return Object.fromEntries(
    (Object.keys(files) as ImageKey[]).map((key) => [key, { ...files[key], alt: alts[locale][key] }]),
  ) as Record<ImageKey, EditorialImage>
}
