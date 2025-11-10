# @websmith/nextjs

Next.js integration for Websmith design tokens with automatic CSS injection and Tailwind CSS configuration.

## Installation

```bash
npm install @websmith/nextjs @websmith/tokens @websmith/theme
# or
yarn add @websmith/nextjs @websmith/tokens @websmith/theme
# or
pnpm add @websmith/nextjs @websmith/tokens @websmith/theme
```

## Usage

### Basic Setup

Add the Websmith configuration to your `next.config.js`:

```js
const { withWebsmith } = require('@websmith/nextjs/withWebsmith')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing Next.js config
}

module.exports = withWebsmith(nextConfig, {
  theme: 'light',
  enableDarkMode: true,
  outputPath: './src/styles/websmith.css'
})
```

### Tailwind CSS Integration

Create a `tailwind.config.js` with Websmith tokens:

```js
const { createWebsmithTailwindConfig } = require('@websmith/nextjs/tailwind')

/** @type {import('tailwindcss').Config} */
module.exports = createWebsmithTailwindConfig({
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
}, {
  theme: 'light',
  prefix: 'ws',
  includeDarkMode: true
})
```

### React Provider

Use the Websmith provider in your `_app.tsx` or layout:

```tsx
import { WebsmithProvider } from '@websmith/nextjs/provider'
import '@/styles/globals.css'
import '@/styles/websmith.css' // Generated CSS

export default function App({ Component, pageProps }) {
  return (
    <WebsmithProvider defaultTheme="light" enableSystem>
      <Component {...pageProps} />
    </WebsmithProvider>
  )
}
```

### Using Tokens

```tsx
import { useWebsmithTokens } from '@websmith/nextjs/provider'

function MyComponent() {
  const { tokens, theme, setTheme } = useWebsmithTokens()
  
  return (
    <div style={{ backgroundColor: tokens.colors.primary }}>
      <h1>Current theme: {theme}</h1>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </div>
  )
}
```

### Static Generation

For static site generation, use the helper function:

```tsx
import { getWebsmithTokens } from '@websmith/nextjs'

export async function getStaticProps() {
  const tokens = await getWebsmithTokens({ theme: 'light' })
  
  return {
    props: {
      tokens
    }
  }
}
```

## Configuration Options

### WebsmithNextOptions

- **`tokensPath`** (string): Path to custom token configuration. Default: `'./tokens.config.js'`
- **`outputPath`** (string): CSS output file path. Default: `'./src/styles/websmith.css'`
- **`theme`** ('light' | 'dark'): Theme to use. Default: `'light'`
- **`injectCSS`** (boolean): Enable CSS injection. Default: `true`
- **`enableTailwind`** (boolean): Enable Tailwind integration. Default: `true`
- **`prefix`** (string): CSS variable prefix. Default: `'ws'`
- **`generateTypes`** (boolean): Generate TypeScript types. Default: `false`
- **`enableDarkMode`** (boolean): Enable dark mode support. Default: `true`
- **`customCSS`** (string): Custom CSS to include. Default: `''`

### WebsmithTailwindOptions

- **`theme`** ('light' | 'dark'): Theme for colors. Default: `'light'`
- **`prefix`** (string): CSS variable prefix. Default: `'ws'`
- **`includeDarkMode`** (boolean): Include dark mode colors. Default: `true`
- **`extendColors`** (boolean): Extend or replace colors. Default: `true`

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
// next.config.js
module.exports = withWebsmith(nextConfig, {
  generateTypes: true
})
```

This generates `src/types/websmith.ts` with type definitions:

```ts
export interface WebsmithTokenColors {
  background: string
  foreground: string
  primary: string
  // ... more color types
}

export const websmithTokens: WebsmithTokens = { ... } as const
```

## App Router Support

For Next.js 13+ App Router, use in your layout:

```tsx
// app/layout.tsx
import { WebsmithProvider } from '@websmith/nextjs/provider'
import './globals.css'
import '../styles/websmith.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <WebsmithProvider>
          {children}
        </WebsmithProvider>
      </body>
    </html>
  )
}
```

## License

MIT
