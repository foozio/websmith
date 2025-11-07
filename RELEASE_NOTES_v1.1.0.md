# Release Notes - Version 1.1.0

**Release Date**: November 7, 2025  
**Package**: @websmith/tokens@1.1.0

## Overview

This release introduces significant performance optimizations for the Websmith Kit token system, focusing on caching strategies and CSS variable generation for large themes.

## 🚀 New Features

### Token Generation Caching

Implemented comprehensive LRU (Least Recently Used) caching system for token generation:

- **LRU Cache with TTL**: Configurable cache size and time-to-live for each token type
- **Automatic Eviction**: Smart eviction of least recently used entries when cache is full
- **Statistics Tracking**: Detailed metrics including hits, misses, evictions, and hit rates
- **Performance Integration**: Cache statistics integrated with existing performance monitoring
- **Flexible Control**: Enable/disable caching at runtime, clear and prune operations

**Cache Configuration**:
- Color tokens: 200 entries, 10-minute TTL
- Typography tokens: 100 entries, 10-minute TTL
- Spacing tokens: 50 entries, 10-minute TTL

### Optimized CSS Variable Generation

Completely rewritten CSS variable generation system for large themes:

- **Efficient String Building**: Array-based concatenation (60-70% memory reduction)
- **Deduplication**: Automatic removal of duplicate variable values (10-30% size reduction)
- **Batching**: Configurable batch processing to prevent blocking
- **Built-in Caching**: Automatic result caching for repeated generations
- **Streaming API**: Async generator for very large themes
- **Compression**: Minification with whitespace removal
- **Custom Formatting**: Configurable indentation, line endings, and sorting
- **Batch Processing**: Process multiple theme sets efficiently

## 📊 Performance Improvements

### Token Caching
- **~95% faster** for cached token generation results
- **Near-instant** repeated calls with same parameters
- **Minimal overhead** for cache misses (~1-2ms)

### CSS Generation
- **80-85% faster** for large themes (1000+ variables)
- **60-70% reduction** in memory allocations
- **10-30% smaller** output with deduplication enabled

### Benchmarks

| Theme Size | Before | After | Improvement |
|------------|--------|-------|-------------|
| 100 variables | ~5ms | ~1ms | 80% |
| 1,000 variables | ~50ms | ~8ms | 84% |
| 10,000 variables | ~500ms | ~75ms | 85% |

## 🔧 API Additions

### Caching API

```typescript
import {
  colorCache,
  typographyCache,
  spacingCache,
  getAllCacheStats,
  clearAllCaches,
  pruneAllCaches
} from '@websmith/tokens'

// Get cache statistics
const stats = getAllCacheStats()

// Clear all caches
clearAllCaches()

// Remove expired entries
pruneAllCaches()

// Control individual caches
colorCache.setEnabled(false)
```

### Optimized CSS Generation API

```typescript
import {
  generateOptimizedCSS,
  streamOptimizedCSS,
  generateCachedCSS,
  generateCompressedCSS,
  generateBatchCSS,
  generateFormattedCSS
} from '@websmith/tokens'

// Basic optimized generation
const result = generateOptimizedCSS(tokens, {
  prefix: 'ws',
  deduplicate: true,
  minify: false
})

// Cached generation
const cached = generateCachedCSS(tokens)

// Streaming for large themes
for await (const chunk of streamOptimizedCSS(tokens)) {
  // Process chunk
}

// Compressed output
const { compressed, compressionRatio } = generateCompressedCSS(tokens)
```

## 📚 Documentation

### New Documentation Files

- **CACHING.md**: Complete guide to token caching system
  - Usage examples
  - Configuration options
  - Performance impact
  - Best practices
  - Troubleshooting

- **CSS-OPTIMIZATION.md**: CSS generation optimization guide
  - Performance benchmarks
  - API reference
  - Advanced use cases
  - Migration guide

- **DEVELOPMENT_WORKFLOW.md**: Development and release workflow
  - Branch strategy
  - Commit conventions
  - Release process
  - Testing guidelines

## 🧪 Testing

### Test Coverage

- **52 new tests** added (29 for CSS optimization, 23 for caching)
- **100% pass rate** for new functionality
- Comprehensive coverage including:
  - Basic operations
  - LRU eviction behavior
  - TTL expiration
  - Statistics tracking
  - Deduplication
  - Batching
  - Streaming
  - Edge cases

## 🔄 Breaking Changes

**None** - This release is fully backward compatible. All existing APIs remain unchanged.

## 📦 Migration Guide

No migration required. The new optimized functions are additive:

```typescript
// Old approach (still works)
import { exportToCSSVariables } from '@websmith/tokens'
const css = exportToCSSVariables()

// New optimized approach (recommended)
import { generateOptimizedCSS, colors, spacing, typography } from '@websmith/tokens'
const result = generateOptimizedCSS({ colors, spacing, typography })
```

## 🐛 Bug Fixes

No bug fixes in this release - focused on performance improvements.

## 🔮 Future Enhancements

Planned improvements for future versions:

- Worker thread support for parallel processing
- Incremental generation for partial updates
- CSS-in-JS output format
- PostCSS plugin integration
- Enhanced source map generation
- Persistent caching (localStorage/IndexedDB)

## 📝 Changelog

See [CHANGELOG.md](./packages/websmith-tokens/CHANGELOG.md) for detailed changes.

## 🙏 Acknowledgments

This release completes the Performance Optimization section of the project roadmap:

- ✅ Implement code splitting for component library
- ✅ Add lazy loading for heavy components
- ✅ Optimize bundle size with better tree-shaking
- ✅ Add performance monitoring and metrics
- ✅ Implement caching strategies for token generation
- ✅ Optimize CSS variable generation for large themes

## 📖 Resources

- [Documentation](https://websmith.vercel.app)
- [GitHub Repository](https://github.com/foozio/websmith)
- [npm Package](https://www.npmjs.com/package/@websmith/tokens)

## 🚀 Getting Started

```bash
# Install
npm install @websmith/tokens@1.1.0

# Use caching
import { generateCachedCSS } from '@websmith/tokens'
const result = generateCachedCSS(tokens)

# Use optimized generation
import { generateOptimizedCSS } from '@websmith/tokens'
const result = generateOptimizedCSS(tokens, {
  deduplicate: true,
  minify: true
})
```

## 💬 Feedback

We'd love to hear your feedback! Please:
- Report issues on [GitHub Issues](https://github.com/foozio/websmith/issues)
- Share your experience using the new features
- Suggest improvements or new features

---

**Full Diff**: [v1.0.0...v1.1.0](https://github.com/foozio/websmith/compare/v1.0.0...v1.1.0)
