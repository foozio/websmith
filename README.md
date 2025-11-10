  # Websmith Kit v1.2.0

  "Forge interfaces with finesse. Now with ecosystem-wide integration."

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)](https://github.com/foozio/websmith/releases)

  Websmith Kit is a comprehensive design system and component library for building modern web applications. It provides a complete set of UI components, design tokens, theming tools, and **ecosystem integrations** to help you create consistent and beautiful interfaces across all major web frameworks.

  ## Features

  - 🎨 **Component Library**: 30+ production-ready React components
  - 🎯 **Design Tokens**: Comprehensive token system with multiple export formats
  - 🎭 **Theme Builder**: Customizable themes with real-time preview
  - 🌐 **Ecosystem Integration**: Zero-config integration with major web frameworks
  - 🛠️ **Framework Support**: Native integrations for Vite, Next.js, Gatsby, Astro
  - 🎨 **CSS Framework Integration**: Styled Components support with TypeScript
  - 🎨 **Design Tool Export**: CLI tools for Sketch, Figma, and Adobe XD
  - 📚 **Documentation**: Complete guides and API references
  - 🎮 **Interactive Playground**: Experiment with components and themes
  - 🛠️ **CLI Tool**: Scaffold projects and manage components
  - ⚡ **Developer Tools**: VS Code extension and ESLint rules for enhanced DX
  - 🔧 **TypeScript Support**: Auto-generated declarations for better IDE support

  ## What's New in v1.2.0

  **🚀 Major Release: Ecosystem Integration**

  This release introduces comprehensive integration capabilities across the modern web development ecosystem:

  ### ✨ New Framework Integrations
  - **Vite Plugin** (`@websmith/vite`) - Zero-config token generation for Vite projects
  - **Next.js Integration** (`@websmith/nextjs`) - SSR-ready integration with automatic token injection
  - **Gatsby Plugin** (`@websmith/gatsby`) - Build-time token generation for static sites
  - **Astro Integration** (`@websmith/astro`) - Multi-framework support with Vite integration

  ### 🎨 CSS Framework Support
  - **Styled Components** (`@websmith/styled-components`) - TypeScript-first theme integration with full IntelliSense support

  ### 🎯 Design Tool Export
  - **Design Tools CLI** (`@websmith/design-tools`) - Export Websmith tokens to Sketch, Figma, and Adobe XD formats

  ### 🔧 Developer Experience
  - Enhanced TypeScript support across all integrations
  - Zero-config setup for major frameworks
  - Comprehensive documentation for each integration
  - Production-ready build configurations

  ## Ecosystem Integration

  Websmith Kit provides seamless integration with your favorite tools and frameworks:

  ### Framework Integrations

  ```bash
  # Vite projects
  npm install @websmith/vite

  # Next.js projects  
  npm install @websmith/nextjs

  # Gatsby projects
  npm install @websmith/gatsby

  # Astro projects
  npm install @websmith/astro
  ```

  ### CSS Framework Integration

  ```bash
  # Styled Components projects
  npm install @websmith/styled-components
  ```

  ### Design Tool Export

  ```bash
  # Install design tools CLI
  npm install -g @websmith/design-tools

  # Export tokens to Sketch
  websmith-design export sketch tokens.sketch

  # Export tokens to Figma
  websmith-design export figma tokens.figma

  # Export tokens to Adobe XD
  websmith-design export xd tokens.xd
  ```

  ## Quick Start

  ```bash
  npm install @websmith/ui @websmith/tokens @websmith/theme
  ```

  ```tsx
  import { Button, Card } from '@websmith/ui'

  function App() {
    return (
      <Card className="p-6">
        <Button>Hello World</Button>
      </Card>
    )
  }
  ```

  ## Documentation

  ### 📚 Main Documentation

  - **[Getting Started](./docs/README.md)** - Documentation overview
  - **[Development Guide](./docs/DEVELOPMENT.md)** - Complete development workflow
  - **[Performance Guide](./docs/PERFORMANCE.md)** - Optimization techniques
  - **[Theming Guide](./docs/THEMING.md)** - Dark mode and theme system
  - **[Contributing](./CONTRIBUTING.md)** - How to contribute

  ### 📦 Package Documentation

  #### Core Packages
  - [Tokens](./packages/websmith-tokens/) - Design token system
  - [UI Components](./packages/websmith-ui/) - React component library
  - [Theme](./packages/websmith-theme/) - Theme builder utilities

  #### Framework Integrations
  - [Vite Plugin](./packages/websmith-vite/) - Vite integration for token generation
  - [Next.js](./packages/websmith-nextjs/) - Next.js integration with SSR support
  - [Gatsby](./packages/websmith-gatsby/) - Gatsby plugin for static sites
  - [Astro](./packages/websmith-astro/) - Astro integration for multi-framework sites

  #### CSS Framework Integrations
  - [Styled Components](./packages/websmith-styled-components/) - CSS-in-JS integration with TypeScript

  #### Design Tools
  - [Design Tools](./packages/websmith-design-tools/) - CLI for Sketch/Figma/Adobe XD export

  #### Developer Tools
  - [CLI Tool](./packages/websmith-cli/) - Scaffold projects and manage components
  - [ESLint Rules](./packages/websmith-eslint/) - ESLint rules for Websmith patterns
  - [VS Code Extension](./packages/websmith-vscode/) - VS Code extension for enhanced DX

  ### 🌐 Online

  Visit our [documentation site](https://websmith.vercel.app) for interactive guides and examples.

  ## Quick Start

  ### Installation

  ```bash
  npm install @websmith/ui @websmith/tokens @websmith/theme
  ```

  ### Usage

  ```tsx
  import { Button, Card, ThemeProvider } from '@websmith/ui'

  function App() {
    return (
      <ThemeProvider config={{ defaultMode: 'system' }}>
        <Card className="p-6">
          <Button>Hello World</Button>
        </Card>
      </ThemeProvider>
    )
  }
  ```

  ## Development

  ### Setup

  ```bash
  git clone https://github.com/foozio/websmith.git
  cd websmith
  npm install
  npm run build
  ```

  ### Development Mode

  ```bash
  npm run dev  # Start all packages in watch mode
  ```

  For complete development guide, see [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md)

  ## Project Structure

  ```
  websmith/
  ├── apps/
  │   ├── docs/                 # Documentation site (Nextra)
  │   └── playground/           # Interactive component playground
  ├── packages/
  │   ├── websmith-ui/          # Core component library
  │   ├── websmith-tokens/      # Design token system
  │   ├── websmith-theme/       # Theme builder utilities
  │   ├── websmith-cli/         # CLI tool
  │   ├── websmith-eslint/      # ESLint rules for Websmith patterns
  │   ├── websmith-vscode/      # VS Code extension for enhanced DX
  │   ├── websmith-vite/        # Vite plugin for token generation
  │   ├── websmith-nextjs/      # Next.js integration package
  │   ├── websmith-gatsby/      # Gatsby plugin support
  │   ├── websmith-astro/       # Astro integration package
  │   ├── websmith-styled-components/ # Styled Components integration
  │   └── websmith-design-tools/# CLI for design tool export
  ├── tools/                    # Shared utilities
  └── docs/                     # Project documentation
  ```

  ## Developer Tools

  ### VS Code Extension

  Install the [Websmith Kit VS Code extension](https://marketplace.visualstudio.com/items?itemName=websmith.websmith-kit) for enhanced development experience:

  - **Component Explorer**: Browse and insert Websmith components
  - **Token Management**: Export and insert design tokens
  - **Theme Tools**: Create, validate, and preview themes
  - **IntelliSense**: Smart completion for components and tokens
  - **Code Snippets**: Pre-built templates for common patterns

  ### ESLint Rules

  Add `@websmith/eslint-plugin` to your project for automatic code quality checks:

  ```json
  {
    "plugins": ["@websmith/eslint-plugin"],
    "rules": {
      "@websmith/eslint-plugin/no-hardcoded-colors": "warn",
      "@websmith/eslint-plugin/enforce-cva-variants": "off"
    }
  }
  ```

  ### TypeScript Declarations

  Websmith UI automatically generates comprehensive TypeScript declarations for better IDE support and type safety.

  ## Deployment

  ### Documentation Site

  The documentation site can be deployed on Vercel or run locally using Docker.

  #### Vercel Deployment (Recommended for Production)

  The documentation site is deployed on Vercel and automatically updates on pushes to the `master` branch.

  To deploy manually:

  1. Install Vercel CLI: `npm i -g vercel`
  2. Login: `vercel login`
  3. Deploy: `vercel --prod` (from the `apps/docs` directory)

  #### Docker Deployment

  Run the documentation site using Docker:

  ```bash
  # Using Docker Compose (recommended)
  docker-compose up -d

  # Or using Docker directly
  docker build -f Dockerfile.minimal -t websmith .
  docker run -d -p 3000:3000 websmith

  # Access at http://localhost:3000
  ```

  The Docker image is optimized and production-ready with:
  - Multi-stage build for minimal size
  - Standalone Next.js output for fast startup
  - Alpine Linux base for security
  - Health checks configured

  ### NPM Packages

  Packages are published to NPM registry via GitHub Actions on releases.

  #### Setup NPM Publishing

  1. Create an NPM account and generate an access token
  2. Add `NPM_TOKEN` to GitHub repository secrets
  3. The release workflow will automatically publish on pushes to `master`

  #### Manual Publishing

  ```bash
  # Build all packages
  npm run build

  # Create a changeset for the release
  npx changeset

  # Version packages
  npm run version

  # Publish packages (requires NPM_TOKEN)
  npm run release
  ```

  #### Package Names

  **Core Packages:**
  - `@websmith/ui` - Component library
  - `@websmith/tokens` - Design tokens
  - `@websmith/theme` - Theme utilities

  **Framework Integrations:**
  - `@websmith/vite` - Vite plugin for token generation
  - `@websmith/nextjs` - Next.js integration package
  - `@websmith/gatsby` - Gatsby plugin support
  - `@websmith/astro` - Astro integration package

  **CSS Framework Integrations:**
  - `@websmith/styled-components` - Styled Components integration

  **Design Tools:**
  - `@websmith/design-tools` - CLI for Sketch/Figma/Adobe XD export

  **Developer Tools:**
  - `@websmith/cli` - CLI tool
  - `@websmith/eslint-plugin` - ESLint rules for Websmith patterns
  - `websmith-vscode` - VS Code extension for enhanced developer experience

  ## Contributing

  We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

  ## License

  This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

  ## Maintainer

  **Nuzli Hernawan** - [foozio](https://github.com/foozio) - nuzlilatief@gmail.com

  ## Acknowledgments

  - Built with [Turbo](https://turbo.build/)
  - Components powered by [Radix UI](https://www.radix-ui.com/)
  - Styled with [Tailwind CSS](https://tailwindcss.com/)
