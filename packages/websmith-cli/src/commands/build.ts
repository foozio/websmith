import { Command } from 'commander'
import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { sanitizeInput, ValidationError } from '../utils/security'

export const buildCommand = new Command('build')
  .description('Build your Websmith Kit project')
  .option('-w, --watch', 'enable watch mode', false)
  .option('-a, --analyze', 'analyze bundle size', false)
  .option('-m, --mode <mode>', 'build mode (development, production)', 'production')
  .action((options) => {
    try {
      // Sanitize inputs
      const mode = sanitizeInput(options.mode)

      if (!['development', 'production'].includes(mode)) {
        console.error('❌ Invalid mode. Use development or production')
        process.exit(1)
      }

      // Check if we're in a valid project
      if (!existsSync('package.json')) {
        console.error('❌ Not in a Node.js project. Please run this command in a project directory.')
        process.exit(1)
      }

      console.log(`🔨 Building project in ${mode} mode...`)

      // Build based on available scripts
      const packageJson = JSON.parse(require('fs').readFileSync('package.json', 'utf8'))
      
      if (packageJson.scripts?.build) {
        // Use project's build script
        const buildCommand = options.watch ? 'npm run build -- --watch' : 'npm run build'
        console.log(`📦 Running: ${buildCommand}`)
        
        try {
          execSync(buildCommand, { stdio: 'inherit' })
          console.log('✅ Build completed successfully!')
        } catch (error) {
          console.error('❌ Build failed')
          process.exit(1)
        }
      } else {
        // Default build commands for different frameworks
        if (existsSync('next.config.js')) {
          console.log('📦 Detected Next.js project')
          const nextCommand = options.watch 
            ? `npx next build --watch` 
            : `npx next build`
          execSync(nextCommand, { stdio: 'inherit' })
        } else if (existsSync('vite.config.ts') || existsSync('vite.config.js')) {
          console.log('📦 Detected Vite project')
          const viteCommand = options.watch 
            ? `npx vite build --watch` 
            : `npx vite build`
          execSync(viteCommand, { stdio: 'inherit' })
        } else if (existsSync('webpack.config.js')) {
          console.log('📦 Detected Webpack project')
          const webpackCommand = options.watch 
            ? `npx webpack --watch` 
            : `npx webpack`
          execSync(webpackCommand, { stdio: 'inherit' })
        } else {
          console.log('📦 No specific framework detected, using TypeScript compiler')
          const tscCommand = `npx tsc --outDir dist`
          execSync(tscCommand, { stdio: 'inherit' })
        }
      }

      // Bundle analysis if requested
      if (options.analyze) {
        console.log('📊 Analyzing bundle size...')
        try {
          execSync('npx webpack-bundle-analyzer dist/static/js/*.js', { stdio: 'inherit' })
        } catch (error) {
          console.log('⚠️  Bundle analysis not available. Install webpack-bundle-analyzer to use this feature.')
        }
      }

      console.log('🎉 Build process completed!')

    } catch (error) {
      if (error instanceof ValidationError) {
        console.error(`❌ Validation error: ${error.message}`)
      } else {
        console.error('❌ Build failed:', error)
      }
      process.exit(1)
    }
  })