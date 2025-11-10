import { Plugin } from 'vite'
import { TokenGenerator } from './generator'
import type { WebsmithViteOptions } from './types'
import { resolve } from 'path'

export interface WebsmithVitePlugin extends Plugin {
  name: 'websmith-vite'
}

export function websmith(options: WebsmithViteOptions = {}): WebsmithVitePlugin {
  let generator: TokenGenerator
  let root: string

  return {
    name: 'websmith-vite',
    
    configResolved(config) {
      root = config.root
      generator = new TokenGenerator(options, root)
    },

    async buildStart() {
      try {
        await generator.writeTokens()
        
        // Add virtual module for hot module replacement
        this.addWatchFile(resolve(root, options.outputPath || './src/styles/tokens.css'))
      } catch (error) {
        this.warn(`Failed to generate Websmith tokens: ${error}`)
      }
    },

    configureServer(server) {
      if (options.watchFiles !== false) {
        const tokensPath = resolve(root, options.tokensPath || './tokens.config.js')
        const outputPath = resolve(root, options.outputPath || './src/styles/tokens.css')
        
        // Use Vite's built-in watcher
        server.watcher.add([tokensPath, outputPath])
        
        server.watcher.on('change', async (path: string) => {
          try {
            await generator.writeTokens()
            
            // Trigger full page reload for changes
            server.ws.send({ type: 'full-reload' })
          } catch (error) {
            console.error(`Failed to regenerate tokens: ${error}`)
          }
        })
      }
    },

    buildEnd() {
      // Cleanup handled by Vite's built-in watcher
    },

    // Generate CSS during build
    async generateBundle() {
      if (options.format === 'css') {
        try {
          const css = await generator.generateTokens()
          const outputPath = options.outputPath || './src/styles/tokens.css'
          
          this.emitFile({
            type: 'asset',
            fileName: outputPath.replace(/^\.\/src\//, ''),
            source: css
          })
        } catch (error) {
          this.warn(`Failed to emit CSS bundle: ${error}`)
        }
      }
    },

    // Handle imports to generated files
    resolveId(id: string) {
      if (id.startsWith('websmith:tokens')) {
        return '\0websmith:tokens'
      }
      return null
    },

    async load(id: string) {
      if (id === '\0websmith:tokens') {
        try {
          const content = await generator.generateTokens()
          
          if (options.format === 'css') {
            return `export default \`${content}\`;`
          } else if (options.format === 'json') {
            return `export default ${content};`
          } else if (options.format === 'ts') {
            return content
          }
        } catch (error) {
          return `export default "/* Error generating tokens: ${error} */";`
        }
      }
      return null
    }
  }
}

export default websmith

// Export types for consumers
export type { WebsmithViteOptions } from './types'
