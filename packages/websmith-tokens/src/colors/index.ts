import { 
  generatePrimaryPalette, 
  generateGrayPalette,
  generateLCHPrimaryPalette,
  generateOKLCHPrimaryPalette,
  HSLColor,
  LCHColor,
  OKLCHColor,
  hslToLCH,
  lchToHSL,
  hslToOKLCH
} from './generator'

import {
  calculateRelativeLuminance,
  calculateContrastRatio,
  meetsContrastLevel,
  findOptimalTextColor,
  generateContrastAwarePalette,
  generateAccessibleCombinations,
  adjustColorForContrast,
  CONTRAST_LEVELS,
  type ContrastLevel
} from './contrast'

// Color tokens - HSL-based palette with mathematical calculations
export const colors = {
  primary: generatePrimaryPalette(),
  gray: generateGrayPalette(),
  primaryLCH: generateLCHPrimaryPalette(),
  primaryOKLCH: generateOKLCHPrimaryPalette(),
  // Add more colors as needed
}

// Export all color utilities
export {
  // Generator functions
  generatePrimaryPalette,
  generateGrayPalette,
  generateLCHPrimaryPalette,
  generateOKLCHPrimaryPalette,
  
  // Color space conversions
  hslToLCH,
  lchToHSL,
  hslToOKLCH,
  
  // Contrast utilities
  calculateRelativeLuminance,
  calculateContrastRatio,
  meetsContrastLevel,
  findOptimalTextColor,
  generateContrastAwarePalette,
  generateAccessibleCombinations,
  adjustColorForContrast,
  CONTRAST_LEVELS
}

// Export types separately for isolatedModules
export type { HSLColor, LCHColor, OKLCHColor, ContrastLevel }