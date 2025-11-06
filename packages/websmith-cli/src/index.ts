#!/usr/bin/env node

import { Command } from 'commander'
import { readFileSync } from 'fs'
import { initCommand } from './commands/init'
import { addCommand } from './commands/add'
import { themeCommand } from './commands/theme'
import { tokensCommand } from './commands/tokens'
import { buildCommand } from './commands/build'

const program = new Command()

// Get version from package.json
let version = '1.0.0'
try {
  const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'))
  version = packageJson.version || '1.0.0'
} catch {
  // Fallback version if package.json is not available
}

program
  .name('websmith')
  .description('Websmith Kit CLI - Modern design system tooling')
  .version(version)

// Add all commands
program.addCommand(initCommand)
program.addCommand(addCommand)
program.addCommand(themeCommand)
program.addCommand(tokensCommand)
program.addCommand(buildCommand)

// Global error handling
program.on('command:*', (operands) => {
  console.error(`❌ Unknown command: ${operands[0]}`)
  console.log('Available commands: init, add, theme, tokens, build')
  console.log('Use --help for more information')
  process.exit(1)
})

// Parse command line arguments
program.parse()