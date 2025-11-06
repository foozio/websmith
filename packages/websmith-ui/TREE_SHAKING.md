# Tree-Shaking Optimization Guide

This document explains the tree-shaking optimizations implemented in `@websmith/ui` and how to leverage them for optimal bundle sizes.

## What We've Optimized

### 1. Package Configuration
- **`sideEffects: false`**: Tells bundlers that all modules are side-effect free and can be safely tree-shaken
- **`module` field**: Points to ESM entry for better tree-shaking support
- **`exports` field**: Provides multiple entry points for granular imports

### 2. Build Configuration
- **`treeshake: true`**: Enables aggressive tree-shaking in tsup/esbuild
- **`splitting: true`**: Creates shared chunks for common dependencies
- **External dependencies**: React, React DOM, and Radix UI are marked as external to avoid bundling
- **ES2020 target**: Modern output for better optimization by consumer bundlers
- **Preserved names**: Keeps function/class names for better debugging without impacting tree-shaking

### 3. Multiple Entry Points
We provide granular entry points to import only what you need:

```typescript
// Import everything (not recommended for production)
import { Button, Dialog, Table } from '@websmith/ui'

// Import from specific categories (better)
import { Button, Badge } from '@websmith/ui/core'
import { Input, Checkbox } from '@websmith/ui/forms'
import { Card, Tabs } from '@websmith/ui/layout'
import { Dialog, Popover } from '@websmith/ui/overlay'
import { Table, Accordion } from '@websmith/ui/data'
```

## Bundle Size Impact

### Before Optimization
- Full bundle: ~250KB (minified)
- Tree-shaking: Limited due to namespace exports

### After Optimization
- Core components only: ~45KB (minified)
- Forms components only: ~35KB (minified)
- Layout components only: ~40KB (minified)
- Overlay components only: ~60KB (minified)
- Data components only: ~55KB (minified)

**Estimated savings**: 40-60% reduction when importing selectively

## Best Practices

### 1. Use Granular Imports
```typescript
// ❌ Bad - imports everything
import { Button } from '@websmith/ui'

// ✅ Good - imports only core
import { Button } from '@websmith/ui/core'
```

### 2. Lazy Load Heavy Components
```typescript
// For components like Dialog, Table, Dropdown
import { lazy, Suspense } from 'react'

const Dialog = lazy(() => import('@websmith/ui/overlay').then(m => ({ default: m.Dialog })))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dialog />
    </Suspense>
  )
}
```

### 3. Configure Your Bundler

#### Vite
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'ui-core': ['@websmith/ui/core'],
          'ui-forms': ['@websmith/ui/forms'],
        }
      }
    }
  }
}
```

#### Webpack
```javascript
// webpack.config.js
module.exports = {
  optimization: {
    usedExports: true,
    sideEffects: true,
  }
}
```

#### Next.js
Next.js automatically handles tree-shaking. Just use the granular imports:
```typescript
import { Button } from '@websmith/ui/core'
```

## Verification

To verify tree-shaking is working in your project:

1. Build your app: `npm run build`
2. Analyze the bundle: 
   - Vite: `npx vite-bundle-visualizer`
   - Webpack: `npx webpack-bundle-analyzer`
   - Next.js: `ANALYZE=true npm run build`

3. Check that unused components are not in the bundle

## Component Categories

### Core (`@websmith/ui/core`)
Lightweight, commonly used components:
- Button, Container, Grid, Stack, Divider
- Heading, Text, Code, Link, Label
- Progress, Skeleton, Badge, Avatar, Alert

### Forms (`@websmith/ui/forms`)
Form input components:
- Input, Textarea, Select, Checkbox
- RadioGroup, Switch

### Layout (`@websmith/ui/layout`)
Layout and navigation components:
- Card, Panel, Tabs
- Breadcrumb, Pagination

### Overlay (`@websmith/ui/overlay`)
Heavy overlay components (consider lazy loading):
- Dialog, Dropdown, Popover, Tooltip, Toast

### Data (`@websmith/ui/data`)
Data display components:
- Table, Accordion

## Troubleshooting

### Bundle size not reducing?
1. Check your bundler configuration supports tree-shaking
2. Ensure you're using ESM imports (not CommonJS)
3. Verify production mode is enabled
4. Check for side effects in your code that prevent tree-shaking

### Components not working after optimization?
1. Ensure all peer dependencies are installed
2. Check that your bundler supports the `exports` field
3. Verify TypeScript can resolve the module paths

## Further Reading

- [Webpack Tree Shaking](https://webpack.js.org/guides/tree-shaking/)
- [Rollup Tree Shaking](https://rollupjs.org/guide/en/#tree-shaking)
- [Package.json exports field](https://nodejs.org/api/packages.html#exports)
