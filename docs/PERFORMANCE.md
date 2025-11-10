# Performance Guide

Comprehensive guide to performance optimizations in Websmith Kit.

## Overview

Websmith Kit includes multiple performance optimizations:
- Token generation caching
- CSS variable generation optimization
- Component lazy loading
- Tree shaking and code splitting
- Performance monitoring

## Token Performance

### Caching System

See [packages/websmith-tokens/CACHING.md](../packages/websmith-tokens/CACHING.md) for detailed caching documentation.

**Quick Start:**

```typescript
import { generateCachedCSS, clearCSSCache } from '@websmith/tokens'

// Cached generation
const result = generateCachedCSS(tokens)

// Clear cache when needed
clearCSSCache()
```

**Performance Impact:**
- ~95% faster for cached results
- Near-instant repeated calls

### CSS Generation Optimization

See [packages/websmith-tokens/CSS-OPTIMIZATION.md](../packages/websmith-tokens/CSS-OPTIMIZATION.md) for detailed CSS optimization documentation.

**Quick Start:**

```typescript
import { generateOptimizedCSS } from '@websmith/tokens'

const result = generateOptimizedCSS(tokens, {
  deduplicate: true,
  minify: true,
  batchSize: 100
})
```

**Performance Impact:**
- 80-85% faster for large themes
- 60-70% reduction in memory
- 10-30% smaller output

## UI Performance

### Lazy Loading

Heavy components are lazy-loaded by default:

```typescript
import { Dialog, Table, DropdownMenu, Toast } from '@websmith/ui'
// These are automatically lazy-loaded
```

### Code Splitting

Use selective imports for better tree shaking:

```typescript
// ✅ Good - tree-shakeable
import { Button } from '@websmith/ui/core'
import { Input } from '@websmith/ui/forms'

// ❌ Avoid - imports everything
import { Button, Input } from '@websmith/ui'
```

### Performance Monitoring

```typescript
import { useRenderPerformance, performanceMonitor } from '@websmith/ui'

function MyComponent() {
  useRenderPerformance('MyComponent')
  
  return <div>Content</div>
}

// Get metrics
const metrics = performanceMonitor.getMetrics()
```

## Best Practices

### 1. Use Caching

```typescript
// ✅ Good - uses cache
import { generateCachedCSS } from '@websmith/tokens'
const css = generateCachedCSS(tokens)

// ❌ Avoid - regenerates every time
import { generateOptimizedCSS } from '@websmith/tokens'
const css = generateOptimizedCSS(tokens)
```

### 2. Enable Deduplication

```typescript
generateOptimizedCSS(tokens, {
  deduplicate: true  // Remove duplicate values
})
```

### 3. Minify for Production

```typescript
generateOptimizedCSS(tokens, {
  minify: process.env.NODE_ENV === 'production'
})
```

### 4. Use Lazy Loading

```typescript
// Heavy components are lazy by default
import { Dialog } from '@websmith/ui'  // Lazy-loaded
```

### 5. Monitor Performance

```typescript
import { performanceMonitor } from '@websmith/ui'

// In development
performanceMonitor.logSummary()
```

## Benchmarks

### Token Caching
- First call: ~10ms
- Cached call: ~0.1ms
- **Improvement: 99%**

### CSS Generation
| Theme Size | Before | After | Improvement |
|------------|--------|-------|-------------|
| 100 vars   | 5ms    | 1ms   | 80%         |
| 1,000 vars | 50ms   | 8ms   | 84%         |
| 10,000 vars| 500ms  | 75ms  | 85%         |

### Bundle Size
- Code splitting: 40% reduction
- Tree shaking: 30% reduction
- Lazy loading: 50% initial load reduction

## Troubleshooting

### High Memory Usage
- Reduce `batchSize` in CSS generation
- Enable `deduplicate`
- Clear cache periodically

### Slow Generation
- Enable caching with `generateCachedCSS()`
- Increase `batchSize`
- Use streaming for very large themes

### Large Bundles
- Use selective imports
- Enable tree shaking
- Check for duplicate dependencies

## Monitoring

### Performance Metrics

```typescript
import { performanceMonitor } from '@websmith/ui'

// Get all metrics
const metrics = performanceMonitor.getMetrics()

// Get summary
const summary = performanceMonitor.getSummary()

// Export JSON
const json = performanceMonitor.exportJSON()
```

### Cache Statistics

```typescript
import { getAllCacheStats } from '@websmith/tokens'

const stats = getAllCacheStats()
console.log('Hit rate:', stats.colors.hitRate)
```

## Additional Resources

- [Token Caching Guide](../packages/websmith-tokens/CACHING.md)
- [CSS Optimization Guide](../packages/websmith-tokens/CSS-OPTIMIZATION.md)
- [UI Performance Monitoring](../packages/websmith-ui/PERFORMANCE_MONITORING.md)
- [Tree Shaking Guide](../packages/websmith-ui/TREE_SHAKING.md)

---

For more details, see package-specific documentation.
