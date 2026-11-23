import { notFound } from 'next/navigation'

/** Cualquier URL desconocida dentro de un idioma muestra el 404 traducido. */
export default function CatchAllPage() {
  notFound()
}
