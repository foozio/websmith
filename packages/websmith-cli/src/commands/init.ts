import { Command } from 'commander'

export const initCommand = new Command('init')
  .description('Initialize a new Websmith Kit project')
  .argument('<name>', 'project name')
  .action((name) => {
    console.log(`Initializing Websmith Kit project: ${name}`)
    // TODO: Implement project initialization
  })