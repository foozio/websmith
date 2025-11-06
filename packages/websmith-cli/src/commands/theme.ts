import { Command } from 'commander'
import { writeFileSync, mkdirSync } from 'fs'
import { join, resolve } from 'path'
import { validateThemePreset, sanitizeInput, ValidationError } from '../utils/security'
import { modernPreset, classicPreset, minimalPreset, brandPreset } from '@websmith/theme'

export const themeCommand = new Command('theme')
  .description('Theme management commands')

const generateCommand = new Command('generate')
  .description('Generate theme files for your project')
  .option('-p, --preset <preset>', 'theme preset (modern, classic, minimal, brand)', 'modern')
  .option('-o, --output <output>', 'output directory', 'src/styles')
  .option('-f, --format <format>', 'output format (css, json, both)', 'css')
  .action((options) => {
    try {
      // Validate theme preset
      const preset = sanitizeInput(options.preset)
      if (!validateThemePreset(preset)) {
        console.error('❌ Invalid theme preset')
        console.error('   Available presets: modern, classic, minimal, brand')
        process.exit(1)
      }

      // Sanitize output directory
      const outputDir = sanitizeInput(options.output)
      const format = sanitizeInput(options.format)

      if (!['css', 'json', 'both'].includes(format)) {
        console.error('❌ Invalid format. Use css, json, or both')
        process.exit(1)
      }

      // Get the selected preset
      let selectedPreset
      switch (preset) {
        case 'modern':
          selectedPreset = modernPreset
          break
        case 'classic':
          selectedPreset = classicPreset
          break
        case 'minimal':
          selectedPreset = minimalPreset
          break
        case 'brand':
          selectedPreset = brandPreset
          break
        default:
          console.error('❌ Theme preset not implemented yet')
          process.exit(1)
      }

      // Create output directory
      const outputPath = resolve(process.cwd(), outputDir)
      mkdirSync(outputPath, { recursive: true })

      // Generate CSS file
      if (format === 'css' || format === 'both') {
        const cssContent = generateThemeCSS(selectedPreset)
        const cssPath = join(outputPath, 'theme.css')
        writeFileSync(cssPath, cssContent)
        console.log(`✅ Generated theme CSS: ${cssPath}`)
      }

      // Generate JSON file
      if (format === 'json' || format === 'both') {
        const jsonContent = JSON.stringify(selectedPreset.config, null, 2)
        const jsonPath = join(outputPath, 'theme.json')
        writeFileSync(jsonPath, jsonContent)
        console.log(`✅ Generated theme JSON: ${jsonPath}`)
      }

      // Generate Tailwind config extension
      const tailwindExtension = generateTailwindExtension(selectedPreset)
      const tailwindPath = join(outputPath, 'tailwind.theme.js')
      writeFileSync(tailwindPath, tailwindExtension)
      console.log(`✅ Generated Tailwind extension: ${tailwindPath}`)

      console.log(`\n🎨 Successfully generated ${preset} theme!`)
      console.log(`\n📝 Next steps:`)
      console.log(`   1. Import the CSS file in your app:`)
      console.log(`      import '${outputDir}/theme.css'`)
      console.log(`   2. Extend your Tailwind config:`)
      console.log(`      const theme = require('./${outputDir}/tailwind.theme.js')`)
      console.log(`      module.exports = { ...theme, ...yourConfig }`)
      console.log(`\n📚 Documentation: https://websmith.vercel.app/theming`)

    } catch (error) {
      if (error instanceof ValidationError) {
        console.error(`❌ Validation error: ${error.message}`)
      } else {
        console.error('❌ Failed to generate theme:', error)
      }
      process.exit(1)
    }
  })

const listCommand = new Command('list')
  .description('List available theme presets')
  .action(() => {
    console.log('🎨 Available theme presets:')
    console.log('')
    console.log('  modern    - Blue-based primary colors with clean design')
    console.log('  classic   - Warm yellow-based theme with traditional feel')
    console.log('  minimal   - Monochromatic grayscale design')
    console.log('  brand     - Green-based brand colors')
    console.log('')
    console.log('Usage: websmith theme generate --preset <preset>')
  })

themeCommand.addCommand(generateCommand)
themeCommand.addCommand(listCommand)

function generateThemeCSS(preset: any): string {
  const { colors, spacing, typography, shadows, borders } = preset.config
  
  let css = `:root {\n`
  
  // Generate color variables
  if (colors) {
    css += `  /* Colors */\n`
    Object.entries(colors).forEach(([colorName, colorValues]: [string, any]) => {
      if (typeof colorValues === 'object') {
        Object.entries(colorValues).forEach(([shade, value]) => {
          css += `  --color-${colorName}-${shade}: ${value};\n`
        })
      } else {
        css += `  --color-${colorName}: ${colorValues};\n`
      }
    })
    css += `\n`
  }
  
  // Generate spacing variables
  if (spacing) {
    css += `  /* Spacing */\n`
    Object.entries(spacing).forEach(([key, value]) => {
      css += `  --spacing-${key}: ${value};\n`
    })
    css += `\n`
  }
  
  // Generate typography variables
  if (typography) {
    css += `  /* Typography */\n`
    Object.entries(typography).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          css += `  --font-${key}-${subKey}: ${subValue};\n`
        })
      } else {
        css += `  --font-${key}: ${value};\n`
      }
    })
    css += `\n`
  }
  
  // Generate shadow variables
  if (shadows) {
    css += `  /* Shadows */\n`
    Object.entries(shadows).forEach(([key, value]) => {
      css += `  --shadow-${key}: ${value};\n`
    })
    css += `\n`
  }
  
  // Generate border variables
  if (borders) {
    css += `  /* Borders */\n`
    Object.entries(borders).forEach(([key, value]) => {
      css += `  --border-${key}: ${value};\n`
    })
  }
  
  css += `}\n`
  
  return css
}

function generateTailwindExtension(preset: any): string {
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: ${JSON.stringify(preset.config, null, 6)}
  }
}
`
}