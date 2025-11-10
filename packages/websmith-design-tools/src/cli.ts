#!/usr/bin/env node

import { Command } from 'commander'
import chalk from 'chalk'
import { exportTokens, validateTokenFile } from './index.js'
import { resolve } from 'path'
import { readFileSync, existsSync } from 'fs'

const program = new Command()

program
  .name('websmith-design')
  .description('CLI tool for Websmith design token synchronization')
  .version('1.0.0')

program
  .command('export')
  .description('Export design tokens to design tool format')
  .argument('<format>', 'Export format (sketch, figma, xd, json)')
  .argument('<output>', 'Output file path')
  .option('-t, --theme <theme>', 'Theme to export (light, dark)', 'light')
  .option('-p, --prefix <prefix>', 'CSS variable prefix', 'ws')
  .option('--include-metadata', 'Include metadata in export', true)
  .action(async (format, output, options) => {
    try {
      const outputPath = resolve(output)
      console.log(chalk.blue(`Exporting ${options.theme} theme to ${format} format...`))

      exportTokens(format as any, outputPath, {
        theme: options.theme as 'light' | 'dark',
        prefix: options.prefix,
        includeMetadata: options.includeMetadata
      })

      console.log(chalk.green(`✅ Successfully exported to ${outputPath}`))
    } catch (error) {
      console.error(chalk.red('❌ Export failed:'), error instanceof Error ? error.message : String(error))
      process.exit(1)
    }
  })

program
  .command('validate')
  .description('Validate a token file')
  .argument('<file>', 'Token file to validate')
  .action((file) => {
    try {
      const filePath = resolve(file)

      if (!existsSync(filePath)) {
        console.error(chalk.red(`❌ File not found: ${filePath}`))
        process.exit(1)
      }

      console.log(chalk.blue(`Validating ${file}...`))
      const result = validateTokenFile(filePath)

      if (result.isValid) {
        console.log(chalk.green('✅ Token file is valid'))
      } else {
        console.log(chalk.red('❌ Token file has errors:'))
        result.errors.forEach(error => console.log(chalk.red(`  - ${error}`)))
      }

      if (result.warnings.length > 0) {
        console.log(chalk.yellow('⚠️ Warnings:'))
        result.warnings.forEach(warning => console.log(chalk.yellow(`  - ${warning}`)))
      }

      if (result.suggestions.length > 0) {
        console.log(chalk.blue('💡 Suggestions:'))
        result.suggestions.forEach(suggestion => console.log(chalk.blue(`  - ${suggestion}`)))
      }
    } catch (error) {
      console.error(chalk.red('❌ Validation failed:'), error instanceof Error ? error.message : String(error))
      process.exit(1)
    }
  })

program
  .command('info')
  .description('Show information about available formats and themes')
  .action(() => {
    console.log(chalk.bold.blue('Websmith Design Tools'))
    console.log()
    console.log(chalk.bold('Supported Export Formats:'))
    console.log('  sketch    - Sketch shared styles (.sketch)')
    console.log('  figma     - Figma variables (.json)')
    console.log('  xd        - Adobe XD styles (.json)')
    console.log('  json      - Generic JSON format')
    console.log()
    console.log(chalk.bold('Available Themes:'))
    console.log('  light     - Light theme tokens')
    console.log('  dark      - Dark theme tokens')
    console.log()
    console.log(chalk.bold('Usage Examples:'))
    console.log('  websmith-design export sketch ./tokens.sketch')
    console.log('  websmith-design export figma ./figma-variables.json --theme dark')
    console.log('  websmith-design validate ./tokens.json')
  })

program.parse()
