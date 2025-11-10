/**
 * Export all available locales
 */

export { en } from './en'
export { es } from './es'
export { fr } from './fr'

import { en } from './en'
import { es } from './es'
import { fr } from './fr'

/**
 * Default locales bundle
 */
export const defaultLocales = {
  en,
  es,
  fr
}

/**
 * Get locale by code
 */
export function getLocale(code: string) {
  return defaultLocales[code as keyof typeof defaultLocales]
}

/**
 * Get all available locale codes
 */
export function getAvailableLocales(): string[] {
  return Object.keys(defaultLocales)
}
