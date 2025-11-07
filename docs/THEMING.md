# Theming Guide

Complete guide to theming in Websmith Kit, including dark mode, theme composition, and customization.

## Overview

Websmith Kit provides a comprehensive theming system:
- Dark mode with system preference detection
- Theme composition and inheritance
- Design token system
- Runtime theme switching

## Quick Start

```typescript
import { ThemeProvider, useTheme, ThemeToggle } from '@websmith/ui'

function App() {
  return (
    <ThemeProvider config={{ defaultMode: 'system' }}>
      <YourApp />
      <ThemeToggle />
    </ThemeProvider>
  )
}

function Component() {
  const { mode, resolvedTheme, toggle } = useTheme()
  return <div>Current theme: {resolvedTheme}</div>
}
```

## Dark Mode

### Basic Setup

```typescript
import { ThemeProvider } from '@websmith/ui'

<ThemeProvider config={{
  defaultMode: 'system',  // 'light' | 'dark' | 'system'
  storageKey: 'websmith-theme',
  enableTransitions: true
}}>
  {children}
</ThemeProvider>
```

### Hooks

```typescript
import { 
  useTheme,
  useThemeMode,
  useIsDark,
  useThemeToggle 
} from '@websmith/ui'

// Full theme access
const { mode, resolvedTheme, setMode, toggle } = useTheme()

// Just mode
const [mode, setMode] = useThemeMode()

// Boolean state
const isDark = useIsDark()

// Toggle function
const toggle = useThemeToggle()
```

### Components

```typescript
import { ThemeToggle, ThemeSelect, ThemeButtonGroup } from '@websmith/ui'

// Simple toggle button
<ThemeToggle />

// Dropdown selector
<ThemeSelect />

// Button group (light/dark/system)
<ThemeButtonGroup />
```

### Preventing FOUC

```tsx
import { ThemeScript } from '@websmith/ui'

// In your HTML <head>
<head>
  <ThemeScript />
  {/* other head content */}
</head>
```

## Theme Composition

### Creating Themes

```typescript
import { createTheme, extendTheme } from '@websmith/ui'

// Base theme
const baseTheme = createTheme('base', {
  colors: {
    primary: '#0ea5e9',
    secondary: '#8b5cf6'
  },
  spacing: {
    sm: '8px',
    md: '16px'
  }
})

// Extend theme
const darkTheme = extendTheme(baseTheme, {
  colors: {
    primary: '#38bdf8'  // Override
  }
})
```

### Theme Inheritance

```typescript
import { ThemeComposer } from '@websmith/ui'

const composer = new ThemeComposer()

// Register base theme
composer.registerTheme(baseTheme)

// Extend from parent
composer.extendTheme('custom', 'base', {
  colors: { accent: '#f59e0b' }
})

// Get theme
const theme = composer.getTheme('custom')
```

### Merging Themes

```typescript
import { mergeThemes } from '@websmith/ui'

const merged = mergeThemes(theme1, theme2, theme3)
```

### Theme Variants

```typescript
import { useThemeVariant } from '@websmith/ui'

const { variant, setVariant, tokens } = useThemeVariant(
  baseTokens,
  {
    compact: { spacing: { sm: '4px' } },
    spacious: { spacing: { sm: '12px' } }
  }
)

<button onClick={() => setVariant('compact')}>Compact</button>
```

## Design Tokens

### Token Structure

```typescript
interface ThemeTokens {
  colors?: Record<string, any>
  spacing?: Record<string, any>
  typography?: Record<string, any>
  shadows?: Record<string, any>
  borders?: Record<string, any>
}
```

### Using Tokens

```typescript
import { colors, spacing, typography } from '@websmith/tokens'

// Access tokens
const primaryColor = colors.primary[500]
const mediumSpacing = spacing[4]
```

### Generating CSS Variables

```typescript
import { generateOptimizedCSS } from '@websmith/tokens'

const result = generateOptimizedCSS({
  colors,
  spacing,
  typography
}, {
  prefix: 'ws',
  minify: true
})

// Use in your app
document.documentElement.style.cssText = result.css
```

## Customization

### Custom Theme Provider

```typescript
<ThemeProvider config={{
  defaultMode: 'dark',
  storageKey: 'my-theme',
  attribute: 'data-theme',
  enableTransitions: true,
  transitionDuration: 200
}}>
  {children}
</ThemeProvider>
```

### Forced Theme

```typescript
<ThemeProvider forcedTheme="dark">
  {children}
</ThemeProvider>
```

### Conditional Rendering

```typescript
import { ThemeMatch, ThemeSwitch } from '@websmith/ui'

// Match specific theme
<ThemeMatch theme="dark">
  <DarkContent />
</ThemeMatch>

// Switch between themes
<ThemeSwitch
  light={<LightIcon />}
  dark={<DarkIcon />}
/>
```

## Best Practices

### 1. Use System Preference

```typescript
<ThemeProvider config={{ defaultMode: 'system' }}>
```

### 2. Persist User Choice

```typescript
// Automatic with ThemeProvider
<ThemeProvider config={{ storageKey: 'websmith-theme' }}>
```

### 3. Prevent FOUC

```tsx
<head>
  <ThemeScript />
</head>
```

### 4. Use Semantic Tokens

```typescript
// ✅ Good
colors.primary[500]

// ❌ Avoid
'#0ea5e9'
```

### 5. Compose Themes

```typescript
// ✅ Good - reusable
const darkTheme = extendTheme(baseTheme, darkOverrides)

// ❌ Avoid - duplicated
const darkTheme = { /* all tokens */ }
```

## Examples

### Complete App Setup

```typescript
import { ThemeProvider, defaultLocales } from '@websmith/ui'

const customTheme = {
  colors: {
    primary: { 500: '#0ea5e9' }
  }
}

function App() {
  return (
    <ThemeProvider config={{ defaultMode: 'system' }}>
      <Header />
      <Main />
      <Footer />
    </ThemeProvider>
  )
}
```

### Theme Switcher

```typescript
function ThemeSwitcher() {
  const { mode, setMode } = useTheme()
  
  return (
    <select value={mode} onChange={(e) => setMode(e.target.value)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  )
}
```

### Responsive Theming

```typescript
import { useResponsiveTheme } from '@websmith/ui'

const theme = useResponsiveTheme({
  mobile: mobileTokens,
  tablet: tabletTokens,
  desktop: desktopTokens
}, currentBreakpoint)
```

## Troubleshooting

### Theme Not Applying
- Check ThemeProvider wraps your app
- Verify theme attribute in HTML
- Check browser console for errors

### FOUC (Flash of Unstyled Content)
- Add ThemeScript to HTML head
- Ensure it runs before other scripts

### Theme Not Persisting
- Check localStorage is available
- Verify storageKey is set
- Check browser privacy settings

## Additional Resources

- [UI Package Documentation](../packages/websmith-ui/)
- [Token System](../packages/websmith-tokens/)
- [Theme Composition API](../packages/websmith-ui/src/theme/)

---

For more details, see package-specific documentation.
