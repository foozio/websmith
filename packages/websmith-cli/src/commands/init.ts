import { Command } from 'commander'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { validateProjectName, sanitizeInput, ValidationError } from '../utils/security'
import { ErrorHandler, FileSystemError } from '../utils/error-handler'

export const initCommand = new Command('init')
  .description('Initialize a new Websmith Kit project')
  .argument('<name>', 'project name (lowercase, hyphens allowed)')
  .option('-t, --template <template>', 'project template', 'default')
  .option('-d, --directory <directory>', 'output directory', '.')
  .action(async (name: string, options: { template: string; directory: string }) => {
    ErrorHandler.wrap(async () => {
      // Validate inputs
      if (!validateProjectName(name)) {
        throw new ValidationError(
          'Invalid project name. Use lowercase letters, numbers, hyphens, and underscores only. Examples: my-project, my_app, project123'
        )
      }

      // Sanitize and validate directory
      const directory = sanitizeInput(options.directory)
      ErrorHandler.validatePath(directory, 'project initialization')

      // Validate template
      const template = sanitizeInput(options.template)
      ErrorHandler.validateConfig('template', template, 'string', 'project initialization')

      // Create project directory
      const projectPath = join(process.cwd(), directory, name)
      
      if (existsSync(projectPath)) {
        throw new FileSystemError(`Directory already exists`, projectPath)
      }

      ErrorHandler.wrapSync(() => {
        mkdirSync(projectPath, { recursive: true })
      }, 'creating project directory')

      // Create package.json
      const packageJson = {
        name: name,
        version: '0.1.0',
        private: true,
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
          lint: 'next lint'
        },
        dependencies: {
          next: '^14.0.0',
          react: '^18.0.0',
          'react-dom': '^18.0.0',
          '@websmith/ui': '^1.0.0',
          '@websmith/theme': '^1.0.0',
          '@websmith/tokens': '^1.0.0',
          tailwindcss: '^3.0.0',
          autoprefixer: '^10.0.0',
          postcss: '^8.0.0'
        },
        devDependencies: {
          '@types/node': '^20.0.0',
          '@types/react': '^18.0.0',
          '@types/react-dom': '^18.0.0',
          eslint: '^8.0.0',
          'eslint-config-next': '^14.0.0',
          typescript: '^5.0.0'
        }
      }

      ErrorHandler.wrapSync(() => {
        writeFileSync(join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2))
      }, 'creating package.json')

      // Create Next.js config
      const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
`

      ErrorHandler.wrapSync(() => {
        writeFileSync(join(projectPath, 'next.config.js'), nextConfig)
      }, 'creating Next.js config')

      // Create TypeScript config
      const tsConfig = {
        compilerOptions: {
          target: 'es5',
          lib: ['dom', 'dom.iterable', 'es6'],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          forceConsistentCasingInFileNames: true,
          noEmit: true,
          esModuleInterop: true,
          module: 'esnext',
          moduleResolution: 'node',
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: 'preserve',
          incremental: true,
          plugins: [{ name: 'next' }],
          paths: { '@/*': ['./src/*'] }
        },
        include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
        exclude: ['node_modules']
      }

      ErrorHandler.wrapSync(() => {
        writeFileSync(join(projectPath, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2))
      }, 'creating TypeScript config')

      // Create basic app structure
      const srcDir = join(projectPath, 'src')
      ErrorHandler.wrapSync(() => {
        mkdirSync(srcDir, { recursive: true })
      }, 'creating src directory')

      // Create pages directory
      const pagesDir = join(projectPath, 'pages')
      ErrorHandler.wrapSync(() => {
        mkdirSync(pagesDir, { recursive: true })
      }, 'creating pages directory')

      // Create basic page
      const indexPage = `import { Button } from '@websmith/ui'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome to ${name}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          This is a new Websmith Kit project.
        </p>
        <Button variant="default">
          Get Started
        </Button>
      </main>
    </div>
  )
}

export default Home
`

      ErrorHandler.wrapSync(() => {
        writeFileSync(join(pagesDir, 'index.tsx'), indexPage)
      }, 'creating index page')

      // Create global styles
      const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`

      ErrorHandler.wrapSync(() => {
        writeFileSync(join(srcDir, 'styles', 'globals.css'), globalsCss)
      }, 'creating global styles')

      // Create README
      const readme = `# ${name}

A new Websmith Kit project.

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Learn More

To learn more about Websmith Kit, visit [the documentation](https://websmith.dev/docs).
`

      ErrorHandler.wrapSync(() => {
        writeFileSync(join(projectPath, 'README.md'), readme)
      }, 'creating README')

      console.log(`✅ Successfully initialized ${name} project`)
      console.log(`📁 Project created at: ${projectPath}`)
      console.log(`🚀 Next steps:`)
      console.log(`   cd ${name}`)
      console.log(`   npm install`)
      console.log(`   npm run dev`)

    }, 'project initialization')
  })