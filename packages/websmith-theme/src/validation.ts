// Theme configuration validation
import { ThemeConfig, ThemePreset } from './theme'

/**
 * Validation error class
 */
export class ThemeValidationError extends Error {
  constructor(
    message: string,
    public path: string[] = [],
    public code: string = 'VALIDATION_ERROR'
  ) {
    super(message)
    this.name = 'ThemeValidationError'
  }
}

/**
 * Color validation utilities
 */
export function validateColorValue(value: unknown, path: string[]): void {
  if (typeof value !== 'string') {
    throw new ThemeValidationError(
      `Color value must be a string, got ${typeof value}`,
      path,
      'INVALID_COLOR_TYPE'
    )
  }

  // Validate CSS color formats
  const colorPatterns = [
    /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/i,           // hsl(h, s%, l%)
    /^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)$/i, // hsla(h, s%, l%, a)
    /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i,               // rgb(r, g, b)
    /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/i, // rgba(r, g, b, a)
    /^#([0-9a-f]{3}){1,2}$/i,                                 // #hex or #hexhex
    /^[a-z]+$/i                                              // Named colors (limited set)
  ]

  const isValidColor = colorPatterns.some(pattern => pattern.test(value))
  if (!isValidColor) {
    throw new ThemeValidationError(
      `Invalid color format: ${value}`,
      path,
      'INVALID_COLOR_FORMAT'
    )
  }
}

export function validateColorShades(shades: unknown, path: string[]): void {
  if (typeof shades !== 'object' || shades === null) {
    throw new ThemeValidationError(
      'Color shades must be an object',
      path,
      'INVALID_SHADES_TYPE'
    )
  }

  const validShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  
  for (const [shadeKey, shadeValue] of Object.entries(shades as Record<string, unknown>)) {
    const shadeNum = parseInt(shadeKey)
    if (!validShades.includes(shadeNum)) {
      throw new ThemeValidationError(
        `Invalid shade: ${shadeKey}. Must be one of: ${validShades.join(', ')}`,
        [...path, shadeKey],
        'INVALID_SHADE'
      )
    }

    validateColorValue(shadeValue, [...path, shadeKey])
  }

  // Ensure all standard shades are present
  const missingShades = validShades.filter(shade => !(shade in shades))
  if (missingShades.length > 0) {
    throw new ThemeValidationError(
      `Missing required shades: ${missingShades.join(', ')}`,
      path,
      'MISSING_SHADES'
    )
  }
}

export function validateColors(colors: unknown, path: string[] = ['colors']): void {
  if (typeof colors !== 'object' || colors === null) {
    throw new ThemeValidationError(
      'Colors must be an object',
      path,
      'INVALID_COLORS_TYPE'
    )
  }

  const requiredColors = ['primary', 'gray']
  
  // Check required colors
  for (const requiredColor of requiredColors) {
    if (!(requiredColor in colors)) {
      throw new ThemeValidationError(
        `Missing required color: ${requiredColor}`,
        path,
        'MISSING_REQUIRED_COLOR'
      )
    }
  }

  // Validate each color palette
  for (const [colorName, colorValue] of Object.entries(colors as Record<string, unknown>)) {
    validateColorShades(colorValue, [...path, colorName])
  }
}

/**
 * Spacing validation utilities
 */
export function validateSpacingValue(value: unknown, path: string[]): void {
  if (typeof value !== 'string') {
    throw new ThemeValidationError(
      `Spacing value must be a string, got ${typeof value}`,
      path,
      'INVALID_SPACING_TYPE'
    )
  }

  // Validate CSS spacing formats
  const spacingPatterns = [
    /^\d+(\.\d+)?(px|rem|em|ch|ex|vh|vw|vmin|vmax|%)$/,  // CSS units
    /^\d+(\.\d+)?$/,                                      // Unitless (pixels in Tailwind)
    /^calc\(.+\)$/i,                                       // calc() expressions
    /^var\(--[a-zA-Z0-9-]+\)$/                            // CSS variables
  ]

  const isValidSpacing = spacingPatterns.some(pattern => pattern.test(value))
  if (!isValidSpacing) {
    throw new ThemeValidationError(
      `Invalid spacing format: ${value}`,
      path,
      'INVALID_SPACING_FORMAT'
    )
  }
}

export function validateSpacing(spacing: unknown, path: string[] = ['spacing']): void {
  if (typeof spacing !== 'object' || spacing === null) {
    throw new ThemeValidationError(
      'Spacing must be an object',
      path,
      'INVALID_SPACING_OBJECT'
    )
  }

  const requiredSpacing = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24', '32', '40', '48', '56', '64']
  
  // Validate each spacing value
  for (const [spacingKey, spacingValue] of Object.entries(spacing as Record<string, unknown>)) {
    validateSpacingValue(spacingValue, [...path, spacingKey])
  }

  // Check for recommended spacing scale
  const missingSpacing = requiredSpacing.filter(key => !(key in spacing))
  if (missingSpacing.length > 0) {
    console.warn(`Warning: Missing recommended spacing values: ${missingSpacing.join(', ')}`)
  }
}

/**
 * Typography validation utilities
 */
export function validateFontFamily(fontFamily: unknown, path: string[]): void {
  if (!Array.isArray(fontFamily)) {
    throw new ThemeValidationError(
      'Font family must be an array',
      path,
      'INVALID_FONT_FAMILY_TYPE'
    )
  }

  if (fontFamily.length === 0) {
    throw new ThemeValidationError(
      'Font family array cannot be empty',
      path,
      'EMPTY_FONT_FAMILY'
    )
  }

  for (let i = 0; i < fontFamily.length; i++) {
    const font = fontFamily[i]
    if (typeof font !== 'string') {
      throw new ThemeValidationError(
        `Font family item at index ${i} must be a string`,
        [...path, i.toString()],
        'INVALID_FONT_FAMILY_ITEM'
      )
    }

    // Validate font name format
    if (!/^[a-zA-Z0-9\s\-'"`]+$/.test(font)) {
      throw new ThemeValidationError(
        `Invalid font name format: ${font}`,
        [...path, i.toString()],
        'INVALID_FONT_NAME'
      )
    }
  }
}

export function validateFontSize(fontSize: unknown, path: string[]): void {
  if (typeof fontSize !== 'object' || fontSize === null) {
    throw new ThemeValidationError(
      'Font size must be an object',
      path,
      'INVALID_FONT_SIZE_TYPE'
    )
  }

  for (const [sizeKey, sizeValue] of Object.entries(fontSize as Record<string, unknown>)) {
    if (typeof sizeValue !== 'object' || sizeValue === null) {
      throw new ThemeValidationError(
        `Font size "${sizeKey}" must be an object with fontSize and lineHeight`,
        [...path, sizeKey],
        'INVALID_FONT_SIZE_VALUE'
      )
    }

    const sizeObj = sizeValue as Record<string, unknown>
    
    if (typeof sizeObj.fontSize !== 'string') {
      throw new ThemeValidationError(
        `Font size "${sizeKey}" must have a fontSize property as string`,
        [...path, sizeKey, 'fontSize'],
        'INVALID_FONT_SIZE_PROPERTY'
      )
    }

    if (typeof sizeObj.lineHeight !== 'string' && typeof sizeObj.lineHeight !== 'number') {
      throw new ThemeValidationError(
        `Font size "${sizeKey}" must have a lineHeight property as string or number`,
        [...path, sizeKey, 'lineHeight'],
        'INVALID_LINE_HEIGHT_PROPERTY'
      )
    }
  }
}

export function validateFontWeight(fontWeight: unknown, path: string[]): void {
  if (typeof fontWeight !== 'object' || fontWeight === null) {
    throw new ThemeValidationError(
      'Font weight must be an object',
      path,
      'INVALID_FONT_WEIGHT_TYPE'
    )
  }

  const validWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900]
  
  for (const [weightKey, weightValue] of Object.entries(fontWeight as Record<string, unknown>)) {
    const weightNum = parseInt(weightValue as string)
    if (!validWeights.includes(weightNum)) {
      throw new ThemeValidationError(
        `Invalid font weight: ${weightValue}. Must be one of: ${validWeights.join(', ')}`,
        [...path, weightKey],
        'INVALID_FONT_WEIGHT'
      )
    }
  }
}

export function validateTypography(typography: unknown, path: string[] = ['typography']): void {
  if (typeof typography !== 'object' || typography === null) {
    throw new ThemeValidationError(
      'Typography must be an object',
      path,
      'INVALID_TYPOGRAPHY_TYPE'
    )
  }

  const typo = typography as Record<string, unknown>

  if (typo.fontFamily) {
    validateFontFamily(typo.fontFamily, [...path, 'fontFamily'])
  }

  if (typo.fontSize) {
    validateFontSize(typo.fontSize, [...path, 'fontSize'])
  }

  if (typo.fontWeight) {
    validateFontWeight(typo.fontWeight, [...path, 'fontWeight'])
  }
}

/**
 * Shadow validation utilities
 */
export function validateShadowValue(value: unknown, path: string[]): void {
  if (typeof value !== 'string') {
    throw new ThemeValidationError(
      `Shadow value must be a string, got ${typeof value}`,
      path,
      'INVALID_SHADOW_TYPE'
    )
  }

  // Basic validation for box-shadow syntax
  const shadowPattern = /^(\d+(\.\d+)?(px|rem|em|ch|ex|vh|vw|vmin|vmax|%)\s+){3,4}([a-zA-Z]+|#[0-9a-f]{3,6}|rgba?\([^)]+\)|hsla?\([^)]+\))(\s+inset)?$/i
  
  if (!shadowPattern.test(value) && value !== 'none') {
    throw new ThemeValidationError(
      `Invalid shadow format: ${value}`,
      path,
      'INVALID_SHADOW_FORMAT'
    )
  }
}

export function validateShadows(shadows: unknown, path: string[] = ['shadows']): void {
  if (typeof shadows !== 'object' || shadows === null) {
    throw new ThemeValidationError(
      'Shadows must be an object',
      path,
      'INVALID_SHADOWS_TYPE'
    )
  }

  for (const [shadowKey, shadowValue] of Object.entries(shadows as Record<string, unknown>)) {
    validateShadowValue(shadowValue, [...path, shadowKey])
  }
}

/**
 * Border validation utilities
 */
export function validateBorderRadius(value: unknown, path: string[]): void {
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new ThemeValidationError(
      `Border radius must be a string or number, got ${typeof value}`,
      path,
      'INVALID_BORDER_RADIUS_TYPE'
    )
  }

  if (typeof value === 'string') {
    const radiusPattern = /^\d+(\.\d+)?(px|rem|em|ch|ex|vh|vw|vmin|vmax|%)$/
    if (!radiusPattern.test(value) && value !== '0') {
      throw new ThemeValidationError(
        `Invalid border radius format: ${value}`,
        path,
        'INVALID_BORDER_RADIUS_FORMAT'
      )
    }
  }
}

export function validateBorders(borders: unknown, path: string[] = ['borders']): void {
  if (typeof borders !== 'object' || borders === null) {
    throw new ThemeValidationError(
      'Borders must be an object',
      path,
      'INVALID_BORDERS_TYPE'
    )
  }

  const borderObj = borders as Record<string, unknown>

  if (borderObj.radius) {
    if (typeof borderObj.radius === 'object' && borderObj.radius !== null) {
      for (const [radiusKey, radiusValue] of Object.entries(borderObj.radius as Record<string, unknown>)) {
        validateBorderRadius(radiusValue, [...path, 'radius', radiusKey])
      }
    } else {
      validateBorderRadius(borderObj.radius, [...path, 'radius'])
    }
  }
}

/**
 * Main theme validation function
 */
export function validateThemeConfig(theme: unknown): ThemeConfig {
  if (typeof theme !== 'object' || theme === null) {
    throw new ThemeValidationError(
      'Theme must be an object',
      [],
      'INVALID_THEME_TYPE'
    )
  }

  const themeObj = theme as Record<string, unknown>

  // Validate required sections
  if (!themeObj.colors) {
    throw new ThemeValidationError(
      'Theme must have colors section',
      [],
      'MISSING_COLORS'
    )
  }

  if (!themeObj.spacing) {
    throw new ThemeValidationError(
      'Theme must have spacing section',
      [],
      'MISSING_SPACING'
    )
  }

  if (!themeObj.shadows) {
    throw new ThemeValidationError(
      'Theme must have shadows section',
      [],
      'MISSING_SHADOWS'
    )
  }

  // Validate each section
  validateColors(themeObj.colors)
  validateSpacing(themeObj.spacing)
  validateTypography(themeObj.typography || {})
  validateShadows(themeObj.shadows)
  validateBorders(themeObj.borders || {})

  return theme as ThemeConfig
}

/**
 * Validate theme preset
 */
export function validateThemePreset(preset: unknown): ThemePreset {
  if (typeof preset !== 'object' || preset === null) {
    throw new ThemeValidationError(
      'Theme preset must be an object',
      [],
      'INVALID_PRESET_TYPE'
    )
  }

  const presetObj = preset as Record<string, unknown>

  if (!presetObj.name || typeof presetObj.name !== 'string') {
    throw new ThemeValidationError(
      'Theme preset must have a name property as string',
      [],
      'INVALID_PRESET_NAME'
    )
  }

  if (!presetObj.config) {
    throw new ThemeValidationError(
      'Theme preset must have a config property',
      [],
      'MISSING_PRESET_CONFIG'
    )
  }

  const validatedConfig = validateThemeConfig(presetObj.config)

  return {
    name: presetObj.name,
    config: validatedConfig
  }
}

/**
 * Theme validation result
 */
export interface ValidationResult {
  isValid: boolean
  errors: ThemeValidationError[]
  warnings: string[]
}

/**
 * Validate theme with detailed error reporting
 */
export function validateThemeDetailed(theme: unknown): ValidationResult {
  const errors: ThemeValidationError[] = []
  const warnings: string[] = []

  try {
    validateThemeConfig(theme)
    return { isValid: true, errors: [], warnings }
  } catch (error) {
    if (error instanceof ThemeValidationError) {
      errors.push(error)
    } else {
      errors.push(new ThemeValidationError(
        error instanceof Error ? error.message : 'Unknown validation error',
        [],
        'UNKNOWN_ERROR'
      ))
    }
    return { isValid: false, errors, warnings }
  }
}

/**
 * Check theme compatibility
 */
export function checkThemeCompatibility(theme: ThemeConfig): ValidationResult {
  const errors: ThemeValidationError[] = []
  const warnings: string[] = []

  // Check for common compatibility issues
  if (!theme.typography.fontFamily) {
    warnings.push('No font family defined - using system fonts')
  }

  if (Object.keys(theme.colors).length < 2) {
    warnings.push('Limited color palette - consider adding more color variations')
  }

  if (Object.keys(theme.spacing).length < 10) {
    warnings.push('Limited spacing scale - consider adding more spacing values')
  }

  // Check for accessibility
  const hasHighContrastColors = Object.values(theme.colors).some(colorPalette => {
    const shades = Object.values(colorPalette)
    return shades.length >= 8 // Should have at least 8 shades for good contrast range
  })

  if (!hasHighContrastColors) {
    warnings.push('Limited color shades may affect accessibility')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}
