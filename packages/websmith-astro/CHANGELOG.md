# @websmith/astro

## 2.0.0

### Major Changes

- cea4995: Release v1.2.0 with ecosystem integrations

### Patch Changes

- Updated dependencies [cea4995]
  - @websmith/vite@2.0.0
  - @websmith/tokens@2.0.0

## 1.0.0

### Major Changes

- Initial release of Astro integration for Websmith design tokens
- Framework-agnostic token support for React, Vue, Svelte, Solid, and vanilla JavaScript
- Automatic CSS custom property generation during Astro build process
- Integration with Astro's Vite configuration and development server
- Island architecture compatible token injection
- TypeScript type generation for design tokens

### Features

- **Astro Integration**: Seamless integration with Astro's plugin system
- **Multi-Framework Support**: Works with all Astro-supported frameworks
- **Build-time Generation**: Tokens generated during build for optimal performance
- **CSS Custom Properties**: Runtime theming with CSS variables
- **Theme Switching**: Light/dark mode support with data attributes
- **TypeScript Support**: Automatic type generation for design tokens
- **Development Hot Reloading**: Token changes trigger automatic reloads
- **Island Architecture**: Compatible with Astro's component islands

### Configuration Options

- Custom token configuration file paths
- Configurable CSS output locations
- Theme selection and dark mode support
- CSS variable prefix customization
- TypeScript type generation control
- Custom CSS injection capabilities

### Framework Integration

- **React**: Compatible with React components and hooks
- **Vue**: Works with Vue composition API and options API
- **Svelte**: Integrates with Svelte stores and reactive statements
- **Solid**: Compatible with Solid signals and reactive primitives
- **Vanilla JS**: Direct CSS custom property usage

### Performance Features

- Build-time token generation eliminates runtime overhead
- CSS custom properties for optimal styling performance
- Island-based CSS injection prevents waterfall loading
- Asset optimization integration with Astro's bundler
- Minimal JavaScript footprint for token usage

### Development Experience

- Hot reloading for token configuration changes
- Comprehensive error messages and validation
- Framework-agnostic API design
- TypeScript support across all frameworks
- Clear documentation and examples

### Build Integration

- Vite plugin integration for development workflow
- Astro configuration hooks for build process
- CSS generation and injection during build
- Asset optimization and caching
- Development server integration with file watching
