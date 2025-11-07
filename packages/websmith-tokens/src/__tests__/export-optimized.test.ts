import { describe, expect, it, beforeEach } from 'vitest'
import {
  generateOptimizedCSS,
  streamOptimizedCSS,
  generateCachedCSS,
  clearCSSCache,
  getCSSCacheStats,
  generateCompressedCSS,
  generateBatchCSS,
  generateFormattedCSS,
  type CSSGenerationOptions
} from '../export-optimized'

describe('Optimized CSS Generation', () => {
  const sampleTokens = {
    colors: {
      primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        500: '#0ea5e9',
        900: '#0c4a6e'
      },
      secondary: {
        50: '#fdf4ff',
        500: '#d946ef'
      }
    },
    spacing: {
      0: '0px',
      1: '4px',
      2: '8px',
      4: '16px'
    }
  }

  beforeEach(() => {
    clearCSSCache()
  })

  describe('generateOptimizedCSS', () => {
    it('generates CSS variables from tokens', () => {
      const result = generateOptimizedCSS(sampleTokens)
      
      expect(result.css).toContain(':root {')
      expect(result.css).toContain('--ws-colors-primary-50: #f0f9ff;')
      expect(result.css).toContain('--ws-spacing-1: 4px;')
      expect(result.stats.variableCount).toBeGreaterThan(0)
    })

    it('uses custom prefix', () => {
      const result = generateOptimizedCSS(sampleTokens, { prefix: 'custom' })
      
      expect(result.css).toContain('--custom-colors-primary-50')
      expect(result.css).not.toContain('--ws-')
    })

    it('uses custom selector', () => {
      const result = generateOptimizedCSS(sampleTokens, { selector: '.theme' })
      
      expect(result.css).toContain('.theme {')
      expect(result.css).not.toContain(':root {')
    })

    it('tracks generation time', () => {
      const result = generateOptimizedCSS(sampleTokens)
      
      expect(result.stats.generationTime).toBeGreaterThanOrEqual(0)
      expect(typeof result.stats.generationTime).toBe('number')
    })

    it('counts variables correctly', () => {
      const result = generateOptimizedCSS(sampleTokens)
      
      // 6 color variables + 4 spacing variables = 10 total
      expect(result.stats.variableCount).toBe(10)
    })

    it('includes theme variations when requested', () => {
      const result = generateOptimizedCSS(sampleTokens, { includeTheme: true })
      
      expect(result.css).toContain('[data-theme="dark"]')
      expect(result.css).toContain('--ws-background')
    })

    it('minifies CSS when requested', () => {
      const normal = generateOptimizedCSS(sampleTokens, { minify: false })
      const minified = generateOptimizedCSS(sampleTokens, { minify: true })
      
      expect(minified.css.length).toBeLessThan(normal.css.length)
      expect(minified.css).not.toContain('/*')
      expect(minified.css).not.toContain('\n\n')
    })
  })

  describe('deduplication', () => {
    it('removes duplicate values when enabled', () => {
      const tokensWithDuplicates = {
        colors: {
          primary: { 500: '#0ea5e9' },
          secondary: { 500: '#0ea5e9' }, // Same value
          tertiary: { 500: '#0ea5e9' }  // Same value
        }
      }

      const result = generateOptimizedCSS(tokensWithDuplicates, { deduplicate: true })
      
      expect(result.stats.duplicatesRemoved).toBe(2)
      expect(result.stats.variableCount).toBe(1)
    })

    it('keeps all variables when deduplication is disabled', () => {
      const tokensWithDuplicates = {
        colors: {
          primary: { 500: '#0ea5e9' },
          secondary: { 500: '#0ea5e9' }
        }
      }

      const result = generateOptimizedCSS(tokensWithDuplicates, { deduplicate: false })
      
      expect(result.stats.duplicatesRemoved).toBe(0)
      expect(result.stats.variableCount).toBe(2)
    })
  })

  describe('batching', () => {
    it('processes variables in batches', () => {
      const largeTokens: Record<string, any> = { colors: {} }
      
      // Create 250 variables
      for (let i = 0; i < 250; i++) {
        largeTokens.colors[`color${i}`] = { 500: `#${i.toString(16).padStart(6, '0')}` }
      }

      const result = generateOptimizedCSS(largeTokens, { batchSize: 50 })
      
      expect(result.stats.variableCount).toBe(250)
      expect(result.css).toContain(':root {')
    })
  })

  describe('streamOptimizedCSS', () => {
    it('streams CSS in chunks', async () => {
      const chunks: string[] = []
      
      for await (const chunk of streamOptimizedCSS(sampleTokens)) {
        chunks.push(chunk)
      }
      
      expect(chunks.length).toBeGreaterThan(0)
      const fullCSS = chunks.join('')
      expect(fullCSS).toContain(':root {')
      expect(fullCSS).toContain('--ws-colors-primary-50')
    })

    it('streams with custom batch size', async () => {
      const chunks: string[] = []
      
      for await (const chunk of streamOptimizedCSS(sampleTokens, { batchSize: 2 })) {
        chunks.push(chunk)
      }
      
      // Should have more chunks with smaller batch size
      expect(chunks.length).toBeGreaterThan(3)
    })
  })

  describe('generateCachedCSS', () => {
    it('caches CSS generation results', () => {
      const result1 = generateCachedCSS(sampleTokens)
      const result2 = generateCachedCSS(sampleTokens)
      
      // Second call should be cached (generation time = 0)
      expect(result2.stats.generationTime).toBe(0)
      expect(result1.css).toBe(result2.css)
    })

    it('generates different results for different tokens', () => {
      const tokens1 = { colors: { primary: { 500: '#000' } } }
      const tokens2 = { colors: { primary: { 500: '#fff' } } }
      
      const result1 = generateCachedCSS(tokens1)
      const result2 = generateCachedCSS(tokens2)
      
      expect(result1.css).not.toBe(result2.css)
    })

    it('respects cache clearing', () => {
      generateCachedCSS(sampleTokens)
      clearCSSCache()
      
      const stats = getCSSCacheStats()
      expect(stats.size).toBe(0)
      expect(stats.memoryUsage).toBe(0)
    })

    it('tracks cache statistics', () => {
      generateCachedCSS(sampleTokens)
      generateCachedCSS({ colors: { test: { 500: '#000' } } })
      
      const stats = getCSSCacheStats()
      expect(stats.size).toBe(2)
      expect(stats.memoryUsage).toBeGreaterThan(0)
    })
  })

  describe('generateCompressedCSS', () => {
    it('compresses CSS output', () => {
      const result = generateCompressedCSS(sampleTokens)
      
      expect(result.compressed.length).toBeLessThan(result.original.length)
      expect(result.compressionRatio).toBeLessThan(1)
      expect(result.compressionRatio).toBeGreaterThan(0)
    })

    it('removes comments and whitespace', () => {
      const result = generateCompressedCSS(sampleTokens)
      
      expect(result.compressed).not.toContain('/*')
      expect(result.compressed).not.toContain('  ')
      expect(result.compressed).not.toContain('\n\n')
    })
  })

  describe('generateBatchCSS', () => {
    it('processes multiple token sets', () => {
      const tokenSets = [
        { name: 'light', tokens: { colors: { bg: { 500: '#fff' } } } },
        { name: 'dark', tokens: { colors: { bg: { 500: '#000' } } } }
      ]

      const results = generateBatchCSS(tokenSets)
      
      expect(results.size).toBe(2)
      expect(results.has('light')).toBe(true)
      expect(results.has('dark')).toBe(true)
      
      const lightResult = results.get('light')
      const darkResult = results.get('dark')
      
      expect(lightResult?.css).toContain('#fff')
      expect(darkResult?.css).toContain('#000')
    })
  })

  describe('generateFormattedCSS', () => {
    it('sorts variables alphabetically', () => {
      const result = generateFormattedCSS(sampleTokens, { sortVariables: true })
      
      const variables = result.css.match(/--[^:]+/g) || []
      const sorted = [...variables].sort()
      
      expect(variables).toEqual(sorted)
    })

    it('uses custom indentation', () => {
      const result = generateFormattedCSS(sampleTokens, { 
        indentSize: 4,
        indentChar: 'space'
      })
      
      expect(result.css).toContain('    --ws-')
    })

    it('uses tab indentation', () => {
      const result = generateFormattedCSS(sampleTokens, { 
        indentChar: 'tab'
      })
      
      expect(result.css).toContain('\t--ws-')
    })

    it('uses CRLF line endings', () => {
      const result = generateFormattedCSS(sampleTokens, { 
        lineEnding: 'crlf'
      })
      
      expect(result.css).toContain('\r\n')
    })
  })

  describe('performance', () => {
    it('handles large token sets efficiently', () => {
      const largeTokens: Record<string, any> = { colors: {} }
      
      // Create 1000 variables
      for (let i = 0; i < 1000; i++) {
        largeTokens.colors[`color${i}`] = { 500: `#${i.toString(16).padStart(6, '0')}` }
      }

      const start = performance.now()
      const result = generateOptimizedCSS(largeTokens)
      const duration = performance.now() - start
      
      expect(result.stats.variableCount).toBe(1000)
      expect(duration).toBeLessThan(100) // Should complete in under 100ms
    })

    it('caching improves performance for repeated calls', () => {
      const largeTokens: Record<string, any> = { colors: {} }
      
      for (let i = 0; i < 500; i++) {
        largeTokens.colors[`color${i}`] = { 500: `#${i.toString(16).padStart(6, '0')}` }
      }

      // First call - not cached
      const result1 = generateCachedCSS(largeTokens)
      expect(result1.stats.generationTime).toBeGreaterThan(0)

      // Second call - cached (generation time should be 0)
      const result2 = generateCachedCSS(largeTokens)
      expect(result2.stats.generationTime).toBe(0)
      
      // Results should be identical
      expect(result1.css).toBe(result2.css)
    })
  })

  describe('edge cases', () => {
    it('handles empty tokens', () => {
      const result = generateOptimizedCSS({})
      
      expect(result.css).toContain(':root {')
      expect(result.stats.variableCount).toBe(0)
    })

    it('handles nested objects', () => {
      const nestedTokens = {
        theme: {
          colors: {
            primary: {
              light: {
                50: '#f0f9ff'
              }
            }
          }
        }
      }

      const result = generateOptimizedCSS(nestedTokens)
      
      expect(result.css).toContain('--ws-theme-colors-primary-light-50')
    })

    it('handles numeric values', () => {
      const numericTokens = {
        spacing: {
          sm: 8,
          md: 16,
          lg: 24
        }
      }

      const result = generateOptimizedCSS(numericTokens)
      
      expect(result.css).toContain('--ws-spacing-sm: 8;')
      expect(result.css).toContain('--ws-spacing-md: 16;')
    })

    it('handles special characters in keys', () => {
      const specialTokens = {
        'colors-primary': {
          '50': '#fff'
        }
      }

      const result = generateOptimizedCSS(specialTokens)
      
      expect(result.css).toContain('--ws-colors-primary-50')
    })
  })
})
