import { cacheLife } from 'next/cache'

/** Año actual, cacheado por días (con Cache Components no se puede leer la hora en cada render). */
export async function CurrentYear() {
  'use cache'
  cacheLife('days')
  return <>{new Date().getFullYear()}</>
}
