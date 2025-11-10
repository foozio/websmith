import { NextConfig } from 'next'

export interface WebsmithNextOptions {
  /**
   * Path to custom token configuration file
   * @default './tokens.config.js'
   */
  tokensPath?: string
  
  /**
   * Output file path for generated CSS
   * @default './src/styles/websmith.css'
   */
  outputPath?: string
  
  /**
   * Theme to use for token generation
   * @default 'light'
   */
  theme?: 'light' | 'dark'
  
  /**
   * Enable CSS variable injection
   * @default true
   */
  injectCSS?: boolean
  
  /**
   * Enable Tailwind CSS integration
   * @default true
   */
  enableTailwind?: boolean
  
  /**
   * CSS variable prefix
   * @default 'ws'
   */
  prefix?: string
  
  /**
   * Generate TypeScript types for tokens
   * @default false
   */
  generateTypes?: boolean
  
  /**
   * Enable dark mode support
   * @default true
   */
  enableDarkMode?: boolean
  
  /**
   * Custom CSS to inject with tokens
   */
  customCSS?: string
}

export interface WebsmithConfig extends NextConfig {
  websmith?: WebsmithNextOptions
}

export interface WebsmithTokens {
  colors: Record<string, any>
  spacing: Record<string, string>
  typography: Record<string, any>
  shadows: Record<string, string>
  borders: Record<string, any>
}
