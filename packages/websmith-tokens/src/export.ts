import { colors, spacing, typography, shadows, borders, themes } from './index'

// Export formats
export function exportToCSSVariables(): string {
  let css = ':root {\n'

  // Colors
  Object.entries(colors).forEach(([colorName, shades]) => {
    Object.entries(shades).forEach(([shade, value]) => {
      css += `  --${colorName}-${shade}: ${value};\n`
    })
  })

  // Spacing
  Object.entries(spacing).forEach(([key, value]) => {
    css += `  --spacing-${key}: ${value};\n`
  })

  // Typography
  Object.entries(typography.fontSize).forEach(([key, value]) => {
    css += `  --font-size-${key}: ${Array.isArray(value) ? value[0] : value};\n`
  })

  Object.entries(typography.fontWeight).forEach(([key, value]) => {
    css += `  --font-weight-${key}: ${value};\n`
  })

  // Shadows
  Object.entries(shadows).forEach(([key, value]) => {
    css += `  --shadow-${key}: ${value};\n`
  })

  // Borders
  Object.entries(borders.radius).forEach(([key, value]) => {
    css += `  --border-radius-${key}: ${value};\n`
  })

  css += '}\n'
  return css
}

export function exportToJSON(): string {
  return JSON.stringify({
    colors,
    spacing,
    typography,
    shadows,
    borders,
    themes,
  }, null, 2)
}

export function exportToStyleDictionary(): any {
  return {
    colors,
    spacing,
    typography,
    shadows,
    borders,
    themes,
  }
}

export function exportToFigmaTokens(): any {
  return {
    global: {
      colors,
      spacing,
      typography,
      shadows,
      borders,
      themes,
    },
  }
}