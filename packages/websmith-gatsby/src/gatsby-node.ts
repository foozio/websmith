import { generateTokens } from '@websmith/tokens'
import * as fs from 'fs'
import * as path from 'path'

interface PluginOptions {
  tokensPath?: string
  outputPath?: string
  theme?: string
  enableDarkMode?: boolean
  prefix?: string
  generateTypes?: boolean
  customCSS?: string
}

export async function onPreBootstrap(
  { store }: any,
  pluginOptions: PluginOptions = {}
) {
  const {
    tokensPath = './tokens.config.js',
    outputPath = './src/styles/websmith.css',
    theme = 'light',
    enableDarkMode = true,
    prefix = 'ws',
    generateTypes = false,
    customCSS = ''
  } = pluginOptions

  // Validate configuration
  const program = store.getState().program
  const tokensConfigPath = path.resolve(program.directory, tokensPath)

  if (!fs.existsSync(tokensConfigPath)) {
    console.warn(`Websmith tokens config not found at ${tokensConfigPath}`)
    return
  }

  // Generate CSS output path
  const cssOutputPath = path.resolve(program.directory, outputPath)
  const cssOutputDir = path.dirname(cssOutputPath)

  // Ensure output directory exists
  if (!fs.existsSync(cssOutputDir)) {
    fs.mkdirSync(cssOutputDir, { recursive: true })
  }

  console.log('Websmith Gatsby plugin initialized')
}

export async function onPreBuild(
  { store }: any,
  pluginOptions: PluginOptions = {}
) {
  const {
    tokensPath = './tokens.config.js',
    outputPath = './src/styles/websmith.css',
    theme = 'light',
    enableDarkMode = true,
    prefix = 'ws',
    generateTypes = false,
    customCSS = ''
  } = pluginOptions

  const program = store.getState().program
  const tokensConfigPath = path.resolve(program.directory, tokensPath)
  const cssOutputPath = path.resolve(program.directory, outputPath)

  try {
    // Load tokens configuration
    const tokensConfig = require(tokensConfigPath)

    // Generate CSS variables
    const cssVariables = generateTokens(tokensConfig, {
      theme,
      enableDarkMode,
      prefix,
      format: 'css'
    })

    // Combine with custom CSS
    const fullCSS = `${cssVariables}\n\n${customCSS}`.trim()

    // Write CSS file
    fs.writeFileSync(cssOutputPath, fullCSS, 'utf8')
    console.log(`Websmith CSS generated at ${cssOutputPath}`)

    // Generate TypeScript types if requested
    if (generateTypes) {
      const typesOutputPath = cssOutputPath.replace('.css', '.d.ts')
      const types = generateTokens(tokensConfig, {
        theme,
        enableDarkMode,
        prefix,
        format: 'typescript'
      })

      fs.writeFileSync(typesOutputPath, types, 'utf8')
      console.log(`Websmith TypeScript types generated at ${typesOutputPath}`)
    }

  } catch (error) {
    console.error('Failed to generate Websmith tokens:', error)
    throw error
  }
}
