import React, { createContext, useContext, useEffect, useState } from 'react'
import { WebsmithNextGenerator } from './index'
import type { WebsmithTokens, WebsmithNextOptions } from './types'

interface WebsmithContextValue {
  tokens: WebsmithTokens
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
}

const WebsmithContext = createContext<WebsmithContextValue | undefined>(undefined)

export interface WebsmithProviderProps {
  children: React.ReactNode
  defaultTheme?: 'light' | 'dark'
  enableSystem?: boolean
  storageKey?: string
  options?: WebsmithNextOptions
}

export function WebsmithProvider({
  children,
  defaultTheme = 'light',
  enableSystem = true,
  storageKey = 'websmith-theme',
  options = {}
}: WebsmithProviderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>(defaultTheme)
  const [tokens, setTokens] = useState<WebsmithTokens>({} as WebsmithTokens)

  useEffect(() => {
    const generator = new WebsmithNextGenerator({ ...options, theme })
    generator.getTokens().then(setTokens)
  }, [theme, options])

  useEffect(() => {
    if (enableSystem && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? 'dark' : 'light')
      }
      
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [enableSystem])

  const handleSetTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, newTheme)
      document.documentElement.setAttribute('data-theme', newTheme)
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }
  }

  const value = {
    tokens,
    theme,
    setTheme: handleSetTheme
  }

  return (
    <WebsmithContext.Provider value={value}>
      {children}
    </WebsmithContext.Provider>
  )
}

export function useWebsmithTokens() {
  const context = useContext(WebsmithContext)
  if (context === undefined) {
    throw new Error('useWebsmithTokens must be used within a WebsmithProvider')
  }
  return context
}
