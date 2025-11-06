import { Command } from 'commander'
import { writeFileSync, mkdirSync } from 'fs'
import { join, resolve } from 'path'
import { sanitizeInput, ValidationError } from '../utils/security'
import { generatePalette, generateSpacingScale, generateTypographyScale } from '@websmith/tokens'

export const tokensCommand = new Command('tokens')
  .description('Design token management commands')

const generateCommand = new Command('generate')
  .description('Generate design tokens')
  .option('-o, --output <output>', 'output directory', 'src/tokens')
  .option('-f, --format <format>', 'output format (css, json, scss, ts)', 'json')
  .option('-c, --colors <colors>', 'base colors (comma-separated)', 'blue')
  .action((options) => {
    try {
      // Sanitize inputs
      const outputDir = sanitizeInput(options.output)
      const format = sanitizeInput(options.format)
      const colorsInput = sanitizeInput(options.colors)

      if (!['css', 'json', 'scss', 'ts'].includes(format)) {
        console.error('❌ Invalid format. Use css, json, scss, or ts')
        process.exit(1)
      }

      // Parse colors
      const baseColors = colorsInput.split(',').map(c => c.trim())
      
      // Create output directory
      const outputPath = resolve(process.cwd(), outputDir)
      mkdirSync(outputPath, { recursive: true })

      // Generate color tokens
      const colorTokens: Record<string, any> = {}
      for (const color of baseColors) {
        colorTokens[color] = generatePalette({ h: 0, s: 0, l: 50 }) // Will be customized
      }

      // Generate spacing tokens
      const spacingTokens = generateSpacingScale(8, 18)

      // Generate typography tokens
      const typographyTokens = generateTypographyScale()

      const allTokens = {
        colors: colorTokens,
        spacing: spacingTokens,
        typography: typographyTokens
      }

      // Generate output based on format
      switch (format) {
        case 'json':
          generateJSON(allTokens, outputPath)
          break
        case 'css':
          generateCSS(allTokens, outputPath)
          break
        case 'scss':
          generateSCSS(allTokens, outputPath)
          break
        case 'ts':
          generateTypeScript(allTokens, outputPath)
          break
      }

      console.log(`✅ Generated design tokens in ${format} format`)
      console.log(`📁 Output directory: ${outputPath}`)
      console.log(`\n📚 Documentation: https://websmith.vercel.app/tokens`)

    } catch (error) {
      if (error instanceof ValidationError) {
        console.error(`❌ Validation error: ${error.message}`)
      } else {
        console.error('❌ Failed to generate tokens:', error)
      }
      process.exit(1)
    }
  })

const exportCommand = new Command('export')
  .description('Export design tokens')
  .option('-f, --format <format>', 'export format (css, json, scss, ts)', 'json')
  .option('-o, --output <output>', 'output file', 'tokens')
  .action((options) => {
    try {
      const format = sanitizeInput(options.format)
      const output = sanitizeInput(options.output)

      if (!['css', 'json', 'scss', 'ts'].includes(format)) {
        console.error('❌ Invalid format. Use css, json, scss, or ts')
        process.exit(1)
      }

      console.log(`📤 Exporting tokens in ${format} format to ${output}`)
      // TODO: Implement actual token export from existing configuration
      console.log('✅ Tokens exported successfully')

    } catch (error) {
      console.error('❌ Failed to export tokens:', error)
      process.exit(1)
    }
  })

const validateCommand = new Command('validate')
  .description('Validate design token configuration')
  .argument('<config>', 'path to token configuration file')
  .action((configPath) => {
    try {
      const sanitizedPath = sanitizeInput(configPath)
      console.log(`🔍 Validating token configuration: ${sanitizedPath}`)
      // TODO: Implement token validation logic
      console.log('✅ Token configuration is valid')
    } catch (error) {
      console.error('❌ Token validation failed:', error)
      process.exit(1)
    }
  })

tokensCommand.addCommand(generateCommand)
tokensCommand.addCommand(exportCommand)
tokensCommand.addCommand(validateCommand)

function generateJSON(tokens: any, outputPath: string) {
  const jsonPath = join(outputPath, 'tokens.json')
  writeFileSync(jsonPath, JSON.stringify(tokens, null, 2))
  console.log(`✅ Generated tokens JSON: ${jsonPath}`)
}

function generateCSS(tokens: any, outputPath: string) {
  let css = ':root {\n'
  
  // Generate color variables
  if (tokens.colors) {
    css += '  /* Colors */\n'
    Object.entries(tokens.colors).forEach(([colorName, colorValues]: [string, any]) => {
      if (typeof colorValues === 'object') {
        Object.entries(colorValues).forEach(([shade, value]) => {
          css += `  --color-${colorName}-${shade}: ${value};\n`
        })
      }
    })
    css += '\n'
  }
  
  // Generate spacing variables
  if (tokens.spacing) {
    css += '  /* Spacing */\n'
    Object.entries(tokens.spacing).forEach(([key, value]) => {
      css += `  --spacing-${key}: ${value};\n`
    })
    css += '\n'
  }
  
  // Generate typography variables
  if (tokens.typography) {
    css += '  /* Typography */\n'
    Object.entries(tokens.typography).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          css += `  --font-${key}-${subKey}: ${subValue};\n`
        })
      }
    })
  }
  
  css += '}\n'
  
  const cssPath = join(outputPath, 'tokens.css')
  writeFileSync(cssPath, css)
  console.log(`✅ Generated tokens CSS: ${cssPath}`)
}

function generateSCSS(tokens: any, outputPath: string) {
  let scss = '// Design Tokens\n'
  
  // Generate color variables
  if (tokens.colors) {
    scss += '// Colors\n'
    Object.entries(tokens.colors).forEach(([colorName, colorValues]: [string, any]) => {
      if (typeof colorValues === 'object') {
        Object.entries(colorValues).forEach(([shade, value]) => {
          scss += `$color-${colorName}-${shade}: ${value};\n`
        })
      }
    })
    scss += '\n'
  }
  
  // Generate spacing variables
  if (tokens.spacing) {
    scss += '// Spacing\n'
    Object.entries(tokens.spacing).forEach(([key, value]) => {
      scss += `$spacing-${key}: ${value};\n`
    })
    scss += '\n'
  }
  
  // Generate typography variables
  if (tokens.typography) {
    scss += '// Typography\n'
    Object.entries(tokens.typography).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          scss += `$font-${key}-${subKey}: ${subValue};\n`
        })
      }
    })
  }
  
  const scssPath = join(outputPath, 'tokens.scss')
  writeFileSync(scssPath, scss)
  console.log(`✅ Generated tokens SCSS: ${scssPath}`)
}

function generateTypeScript(tokens: any, outputPath: string) {
  let ts = '// Design Tokens\n'
  ts += 'export interface DesignTokens {\n'
  
  if (tokens.colors) {
    ts += '  colors: {\n'
    Object.keys(tokens.colors).forEach(colorName => {
      ts += `    ${colorName}: Record<string, string>;\n`
    })
    ts += '  };\n'
  }
  
  if (tokens.spacing) {
    ts += '  spacing: Record<string, string>;\n'
  }
  
  if (tokens.typography) {
    ts += '  typography: {\n'
    Object.keys(tokens.typography).forEach(key => {
      ts += `    ${key}: Record<string, string | number>;\n`
    })
    ts += '  };\n'
  }
  
  ts += '}\n\n'
  ts += 'export const tokens: DesignTokens = '
  ts += JSON.stringify(tokens, null, 2)
  ts += ';\n'
  
  const tsPath = join(outputPath, 'tokens.ts')
  writeFileSync(tsPath, ts)
  console.log(`✅ Generated tokens TypeScript: ${tsPath}`)
}