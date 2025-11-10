import { exportToCSSVariables, exportToJSON, generateOptimizedCSS, themes } from '@websmith/tokens'
import type { WebsmithViteOptions } from './types'
import { promises as fs } from 'fs'
import { resolve, dirname } from 'path'

export class TokenGenerator {
  private options: Required<WebsmithViteOptions>
  private root: string

  constructor(options: WebsmithViteOptions = {}, root: string = process.cwd()) {
    this.root = root
    this.options = {
      tokensPath: options.tokensPath || './tokens.config.js',
      outputPath: options.outputPath || './src/styles/tokens.css',
      watchFiles: options.watchFiles ?? true,
      format: options.format || 'css',
      prefix: options.prefix || 'ws',
      generateTypes: options.generateTypes ?? false,
      theme: options.theme || 'light',
      compress: options.compress ?? true,
    }
  }

  async generateTokens(): Promise<string> {
    const theme = themes[this.options.theme as keyof typeof themes] || themes.light
    
    switch (this.options.format) {
      case 'css':
        return this.generateCSS(theme)
      case 'json':
        return this.generateJSON(theme)
      case 'ts':
        return this.generateTypeScript(theme)
      default:
        throw new Error(`Unsupported format: ${this.options.format}`)
    }
  }

  private generateCSS(theme: any): string {
    let css = ''
    
    if (this.options.compress && process.env.NODE_ENV === 'production') {
      const result = generateOptimizedCSS(theme, {
        prefix: this.options.prefix,
        minify: true,
        sourceMap: false
      })
      css = result.css
    } else {
      css = exportToCSSVariables()
      if (this.options.prefix !== 'ws') {
        css = css.replace(/--ws-/g, `--${this.options.prefix}-`)
      }
    }
    
    return css
  }

  private generateJSON(theme: any): string {
    return exportToJSON(theme, { pretty: true })
  }

  private generateTypeScript(theme: any): string {
    const interfaces = this.generateTypeScriptInterfaces(theme)
    const constants = this.generateTypeScriptConstants(theme)
    
    return `// Generated Websmith Token Types
${interfaces}

// Generated Websmith Token Constants
${constants}

export default tokens
`
  }

  private generateTypeScriptInterfaces(theme: any): string {
    const interfaces: string[] = []
    
    Object.entries(theme).forEach(([category, tokens]) => {
      if (typeof tokens === 'object' && tokens !== null) {
        const interfaceName = `${this.capitalize(category)}Tokens`
        const properties = Object.entries(tokens as Record<string, any>)
          .map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
              const nestedProps = Object.entries(value as Record<string, any>)
                .map(([nestedKey, nestedValue]) => 
                  `  ${nestedKey}: ${typeof nestedValue === 'string' ? 'string' : typeof nestedValue};`
                ).join('\n')
              return `  ${key}: {\n${nestedProps}\n  };`
            }
            return `  ${key}: ${typeof value};`
          })
          .join('\n')
        
        interfaces.push(`export interface ${interfaceName} {\n${properties}\n}`)
      }
    })
    
    return interfaces.join('\n\n')
  }

  private generateTypeScriptConstants(theme: any): string {
    const constants: string[] = []
    
    Object.entries(theme).forEach(([category, tokens]) => {
      if (typeof tokens === 'object' && tokens !== null) {
        const constantName = `${category}Tokens`
        constants.push(`export const ${constantName} = ${JSON.stringify(tokens, null, 2)} as const`)
      }
    })
    
    return constants.join('\n\n')
  }

  async writeTokens(): Promise<void> {
    const content = await this.generateTokens()
    const outputPath = resolve(this.root, this.options.outputPath)
    
    await fs.mkdir(dirname(outputPath), { recursive: true })
    await fs.writeFile(outputPath, content, 'utf-8')
  }

  async loadCustomTokens(): Promise<any> {
    try {
      const tokensPath = resolve(this.root, this.options.tokensPath)
      const tokensModule = await import(tokensPath)
      return tokensModule.default || tokensModule
    } catch (error) {
      // No custom tokens found, use defaults
      return null
    }
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
}
