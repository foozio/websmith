// Typography scale - Advanced modular scale with mathematical calculations
import { typographyCache } from '../cache'

export interface TypographyScaleOptions {
  baseSize?: number        // Base font size in pixels (default: 16)
  ratio?: number          // Musical ratio for scale (default: 1.25 - major fifth)
  scale?: 'major-third' | 'perfect-fifth' | 'golden-ratio' | 'custom'
  minSize?: number        // Minimum font size (default: 12)
  maxSize?: number        // Maximum font size (default: 96)
  precision?: number      // Decimal precision for sizes (default: 2)
}

export interface FontSizeToken {
  fontSize: string
  lineHeight: string | number
  letterSpacing?: string
  fontWeight?: number
}

export interface TypographyScale {
  fontSizes: Record<string, FontSizeToken>
  lineHeights: Record<string, number>
  letterSpacing: Record<string, string>
  fontWeights: Record<string, number>
}

/**
 * Musical ratios for typography scales
 */
export const MUSICAL_RATIOS = {
  'major-third': 1.25,      // 5:4 ratio
  'perfect-fifth': 1.5,     // 3:2 ratio
  'golden-ratio': 1.618,    // Golden ratio
  'minor-third': 1.2,       // 6:5 ratio
  'major-sixth': 1.667,     // 5:3 ratio
} as const

/**
 * Calculate optimal font size using modular scale
 */
function calculateModularSize(step: number, baseSize: number, ratio: number): number {
  return baseSize * Math.pow(ratio, step)
}

/**
 * Calculate optimal line height based on font size and reading context
 */
function calculateOptimalLineHeight(fontSize: number, context: 'body' | 'heading' | 'display'): number {
  // Different line height strategies for different contexts
  switch (context) {
    case 'body':
      // Body text: comfortable reading line height (1.4-1.6)
      return Math.max(1.4, Math.min(1.6, 20 / fontSize))
    case 'heading':
      // Headings: tighter line height for better visual hierarchy (1.1-1.3)
      return Math.max(1.1, Math.min(1.3, 24 / fontSize))
    case 'display':
      // Display text: very tight line height (1.0-1.2)
      return Math.max(1.0, Math.min(1.2, 28 / fontSize))
    default:
      return 1.5
  }
}

/**
 * Calculate letter spacing based on font size
 */
function calculateLetterSpacing(fontSize: number, weight: number = 400): string {
  // Smaller fonts need more letter spacing for readability
  // Heavier fonts need less letter spacing
  const spacingFactor = Math.max(0, (16 - fontSize) / 16) * (500 - weight) / 100
  const spacing = spacingFactor * 0.05 // Convert to em units
  
  return spacing > 0.01 ? `${spacing.toFixed(3)}em` : 'normal'
}

/**
 * Generate comprehensive typography scale with mathematical calculations
 */
export function generateTypographyScale(options: TypographyScaleOptions = {}): TypographyScale {
  // Check cache first
  const cached = typographyCache.get(options)
  if (cached !== undefined) {
    return cached
  }

  const {
    baseSize = 16,
    ratio = MUSICAL_RATIOS['major-third'],
    scale = 'custom',
    minSize = 12,
    maxSize = 96,
    precision = 2
  } = options

  const actualRatio = scale !== 'custom' ? MUSICAL_RATIOS[scale] : ratio
  
  // Define size steps and their contexts
  const sizeSteps = [
    { name: 'xs', step: -2, context: 'body' as const },
    { name: 'sm', step: -1, context: 'body' as const },
    { name: 'base', step: 0, context: 'body' as const },
    { name: 'lg', step: 1, context: 'body' as const },
    { name: 'xl', step: 2, context: 'heading' as const },
    { name: '2xl', step: 3, context: 'heading' as const },
    { name: '3xl', step: 4, context: 'heading' as const },
    { name: '4xl', step: 5, context: 'display' as const },
    { name: '5xl', step: 6, context: 'display' as const },
    { name: '6xl', step: 7, context: 'display' as const },
    { name: '7xl', step: 8, context: 'display' as const },
    { name: '8xl', step: 9, context: 'display' as const },
    { name: '9xl', step: 10, context: 'display' as const },
  ]

  const fontSizes: Record<string, FontSizeToken> = {}
  const lineHeights: Record<string, number> = {}
  const letterSpacing: Record<string, string> = {}

  // Generate font sizes with optimal line heights and letter spacing
  sizeSteps.forEach(({ name, step, context }) => {
    const calculatedSize = calculateModularSize(step, baseSize, actualRatio)
    const clampedSize = Math.max(minSize, Math.min(maxSize, calculatedSize))
    const fontSize = `${clampedSize.toFixed(precision)}px`
    const lineHeight = calculateOptimalLineHeight(clampedSize, context)
    const letterSpacingValue = calculateLetterSpacing(clampedSize)

    fontSizes[name] = {
      fontSize,
      lineHeight,
      letterSpacing: letterSpacingValue !== 'normal' ? letterSpacingValue : undefined
    }

    lineHeights[name] = lineHeight
    letterSpacing[name] = letterSpacingValue
  })

  // Generate font weights based on common typographic hierarchy
  const fontWeights: Record<string, number> = {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900
  }

  const result = {
    fontSizes,
    lineHeights,
    letterSpacing,
    fontWeights
  }

  // Store in cache
  typographyCache.set(options, result)
  return result
}

/**
 * Generate responsive typography scale
 */
export function generateResponsiveTypographyScale(
  baseOptions: TypographyScaleOptions = {},
  breakpoints: {
    sm?: Partial<TypographyScaleOptions>
    md?: Partial<TypographyScaleOptions>
    lg?: Partial<TypographyScaleOptions>
    xl?: Partial<TypographyScaleOptions>
  } = {}
): Record<string, Record<string, FontSizeToken>> {
  const base = generateTypographyScale(baseOptions)
  const responsive: Record<string, Record<string, FontSizeToken>> = {
    base: base.fontSizes
  }

  // Generate scales for each breakpoint
  Object.entries(breakpoints).forEach(([breakpoint, options]) => {
    if (options) {
      const mergedOptions = { ...baseOptions, ...options }
      const scale = generateTypographyScale(mergedOptions)
      responsive[breakpoint] = scale.fontSizes
    }
  })

  return responsive
}

/**
 * Calculate optimal reading measures based on font size
 */
export function calculateReadingMeasure(fontSize: number, context: 'body' | 'heading' = 'body'): number {
  // Optimal characters per line for readability
  const targetCPL = context === 'body' ? 66 : 45
  
  // Approximate character width (varies by font, using average)
  const avgCharWidth = fontSize * 0.6
  
  // Calculate optimal width in pixels
  const measure = targetCPL * avgCharWidth
  
  // Convert to rem for CSS
  return measure / 16
}

/**
 * Generate fluid typography scale using CSS clamp()
 */
export function generateFluidTypographyScale(
  minViewport: number = 320,
  maxViewport: number = 1200,
  options: TypographyScaleOptions = {}
): Record<string, string> {
  const scale = generateTypographyScale(options)
  const fluidScale: Record<string, string> = {}

  Object.entries(scale.fontSizes).forEach(([name, token]) => {
    const minSize = parseFloat(token.fontSize)
    const maxSize = minSize * 1.2 // 20% larger at max viewport
    
    // Calculate preferred value for clamp()
    const preferredValue = minSize + (maxSize - minSize) * 
      ((100 - minViewport) / (maxViewport - minViewport))
    
    fluidScale[name] = `clamp(${minSize}px, ${preferredValue.toFixed(2)}px, ${maxSize}px)`
  })

  return fluidScale
}

/**
 * Legacy function for backward compatibility
 */
export function generateModularScale(baseSize: number = 16, ratio: number = 1.25): Record<string, string> {
  const scale = generateTypographyScale({ baseSize, ratio })
  const simplified: Record<string, string> = {}
  
  Object.entries(scale.fontSizes).forEach(([name, token]) => {
    simplified[name] = token.fontSize
  })
  
  return simplified
}

/**
 * Legacy function for backward compatibility
 */
export function generateLineHeights(): Record<string, string> {
  const scale = generateTypographyScale()
  const lineHeights: Record<string, string> = {}
  
  Object.entries(scale.lineHeights).forEach(([name, height]) => {
    lineHeights[name] = height.toString()
  })
  
  return lineHeights
}

/**
 * Generate typography tokens optimized for different languages/scripts
 */
export function generateMultiScriptTypography(
  scripts: {
    latin?: TypographyScaleOptions
    arabic?: TypographyScaleOptions
    cjk?: TypographyScaleOptions
    devanagari?: TypographyScaleOptions
  } = {}
): Record<string, TypographyScale> {
  const multiScript: Record<string, TypographyScale> = {}

  // Default options for different scripts
  const defaultOptions = {
    latin: { baseSize: 16, ratio: 1.25 },
    arabic: { baseSize: 16, ratio: 1.2 }, // Slightly tighter for Arabic
    cjk: { baseSize: 16, ratio: 1.25 },   // CJK often uses larger line heights
    devanagari: { baseSize: 16, ratio: 1.25 }
  }

  Object.entries(scripts).forEach(([script, options]) => {
    const mergedOptions = { ...defaultOptions[script as keyof typeof defaultOptions], ...options }
    multiScript[script] = generateTypographyScale(mergedOptions)
  })

  return multiScript
}