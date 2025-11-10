# @websmith/vite

Vite plugin for Websmith design token generation and hot-reloading.

## Installation

```bash
npm install @websmith/vite
# or
yarn add @websmith/vite
# or
pnpm add @websmith/vite
```

## Usage

Add the plugin to your `vite.config.js`:

```js
import { defineConfig } from 'vite'
import websmith from '@websmith/vite'

export default defineConfig({
  plugins: [
    websmith({
      // Optional configuration
      outputPath: './src/styles/tokens.css',
      format: 'css',
      prefix: 'ws',
      watchFiles: true
    })
  ]
})
```

## Configuration

### Options

- **`tokensPath`** (string): Path to custom token configuration file. Default: `'./tokens.config.js'`
- **`outputPath`** (string): Output file path for generated CSS. Default: `'./src/styles/tokens.css'`
- **`watchFiles`** (boolean): Enable file watching for token changes. Default: `true`
- **`format`** ('css' | 'json' | 'ts'): Export format for tokens. Default: `'css'`
- **`prefix`** (string): CSS variable prefix. Default: `'ws'`
- **`generateTypes`** (boolean): Generate TypeScript types for tokens. Default: `false`
- **`theme`** (string): Theme name to use. Default: `'default'`
- **`compress`** (boolean): Enable compression for production builds. Default: `true`

### Custom Token Configuration

Create a `tokens.config.js` file in your project root:

```js
// tokens.config.js
export default {
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    // ... custom colors
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    // ... custom spacing
  }
}
```

## Formats

### CSS Variables

Generates CSS custom properties:

```css
:root {
  --ws-primary-50: #eff6ff;
  --ws-primary-500: #3b82f6;
  --ws-spacing-xs: 0.25rem;
  /* ... */
}
```

### JSON

Exports tokens as JSON:

```json
{
  "colors": {
    "primary": "#3b82f6",
    "secondary": "#64748b"
  },
  "spacing": {
    "xs": "0.25rem",
    "sm": "0.5rem"
  }
}
```

### TypeScript

Generates TypeScript types and constants:

```ts
export interface ColorTokens {
  primary: string;
  secondary: string;
}

export const colorTokens = {
  primary: '#3b82f6',
  secondary: '#64748b'
} as const;
```

## Virtual Module

Import tokens directly using the virtual module:

```ts
import tokens from 'websmith:tokens'

// Use tokens based on the configured format
```

## Hot Reloading

The plugin automatically watches for changes to:
- Your token configuration file
- Generated CSS output files

Changes trigger automatic browser refresh for seamless development.

## License

MIT
