import { Command } from 'commander'

export const buildCommand = new Command('build')
  .description('Build the component library')
  .action(() => {
    console.log('Building component library...')
    // TODO: Implement build command
  })