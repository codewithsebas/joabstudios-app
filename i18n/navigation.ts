import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

/** Link, router y helpers que conocen el idioma y las URL traducidas. */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
