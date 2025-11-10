import { generateOptimizedCSS, colors, spacing, typography } from '@websmith/tokens'
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
  } = pluginOptions

  // Validate configuration
  const program = store.getState().program
  const tokensConfigPath = path.resolve(program.directory, tokensPath)

  if (!fs.existsSync(tokensConfigPath)) {
    console.warn(`Websmith tokens config not found at ${tokensConfigPath}`)
    return
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
    prefix = 'ws',
    customCSS = ''
  } = pluginOptions

  const program = store.getState().program
  const cssOutputPath = path.resolve(program.directory, outputPath)

  try {
    // Use default token exports to generate CSS
    const tokens = {
      colors,
      spacing,
      typography
    }

    // Generate CSS variables
    const result = generateOptimizedCSS(tokens, {
      prefix,
      includeTheme: true,
      minify: false
    })

    // Combine with custom CSS
    const fullCSS = `${result.css}\n\n${customCSS}`.trim()

    // Ensure output directory exists
    const cssOutputDir = path.dirname(cssOutputPath)
    if (!fs.existsSync(cssOutputDir)) {
      fs.mkdirSync(cssOutputDir, { recursive: true })
    }

    // Write CSS file
    fs.writeFileSync(cssOutputPath, fullCSS, 'utf8')
    console.log(`Websmith CSS generated at ${cssOutputPath} (${result.stats.variableCount} variables)`)

  } catch (error) {
    console.error('Failed to generate Websmith tokens:', error)
    throw error
  }
}
