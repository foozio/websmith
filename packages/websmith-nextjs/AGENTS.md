# Websmith Next.js Integration Guide

## Mission
Provide seamless Next.js integration for Websmith design tokens, enabling automatic CSS injection, Tailwind CSS configuration, and SSR-compatible token usage.

## Integration Features
- `withWebsmith` config helper for Next.js configuration
- Automatic CSS variable injection in `_app.js`/`_app.tsx`
- Tailwind CSS configuration with Websmith tokens
- Server-side rendering compatible token generation
- Static site generation (SSG) support
- Incremental Static Regeneration (ISR) compatibility
- Font optimization integration

## Configuration Helpers
- `withWebsmith(nextConfig, options)`: Next.js config wrapper
- `WebsmithProvider`: React context provider for client-side tokens
- `useWebsmithTokens`: Hook for accessing tokens in components
- `getWebsmithTokens`: Helper for static generation

## Development Commands
- `npm run build -- --filter=packages/websmith-nextjs` to compile integration
- `npm run dev -- --filter=packages/websmith-nextjs` for watch mode development
- `npm run lint -- --filter=packages/websmith-nextjs` and `npm run typecheck -- --filter=packages/websmith-nextjs` before commits

## Next.js Compatibility
- Support for Next.js 13+ App Router
- Legacy Pages Router compatibility
- Middleware integration for dynamic theming
- Edge runtime support for token generation

## Testing Requirements
Test integration with various Next.js setups:
- App Router with Server Components
- Pages Router with `_app` and `_document`
- Static site generation projects
- Server-side rendering applications
- Edge runtime deployments
- TypeScript and JavaScript projects

## Release Checklist
- Verify compatibility with latest Next.js versions
- Test with both App Router and Pages Router
- Validate Tailwind CSS integration
- Ensure SSR/SSG compatibility
- Update documentation for new Next.js features
- Create Changeset for breaking changes
