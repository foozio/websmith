import { AstroIntegration } from 'astro'

export interface WebsmithAstroOptions {
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
   * Default theme to use
   * @default 'light'
   */
  theme?: 'light' | 'dark'

  /**
   * Enable dark mode support
   * @default true
   */
  enableDarkMode?: boolean

  /**
   * CSS variable prefix
   * @default 'ws'
   */
  prefix?: string

  /**
   * Automatically inject CSS into pages
   * @default true
   */
  injectCSS?: boolean

  /**
   * Generate TypeScript types for tokens
   * @default false
   */
  generateTypes?: boolean

  /**
   * Custom CSS to include with tokens
   */
  customCSS?: string
}

export interface AstroConfigWithWebsmith extends AstroIntegration {
  name: '@websmith/astro'
  hooks: {
    'astro:config:setup': (options: {
      config: any
      command: string
      addWatchFile: (path: string) => void
      injectScript: (stage: string, content: string) => void
      updateConfig: (newConfig: any) => void
    }) => void | Promise<void>
    'astro:build:setup'?: (options: {
      vite: any
      pages: any[]
      target: string
    }) => void | Promise<void>
    'astro:server:setup'?: (options: {
      server: any
    }) => void | Promise<void>
    'astro:config:done'?: (options: {
      config: any
      setAdapter: (adapter: any) => void
    }) => void | Promise<void>
  }
}
