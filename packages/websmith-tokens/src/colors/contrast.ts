// Contrast calculation and dynamic token generation
import { HSLColor } from './generator'

/**
 * Calculate relative luminance of a color (WCAG 2.1)
 */
export function calculateRelativeLuminance(hsl: HSLColor): number {
  // Convert HSL to RGB
  const h = hsl.h / 360
  const s = hsl.s / 100
  const l = hsl.l / 100

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }

  // Convert RGB to linear RGB
  const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)
  const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)
  const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)

  // Calculate relative luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear
}

/**
 * Calculate contrast ratio between two colors (WCAG 2.1)
 */
export function calculateContrastRatio(color1: HSLColor, color2: HSLColor): number {
  const lum1 = calculateRelativeLuminance(color1)
  const lum2 = calculateRelativeLuminance(color2)
  
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * WCAG 2.1 contrast levels
 */
export const CONTRAST_LEVELS = {
  AA_NORMAL: 4.5,      // Normal text
  AA_LARGE: 3.0,       // Large text (18pt+ or 14pt+ bold)
  AAA_NORMAL: 7.0,     // Enhanced contrast for normal text
  AAA_LARGE: 4.5,      // Enhanced contrast for large text
  UI_COMPONENTS: 3.0   // Graphical objects and UI components
} as const

export type ContrastLevel = keyof typeof CONTRAST_LEVELS

/**
 * Check if two colors meet a specific contrast level
 */
export function meetsContrastLevel(
  foreground: HSLColor, 
  background: HSLColor, 
  level: ContrastLevel
): boolean {
  const ratio = calculateContrastRatio(foreground, background)
  return ratio >= CONTRAST_LEVELS[level]
}

/**
 * Find the best text color for a given background
 */
export function findOptimalTextColor(
  backgroundColor: HSLColor,
  targetLevel: ContrastLevel = 'AA_NORMAL',
  options: {
    preferLight?: boolean
    maxAttempts?: number
  } = {}
): HSLColor {
  const { preferLight = false, maxAttempts = 50 } = options
  
  // Start with black and white as candidates
  const candidates: HSLColor[] = [
    { h: 0, s: 0, l: 0 },    // Black
    { h: 0, s: 0, l: 100 },  // White
  ]
  
  // If no preference, try both
  if (!preferLight) {
    candidates.reverse()
  }
  
  let bestColor = candidates[0]
  let bestRatio = calculateContrastRatio(bestColor, backgroundColor)
  
  // If initial candidates don't meet the target, try adjusting lightness
  if (bestRatio < CONTRAST_LEVELS[targetLevel]) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      // Try different lightness values
      const lightnessStep = attempt * 2
      const testLightness = preferLight ? 
        Math.min(95, 50 + lightnessStep) : 
        Math.max(5, 50 - lightnessStep)
      
      const testColor: HSLColor = {
        h: backgroundColor.h, // Keep similar hue for harmony
        s: Math.min(20, backgroundColor.s * 0.3), // Reduce saturation
        l: testLightness
      }
      
      const ratio = calculateContrastRatio(testColor, backgroundColor)
      
      if (ratio > bestRatio) {
        bestRatio = ratio
        bestColor = testColor
      }
      
      if (ratio >= CONTRAST_LEVELS[targetLevel]) {
        break
      }
    }
  }
  
  return bestColor
}

/**
 * Generate a palette with guaranteed contrast levels
 */
export function generateContrastAwarePalette(
  baseHSL: HSLColor,
  options: {
    backgroundColors?: {
      [shade: number]: HSLColor
    }
  } = {}
): Record<string, { color: string; contrast: number; meets: ContrastLevel[] }> {
  const { 
    backgroundColors = {}
  } = options
  
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  const palette: Record<string, { color: string; contrast: number; meets: ContrastLevel[] }> = {}
  
  shades.forEach(shade => {
    // Calculate the actual color for this shade
    let lightness = 0
    if (shade <= 500) {
      const lightnessFactor = Math.pow((500 - shade) / 450, 0.8)
      lightness = baseHSL.l + (98 - baseHSL.l) * lightnessFactor
    } else {
      const darknessFactor = Math.pow((shade - 500) / 450, 0.9)
      lightness = baseHSL.l - (baseHSL.l - 10) * darknessFactor
    }
    lightness = Math.max(5, Math.min(98, Math.round(lightness * 10) / 10))
    
    const color: HSLColor = { h: baseHSL.h, s: baseHSL.s, l: lightness }
    const colorString = `hsl(${baseHSL.h}, ${baseHSL.s}%, ${lightness}%)`
    
    // Calculate contrast against relevant backgrounds
    const meets: ContrastLevel[] = []
    let maxContrast = 0
    
    // Test against white background for dark colors
    if (shade >= 600) {
      const whiteBg = { h: 0, s: 0, l: 100 }
      const contrast = calculateContrastRatio(color, whiteBg)
      maxContrast = Math.max(maxContrast, contrast)
      
      // Check which levels this meets
      Object.keys(CONTRAST_LEVELS).forEach((level) => {
        const threshold = CONTRAST_LEVELS[level as ContrastLevel]
        if (contrast >= threshold) {
          meets.push(level as ContrastLevel)
        }
      })
    }
    
    // Test against black background for light colors
    if (shade <= 400) {
      const blackBg = { h: 0, s: 0, l: 0 }
      const contrast = calculateContrastRatio(color, blackBg)
      maxContrast = Math.max(maxContrast, contrast)
      
      // Check which levels this meets
      Object.keys(CONTRAST_LEVELS).forEach((level) => {
        const threshold = CONTRAST_LEVELS[level as ContrastLevel]
        if (contrast >= threshold) {
          meets.push(level as ContrastLevel)
        }
      })
    }
    
    // Test against specified background colors
    if (backgroundColors[shade]) {
      const contrast = calculateContrastRatio(color, backgroundColors[shade])
      maxContrast = Math.max(maxContrast, contrast)
      
      Object.keys(CONTRAST_LEVELS).forEach((level) => {
        const threshold = CONTRAST_LEVELS[level as ContrastLevel]
        if (contrast >= threshold) {
          meets.push(level as ContrastLevel)
        }
      })
    }
    
    palette[shade] = {
      color: colorString,
      contrast: Math.round(maxContrast * 100) / 100,
      meets: Array.from(new Set(meets)) // Remove duplicates
    }
  })
  
  return palette
}

/**
 * Generate accessible color combinations
 */
export function generateAccessibleCombinations(
  baseColors: Record<string, HSLColor>,
  targetLevel: ContrastLevel = 'AA_NORMAL'
): Record<string, { foreground: string; background: string; contrast: number }> {
  const combinations: Record<string, { foreground: string; background: string; contrast: number }> = {}
  
  Object.entries(baseColors).forEach(([name, bgColor]) => {
    const textColor = findOptimalTextColor(bgColor, targetLevel)
    const contrast = calculateContrastRatio(textColor, bgColor)
    
    combinations[name] = {
      foreground: `hsl(${textColor.h}, ${textColor.s}%, ${textColor.l}%)`,
      background: `hsl(${bgColor.h}, ${bgColor.s}%, ${bgColor.l}%)`,
      contrast: Math.round(contrast * 100) / 100
    }
  })
  
  return combinations
}

/**
 * Adjust a color to meet a specific contrast ratio
 */
export function adjustColorForContrast(
  color: HSLColor,
  background: HSLColor,
  targetLevel: ContrastLevel,
  options: {
    maxIterations?: number
  } = {}
): HSLColor {
  const { maxIterations = 50 } = options
  const targetRatio = CONTRAST_LEVELS[targetLevel]
  
  let adjustedColor = { ...color }
  let currentRatio = calculateContrastRatio(adjustedColor, background)
  
  if (currentRatio >= targetRatio) {
    return adjustedColor
  }
  
  // Determine if we need to make the color lighter or darker
  const bgLuminance = calculateRelativeLuminance(background)
  
  const shouldLighten = bgLuminance < 0.5 // Dark background, need lighter text
  const shouldDarken = bgLuminance >= 0.5 // Light background, need darker text
  
  for (let i = 0; i < maxIterations; i++) {
    if (shouldLighten) {
      adjustedColor.l = Math.min(95, adjustedColor.l + (i + 1) * 2)
    } else if (shouldDarken) {
      adjustedColor.l = Math.max(5, adjustedColor.l - (i + 1) * 2)
    }
    
    // Reduce saturation gradually for better contrast
    if (i > 10) {
      adjustedColor.s = Math.max(0, adjustedColor.s - i * 2)
    }
    
    currentRatio = calculateContrastRatio(adjustedColor, background)
    
    if (currentRatio >= targetRatio) {
      break
    }
  }
  
  return adjustedColor
}
