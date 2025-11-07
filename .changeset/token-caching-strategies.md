---
"@websmith/tokens": minor
---

Implement comprehensive caching strategies for token generation

- Add LRU cache implementation with configurable size and TTL
- Integrate caching into color, typography, and spacing generators
- Add cache statistics tracking (hits, misses, evictions, hit rate)
- Integrate cache metrics with performance monitoring system
- Add comprehensive test coverage for caching functionality
- Export cache utilities for external use and testing

This significantly improves performance for repeated token generation operations, especially beneficial for applications that generate tokens dynamically or frequently rebuild themes.
