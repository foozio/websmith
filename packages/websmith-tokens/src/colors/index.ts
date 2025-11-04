import { generatePrimaryPalette, generateGrayPalette } from './generator'

// Color tokens - HSL-based palette
export const colors = {
  primary: generatePrimaryPalette(),
  gray: generateGrayPalette(),
  // Add more colors as needed
}