# @websmith/styled-components

## 2.0.0

### Major Changes

- cea4995: Release v1.2.0 with ecosystem integrations

### Patch Changes

- Updated dependencies [cea4995]
  - @websmith/tokens@2.0.0

## 1.0.0

### Major Changes

- Initial release of Styled Components integration for Websmith design tokens
- TypeScript-first theme integration with full IntelliSense support
- Automatic CSS custom property generation and injection
- Theme provider with context-based theme management
- Comprehensive utility functions for token access and manipulation
- Server-side rendering compatible theme switching

### Features

- **Theme Provider**: `WebsmithThemeProvider` component with React context integration
- **TypeScript Support**: Full type safety with generated theme types and IntelliSense
- **CSS Custom Properties**: Automatic injection of design tokens as CSS variables
- **Theme Utilities**: `createWebsmithTheme()` and `extendWebsmithTheme()` for theme composition
- **Token Helpers**: Utility functions for accessing colors, spacing, shadows, borders, and typography
- **CSS Utilities**: Helper functions for responsive design, transitions, focus rings, and layout
- **Theme Context**: `useWebsmithTheme()` hook for accessing current theme and theme switching

### Styled Components Integration

- **Theme Access**: Direct access to Websmith tokens through `props.theme`
- **Helper Functions**: `getColor()`, `getSpacing()`, `getShadow()`, `getBorder()`, `getTypography()`
- **Template Literals**: `token()` helper for CSS-in-JS token interpolation
- **CSS Utilities**: `flex()`, `grid()`, `responsive()`, `transition()`, `focusRing()`, `truncate()`
- **Composition**: Easy theme composition and extension patterns

### TypeScript Features

- **Theme Types**: Comprehensive type definitions for all theme properties
- **IntelliSense**: Full autocomplete support for design tokens in editors
- **Type Safety**: Compile-time validation of theme property access
- **Custom Types**: Support for extending theme types with custom properties
- **Validation**: Runtime theme validation and error checking

### CSS Custom Properties

- **Automatic Injection**: CSS variables automatically added to `:root` and `[data-theme]`
- **Theme Switching**: Runtime theme switching with CSS custom properties
- **Performance**: Optimized CSS variable usage for minimal style recalculation
- **Fallback Support**: Graceful fallbacks for unsupported CSS custom properties

### Utility Functions

- **Token Access**: `getTokenValue(path, fallback?)` for dynamic token resolution
- **Specialized Helpers**: Color, spacing, shadow, border, and typography specific functions
- **Layout Helpers**: `flex()`, `grid()`, `absolute()`, `size()` for common layout patterns
- **Interactive Helpers**: `focusRing()`, `transition()` for accessibility and animations
- **Text Helpers**: `truncate()`, `textAlign()`, `fontSize()`, `fontWeight()` for typography

### Performance Features

- **CSS Custom Properties**: Runtime theming without style recalculation penalties
- **Static Extraction**: Support for Styled Components static CSS extraction
- **Bundle Optimization**: Tree-shaking friendly exports and minimal bundle size
- **Caching**: Efficient theme object creation and caching strategies
- **SSR Compatible**: Full server-side rendering support with theme hydration

### Development Experience

- **Hot Reloading**: Theme changes trigger automatic component updates
- **Error Handling**: Clear error messages for invalid theme configurations
- **Documentation**: Comprehensive examples and API documentation
- **Migration**: Easy migration path from existing Styled Components setups
- **Composition**: Flexible theme composition and inheritance patterns

### Compatibility

- **Styled Components v5 & v6**: Full compatibility with latest versions
- **React 16.8+**: Hooks support required for theme context
- **TypeScript 4.0+**: Full type safety and IntelliSense support
- **Server-Side Rendering**: Compatible with Next.js, Gatsby, and other SSR frameworks
- **Build Tools**: Works with Vite, Webpack, Rollup, and other bundlers
