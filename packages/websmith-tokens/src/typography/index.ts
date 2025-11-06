// Typography tokens with advanced mathematical calculations
import { 
  generateTypographyScale, 
  generateResponsiveTypographyScale,
  generateFluidTypographyScale,
  generateMultiScriptTypography,
  calculateReadingMeasure,
  generateModularScale,
  generateLineHeights,
  MUSICAL_RATIOS,
  type TypographyScaleOptions,
  type FontSizeToken,
  type TypographyScale
} from './generator'

// Generate enhanced typography scale using mathematical calculations
const typographyScale = generateTypographyScale({
  scale: 'major-third',
  baseSize: 16,
  minSize: 12,
  maxSize: 96,
  precision: 0
})

// Typography tokens with improved calculations
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: typographyScale.fontSizes,
  fontWeight: typographyScale.fontWeights,
  letterSpacing: typographyScale.letterSpacing,
  lineHeights: typographyScale.lineHeights,
}

// Export all typography utilities
export {
  // Advanced generator functions
  generateTypographyScale,
  generateResponsiveTypographyScale,
  generateFluidTypographyScale,
  generateMultiScriptTypography,
  calculateReadingMeasure,
  
  // Musical ratios for scale calculations
  MUSICAL_RATIOS,
  
  // Legacy functions for backward compatibility
  generateModularScale,
  generateLineHeights
}

// Export types separately for isolatedModules
export type {
  TypographyScaleOptions,
  FontSizeToken,
  TypographyScale
}