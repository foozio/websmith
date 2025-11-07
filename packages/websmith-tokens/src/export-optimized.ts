/**
 * Optimized CSS variable generation for large themes
 * Uses efficient string building, deduplication, and batching
 */

export interface CSSGenerationOptions {
  prefix?: string
  includeFallbacks?: boolean
  includeTheme?: boolean
  batchSize?: number
  deduplicate?: boolean
  minify?: boolean
  selector?: string
}

export interface CSSGenerationResult {
  css: string
  stats: {
    variableCount: number
    duplicatesRemoved: number
    generationTime: number
    outputSize: number
  }
}

/**
 * Efficient string builder using array joining
 */
class CSSBuilder {
  private parts: string[] = []
  private indent: number = 0
  private indentStr: string = '  '

  write(text: string): void {
    if (this.indent > 0) {
      this.parts.push(this.indentStr.repeat(this.indent) + text)
    } else {
      this.parts.push(text)
    }
  }

  writeLine(text: string = ''): void {
    this.write(text + '\n')
  }

  increaseIndent(): void {
    this.indent++
  }

  decreaseIndent(): void {
    this.indent = Math.max(0, this.indent - 1)
  }

  toString(): string {
    return this.parts.join('')
  }

  clear(): void {
    this.parts = []
    this.indent = 0
  }

  size(): number {
    return this.parts.reduce((sum, part) => sum + part.length, 0)
  }
}

/**
 * Deduplicate CSS variables by value
 */
function deduplicateVariables(
  variables: Map<string, string>
): { deduplicated: Map<string, string>; duplicatesRemoved: number } {
  const valueToKeys = new Map<string, string[]>()
  const deduplicated = new Map<string, string>()
  let duplicatesRemoved = 0

  // Group variables by value
  for (const [key, value] of Array.from(variables.entries())) {
    const existing = valueToKeys.get(value)
    if (existing) {
      existing.push(key)
    } else {
      valueToKeys.set(value, [key])
    }
  }

  // Keep first occurrence of each value
  for (const [value, keys] of Array.from(valueToKeys.entries())) {
    deduplicated.set(keys[0], value)
    if (keys.length > 1) {
      duplicatesRemoved += keys.length - 1
    }
  }

  return { deduplicated, duplicatesRemoved }
}

/**
 * Process tokens into flat CSS variable map
 */
function flattenTokens(
  obj: Record<string, unknown>,
  prefix: string = 'ws',
  path: string[] = [],
  result: Map<string, string> = new Map()
): Map<string, string> {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = [...path, key]
    const cssVar = `--${prefix}-${currentPath.join('-')}`

    if (typeof value === 'string' || typeof value === 'number') {
      result.set(cssVar, String(value))
    } else if (value !== null && typeof value === 'object') {
      flattenTokens(value as Record<string, unknown>, prefix, currentPath, result)
    }
  }

  return result
}

/**
 * Generate CSS variables in batches for better performance
 */
function* generateCSSInBatches(
  variables: Map<string, string>,
  batchSize: number = 100
): Generator<string[]> {
  const entries = Array.from(variables.entries())
  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize)
    yield batch.map(([key, value]) => `${key}: ${value};`)
  }
}

/**
 * Optimized CSS variable generation
 */
export function generateOptimizedCSS(
  tokens: Record<string, unknown>,
  options: CSSGenerationOptions = {}
): CSSGenerationResult {
  const startTime = performance.now()
  const {
    prefix = 'ws',
    includeFallbacks = false,
    includeTheme = false,
    batchSize = 100,
    deduplicate = true,
    minify = false,
    selector = ':root'
  } = options

  const builder = new CSSBuilder()
  let duplicatesRemoved = 0

  // Flatten tokens into CSS variables
  let variables = flattenTokens(tokens, prefix)
  const originalCount = variables.size

  // Deduplicate if requested
  if (deduplicate) {
    const result = deduplicateVariables(variables)
    variables = result.deduplicated
    duplicatesRemoved = result.duplicatesRemoved
  }

  // Generate CSS
  if (!minify) {
    builder.writeLine(`/* Websmith Design Tokens */`)
    builder.writeLine(`/* Generated: ${new Date().toISOString()} */`)
    builder.writeLine(`/* Variables: ${variables.size} */`)
    if (duplicatesRemoved > 0) {
      builder.writeLine(`/* Duplicates removed: ${duplicatesRemoved} */`)
    }
    builder.writeLine()
  }

  builder.writeLine(`${selector} {`)
  builder.increaseIndent()

  // Generate variables in batches
  for (const batch of Array.from(generateCSSInBatches(variables, batchSize))) {
    for (const line of batch) {
      builder.writeLine(line)
    }
  }

  builder.decreaseIndent()
  builder.writeLine('}')

  // Add theme variations if requested
  if (includeTheme && !minify) {
    builder.writeLine()
    builder.writeLine(`/* Dark theme */`)
    builder.writeLine(`[data-theme="dark"] {`)
    builder.increaseIndent()
    builder.writeLine(`--${prefix}-background: #09090b;`)
    builder.writeLine(`--${prefix}-foreground: #fafafa;`)
    builder.decreaseIndent()
    builder.writeLine('}')
  }

  const css = builder.toString()
  const endTime = performance.now()

  return {
    css: minify ? minifyCSS(css) : css,
    stats: {
      variableCount: variables.size,
      duplicatesRemoved,
      generationTime: endTime - startTime,
      outputSize: css.length
    }
  }
}

/**
 * Minify CSS by removing unnecessary whitespace
 */
function minifyCSS(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*{\s*/g, '{') // Remove space around {
    .replace(/\s*}\s*/g, '}') // Remove space around }
    .replace(/\s*:\s*/g, ':') // Remove space around :
    .replace(/\s*;\s*/g, ';') // Remove space around ;
    .replace(/;\s*}/g, '}') // Remove last semicolon before }
    .trim()
}

/**
 * Stream CSS generation for very large themes
 * Returns an async generator that yields CSS chunks
 */
export async function* streamOptimizedCSS(
  tokens: Record<string, unknown>,
  options: CSSGenerationOptions = {}
): AsyncGenerator<string> {
  const {
    prefix = 'ws',
    batchSize = 100,
    deduplicate = true,
    minify = false,
    selector = ':root'
  } = options

  // Flatten and optionally deduplicate
  let variables = flattenTokens(tokens, prefix)
  if (deduplicate) {
    const result = deduplicateVariables(variables)
    variables = result.deduplicated
  }

  // Yield header
  if (!minify) {
    yield `/* Websmith Design Tokens */\n`
    yield `/* Variables: ${variables.size} */\n\n`
  }

  yield `${selector} {\n`

  // Yield variables in batches
  for (const batch of Array.from(generateCSSInBatches(variables, batchSize))) {
    const chunk = batch.map((line: string) => `  ${line}\n`).join('')
    yield chunk
    
    // Allow event loop to process other tasks
    await new Promise(resolve => setTimeout(resolve, 0))
  }

  yield '}\n'
}

/**
 * Generate CSS with caching support
 */
const cssCache = new Map<string, CSSGenerationResult>()

export function generateCachedCSS(
  tokens: Record<string, unknown>,
  options: CSSGenerationOptions = {}
): CSSGenerationResult {
  const cacheKey = JSON.stringify({ tokens, options })
  
  const cached = cssCache.get(cacheKey)
  if (cached) {
    return {
      ...cached,
      stats: {
        ...cached.stats,
        generationTime: 0 // Indicate it was cached
      }
    }
  }

  const result = generateOptimizedCSS(tokens, options)
  cssCache.set(cacheKey, result)
  
  return result
}

/**
 * Clear CSS generation cache
 */
export function clearCSSCache(): void {
  cssCache.clear()
}

/**
 * Get CSS cache statistics
 */
export function getCSSCacheStats() {
  return {
    size: cssCache.size,
    memoryUsage: Array.from(cssCache.values()).reduce(
      (sum, result) => sum + result.css.length,
      0
    )
  }
}

/**
 * Generate CSS with compression
 */
export function generateCompressedCSS(
  tokens: Record<string, unknown>,
  options: CSSGenerationOptions = {}
): { compressed: string; original: string; compressionRatio: number } {
  const result = generateOptimizedCSS(tokens, { ...options, minify: false })
  const minified = minifyCSS(result.css)
  
  return {
    compressed: minified,
    original: result.css,
    compressionRatio: minified.length / result.css.length
  }
}

/**
 * Generate CSS with source map support
 */
export interface CSSWithSourceMap {
  css: string
  map: {
    version: number
    sources: string[]
    names: string[]
    mappings: string
  }
}

export function generateCSSWithSourceMap(
  tokens: Record<string, unknown>,
  options: CSSGenerationOptions = {}
): CSSWithSourceMap {
  const result = generateOptimizedCSS(tokens, options)
  
  // Simple source map (can be enhanced)
  return {
    css: result.css,
    map: {
      version: 3,
      sources: ['tokens.json'],
      names: [],
      mappings: '' // Would need proper source map generation
    }
  }
}

/**
 * Batch process multiple token sets
 */
export function generateBatchCSS(
  tokenSets: Array<{ name: string; tokens: Record<string, unknown> }>,
  options: CSSGenerationOptions = {}
): Map<string, CSSGenerationResult> {
  const results = new Map<string, CSSGenerationResult>()
  
  for (const { name, tokens } of tokenSets) {
    const result = generateOptimizedCSS(tokens, options)
    results.set(name, result)
  }
  
  return results
}

/**
 * Generate CSS with custom formatting
 */
export interface CSSFormattingOptions extends CSSGenerationOptions {
  indentSize?: number
  indentChar?: 'space' | 'tab'
  lineEnding?: 'lf' | 'crlf'
  sortVariables?: boolean
}

export function generateFormattedCSS(
  tokens: Record<string, unknown>,
  options: CSSFormattingOptions = {}
): CSSGenerationResult {
  const {
    indentSize = 2,
    indentChar = 'space',
    lineEnding = 'lf',
    sortVariables = false,
    ...cssOptions
  } = options

  let variables = flattenTokens(tokens, cssOptions.prefix || 'ws')
  
  // Sort variables if requested
  if (sortVariables) {
    variables = new Map(Array.from(variables.entries()).sort((a, b) => a[0].localeCompare(b[0])))
  }

  const result = generateOptimizedCSS({ ...Object.fromEntries(variables) }, cssOptions)
  
  // Apply formatting
  let formatted = result.css
  if (indentChar === 'tab') {
    formatted = formatted.replace(/  /g, '\t')
  } else if (indentSize !== 2) {
    formatted = formatted.replace(/  /g, ' '.repeat(indentSize))
  }
  
  if (lineEnding === 'crlf') {
    formatted = formatted.replace(/\n/g, '\r\n')
  }
  
  return {
    ...result,
    css: formatted
  }
}
