/**
 * Internationalization (i18n) utilities for Websmith UI
 * Provides lightweight translation support for component labels and messages
 */

export type Locale = string

export interface TranslationMessages {
  [key: string]: string | TranslationMessages
}

export interface I18nConfig {
  locale: Locale
  messages: Record<Locale, TranslationMessages>
  fallbackLocale?: Locale
}

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj: any, path: string): string | undefined {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

/**
 * I18n manager class
 */
export class I18n {
  private locale: Locale
  private messages: Record<Locale, TranslationMessages>
  private fallbackLocale: Locale

  constructor(config: I18nConfig) {
    this.locale = config.locale
    this.messages = config.messages
    this.fallbackLocale = config.fallbackLocale || 'en'
  }

  /**
   * Get current locale
   */
  getLocale(): Locale {
    return this.locale
  }

  /**
   * Set current locale
   */
  setLocale(locale: Locale): void {
    if (!this.messages[locale]) {
      console.warn(`[I18n] Locale "${locale}" not found, using fallback`)
      this.locale = this.fallbackLocale
      return
    }
    this.locale = locale
  }

  /**
   * Add messages for a locale
   */
  addMessages(locale: Locale, messages: TranslationMessages): void {
    this.messages[locale] = {
      ...this.messages[locale],
      ...messages
    }
  }

  /**
   * Translate a key with optional interpolation
   */
  t(key: string, params?: Record<string, string | number>): string {
    // Try current locale
    let message = getNestedValue(this.messages[this.locale], key)

    // Fallback to fallback locale
    if (message === undefined && this.locale !== this.fallbackLocale) {
      message = getNestedValue(this.messages[this.fallbackLocale], key)
    }

    // Return key if no translation found
    if (message === undefined) {
      console.warn(`[I18n] Translation not found for key: ${key}`)
      return key
    }

    // Interpolate parameters
    if (params) {
      return Object.entries(params).reduce(
        (result, [param, value]) => result.replace(new RegExp(`\\{${param}\\}`, 'g'), String(value)),
        message
      )
    }

    return message
  }

  /**
   * Check if a translation exists
   */
  has(key: string): boolean {
    return getNestedValue(this.messages[this.locale], key) !== undefined ||
           getNestedValue(this.messages[this.fallbackLocale], key) !== undefined
  }

  /**
   * Get all available locales
   */
  getAvailableLocales(): Locale[] {
    return Object.keys(this.messages)
  }
}

/**
 * Default i18n instance
 */
let defaultI18n: I18n | null = null

/**
 * Initialize default i18n instance
 */
export function initI18n(config: I18nConfig): I18n {
  defaultI18n = new I18n(config)
  return defaultI18n
}

/**
 * Get default i18n instance
 */
export function getI18n(): I18n {
  if (!defaultI18n) {
    throw new Error('[I18n] Not initialized. Call initI18n() first.')
  }
  return defaultI18n
}

/**
 * Translate using default instance
 */
export function t(key: string, params?: Record<string, string | number>): string {
  return getI18n().t(key, params)
}

/**
 * Format number based on locale
 */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  const locale = defaultI18n?.getLocale() || 'en'
  return new Intl.NumberFormat(locale, options).format(value)
}

/**
 * Format date based on locale
 */
export function formatDate(date: Date | number, options?: Intl.DateTimeFormatOptions): string {
  const locale = defaultI18n?.getLocale() || 'en'
  return new Intl.DateTimeFormat(locale, options).format(date)
}

/**
 * Format relative time based on locale
 */
export function formatRelativeTime(value: number, unit: Intl.RelativeTimeFormatUnit): string {
  const locale = defaultI18n?.getLocale() || 'en'
  return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(value, unit)
}

/**
 * Pluralization helper
 */
export function plural(
  count: number,
  options: { zero?: string; one: string; other: string }
): string {
  if (count === 0 && options.zero) return options.zero
  if (count === 1) return options.one
  return options.other
}
