export interface WebsmithViteOptions {
  /**
   * Path to custom token configuration file
   * @default './tokens.config.js'
   */
  tokensPath?: string
  
  /**
   * Output file path for generated CSS
   * @default './src/styles/tokens.css'
   */
  outputPath?: string
  
  /**
   * Enable file watching for token changes
   * @default true
   */
  watchFiles?: boolean
  
  /**
   * Export format for tokens
   * @default 'css'
   */
  format?: 'css' | 'json' | 'ts'
  
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
   * Custom theme configuration
   */
  theme?: string
  
  /**
   * Enable compression for production builds
   * @default true
   */
  compress?: boolean
}

export interface PluginContext {
  resolvedConfig: any
  server?: any
}
