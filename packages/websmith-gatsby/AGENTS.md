# Websmith Gatsby Plugin Guide

## Mission
Provide seamless Gatsby integration for Websmith design tokens, enabling automatic CSS injection during build time and SSR-compatible token usage.

## Plugin Features
- Automatic CSS custom property generation during Gatsby build
- Support for static site generation (SSG) and server-side rendering (SSR)
- Theme switching and dark mode support
- Integration with Gatsby's CSS pipeline
- TypeScript type generation for design tokens
- Custom token configuration support

## Gatsby API Integration
- `onPreBootstrap`: Initialize token generator and validate configuration
- `createPages`: Generate CSS files and TypeScript types
- `onCreateWebpackConfig`: Configure webpack for token processing
- `onPreBuild`: Generate tokens before build process
- `setWebpackConfig`: Add CSS loading and processing rules

## Configuration Options
- `tokensPath`: Path to custom token configuration (default: `./tokens.config.js`)
- `outputPath`: CSS output file path (default: `./src/styles/websmith.css`)
- `theme`: Default theme to use (default: `'light'`)
- `enableDarkMode`: Enable dark mode support (default: `true`)
- `prefix`: CSS variable prefix (default: `'ws'`)
- `generateTypes`: Generate TypeScript types (default: `false`)
- `customCSS`: Custom CSS to include (default: `''`)

## Development Commands
- `npm run build -- --filter=packages/websmith-gatsby` to compile plugin
- `npm run dev -- --filter=packages/websmith-gatsby` for watch mode development
- `npm run lint -- --filter=packages/websmith-gatsby` and `npm run typecheck -- --filter=packages/websmith-gatsby` before commits

## Gatsby Compatibility
- Support for Gatsby 4+ and 5+
- Cloud build compatibility (Gatsby Cloud, Netlify, Vercel)
- Plugin system integration
- GraphQL data layer support
- Image optimization integration

## Testing Requirements
Test plugin with various Gatsby setups:
- Static site generation projects
- Server-side rendering applications
- Progressive Web Apps (PWA)
- E-commerce sites with dynamic theming
- Content management system integrations
- Multi-language sites with theme variations

## Performance Considerations
- Build-time token generation for optimal performance
- CSS minification and optimization
- Critical CSS extraction
- Bundle size optimization
- Caching strategies for generated assets

## Release Checklist
- Verify compatibility with latest Gatsby versions
- Test with different rendering strategies (SSG, SSR, DSG)
- Validate CSS injection in various environments
- Ensure TypeScript generation works correctly
- Update documentation for new Gatsby features
- Create Changeset for breaking changes
