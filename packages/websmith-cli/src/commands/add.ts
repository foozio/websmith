import { Command } from 'commander'

export const addCommand = new Command('add')
  .description('Add components to your project')
  .argument('<components...>', 'component names')
  .action((components) => {
    console.log(`Adding components: ${components.join(', ')}`)
    // TODO: Implement component addition
  })