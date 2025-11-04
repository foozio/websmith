#!/usr/bin/env node

import { Command } from 'commander'
import { initCommand } from './commands/init'
import { addCommand } from './commands/add'
import { themeCommand } from './commands/theme'
import { tokensCommand } from './commands/tokens'
import { buildCommand } from './commands/build'

const program = new Command()

program
  .name('websmith')
  .description('Websmith Kit CLI')
  .version('0.0.0')

program.addCommand(initCommand)
program.addCommand(addCommand)
program.addCommand(themeCommand)
program.addCommand(tokensCommand)
program.addCommand(buildCommand)

program.parse()