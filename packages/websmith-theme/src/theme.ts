// Theme types and utilities
export interface ThemeConfig {
  colors: {
    primary: Record<string, string>
    gray: Record<string, string>
    [key: string]: Record<string, string>
  }
  spacing: Record<string, string>
  typography: {
    fontFamily: Record<string, string[]>
    fontSize: Record<string, string>
    fontWeight: Record<string, string>
    letterSpacing: Record<string, string>
  }
  shadows: Record<string, string>
  borders: {
    radius: Record<string, string>
    width: Record<string, string>
  }
}

export interface ThemePreset {
  name: string
  config: ThemeConfig
}

export function createThemeCSS(theme: ThemeConfig): string {
  let css = ':root {\n'

  // Colors
  Object.entries(theme.colors).forEach(([colorName, shades]: [string, Record<string, string>]) => {
    Object.entries(shades).forEach(([shade, value]: [string, string]) => {
      css += `  --${colorName}-${shade}: ${value};\n`
    })
  })

  // Spacing
  Object.entries(theme.spacing).forEach(([key, value]: [string, string]) => {
    css += `  --spacing-${key}: ${value};\n`
  })

  // Shadows
  Object.entries(theme.shadows).forEach(([key, value]: [string, string]) => {
    css += `  --shadow-${key}: ${value};\n`
  })

  css += '}\n'
  return css
}

export function createTailwindConfig(theme: ThemeConfig): {
  theme: {
    extend: {
      colors: ThemeConfig['colors']
      spacing: ThemeConfig['spacing']
      fontFamily: ThemeConfig['typography']['fontFamily']
      fontSize: ThemeConfig['typography']['fontSize']
      fontWeight: ThemeConfig['typography']['fontWeight']
      boxShadow: Record<string, string>
      borderRadius: Record<string, string>
    }
  }
} {
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