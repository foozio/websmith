// Theme types and utilities
export interface ThemeConfig {
  colors: {
    primary: Record<string, string>
    gray: Record<string, string>
    [key: string]: Record<string, string>
  }
  spacing: Record<string, string>
  typography: any // Simplified for now
  shadows: Record<string, string>
  borders: any // Simplified for now
}

export interface ThemePreset {
  name: string
  config: ThemeConfig
}

export function createThemeCSS(theme: any): string {
  let css = ':root {\n'

  // Colors
  Object.entries(theme.colors).forEach(([colorName, shades]: [string, any]) => {
    Object.entries(shades).forEach(([shade, value]: [string, any]) => {
      css += `  --${colorName}-${shade}: ${value};\n`
    })
  })

  // Spacing
  Object.entries(theme.spacing).forEach(([key, value]: [string, any]) => {
    css += `  --spacing-${key}: ${value};\n`
  })

  // Shadows
  Object.entries(theme.shadows).forEach(([key, value]: [string, any]) => {
    css += `  --shadow-${key}: ${value};\n`
  })

  css += '}\n'
  return css
}

export function createTailwindConfig(theme: ThemeConfig): any {
  return {
    theme: {
      extend: {
        colors: theme.colors,
        spacing: theme.spacing,
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.fontSize,
        fontWeight: theme.typography.fontWeight,
        boxShadow: theme.shadows,
        borderRadius: theme.borders.radius,
      },
    },
  }
}