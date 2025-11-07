/**
 * React context and hooks for i18n
 */

import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'
import { I18n, type I18nConfig, type Locale, type TranslationMessages } from './index'

interface I18nContextValue {
  i18n: I18n
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export interface I18nProviderProps {
  children: ReactNode
  config: I18nConfig
}

/**
 * I18n Provider Component
 * Wraps your app to provide i18n functionality
 */
export function I18nProvider({ children, config }: I18nProviderProps) {
  const [i18n] = useState(() => new I18n(config))
  const [locale, setLocaleState] = useState(config.locale)

  const setLocale = useCallback((newLocale: Locale) => {
    i18n.setLocale(newLocale)
    setLocaleState(newLocale)
  }, [i18n])

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    return i18n.t(key, params)
  }, [i18n, locale]) // Re-create when locale changes

  const value = useMemo(() => ({
    i18n,
    locale,
    setLocale,
    t
  }), [i18n, locale, setLocale, t])

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

/**
 * Hook to access i18n context
 */
export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

/**
 * Hook for translation
 */
export function useTranslation() {
  const { t, locale, setLocale, i18n } = useI18n()
  
  return {
    t,
    locale,
    setLocale,
    i18n
  }
}

/**
 * Hook for formatted numbers
 */
export function useFormattedNumber(value: number, options?: Intl.NumberFormatOptions): string {
  const { locale } = useI18n()
  return useMemo(() => {
    return new Intl.NumberFormat(locale, options).format(value)
  }, [value, locale, options])
}

/**
 * Hook for formatted dates
 */
export function useFormattedDate(date: Date | number, options?: Intl.DateTimeFormatOptions): string {
  const { locale } = useI18n()
  return useMemo(() => {
    return new Intl.DateTimeFormat(locale, options).format(date)
  }, [date, locale, options])
}

/**
 * Hook for formatted relative time
 */
export function useFormattedRelativeTime(value: number, unit: Intl.RelativeTimeFormatUnit): string {
  const { locale } = useI18n()
  return useMemo(() => {
    return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(value, unit)
  }, [value, unit, locale])
}

/**
 * HOC to inject i18n props
 */
export function withI18n<P extends object>(
  Component: React.ComponentType<P & { t: (key: string, params?: Record<string, string | number>) => string }>
) {
  return function WithI18nComponent(props: P) {
    const { t } = useTranslation()
    return <Component {...props} t={t} />
  }
}

/**
 * Component for conditional rendering based on locale
 */
export interface LocaleMatchProps {
  locale: Locale | Locale[]
  children: ReactNode
  fallback?: ReactNode
}

export function LocaleMatch({ locale: matchLocale, children, fallback = null }: LocaleMatchProps) {
  const { locale } = useI18n()
  
  const matches = Array.isArray(matchLocale)
    ? matchLocale.includes(locale)
    : locale === matchLocale
  
  return matches ? <>{children}</> : <>{fallback}</>
}

/**
 * Component for displaying translated text
 */
export interface TransProps {
  i18nKey: string
  params?: Record<string, string | number>
  fallback?: string
}

export function Trans({ i18nKey, params, fallback }: TransProps) {
  const { t } = useTranslation()
  const text = t(i18nKey, params)
  
  if (text === i18nKey && fallback) {
    return <>{fallback}</>
  }
  
  return <>{text}</>
}
