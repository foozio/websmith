# @websmith/astro

Astro integration for Websmith design tokens with framework-agnostic support and build-time optimization.

## Installation

```bash
npm install @websmith/astro @websmith/tokens
# or
yarn add @websmith/astro @websmith/tokens
# or
pnpm add @websmith/astro @websmith/tokens
```

## Usage

Add the integration to your `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config'
import websmith from '@websmith/astro'

export default defineConfig({
  integrations: [
    websmith({
      theme: 'light',
      enableDarkMode: true,
      injectCSS: true
    })
  ]
})
```

## Configuration Options

### WebsmithAstroOptions

- **`tokensPath`** (string): Path to custom token configuration. Default: `'./tokens.config.js'`
- **`outputPath`** (string): CSS output file path. Default: `'./src/styles/websmith.css'`
- **`theme`** ('light' | 'dark'): Default theme. Default: `'light'`
- **`enableDarkMode`** (boolean): Enable dark mode support. Default: `true`
- **`prefix`** (string): CSS variable prefix. Default: `'ws'`
- **`injectCSS`** (boolean): Auto-inject CSS. Default: `true`
- **`generateTypes`** (boolean): Generate TypeScript types. Default: `false`
- **`customCSS`** (string): Additional CSS. Default: `''`

## Framework Support

### React Components

```tsx
// src/components/Button.tsx
import React from 'react'

export default function Button() {
  return (
    <button style={{
      backgroundColor: 'var(--ws-primary)',
      color: 'var(--ws-primary-foreground)',
      padding: 'var(--ws-spacing-sm) var(--ws-spacing-md)',
      borderRadius: 'var(--ws-border-radius-md)'
    }}>
      Click me
    </button>
  )
}
```

### Vue Components

```vue
<!-- src/components/Button.vue -->
<template>
  <button
    :style="{
      backgroundColor: 'var(--ws-primary)',
      color: 'var(--ws-primary-foreground)',
      padding: 'var(--ws-spacing-sm) var(--ws-spacing-md)',
      borderRadius: 'var(--ws-border-radius-md)'
    }"
  >
    Click me
  </button>
</template>
```

### Svelte Components

```svelte
<!-- src/components/Button.svelte -->
<button
  style="
    background-color: var(--ws-primary);
    color: var(--ws-primary-foreground);
    padding: var(--ws-spacing-sm) var(--ws-spacing-md);
    border-radius: var(--ws-border-radius-md);
  "
>
  Click me
</button>
```

### Solid Components

```tsx
// src/components/Button.tsx
import { createSignal } from 'solid-js'

export default function Button() {
  return (
    <button
      style={{
        'background-color': 'var(--ws-primary)',
        'color': 'var(--ws-primary-foreground)',
        'padding': 'var(--ws-spacing-sm) var(--ws-spacing-md)',
        'border-radius': 'var(--ws-border-radius-md)'
      }}
    >
      Click me
    </button>
  )
}
```

## CSS Variables

The integration generates CSS custom properties:

```css
:root {
  --ws-background: hsl(0 0% 100%);
  --ws-foreground: hsl(222.2 84% 4.9%);
  --ws-primary: hsl(221.2 83.2% 53.3%);
  /* ... more tokens */
}

[data-theme="dark"], .dark {
  --ws-background: hsl(222.2 84% 4.9%);
  --ws-foreground: hsl(210 40% 98%);
  --ws-primary: hsl(217.2 91.2% 59.8%);
  /* ... dark mode tokens */
}
```

## TypeScript Support

Enable type generation for full TypeScript support:

```js
// astro.config.mjs
export default defineConfig({
  integrations: [
    websmith({
      generateTypes: true
    })
  ]
})
```

This generates `src/types/websmith.ts` with type definitions:

```ts
export interface WebsmithTokenColors {
  background: string
  foreground: string
  primary: string
  // ... more types
}
```

## Custom Token Configuration

Create a `tokens.config.js` file in your project root:

```js
// tokens.config.js
export default {
  colors: {
    brand: '#ff6b6b',
    accent: '#4ecdc4',
    // ... custom colors
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    // ... custom spacing
  }
}
```

## Development Features

- **Hot Reloading**: Token changes automatically reload in development
- **Build Optimization**: Tokens are generated at build time for optimal performance
- **Framework Agnostic**: Works with any Astro-supported framework
- **Island Architecture**: Compatible with Astro's component islands

## Performance

- **Build-time Generation**: Tokens generated during build, not runtime
- **CSS Optimization**: Minimal CSS footprint with custom properties
- **Island-friendly**: No client-side JavaScript overhead
- **Caching**: Generated CSS is cached for optimal loading

## License

MIT
