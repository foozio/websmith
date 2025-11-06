# TypeScript Declaration Generation

## Overview

Websmith Kit includes a comprehensive TypeScript declaration generation system that provides enhanced type definitions, better IDE support, and improved developer experience. The system generates multiple declaration files with specialized exports for different use cases.

## Features

### 🎯 **Enhanced Declaration Generation**

- **Multiple Declaration Files**: Separated declarations for components, utilities, themes, and tokens
- **Type Safety**: Comprehensive type definitions with proper inheritance and generics
- **IDE Support**: Enhanced autocomplete and intellisense support
- **Validation**: Built-in validation to ensure declaration file integrity

### 📦 **Generated Declaration Files**

#### `dist/index.d.ts`
Main declaration file with all public exports:
```typescript
export { Button } from './components/Button'
export { Card } from './components/Card'
export { cn } from './lib/utils'
// ... other exports
```

#### `dist/components.d.ts`
Component-specific declarations:
```typescript
// Component exports
export declare const Button: React.ForwardRefExoticComponent<ButtonProps>
export declare const Card: React.ForwardRefExoticComponent<CardProps>
// ... other components
```

#### `dist/utilities.d.ts`
Utility function declarations:
```typescript
export declare function cn(...inputs: ClassValue[]): string
export type CVAProps<T> = VariantProps<T>
export type ForwardRefComponent<T, P> = React.ForwardRefExoticComponent<P & React.RefAttributes<T>>
// ... other utilities
```

#### `dist/theme.d.ts`
Theme-related declarations:
```typescript
export interface WebsmithTheme {
  colors: { /* color definitions */ }
  spacing: { /* spacing definitions */ }
  typography: { /* typography definitions */ }
  // ... other theme properties
}
```

#### `dist/tokens.d.ts`
Design token declarations:
```typescript
export interface DesignTokens {
  colors: ColorTokens
  spacing: SpacingTokens
  typography: TypographyTokens
  // ... other token types
}
```

## Usage

### Basic Generation
```bash
# Generate standard declarations
npm run build

# Generate enhanced declarations
npm run build:declarations
```

### Programmatic Generation
```typescript
import { generateDeclarations, DeclarationGenerator } from './src/declarations/generator'

// Quick generation
await generateDeclarations({
  entryPoints: ['src/**/*.{ts,tsx}'],
  outDir: 'dist',
  separatePackages: true,
})

// Advanced generation with custom config
const generator = new DeclarationGenerator({
  entryPoints: ['src/components/**/*.{ts,tsx}'],
  outDir: 'dist/declarations',
  includePrivate: false,
  generateMaps: true,
  separatePackages: true,
})

await generator.generateDeclarations()
await generator.validateDeclarations()
```

## Configuration Options

### DeclarationConfig Interface
```typescript
interface DeclarationConfig {
  entryPoints: string[]        // Source files to process
  outDir: string              // Output directory for declarations
  includePrivate?: boolean    // Include private members
  includeInternal?: boolean   // Include internal members  
  generateMaps?: boolean      // Generate source maps
  separatePackages?: boolean  // Create separate declaration files
}
```

### Default Configuration
```typescript
{
  entryPoints: ['src/**/*.{ts,tsx}'],
  outDir: 'dist',
  includePrivate: false,
  includeInternal: false,
  generateMaps: true,
  separatePackages: true,
}
```

## Generated Types

### Component Types
```typescript
// Enhanced component props with variant support
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ComponentVariant
  size?: ComponentSize
  asChild?: boolean
}

// Forward ref component type
export type ForwardRefComponent<T, P> = React.ForwardRefExoticComponent<
  P & React.RefAttributes<T>
>
```

### Utility Types
```typescript
// Class name utility
export declare function cn(...inputs: ClassValue[]): string

// Variant props from class-variance-authority
export type CVAProps<T> = VariantProps<T>

// Common component sizes
export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl' | 'icon'

// Common component variants
export type ComponentVariant = 'default' | 'outline' | 'ghost' | 'destructive'
```

### Theme Types
```typescript
export interface WebsmithTheme {
  colors: {
    primary: Record<string, string>
    secondary: Record<string, string>
    accent: Record<string, string>
    // ... other colors
  }
  spacing: Record<string, string>
  typography: {
    fontFamily: Record<string, string[]>
    fontSize: Record<string, [string, string]>
    fontWeight: Record<string, number>
    lineHeight: Record<string, number>
  }
  shadows: Record<string, string>
  borders: {
    radius: Record<string, string>
    width: Record<string, string>
  }
  breakpoints: Record<string, string>
}
```

### Token Types
```typescript
export interface DesignTokens {
  colors: ColorTokens
  spacing: SpacingTokens
  typography: TypographyTokens
  shadows: ShadowTokens
  borders: BorderTokens
  themes: ThemeTokens
}

export interface ColorTokens {
  [colorName: string]: {
    [shade: string]: string
  }
}
```

## Integration with Build Process

### Enhanced Build Script
```json
{
  "scripts": {
    "build": "npm run build:declarations && tsup",
    "build:declarations": "tsx src/declarations/generator.ts",
    "dev": "npm run build:declarations && tsup --watch",
    "typecheck": "tsc --noEmit"
  }
}
```

### CI/CD Integration
```yaml
# .github/workflows/build.yml
- name: Generate declarations
  run: npm run build:declarations

- name: Validate declarations
  run: npm run typecheck

- name: Build package
  run: npm run build
```

## IDE Support

### VS Code Integration
The generated declarations provide enhanced VS Code support:

- **Autocomplete**: Intelligent suggestions for components and props
- **Type Checking**: Real-time type validation
- **Hover Information**: Detailed type information on hover
- **Go to Definition**: Navigate to source definitions
- **IntelliSense**: Smart code completion

### WebStorm Integration
Full WebStorm support with:
- Type-aware code completion
- Parameter hints
- Quick documentation
- Type hierarchy navigation

## Validation and Testing

### Declaration Validation
```typescript
const generator = new DeclarationGenerator(config)
await generator.generateDeclarations()

// Validate generated declarations
const isValid = await generator.validateDeclarations()
if (!isValid) {
  throw new Error('Declaration generation failed validation')
}
```

### Type Checking
```bash
# Check for type errors in declarations
npm run typecheck

# Check specific declaration file
npx tsc --noEmit dist/index.d.ts
```

## Best Practices

### Declaration Organization
1. **Separate Concerns**: Use separate files for different export types
2. **Consistent Naming**: Use consistent naming conventions across declarations
3. **Proper Exports**: Export all public APIs through main declaration file
4. **Type Safety**: Ensure all declarations are type-safe and complete

### Performance Optimization
1. **Selective Generation**: Only generate declarations for changed files
2. **Parallel Processing**: Generate multiple declaration files in parallel
3. **Caching**: Cache declaration generation results
4. **Incremental Updates**: Update only affected declaration files

### Maintenance
1. **Regular Updates**: Regenerate declarations after API changes
2. **Version Compatibility**: Ensure declarations match package version
3. **Documentation**: Keep declaration documentation up to date
4. **Testing**: Test declarations with real usage scenarios

## Troubleshooting

### Common Issues

#### Missing Declarations
```bash
# Check if declaration files exist
ls -la dist/*.d.ts

# Regenerate declarations
npm run build:declarations
```

#### Type Errors
```bash
# Check TypeScript configuration
npx tsc --showConfig

# Validate declaration syntax
npx tsc --noEmit --skipLibCheck false dist/index.d.ts
```

#### Import Issues
```typescript
// Ensure proper import paths in declarations
export { Button } from './components/Button'  // ✅ Correct
export { Button } from './Button'            // ❌ Incorrect path
```

### Debug Mode
Enable debug logging for troubleshooting:
```typescript
const generator = new DeclarationGenerator({
  ...config,
  debug: true,  // Enable debug output
})
```

This comprehensive declaration generation system ensures excellent TypeScript support and developer experience for Websmith Kit consumers.
