import React from 'react'
import { themes } from '@websmith/tokens'

export interface WebsmithStyledTheme {
  colors: Record<string, string>
  spacing: Record<string, string>
  typography: Record<string, any>
  shadows: Record<string, string>
  borders: Record<string, any>
  breakpoints?: Record<string, string>
}

export interface WebsmithThemeProviderProps {
  theme?: 'light' | 'dark' | WebsmithStyledTheme
  children: React.ReactNode
  enableCSSVariables?: boolean
  cssVariablePrefix?: string
}

export interface WebsmithThemeContextValue {
  theme: WebsmithStyledTheme
  setTheme: (theme: WebsmithStyledTheme | 'light' | 'dark') => void
  toggleTheme: () => void
}

export interface TokenFunction {
  (path: string): string
  colors: Record<string, string>
  spacing: Record<string, string>
  typography: Record<string, any>
  shadows: Record<string, string>
  borders: Record<string, any>
}

export interface ThemeHelper {
  token: TokenFunction
  getToken: (path: string) => string
  getColor: (colorName: string) => string
  getSpacing: (spacingName: string) => string
  getShadow: (shadowName: string) => string
  getBorder: (borderName: string) => string
  getTypography: (typographyName: string) => any
}

export interface StyledComponentTheme extends WebsmithStyledTheme {
  websmith: ThemeHelper
}

// Utility types for theme extensions
export type ThemeColors = typeof themes.light
export type ThemeSpacing = Record<string, string>
export type ThemeTypography = Record<string, any>
export type ThemeShadows = Record<string, string>
export type ThemeBorders = Record<string, any>

// Template literal helper types
export type TokenValue<T extends string> = T extends keyof WebsmithStyledTheme
  ? WebsmithStyledTheme[T]
  : string

export type TokenPath = string
