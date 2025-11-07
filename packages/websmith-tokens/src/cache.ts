/**
 * Token generation caching utilities
 * Implements LRU (Least Recently Used) cache with configurable size and TTL
 */

export interface CacheOptions {
  maxSize?: number
  ttl?: number // Time to live in milliseconds
  enabled?: boolean
}

export interface CacheEntry<T> {
  value: T
  timestamp: number
  hits: number
}

export interface CacheStats {
  hits: number
  misses: number
  size: number
  maxSize: number
  hitRate: number
  evictions: number
}

/**
 * LRU Cache implementation for token generation results
 */
export class TokenCache<T = any> {
  private cache: Map<string, CacheEntry<T>>
  private maxSize: number
  private ttl: number
  private enabled: boolean
  private hits: number = 0
  private misses: number = 0
  private evictions: number = 0

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize ?? 100
    this.ttl = options.ttl ?? 1000 * 60 * 5 // Default 5 minutes
    this.enabled = options.enabled ?? true
    this.cache = new Map()
  }

  /**
   * Generate a cache key from input parameters
   */
  private generateKey(params: any): string {
    return JSON.stringify(params, Object.keys(params).sort())
  }

  /**
   * Check if a cache entry is still valid
   */
  private isValid(entry: CacheEntry<T>): boolean {
    if (!this.enabled) return false
    const age = Date.now() - entry.timestamp
    return age < this.ttl
  }

  /**
   * Get a value from the cache
   */
  get(params: any): T | undefined {
    if (!this.enabled) return undefined

    const key = this.generateKey(params)
    const entry = this.cache.get(key)

    if (!entry) {
      this.misses++
      return undefined
    }

    if (!this.isValid(entry)) {
      this.cache.delete(key)
      this.misses++
      return undefined
    }

    // Update hit count and move to end (most recently used)
    entry.hits++
    this.cache.delete(key)
    this.cache.set(key, entry)
    this.hits++

    return entry.value
  }

  /**
   * Set a value in the cache
   */
  set(params: any, value: T): void {
    if (!this.enabled) return

    const key = this.generateKey(params)

    // Evict oldest entry if cache is full
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value
      if (firstKey !== undefined) {
        this.cache.delete(firstKey)
        this.evictions++
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      hits: 0,
    })
  }

  /**
   * Check if a value exists in the cache
   */
  has(params: any): boolean {
    if (!this.enabled) return false

    const key = this.generateKey(params)
    const entry = this.cache.get(key)

    if (!entry) return false
    if (!this.isValid(entry)) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  /**
   * Clear the entire cache
   */
  clear(): void {
    this.cache.clear()
    this.hits = 0
    this.misses = 0
    this.evictions = 0
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const total = this.hits + this.misses
    return {
      hits: this.hits,
      misses: this.misses,
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: total > 0 ? this.hits / total : 0,
      evictions: this.evictions,
    }
  }

  /**
   * Enable or disable the cache
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled
    if (!enabled) {
      this.clear()
    }
  }

  /**
   * Check if cache is enabled
   */
  isEnabled(): boolean {
    return this.enabled
  }

  /**
   * Get current cache size
   */
  size(): number {
    return this.cache.size
  }

  /**
   * Remove expired entries
   */
  prune(): number {
    let pruned = 0
    const now = Date.now()

    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (now - entry.timestamp >= this.ttl) {
        this.cache.delete(key)
        pruned++
      }
    }

    return pruned
  }
}

/**
 * Decorator function to cache the result of a function
 */
export function cached<T extends (...args: any[]) => any>(
  cache: TokenCache,
  fn: T
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    const cached = cache.get(args)
    if (cached !== undefined) {
      return cached
    }

    const result = fn(...args)
    cache.set(args, result)
    return result
  }) as T
}

/**
 * Global cache instances for different token types
 */
export const colorCache = new TokenCache({
  maxSize: 200,
  ttl: 1000 * 60 * 10, // 10 minutes
  enabled: process.env.NODE_ENV !== 'test' || process.env.WEBSMITH_CACHE === 'true',
})

export const typographyCache = new TokenCache({
  maxSize: 100,
  ttl: 1000 * 60 * 10, // 10 minutes
  enabled: process.env.NODE_ENV !== 'test' || process.env.WEBSMITH_CACHE === 'true',
})

export const spacingCache = new TokenCache({
  maxSize: 50,
  ttl: 1000 * 60 * 10, // 10 minutes
  enabled: process.env.NODE_ENV !== 'test' || process.env.WEBSMITH_CACHE === 'true',
})

/**
 * Get combined cache statistics
 */
export function getAllCacheStats() {
  return {
    color: colorCache.getStats(),
    typography: typographyCache.getStats(),
    spacing: spacingCache.getStats(),
  }
}

/**
 * Clear all caches
 */
export function clearAllCaches(): void {
  colorCache.clear()
  typographyCache.clear()
  spacingCache.clear()
}

/**
 * Prune all caches
 */
export function pruneAllCaches(): number {
  return colorCache.prune() + typographyCache.prune() + spacingCache.prune()
}
