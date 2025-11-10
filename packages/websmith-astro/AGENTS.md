# Websmith Astro Integration Guide

## Mission
Provide seamless Astro integration for Websmith design tokens, enabling automatic CSS injection, framework-agnostic token usage, and build-time optimization.

## Integration Features
- Astro integration with automatic setup and configuration
- Island-based token injection for optimal performance
- Support for all Astro-supported frameworks (React, Vue, Svelte, Solid)
- CSS custom property generation during build time
- Theme switching and dark mode support
- TypeScript type generation for design tokens
- Integration with Astro's asset optimization

## Astro Integration APIs
- `astro:config:setup`: Configure Vite plugins and inject CSS
- `astro:build:setup`: Generate tokens during build process
- `astro:server:setup`: Enable development mode token watching
- `astro:config:done`: Validate configuration and emit warnings

## Configuration Options
- `tokensPath`: Path to custom token configuration (default: `./tokens.config.js`)
- `outputPath`: CSS output file path (default: `./src/styles/websmith.css`)
- `theme`: Default theme to use (default: `'light'`)
- `enableDarkMode`: Enable dark mode support (default: `true`)
- `prefix`: CSS variable prefix (default: `'ws'`)
- `injectCSS`: Automatically inject CSS (default: `true`)
- `generateTypes`: Generate TypeScript types (default: `false`)

## Development Commands
- `npm run build -- --filter=packages/websmith-astro` to compile integration
- `npm run dev -- --filter=packages/websmith-astro` for watch mode development
- `npm run lint -- --filter=packages/websmith-astro` and `npm run typecheck -- --filter=packages/websmith-astro` before commits

## Framework Compatibility
- React components with theme context
- Vue components with composition API
- Svelte stores for reactive tokens
- Solid signals for reactive state
- Vanilla JavaScript with CSS custom properties
- TypeScript support across all frameworks

## Performance Features
- Build-time token generation for optimal loading
- CSS minification and critical path optimization
- Island-based CSS injection to prevent waterfall loading
- Asset optimization with Astro's bundler
- Lazy loading for non-critical token styles

## Testing Requirements
Test integration with various Astro setups:
- Multi-framework projects (React + Vue + Svelte)
- Static site generation projects
- Server-side rendering with different output modes
- Hybrid rendering (SSG + SSR)
- Edge deployment configurations
- Various CSS frameworks and preprocessors

## Build Optimization
- CSS custom properties for runtime theming
- Critical CSS extraction for above-the-fold content
- Font loading optimization
- Image optimization integration
- Bundle splitting for optimal caching

## Release Checklist
- Verify compatibility with latest Astro versions
- Test with all supported frameworks
- Validate CSS injection and optimization
- Ensure TypeScript generation works across frameworks
- Update documentation for new Astro features
- Create Changeset for breaking changes
