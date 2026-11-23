type ClassValue = string | false | null | undefined

/** Joins truthy class names. Intentionally tiny: the design system avoids conflicting utilities. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}
