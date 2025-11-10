import { themes } from '@websmith/tokens'
import type { Config } from 'tailwindcss'

export interface WebsmithTailwindOptions {
  /**
   * Theme to use for Tailwind colors
   * @default 'light'
   */
  theme?: 'light' | 'dark'
  
  /**
   * CSS variable prefix
   * @default 'ws'
   */
  prefix?: string
  
  /**
   * Include dark mode colors
   * @default true
   */
  includeDarkMode?: boolean
  
  /**
   * Extend existing colors or replace them
   * @default true
   */
  extendColors?: boolean
}

export function createWebsmithTailwindConfig(
  tailwindConfig: Config = {},
  options: WebsmithTailwindOptions = {}
): Config {
  const {
    theme = 'light',
    prefix = 'ws',
    includeDarkMode = true,
    extendColors = true
  } = options

  const lightTheme = themes.light
  const darkTheme = themes.dark

  // Convert theme colors to Tailwind format
  const colors: Record<string, any> = {}
  
  Object.entries(lightTheme).forEach(([key, value]) => {
    colors[key] = `rgba(var(--${prefix}-${key}), <alpha-value>)`
  })

  // Add dark mode colors if enabled
  if (includeDarkMode && darkTheme) {
    Object.entries(darkTheme).forEach(([key, value]) => {
      colors[key] = {
        DEFAULT: `rgba(var(--${prefix}-${key}), <alpha-value>)`,
        dark: value
      }
    })
  }

  const websmithConfig: Config = {
    ...tailwindConfig,
    darkMode: 'class',
    theme: {
      ...tailwindConfig.theme,
      extend: {
        ...tailwindConfig.theme?.extend,
        colors: extendColors ? {
          ...tailwindConfig.theme?.extend?.colors,
          ...colors
        } : colors,
        // Add spacing from Websmith tokens
        spacing: {
          ...tailwindConfig.theme?.extend?.spacing,
          // You can add custom spacing here based on Websmith spacing tokens
        },
        // Add fontFamily from Websmith tokens
        fontFamily: {
          ...tailwindConfig.theme?.extend?.fontFamily,
          // You can add custom fonts here based on Websmith typography tokens
        },
        // Add other Websmith token extensions
        boxShadow: {
          ...tailwindConfig.theme?.extend?.boxShadow,
          // You can add custom shadows here based on Websmith shadow tokens
        },
        borderRadius: {
          ...tailwindConfig.theme?.extend?.borderRadius,
          // You can add custom border radius here based on Websmith border tokens
        }
      }
    },
    plugins: [
      // Add Websmith-specific plugins
      function({ addUtilities, theme }: any) {
        const newUtilities = {
          '.websmith-transition': {
            transition: 'all 0.2s ease-in-out',
          },
          '.websmith-focus-ring': {
            outline: `2px solid rgba(var(--${prefix}-ring), 0.5)`,
            outlineOffset: '2px',
          }
        }
        
        addUtilities(newUtilities)
      },
      ...(tailwindConfig.plugins || [])
    ]
  }

  return websmithConfig
}

// Helper function to get CSS variables for a theme
export function getWebsmithCSSVariables(
  theme: 'light' | 'dark' = 'light',
  prefix: string = 'ws'
): string {
  const themeData = theme === 'dark' ? themes.dark : themes.light
  
  let css = ':root {\n'
  Object.entries(themeData).forEach(([key, value]) => {
    css += `  --${prefix}-${key}: ${value};\n`
  })
  css += '}\n'
  
  return css
}

// Export default configuration
export default createWebsmithTailwindConfig
