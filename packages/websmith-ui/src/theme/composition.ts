/**
 * Theme composition and inheritance utilities
 * Allows creating derived themes and composing multiple theme configurations
 */

export interface ThemeTokens {
  colors?: Record<string, any>
  spacing?: Record<string, any>
  typography?: Record<string, any>
  shadows?: Record<string, any>
  borders?: Record<string, any>
  [key: string]: any
}

export interface ThemeVariant {
  name: string
  tokens: ThemeTokens
  extends?: string
  overrides?: ThemeTokens
}

export interface ComposedTheme {
  name: string
  tokens: ThemeTokens
  variants: Record<string, ThemeTokens>
  parent?: string
}

/**
 * Deep merge two objects
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target }

  for (const key in source) {
    const sourceValue = source[key]
    const targetValue = result[key]

    if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
      if (targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue)) {
        result[key] = deepMerge(targetValue, sourceValue) as any
      } else {
        result[key] = { ...sourceValue } as any
      }
    } else {
      result[key] = sourceValue as any
    }
  }

  return result
}

/**
 * Theme Composer class
 * Manages theme composition, inheritance, and variants
 */
export class ThemeComposer {
  private themes: Map<string, ComposedTheme> = new Map()
  private baseTheme: ThemeTokens = {}

  constructor(baseTheme?: ThemeTokens) {
    if (baseTheme) {
      this.baseTheme = baseTheme
    }
  }

  /**
   * Set base theme
   */
  setBaseTheme(tokens: ThemeTokens): void {
    this.baseTheme = tokens
  }

  /**
   * Get base theme
   */
  getBaseTheme(): ThemeTokens {
    return this.baseTheme
  }

  /**
   * Register a theme
   */
  registerTheme(theme: ComposedTheme): void {
    this.themes.set(theme.name, theme)
  }

  /**
   * Create a theme that extends another
   */
  extendTheme(name: string, parentName: string, overrides: ThemeTokens): ComposedTheme {
    const parent = this.themes.get(parentName)
    if (!parent) {
      throw new Error(`Parent theme "${parentName}" not found`)
    }

    const tokens = deepMerge(parent.tokens, overrides)
    const theme: ComposedTheme = {
      name,
      tokens,
      variants: {},
      parent: parentName
    }

    this.registerTheme(theme)
    return theme
  }

  /**
   * Compose multiple themes
   */
  composeThemes(name: string, ...themeNames: string[]): ComposedTheme {
    let tokens: ThemeTokens = { ...this.baseTheme }

    for (const themeName of themeNames) {
      const theme = this.themes.get(themeName)
      if (theme) {
        tokens = deepMerge(tokens, theme.tokens)
      }
    }

    const composed: ComposedTheme = {
      name,
      tokens,
      variants: {}
    }

    this.registerTheme(composed)
    return composed
  }

  /**
   * Add a variant to a theme
   */
  addVariant(themeName: string, variantName: string, tokens: ThemeTokens): void {
    const theme = this.themes.get(themeName)
    if (!theme) {
      throw new Error(`Theme "${themeName}" not found`)
    }

    theme.variants[variantName] = deepMerge(theme.tokens, tokens)
  }

  /**
   * Get a theme by name
   */
  getTheme(name: string): ComposedTheme | undefined {
    return this.themes.get(name)
  }

  /**
   * Get theme tokens with variant applied
   */
  getThemeWithVariant(themeName: string, variantName: string): ThemeTokens {
    const theme = this.themes.get(themeName)
    if (!theme) {
      throw new Error(`Theme "${themeName}" not found`)
    }

    const variant = theme.variants[variantName]
    if (!variant) {
      throw new Error(`Variant "${variantName}" not found in theme "${themeName}"`)
    }

    return variant
  }

  /**
   * Get all registered themes
   */
  getAllThemes(): ComposedTheme[] {
    return Array.from(this.themes.values())
  }

  /**
   * Check if theme exists
   */
  hasTheme(name: string): boolean {
    return this.themes.has(name)
  }

  /**
   * Remove a theme
   */
  removeTheme(name: string): boolean {
    return this.themes.delete(name)
  }

  /**
   * Clear all themes
   */
  clearThemes(): void {
    this.themes.clear()
  }
}

/**
 * Create a theme from base tokens
 */
export function createTheme(name: string, tokens: ThemeTokens): ComposedTheme {
  return {
    name,
    tokens,
    variants: {}
  }
}

/**
 * Extend a theme with overrides
 */
export function extendTheme(base: ComposedTheme, overrides: ThemeTokens): ComposedTheme {
  return {
    ...base,
    tokens: deepMerge(base.tokens, overrides),
    parent: base.name
  }
}

/**
 * Merge multiple themes
 */
export function mergeThemes(...themes: ThemeTokens[]): ThemeTokens {
  return themes.reduce((acc, theme) => deepMerge(acc, theme), {})
}

/**
 * Create theme variants
 */
export function createVariants(
  baseTokens: ThemeTokens,
  variants: Record<string, ThemeTokens>
): Record<string, ThemeTokens> {
  const result: Record<string, ThemeTokens> = {}

  for (const [name, overrides] of Object.entries(variants)) {
    result[name] = deepMerge(baseTokens, overrides)
  }

  return result
}

/**
 * Apply theme overrides conditionally
 */
export function applyOverrides(
  tokens: ThemeTokens,
  condition: boolean,
  overrides: ThemeTokens
): ThemeTokens {
  return condition ? deepMerge(tokens, overrides) : tokens
}

/**
 * Create responsive theme tokens
 */
export function createResponsiveTokens(
  breakpoints: Record<string, ThemeTokens>
): Record<string, ThemeTokens> {
  return breakpoints
}

/**
 * Interpolate between two token values
 */
export function interpolateTokens(
  from: ThemeTokens,
  to: ThemeTokens,
  progress: number
): ThemeTokens {
  const result: ThemeTokens = {}

  for (const key in from) {
    const fromValue = from[key]
    const toValue = to[key]

    if (typeof fromValue === 'number' && typeof toValue === 'number') {
      result[key] = fromValue + (toValue - fromValue) * progress
    } else if (typeof fromValue === 'object' && typeof toValue === 'object') {
      result[key] = interpolateTokens(fromValue, toValue, progress)
    } else {
      result[key] = progress < 0.5 ? fromValue : toValue
    }
  }

  return result
}

/**
 * Create theme with semantic tokens
 */
export function createSemanticTheme(
  primitives: ThemeTokens,
  semanticMapping: Record<string, string>
): ThemeTokens {
  const result: ThemeTokens = { ...primitives }

  for (const [semantic, primitive] of Object.entries(semanticMapping)) {
    const keys = primitive.split('.')
    let value: any = primitives

    for (const key of keys) {
      value = value?.[key]
    }

    if (value !== undefined) {
      const semanticKeys = semantic.split('.')
      let target: any = result

      for (let i = 0; i < semanticKeys.length - 1; i++) {
        const key = semanticKeys[i]
        if (!target[key]) {
          target[key] = {}
        }
        target = target[key]
      }

      target[semanticKeys[semanticKeys.length - 1]] = value
    }
  }

  return result
}

/**
 * Validate theme structure
 */
export function validateTheme(tokens: ThemeTokens, schema: Record<string, string[]>): boolean {
  for (const [category, requiredKeys] of Object.entries(schema)) {
    const categoryTokens = tokens[category]
    if (!categoryTokens || typeof categoryTokens !== 'object') {
      return false
    }

    for (const key of requiredKeys) {
      if (!(key in categoryTokens)) {
        return false
      }
    }
  }

  return true
}

/**
 * Extract theme subset
 */
export function extractThemeSubset(tokens: ThemeTokens, keys: string[]): ThemeTokens {
  const result: ThemeTokens = {}

  for (const key of keys) {
    if (key in tokens) {
      result[key] = tokens[key]
    }
  }

  return result
}

/**
 * Transform theme tokens
 */
export function transformTheme(
  tokens: ThemeTokens,
  transformer: (key: string, value: any, path: string[]) => any,
  path: string[] = []
): ThemeTokens {
  const result: ThemeTokens = {}

  for (const [key, value] of Object.entries(tokens)) {
    const currentPath = [...path, key]

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = transformTheme(value, transformer, currentPath)
    } else {
      result[key] = transformer(key, value, currentPath)
    }
  }

  return result
}

/**
 * Create theme preset
 */
export interface ThemePreset {
  name: string
  description?: string
  tokens: ThemeTokens
  variants?: Record<string, ThemeTokens>
}

export function createPreset(
  name: string,
  tokens: ThemeTokens,
  options?: {
    description?: string
    variants?: Record<string, ThemeTokens>
  }
): ThemePreset {
  return {
    name,
    description: options?.description,
    tokens,
    variants: options?.variants
  }
}

/**
 * Apply theme preset
 */
export function applyPreset(preset: ThemePreset, overrides?: ThemeTokens): ThemeTokens {
  return overrides ? deepMerge(preset.tokens, overrides) : preset.tokens
}

/**
 * Default theme composer instance
 */
let defaultComposer: ThemeComposer | null = null

/**
 * Get default theme composer
 */
export function getThemeComposer(): ThemeComposer {
  if (!defaultComposer) {
    defaultComposer = new ThemeComposer()
  }
  return defaultComposer
}

/**
 * Initialize theme composer with base theme
 */
export function initThemeComposer(baseTheme?: ThemeTokens): ThemeComposer {
  defaultComposer = new ThemeComposer(baseTheme)
  return defaultComposer
}
