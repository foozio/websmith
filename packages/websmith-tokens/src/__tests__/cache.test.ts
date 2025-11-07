import { describe, expect, it, beforeEach, vi } from 'vitest'
import { 
  TokenCache, 
  colorCache, 
  typographyCache, 
  spacingCache,
  getAllCacheStats,
  clearAllCaches,
  pruneAllCaches
} from '../cache'

describe('TokenCache', () => {
  let cache: TokenCache<string>

  beforeEach(() => {
    cache = new TokenCache({ maxSize: 3, ttl: 1000, enabled: true })
  })

  describe('basic operations', () => {
    it('stores and retrieves values', () => {
      cache.set({ key: 'test' }, 'value')
      expect(cache.get({ key: 'test' })).toBe('value')
    })

    it('returns undefined for non-existent keys', () => {
      expect(cache.get({ key: 'nonexistent' })).toBeUndefined()
    })

    it('checks if key exists', () => {
      cache.set({ key: 'test' }, 'value')
      expect(cache.has({ key: 'test' })).toBe(true)
      expect(cache.has({ key: 'other' })).toBe(false)
    })

    it('generates consistent keys for same input', () => {
      cache.set({ a: 1, b: 2 }, 'value1')
      expect(cache.get({ b: 2, a: 1 })).toBe('value1') // Different order, same key
    })
  })

  describe('LRU eviction', () => {
    it('evicts oldest entry when cache is full', () => {
      cache.set({ key: '1' }, 'value1')
      cache.set({ key: '2' }, 'value2')
      cache.set({ key: '3' }, 'value3')
      cache.set({ key: '4' }, 'value4') // Should evict key: '1'

      expect(cache.get({ key: '1' })).toBeUndefined()
      expect(cache.get({ key: '2' })).toBe('value2')
      expect(cache.get({ key: '3' })).toBe('value3')
      expect(cache.get({ key: '4' })).toBe('value4')
    })

    it('updates LRU order on access', () => {
      cache.set({ key: '1' }, 'value1')
      cache.set({ key: '2' }, 'value2')
      cache.set({ key: '3' }, 'value3')
      
      // Access key '1' to make it most recently used
      cache.get({ key: '1' })
      
      // Add new entry, should evict '2' (oldest)
      cache.set({ key: '4' }, 'value4')

      expect(cache.get({ key: '1' })).toBe('value1')
      expect(cache.get({ key: '2' })).toBeUndefined()
      expect(cache.get({ key: '3' })).toBe('value3')
      expect(cache.get({ key: '4' })).toBe('value4')
    })
  })

  describe('TTL expiration', () => {
    it('expires entries after TTL', async () => {
      const shortCache = new TokenCache({ maxSize: 10, ttl: 50, enabled: true })
      shortCache.set({ key: 'test' }, 'value')
      
      expect(shortCache.get({ key: 'test' })).toBe('value')
      
      // Wait for TTL to expire
      await new Promise(resolve => setTimeout(resolve, 60))
      
      expect(shortCache.get({ key: 'test' })).toBeUndefined()
    })

    it('prunes expired entries', async () => {
      const shortCache = new TokenCache({ maxSize: 10, ttl: 50, enabled: true })
      shortCache.set({ key: '1' }, 'value1')
      shortCache.set({ key: '2' }, 'value2')
      
      await new Promise(resolve => setTimeout(resolve, 60))
      
      const pruned = shortCache.prune()
      expect(pruned).toBe(2)
      expect(shortCache.size()).toBe(0)
    })
  })

  describe('statistics', () => {
    it('tracks hits and misses', () => {
      cache.set({ key: 'test' }, 'value')
      
      cache.get({ key: 'test' }) // hit
      cache.get({ key: 'test' }) // hit
      cache.get({ key: 'other' }) // miss
      
      const stats = cache.getStats()
      expect(stats.hits).toBe(2)
      expect(stats.misses).toBe(1)
      expect(stats.hitRate).toBeCloseTo(0.667, 2)
    })

    it('tracks evictions', () => {
      cache.set({ key: '1' }, 'value1')
      cache.set({ key: '2' }, 'value2')
      cache.set({ key: '3' }, 'value3')
      cache.set({ key: '4' }, 'value4') // eviction
      cache.set({ key: '5' }, 'value5') // eviction
      
      const stats = cache.getStats()
      expect(stats.evictions).toBe(2)
    })

    it('tracks cache size', () => {
      expect(cache.size()).toBe(0)
      
      cache.set({ key: '1' }, 'value1')
      expect(cache.size()).toBe(1)
      
      cache.set({ key: '2' }, 'value2')
      expect(cache.size()).toBe(2)
    })
  })

  describe('enable/disable', () => {
    it('does not cache when disabled', () => {
      cache.setEnabled(false)
      cache.set({ key: 'test' }, 'value')
      
      expect(cache.get({ key: 'test' })).toBeUndefined()
      expect(cache.size()).toBe(0)
    })

    it('clears cache when disabled', () => {
      cache.set({ key: 'test' }, 'value')
      expect(cache.size()).toBe(1)
      
      cache.setEnabled(false)
      expect(cache.size()).toBe(0)
    })

    it('can be re-enabled', () => {
      cache.setEnabled(false)
      cache.setEnabled(true)
      
      cache.set({ key: 'test' }, 'value')
      expect(cache.get({ key: 'test' })).toBe('value')
    })
  })

  describe('clear', () => {
    it('removes all entries', () => {
      cache.set({ key: '1' }, 'value1')
      cache.set({ key: '2' }, 'value2')
      
      cache.clear()
      
      expect(cache.size()).toBe(0)
      expect(cache.get({ key: '1' })).toBeUndefined()
      expect(cache.get({ key: '2' })).toBeUndefined()
    })

    it('resets statistics', () => {
      cache.set({ key: 'test' }, 'value')
      cache.get({ key: 'test' })
      cache.get({ key: 'other' })
      
      cache.clear()
      
      const stats = cache.getStats()
      expect(stats.hits).toBe(0)
      expect(stats.misses).toBe(0)
      expect(stats.evictions).toBe(0)
    })
  })
})

describe('global cache instances', () => {
  beforeEach(() => {
    clearAllCaches()
  })

  it('provides separate caches for different token types', () => {
    expect(colorCache).toBeInstanceOf(TokenCache)
    expect(typographyCache).toBeInstanceOf(TokenCache)
    expect(spacingCache).toBeInstanceOf(TokenCache)
  })

  it('getAllCacheStats returns stats for all caches', () => {
    // Enable caches for this test
    colorCache.setEnabled(true)
    typographyCache.setEnabled(true)
    spacingCache.setEnabled(true)
    
    colorCache.set({ test: 'color' }, 'red')
    typographyCache.set({ test: 'typo' }, '16px')
    spacingCache.set({ test: 'space' }, '8px')

    const allStats = getAllCacheStats()
    
    expect(allStats.color).toBeDefined()
    expect(allStats.typography).toBeDefined()
    expect(allStats.spacing).toBeDefined()
    
    expect(allStats.color.size).toBe(1)
    expect(allStats.typography.size).toBe(1)
    expect(allStats.spacing.size).toBe(1)
  })

  it('clearAllCaches clears all cache instances', () => {
    colorCache.set({ test: 'color' }, 'red')
    typographyCache.set({ test: 'typo' }, '16px')
    spacingCache.set({ test: 'space' }, '8px')

    clearAllCaches()

    expect(colorCache.size()).toBe(0)
    expect(typographyCache.size()).toBe(0)
    expect(spacingCache.size()).toBe(0)
  })

  it('pruneAllCaches removes expired entries from all caches', async () => {
    // Create short-lived entries
    const shortColorCache = new TokenCache({ maxSize: 10, ttl: 50, enabled: true })
    const shortTypoCache = new TokenCache({ maxSize: 10, ttl: 50, enabled: true })
    
    shortColorCache.set({ test: 'color' }, 'red')
    shortTypoCache.set({ test: 'typo' }, '16px')
    
    await new Promise(resolve => setTimeout(resolve, 60))
    
    const prunedColor = shortColorCache.prune()
    const prunedTypo = shortTypoCache.prune()
    
    expect(prunedColor + prunedTypo).toBeGreaterThan(0)
  })
})

describe('cache integration with generators', () => {
  beforeEach(() => {
    clearAllCaches()
    // Enable caches for integration tests
    colorCache.setEnabled(true)
    typographyCache.setEnabled(true)
    spacingCache.setEnabled(true)
  })

  it('caches color palette generation', async () => {
    const { generatePalette } = await import('../colors/generator')
    
    const params = { h: 210, s: 60, l: 50 }
    const result1 = generatePalette(params)
    const result2 = generatePalette(params)
    
    // Should return same reference (cached)
    expect(result1).toBe(result2)
    
    const stats = colorCache.getStats()
    expect(stats.hits).toBeGreaterThan(0)
  })

  it('caches typography scale generation', async () => {
    const { generateTypographyScale } = await import('../typography/generator')
    
    const options = { baseSize: 16, ratio: 1.25 }
    const result1 = generateTypographyScale(options)
    const result2 = generateTypographyScale(options)
    
    // Should return same reference (cached)
    expect(result1).toBe(result2)
    
    const stats = typographyCache.getStats()
    expect(stats.hits).toBeGreaterThan(0)
  })

  it('caches spacing scale generation', async () => {
    const { generateSpacingScale } = await import('../spacing/generator')
    
    const result1 = generateSpacingScale(8)
    const result2 = generateSpacingScale(8)
    
    // Should return same reference (cached)
    expect(result1).toBe(result2)
    
    const stats = spacingCache.getStats()
    expect(stats.hits).toBeGreaterThan(0)
  })
})
