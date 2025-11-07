# Websmith Kit

"Forge interfaces with finesse."

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Websmith Kit is a comprehensive design system and component library for building modern web applications. It provides a complete set of UI components, design tokens, and theming tools to help you create consistent and beautiful interfaces.

## Features

- 🎨 **Component Library**: 30+ production-ready React components
- 🎯 **Design Tokens**: Comprehensive token system with multiple export formats
- 🎭 **Theme Builder**: Customizable themes with real-time preview
- 📚 **Documentation**: Complete guides and API references
- 🎮 **Interactive Playground**: Experiment with components and themes
- 🛠️ **CLI Tool**: Scaffold projects and manage components
- ⚡ **Developer Tools**: VS Code extension and ESLint rules for enhanced DX
- 🔧 **TypeScript Support**: Auto-generated declarations for better IDE support

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

Visit our [documentation site](https://websmith.vercel.app) for complete guides, API references, and examples.

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/foozio/websmith.git
cd websmith

# Install dependencies
npm install

# Start development
npm run dev
```

### Building

```bash
# Build all packages
npm run build

# Build specific package
cd packages/websmith-ui
npm run build
```

### Testing

```bash
# Run tests
npm run test

# Run linting
npm run lint
```

### Development Workflow

See [DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md) for detailed information about:
- Branch strategy (master/development)
- Commit conventions
- Release process
- Changeset management
- Testing guidelines

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
│   └── websmith-vscode/      # VS Code extension for enhanced DX
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

- `@websmith/ui` - Component library
- `@websmith/tokens` - Design tokens
- `@websmith/theme` - Theme utilities
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
