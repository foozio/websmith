import React, { createContext, useContext, useState, useEffect } from 'react'
import { ThemeProvider } from 'styled-components'
import { themes } from '@websmith/tokens'
import type {
  WebsmithThemeProviderProps,
  WebsmithThemeContextValue,
  WebsmithStyledTheme,
  StyledComponentTheme,
  ThemeHelper
} from './types'

const WebsmithThemeContext = createContext<WebsmithThemeContextValue | undefined>(undefined)

export function useWebsmithTheme(): WebsmithThemeContextValue {
  const context = useContext(WebsmithThemeContext)
  if (!context) {
    throw new Error('useWebsmithTheme must be used within a WebsmithThemeProvider')
  }
  return context
}

function createThemeHelper(theme: WebsmithStyledTheme): ThemeHelper {
  const getToken = (path: string): string => {
    const keys = path.split('.')
    let value: any = theme

    for (const key of keys) {
      value = value?.[key]
    }

    return typeof value === 'string' ? value : ''
  }

  const token: any = getToken
  token.colors = theme.colors
  token.spacing = theme.spacing
  token.typography = theme.typography
  token.shadows = theme.shadows
  token.borders = theme.borders

  return {
    token,
    getToken,
    getColor: (colorName: string) => theme.colors[colorName] || '',
    getSpacing: (spacingName: string) => theme.spacing[spacingName] || '',
    getShadow: (shadowName: string) => theme.shadows[shadowName] || '',
    getBorder: (borderName: string) => theme.borders[borderName] || '',
    getTypography: (typographyName: string) => theme.typography[typographyName] || {}
  }
}

function createStyledTheme(theme: WebsmithStyledTheme): StyledComponentTheme {
  return {
    ...theme,
    websmith: createThemeHelper(theme)
  }
}

function normalizeTheme(theme: 'light' | 'dark' | WebsmithStyledTheme): WebsmithStyledTheme {
  if (typeof theme === 'string') {
    const baseTheme = themes[theme]
    if (!baseTheme) {
      throw new Error(`Theme "${theme}" not found. Available themes: light, dark`)
    }
    return {
      colors: baseTheme,
      spacing: {},
      typography: {},
      shadows: {},
      borders: {}
    }
  }

  return theme
}

function injectCSSVariables(
  theme: WebsmithStyledTheme,
  prefix: string = 'ws',
  enableDarkMode: boolean = true
): void {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  const lightVars: Record<string, string> = {}
  const darkVars: Record<string, string> = {}

  // Process colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVar = `--${prefix}-${key}`
    lightVars[cssVar] = value

    // For dark mode, we could apply transformations here
    // For now, just use the same values
    if (enableDarkMode) {
      darkVars[cssVar] = value
    }
  })

  // Apply light theme variables
  Object.entries(lightVars).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })

  // Set up data attribute for theme switching
  root.setAttribute('data-theme', 'light')
}

export function WebsmithThemeProvider({
  theme: initialTheme = 'light',
  children,
  enableCSSVariables = true,
  cssVariablePrefix = 'ws'
}: WebsmithThemeProviderProps) {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() =>
    typeof initialTheme === 'string' ? initialTheme : 'light'
  )
  const [theme, setThemeState] = useState<WebsmithStyledTheme>(() =>
    normalizeTheme(initialTheme)
  )

  const setTheme = (newTheme: WebsmithStyledTheme | 'light' | 'dark') => {
    const normalizedTheme = normalizeTheme(newTheme)
    setThemeState(normalizedTheme)

    // Update theme mode if a string was passed
    if (typeof newTheme === 'string') {
      setThemeMode(newTheme)
    }

    if (enableCSSVariables) {
      injectCSSVariables(normalizedTheme, cssVariablePrefix)
    }
  }

  const toggleTheme = () => {
    const newThemeMode = themeMode === 'light' ? 'dark' : 'light'
    setThemeMode(newThemeMode)
    setTheme(newThemeMode)
  }

  const contextValue: WebsmithThemeContextValue = {
    theme,
    setTheme,
    toggleTheme
  }

  const styledTheme = createStyledTheme(theme)

  useEffect(() => {
    if (enableCSSVariables) {
      injectCSSVariables(theme, cssVariablePrefix)
    }
  }, [theme, enableCSSVariables, cssVariablePrefix])

  return (
    <WebsmithThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={styledTheme}>
        {children}
      </ThemeProvider>
    </WebsmithThemeContext.Provider>
  )
}

// Export theme creation utilities
export function createWebsmithTheme(
  baseTheme: 'light' | 'dark' = 'light',
  overrides: Partial<WebsmithStyledTheme> = {}
): WebsmithStyledTheme {
  const base = normalizeTheme(baseTheme)
  return {
    ...base,
    ...overrides,
    colors: { ...base.colors, ...overrides.colors },
    spacing: { ...base.spacing, ...overrides.spacing },
    typography: { ...base.typography, ...overrides.typography },
    shadows: { ...base.shadows, ...overrides.shadows },
    borders: { ...base.borders, ...overrides.borders }
  }
}

export function extendWebsmithTheme(
  baseTheme: WebsmithStyledTheme,
  extensions: Partial<WebsmithStyledTheme>
): WebsmithStyledTheme {
  return {
    ...baseTheme,
    ...extensions,
    colors: { ...baseTheme.colors, ...extensions.colors },
    spacing: { ...baseTheme.spacing, ...extensions.spacing },
    typography: { ...baseTheme.typography, ...extensions.typography },
    shadows: { ...baseTheme.shadows, ...extensions.shadows },
    borders: { ...baseTheme.borders, ...extensions.borders }
  }
}
