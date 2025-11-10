// Main exports
export { WebsmithThemeProvider, createWebsmithTheme, extendWebsmithTheme, useWebsmithTheme } from './theme'

// Utility functions
export {
  token,
  getTokenValue,
  getColor,
  getSpacing,
  getShadow,
  getBorder,
  getTypography,
  responsive,
  transition,
  focusRing,
  truncate,
  flex,
  grid,
  absolute,
  size,
  borderRadius,
  boxShadow,
  textAlign,
  fontSize,
  fontWeight
} from './utils'

// Types
export type {
  WebsmithStyledTheme,
  WebsmithThemeProviderProps,
  WebsmithThemeContextValue,
  TokenFunction,
  ThemeHelper,
  StyledComponentTheme,
  ThemeColors,
  ThemeSpacing,
  ThemeTypography,
  ThemeShadows,
  ThemeBorders,
  TokenValue,
  TokenPath
} from './types'

// Re-export styled-components utilities for convenience
export { css, styled, keyframes, createGlobalStyle, ThemeProvider } from 'styled-components'
