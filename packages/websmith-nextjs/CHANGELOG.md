# @websmith/nextjs

## 1.0.0

### Major Changes

- Initial release of Next.js integration for Websmith design tokens
- `withWebsmith` configuration helper for Next.js setup
- Automatic CSS variable injection and generation
- Tailwind CSS integration with Websmith tokens
- React context provider for client-side token management
- Server-side rendering compatible token generation

### Features

- **Configuration Helper**: `withWebsmith(nextConfig, options)` for easy Next.js setup
- **Token Generation**: Automatic CSS custom property generation from Websmith tokens
- **Theme Support**: Built-in light/dark theme switching with system preference detection
- **Tailwind Integration**: `createWebsmithTailwindConfig()` for seamless Tailwind CSS setup
- **React Provider**: `WebsmithProvider` component with `useWebsmithTokens` hook
- **Static Generation**: `getWebsmithTokens()` helper for SSG/SSR scenarios
- **TypeScript Support**: Automatic type generation for design tokens
- **App Router Support**: Full compatibility with Next.js 13+ App Router
- **Pages Router Support**: Legacy compatibility with Pages Router

### Configuration Options

- Custom token configuration paths
- Configurable CSS output locations
- Theme selection and dark mode support
- CSS variable prefix customization
- TypeScript type generation
- Custom CSS injection capabilities

### Integration Features

- Webpack configuration for CSS processing
- Headers and redirects optimization
- Client-side fallback handling
- Build-time token optimization
- Development hot reloading support

### Documentation

- Complete setup guide for Next.js projects
- Tailwind CSS integration examples
- React provider usage documentation
- TypeScript configuration instructions
- App Router and Pages Router examples

### Developer Experience

- Zero-config setup with sensible defaults
- Comprehensive TypeScript definitions
- Extensive configuration options
- Development and production optimizations
- Clear error messages and debugging support
