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

Visit our [documentation site](https://websmith-kit.vercel.app) for complete guides, API references, and examples.

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/foozio/websmith-kit.git
cd websmith-kit

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

## Project Structure

```
websmith-kit/
├── apps/
│   ├── docs/                 # Documentation site (Nextra)
│   └── playground/           # Interactive component playground
├── packages/
│   ├── websmith-ui/          # Core component library
│   ├── websmith-tokens/      # Design token system
│   ├── websmith-theme/       # Theme builder utilities
│   └── websmith-cli/         # CLI tool
├── tools/                    # Shared utilities
└── docs/                     # Project documentation
```

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