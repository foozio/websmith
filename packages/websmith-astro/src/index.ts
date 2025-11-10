import type { AstroIntegration } from 'astro'
import { websmith } from '@websmith/vite'
import { exportToCSSVariables, exportToJSON, themes } from '@websmith/tokens'
import type { WebsmithAstroOptions } from './types'
import { promises as fs } from 'fs'
import { resolve, dirname } from 'path'

export function websmithAstro(options: WebsmithAstroOptions = {}): AstroIntegration {
  const {
    tokensPath = './tokens.config.js',
    outputPath = './src/styles/websmith.css',
    theme = 'light',
    enableDarkMode = true,
    prefix = 'ws',
    injectCSS = true,
    generateTypes = false,
    customCSS = ''
  } = options

  let root: string

  return {
    name: '@websmith/astro',
    hooks: {
      'astro:config:setup'({ config, command, addWatchFile, updateConfig }) {
        root = config.root

        // Add the Websmith Vite plugin to the Vite config
        updateConfig({
          vite: {
            plugins: [
              websmith({
                tokensPath: resolve(root, tokensPath),
                outputPath: resolve(root, outputPath),
                theme,
                prefix,
                watchFiles: command === 'dev'
              })
            ]
          }
        })

        // Watch token files in development
        if (command === 'dev') {
          addWatchFile(resolve(root, tokensPath))
        }

        // Inject CSS if enabled
        if (injectCSS) {
          // This will be handled by the Vite plugin
        }
      },

      'astro:build:setup'({ vite }) {
        // Generate tokens during build
        generateTokens(root, {
          tokensPath,
          outputPath,
          theme,
          enableDarkMode,
          prefix,
          generateTypes,
          customCSS
        })
      },

      'astro:server:setup'({ server }) {
        // Add token file watching in development
        server.watcher.add(resolve(root, tokensPath))
        server.watcher.on('change', (file) => {
          if (file === resolve(root, tokensPath)) {
            generateTokens(root, {
              tokensPath,
              outputPath,
              theme,
              enableDarkMode,
              prefix,
              generateTypes,
              customCSS
            })
          }
        })
      },

      'astro:config:done'({ config }) {
        // Validate configuration
        if (injectCSS && !config.vite?.plugins?.some((p: any) => p.name === 'websmith-vite')) {
          console.warn('[Websmith] Vite plugin not found in configuration. Make sure to add it manually if needed.')
        }
      }
    }
  }
}

async function generateTokens(
  root: string,
  options: {
    tokensPath: string
    outputPath: string
    theme: string
    enableDarkMode: boolean
    prefix: string
    generateTypes: boolean
    customCSS: string
  }
) {
  try {
    const {
      tokensPath,
      outputPath,
      theme,
      enableDarkMode,
      prefix,
      generateTypes,
      customCSS
    } = options

    // Generate CSS
    const themeTokens = themes[theme as keyof typeof themes] || themes.light
    let css = exportToCSSVariables()

    // Apply custom prefix
    if (prefix !== 'ws') {
      css = css.replace(/--ws-/g, `--${prefix}-`)
    }

    // Add dark mode support
    if (enableDarkMode) {
      const darkTheme = themes.dark
      css += '\n\n[data-theme="dark"], .dark {\n'
      Object.entries(darkTheme).forEach(([key, value]) => {
        css += `  --${prefix}-${key}: ${value};\n`
      })
      css += '}\n'
    }

    // Add custom CSS
    if (customCSS) {
      css += '\n\n' + customCSS
    }

    // Write CSS file
    const cssPath = resolve(root, outputPath)
    await fs.mkdir(dirname(cssPath), { recursive: true })
    await fs.writeFile(cssPath, css, 'utf-8')

    // Generate TypeScript types if enabled
    if (generateTypes) {
      const types = generateTypeScriptTypes(themeTokens, prefix)
      const typesPath = resolve(root, './src/types/websmith.ts')
      await fs.mkdir(dirname(typesPath), { recursive: true })
      await fs.writeFile(typesPath, types, 'utf-8')
    }
  } catch (error) {
    console.error('[Websmith] Failed to generate tokens:', error)
  }
}

function generateTypeScriptTypes(theme: any, prefix: string): string {
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

export default websmithAstro
