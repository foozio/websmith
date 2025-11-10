# Websmith Styled Components Integration Guide

## Mission
Provide seamless integration between Websmith design tokens and Styled Components, enabling type-safe, theme-aware styling with automatic token resolution and IntelliSense support.

## Integration Features
- TypeScript-first theme integration with Styled Components
- Automatic token resolution in styled components
- Theme provider with Websmith tokens
- CSS custom property generation for runtime theming
- Utility functions for token access and manipulation
- IntelliSense support for design tokens in editors
- Hot reloading support for theme changes

## Theme Provider Integration
- `WebsmithThemeProvider`: React context provider for theme management
- Automatic theme switching with CSS custom properties
- Type-safe theme access in styled components
- Theme inheritance and composition support
- Runtime theme switching capabilities

## Utility Functions
- `useWebsmithTheme()`: Hook for accessing current theme
- `getTokenValue()`: Utility for resolving token values
- `createWebsmithTheme()`: Theme creation helper
- `extendWebsmithTheme()`: Theme extension utilities
- `token()`: Template literal helper for token interpolation

## TypeScript Integration
- Full TypeScript support with generated theme types
- IntelliSense for design tokens in styled components
- Type-safe theme property access
- Custom theme extension types
- Theme validation and error checking

## Development Commands
- `npm run build -- --filter=packages/websmith-styled-components` to compile integration
- `npm run dev -- --filter=packages/websmith-styled-components` for watch mode development
- `npm run lint -- --filter=packages/websmith-styled-components` and `npm run typecheck -- --filter=packages/websmith-styled-components` before commits

## Styled Components Compatibility
- Support for Styled Components v5 and v6
- Compatible with React 16.8+ (hooks support)
- Server-side rendering support
- Static CSS extraction for performance
- Theme composition and inheritance

## Performance Features
- CSS custom properties for optimal runtime performance
- Static CSS extraction for critical styles
- Minimal runtime overhead for theme switching
- Bundle size optimization with tree-shaking
- Efficient theme object creation and caching

## Testing Requirements
Test integration with various Styled Components setups:
- TypeScript and JavaScript projects
- Server-side rendering applications
- Static site generation projects
- Theme switching and dynamic theming
- Custom theme extensions and compositions
- Performance-critical applications

## Build Integration
- Zero-config setup with sensible defaults
- Customizable theme generation
- CSS custom property injection
- TypeScript declaration generation
- Bundle optimization for production builds

## Release Checklist
- Verify compatibility with latest Styled Components versions
- Test TypeScript integration and IntelliSense support
- Validate theme switching performance
- Ensure SSR compatibility and static extraction
- Update documentation for new Styled Components features
- Create Changeset for breaking changes
