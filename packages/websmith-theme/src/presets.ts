import { colors, spacing, typography, shadows, borders } from '@websmith/tokens'
import { ThemePreset } from './theme'

export const modernPreset: ThemePreset = {
  name: 'Modern',
  config: {
    colors,
    spacing,
    typography,
    shadows,
    borders,
  },
}

export const classicPreset: ThemePreset = {
  name: 'Classic',
  config: {
    colors: {
      ...colors,
      primary: {
        50: 'hsl(45, 100%, 98%)',
        100: 'hsl(45, 100%, 95%)',
        200: 'hsl(45, 100%, 90%)',
        300: 'hsl(45, 100%, 80%)',
        400: 'hsl(45, 100%, 70%)',
        500: 'hsl(45, 100%, 60%)',
        600: 'hsl(45, 100%, 50%)',
        700: 'hsl(45, 100%, 40%)',
        800: 'hsl(45, 100%, 30%)',
        900: 'hsl(45, 100%, 20%)',
        950: 'hsl(45, 100%, 10%)',
      },
    },
    spacing,
    typography,
    shadows,
    borders,
  },
}

export const minimalPreset: ThemePreset = {
  name: 'Minimal',
  config: {
    colors: {
      primary: {
        50: 'hsl(0, 0%, 98%)',
        100: 'hsl(0, 0%, 95%)',
        200: 'hsl(0, 0%, 90%)',
        300: 'hsl(0, 0%, 80%)',
        400: 'hsl(0, 0%, 70%)',
        500: 'hsl(0, 0%, 60%)',
        600: 'hsl(0, 0%, 50%)',
        700: 'hsl(0, 0%, 40%)',
        800: 'hsl(0, 0%, 30%)',
        900: 'hsl(0, 0%, 20%)',
        950: 'hsl(0, 0%, 10%)',
      },
      gray: colors.gray,
    },
    spacing,
    typography,
    shadows: {
      ...shadows,
      sm: 'none',
      base: 'none',
    },
    borders,
  },
}

export const brandPreset: ThemePreset = {
  name: 'Brand',
  config: {
    colors: {
      primary: {
        50: 'hsl(120, 100%, 98%)',
        100: 'hsl(120, 100%, 95%)',
        200: 'hsl(120, 100%, 90%)',
        300: 'hsl(120, 100%, 80%)',
        400: 'hsl(120, 100%, 70%)',
        500: 'hsl(120, 100%, 60%)',
        600: 'hsl(120, 100%, 50%)',
        700: 'hsl(120, 100%, 40%)',
        800: 'hsl(120, 100%, 30%)',
        900: 'hsl(120, 100%, 20%)',
        950: 'hsl(120, 100%, 10%)',
      },
      gray: colors.gray,
    },
    spacing,
    typography,
    shadows,
    borders,
  },
}

export const themePresets = [modernPreset, classicPreset, minimalPreset, brandPreset]