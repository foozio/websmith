import { exportToCSSVariables, exportToJSON, themes } from '@websmith/tokens'
import type { WebsmithNextOptions, WebsmithTokens } from './types'
import { promises as fs } from 'fs'
import { resolve, dirname } from 'path'

export class WebsmithNextGenerator {
  private options: Required<WebsmithNextOptions>
  private root: string

  constructor(options: WebsmithNextOptions = {}, root: string = process.cwd()) {
    this.root = root
    this.options = {
      tokensPath: options.tokensPath || './tokens.config.js',
      outputPath: options.outputPath || './src/styles/websmith.css',
      theme: options.theme || 'light',
      injectCSS: options.injectCSS ?? true,
      enableTailwind: options.enableTailwind ?? true,
      prefix: options.prefix || 'ws',
      generateTypes: options.generateTypes ?? false,
      enableDarkMode: options.enableDarkMode ?? true,
      customCSS: options.customCSS || '',
    }
  }

  async generateCSS(): Promise<string> {
    const theme = themes[this.options.theme as keyof typeof themes] || themes.light
    let css = exportToCSSVariables()
    
    // Apply custom prefix
    if (this.options.prefix !== 'ws') {
      css = css.replace(/--ws-/g, `--${this.options.prefix}-`)
    }
    
    // Add dark mode support
    if (this.options.enableDarkMode) {
      const darkTheme = themes.dark
      css += '\n\n[data-theme="dark"], .dark {\n'
      Object.entries(darkTheme).forEach(([key, value]) => {
        css += `  --${this.options.prefix}-${key}: ${value};\n`
      })
      css += '}\n'
    }
    
    // Add custom CSS
    if (this.options.customCSS) {
      css += '\n\n' + this.options.customCSS
    }
    
    return css
  }

  async generateTypeScriptTypes(): Promise<string> {
    const theme = themes[this.options.theme as keyof typeof themes] || themes.light
    
    const interfaces = `
// Generated Websmith Token Types
export interface WebsmithTokenColors {
  ${Object.entries(theme).map(([key, value]) => `${key}: string;`).join('\n  ')}
}

export interface WebsmithTokens {
  colors: WebsmithTokenColors
  spacing: Record<string, string>
  typography: Record<string, any>
  shadows: Record<string, string>
  borders: Record<string, any>
}

export const websmithTokens: WebsmithTokens = ${JSON.stringify(theme, null, 2)} as const
`
    
    return interfaces
  }

  async writeTokens(): Promise<void> {
    if (this.options.injectCSS) {
      const css = await this.generateCSS()
      const outputPath = resolve(this.root, this.options.outputPath)
      
      await fs.mkdir(dirname(outputPath), { recursive: true })
      await fs.writeFile(outputPath, css, 'utf-8')
    }
    
    if (this.options.generateTypes) {
      const types = await this.generateTypeScriptTypes()
      const typesPath = resolve(this.root, './src/types/websmith.ts')
      
      await fs.mkdir(dirname(typesPath), { recursive: true })
      await fs.writeFile(typesPath, types, 'utf-8')
    }
  }

  async getTokens(): Promise<WebsmithTokens> {
    const theme = themes[this.options.theme as keyof typeof themes] || themes.light
    return {
      colors: theme,
      spacing: {},
      typography: {},
      shadows: {},
      borders: {}
    }
  }
}

// Helper for static generation
export async function getWebsmithTokens(options?: WebsmithNextOptions): Promise<WebsmithTokens> {
  const generator = new WebsmithNextGenerator(options)
  return generator.getTokens()
}

export type { WebsmithNextOptions, WebsmithTokens }
