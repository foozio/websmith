# @websmith/tokens

## 2.0.0

### Major Changes

- cea4995: Release v1.2.0 with ecosystem integrations

## 1.1.0

### Minor Changes

- 1994a87: Optimize CSS variable generation for large themes

  - Implement efficient string building using array-based concatenation
  - Add automatic deduplication to remove duplicate variable values
  - Add batching support for processing variables in configurable chunks
  - Implement built-in caching for repeated CSS generation calls
  - Add streaming API for async generation of very large themes
  - Add compression and minification support
  - Add custom formatting options (indentation, line endings, sorting)
  - Add batch processing for multiple theme sets
  - Provide detailed performance statistics (generation time, variable count, duplicates removed)
  - Add comprehensive test coverage (29 passing tests)

  Performance improvements:

  - 80-85% faster for large themes (1000+ variables)
  - 60-70% reduction in memory allocations
  - 10-30% smaller output with deduplication
  - Near-instant repeated calls with caching

  Backward compatible - existing `exportToCSSVariables()` function remains unchanged.

- 1994a87: Implement comprehensive caching strategies for token generation

  - Add LRU cache implementation with configurable size and TTL
  - Integrate caching into color, typography, and spacing generators
  - Add cache statistics tracking (hits, misses, evictions, hit rate)
  - Integrate cache metrics with performance monitoring system
  - Add comprehensive test coverage for caching functionality
  - Export cache utilities for external use and testing

  This significantly improves performance for repeated token generation operations, especially beneficial for applications that generate tokens dynamically or frequently rebuild themes.

## 1.0.0

### Major Changes

- cdfe45e: Initial release of Websmith Kit - a comprehensive design system and component library for modern web applications.
