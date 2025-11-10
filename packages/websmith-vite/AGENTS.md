# Websmith Vite Plugin Guide

## Mission
Provide seamless Vite integration for Websmith design token generation, enabling automatic CSS variable injection and token hot-reloading during development.

## Plugin Features
- Automatic CSS custom property generation from design tokens
- Hot module replacement for token changes
- Configurable output formats (CSS variables, JSON, TypeScript types)
- Build-time token optimization and compression
- Integration with existing Vite CSS pipeline

## Configuration Options
- `tokensPath`: Path to custom token configuration (default: `./tokens.config.js`)
- `outputPath`: CSS output file path (default: `./src/styles/tokens.css`)
- `watchFiles`: Enable file watching for token changes (default: `true`)
- `format`: Export format - 'css' | 'json' | 'ts' (default: 'css')
- `prefix`: CSS variable prefix (default: 'ws')

## Development Commands
- `npm run build -- --filter=packages/websmith-vite` to compile plugin
- `npm run dev -- --filter=packages/websmith-vite` for watch mode development
- `npm run lint -- --filter=packages/websmith-vite` and `npm run typecheck -- --filter=packages/websmith-vite` before commits

## Integration Testing
Test plugin with various Vite projects:
- React + TypeScript projects
- Vanilla JavaScript applications  
- Projects using PostCSS
- Multi-entry applications
- Library mode builds

## Release Checklist
- Verify compatibility with latest Vite versions
- Test plugin with common Vite configurations
- Update documentation with new features
- Create Changeset for breaking changes
