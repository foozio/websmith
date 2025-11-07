// Spacing scale calculator - 8px base
import { spacingCache } from '../cache'

export function generateSpacingScale(base: number = 8, steps: number[] = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64]): Record<string, string> {
  // Check cache first
  const cacheKey = { base, steps }
  const cached = spacingCache.get(cacheKey)
  if (cached !== undefined) {
    return cached
  }

  const scale: Record<string, string> = {}

  steps.forEach(step => {
    scale[step] = `${step * base / 2}px`
  })

  // Store in cache
  spacingCache.set(cacheKey, scale)
  return scale
}