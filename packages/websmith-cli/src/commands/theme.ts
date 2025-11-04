import { Command } from 'commander'

export const themeCommand = new Command('theme')
  .description('Theme management commands')

const generateCommand = new Command('generate')
  .description('Generate a theme')
  .option('-p, --preset <preset>', 'theme preset')
  .action((options) => {
    console.log(`Generating theme with preset: ${options.preset}`)
    // TODO: Implement theme generation
  })

themeCommand.addCommand(generateCommand)