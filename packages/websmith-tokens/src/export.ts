/* eslint-disable @websmith/eslint-plugin/no-hardcoded-colors */
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

export function exportToJSON(tokens: Record<string, unknown>, options: { pretty?: boolean } = {}): string {
  const { pretty = true } = options
  return JSON.stringify(tokens, null, pretty ? 2 : 0)
}

export function exportToCSS(tokens: Record<string, unknown>, prefix: string = 'ws'): string {
  let css = ''
  
  function processTokens(obj: Record<string, unknown>, path: string[] = []): void {
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = [...path, key]
      const cssVar = `--${prefix}-${currentPath.join('-')}`
      
      if (typeof value === 'string' || typeof value === 'number') {
        css += `  ${cssVar}: ${value};\n`
      } else if (typeof value === 'object' && value !== null) {
        processTokens(value as Record<string, unknown>, currentPath)
      }
    })
  }
  
  css += ':root {\n'
  processTokens(tokens)
  css += '}\n'
  
  return css
}

export function exportToSCSS(tokens: Record<string, unknown>, options: { prefix?: string; includeMaps?: boolean; includeUtilities?: boolean } = {}): string {
  const { prefix = 'ws', includeMaps = true, includeUtilities = true } = options
  let scss = ''
  
  // Add header comment
  scss += '// Websmith Design Tokens\n'
  scss += '// Generated automatically - do not edit manually\n\n'
  
  // Process tokens into SCSS variables
  function processTokens(obj: Record<string, unknown>, path: string[] = []): void {
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = [...path, key]
      const scssVar = `$${prefix}-${currentPath.join('-')}`
      
      if (typeof value === 'string' || typeof value === 'number') {
        scss += `${scssVar}: ${value};\n`
      } else if (typeof value === 'object' && value !== null) {
        processTokens(value as Record<string, unknown>, currentPath)
      }
    })
  }
  
  // Generate SCSS variables
  if (includeMaps) {
    scss += '// Token Maps\n'
    processTokens(tokens)
    scss += '\n'
  }
  
  // Generate SCSS maps
  if (includeMaps) {
    scss += '// SCSS Maps\n'
    scss += `$${prefix}-colors: (\n`
    Object.entries(colors).forEach(([colorName, shades]) => {
      scss += `  '${colorName}': (\n`
      Object.entries(shades).forEach(([shade, value]) => {
        scss += `    '${shade}': ${value},\n`
      })
      scss += '  ),\n'
    })
    scss += ');\n\n'
    
    scss += `$${prefix}-spacing: (\n`
    Object.entries(spacing).forEach(([key, value]) => {
      scss += `  '${key}': ${value},\n`
    })
    scss += ');\n\n'
    
    scss += `$${prefix}-font-sizes: (\n`
    Object.entries(typography.fontSize).forEach(([key, value]) => {
      scss += `  '${key}': ${Array.isArray(value) ? value[0] : value},\n`
    })
    scss += ');\n\n'
  }
  
  // Generate utility mixins
  if (includeUtilities) {
    scss += '// Utility Mixins\n'
    scss += `@mixin ${prefix}-color($color, $shade: 500) {\n`
    scss += `  color: $${prefix}-color-#{$color}-#{$shade};\n`
    scss += `}\n\n`
    
    scss += `@mixin ${prefix}-bg-color($color, $shade: 500) {\n`
    scss += `  background-color: $${prefix}-color-#{$color}-#{$shade};\n`
    scss += `}\n\n`
    
    scss += `@mixin ${prefix}-spacing($property, $size) {\n`
    scss += `  #{$property}: $${prefix}-spacing-#{$size};\n`
    scss += `}\n\n`
    
    scss += `@mixin ${prefix}-font-size($size) {\n`
    scss += `  font-size: $${prefix}-font-size-#{$size};\n`
    scss += `}\n\n`
    
    scss += `@mixin ${prefix}-border-radius($size: 'md') {\n`
    scss += `  border-radius: $${prefix}-border-radius-#{$size};\n`
    scss += `}\n\n`
  }
  
  return scss
}

export function exportToLESS(tokens: Record<string, unknown>, options: { prefix?: string; includeMaps?: boolean; includeUtilities?: boolean } = {}): string {
  const { prefix = 'ws', includeMaps = true, includeUtilities = true } = options
  let less = ''
  
  // Add header comment
  less += '// Websmith Design Tokens\n'
  less += '// Generated automatically - do not edit manually\n\n'
  
  // Process tokens into LESS variables
  function processTokens(obj: Record<string, unknown>, path: string[] = []): void {
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = [...path, key]
      const lessVar = `@${prefix}-${currentPath.join('-')}`
      
      if (typeof value === 'string' || typeof value === 'number') {
        less += `${lessVar}: ${value};\n`
      } else if (typeof value === 'object' && value !== null) {
        processTokens(value as Record<string, unknown>, currentPath)
      }
    })
  }
  
  // Generate LESS variables
  if (includeMaps) {
    less += '// Token Variables\n'
    processTokens(tokens)
    less += '\n'
  }
  
  // Generate utility mixins
  if (includeUtilities) {
    less += '// Utility Mixins\n'
    less += `.${prefix}-color(@color, @shade: 500) {\n`
    less += `  color: @@{prefix}-color-@{color}-@{shade};\n`
    less += `}\n\n`
    
    less += `.${prefix}-bg-color(@color, @shade: 500) {\n`
    less += `  background-color: @@{prefix}-color-@{color}-@{shade};\n`
    less += `}\n\n`
    
    less += `.${prefix}-spacing(@property, @size) {\n`
    less += `  @{property}: @@{prefix}-spacing-@{size};\n`
    less += `}\n\n`
    
    less += `.${prefix}-font-size(@size) {\n`
    less += `  font-size: @@{prefix}-font-size-@{size};\n`
    less += `}\n\n`
    
    less += `.${prefix}-border-radius(@size: md) {\n`
    less += `  border-radius: @@{prefix}-border-radius-@{size};\n`
    less += `}\n\n`
  }
  
  return less
}

export function exportToCSSCustomProperties(tokens: Record<string, unknown>, options: { prefix?: string; includeFallbacks?: boolean; includeTheme?: boolean } = {}): string {
  const { prefix = 'ws', includeFallbacks = true, includeTheme = true } = options
  let css = ''
  
  // Add header comment
  css += '/* Websmith Design Tokens */\n'
  css += '/* Generated automatically - do not edit manually */\n\n'
  
  // Generate CSS custom properties
  css += ':root {\n'
  
  function processTokens(obj: Record<string, unknown>, path: string[] = []): void {
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = [...path, key]
      const cssVar = `--${prefix}-${currentPath.join('-')}`
      
      if (typeof value === 'string' || typeof value === 'number') {
        if (includeFallbacks && currentPath.includes('color')) {
          // Add fallback for colors
          css += `  ${cssVar}: ${value}; /* fallback */\n`
          css += `  ${cssVar}-rgb: ${hexToRgb(value as string)}; /* RGB values for opacity */\n`
        } else {
          css += `  ${cssVar}: ${value};\n`
        }
      } else if (typeof value === 'object' && value !== null) {
        processTokens(value as Record<string, unknown>, currentPath)
      }
    })
  }
  
  processTokens(tokens)
  css += '}\n\n'
  
  // Add theme variations if requested
  if (includeTheme) {
    css += '/* Dark theme variations */\n'
    css += '[data-theme="dark"] {\n'
    css += '  --ws-background: #09090b;\n'
    css += '  --ws-foreground: #fafafa;\n'
    css += '  --ws-muted: #1f1f23;\n'
    css += '  --ws-muted-foreground: #a1a1aa;\n'
    css += '  --ws-border: #27272a;\n'
    css += '  --ws-input: #27272a;\n'
    css += '  --ws-ring: #d4d4d8;\n'
    css += '}\n\n'
    
    css += '/* High contrast theme */\n'
    css += '[data-theme="high-contrast"] {\n'
    css += '  --ws-background: #000000;\n'
    css += '  --ws-foreground: #ffffff;\n'
    css += '  --ws-primary: #00ff00;\n'
    css += '  --ws-border: #ffffff;\n'
    css += '}\n\n'
  }
  
  // Add utility classes
  css += '/* Utility classes for quick access */\n'
  css += `.ws-bg-primary { background-color: var(--${prefix}-color-primary-500); }\n`
  css += `.ws-bg-secondary { background-color: var(--${prefix}-color-secondary-500); }\n`
  css += `.ws-text-primary { color: var(--${prefix}-color-primary-500); }\n`
  css += `.ws-text-secondary { color: var(--${prefix}-color-secondary-500); }\n`
  css += `.ws-border-primary { border-color: var(--${prefix}-color-primary-500); }\n`
  css += `.ws-border-secondary { border-color: var(--${prefix}-color-secondary-500); }\n`
  
  return css
}

export function exportToStylus(tokens: Record<string, unknown>, options: { prefix?: string; includeUtilities?: boolean } = {}): string {
  const { prefix = 'ws', includeUtilities = true } = options
  let stylus = ''
  
  // Add header comment
  stylus += '// Websmith Design Tokens\n'
  stylus += '// Generated automatically - do not edit manually\n\n'
  
  // Process tokens into Stylus variables
  function processTokens(obj: Record<string, unknown>, path: string[] = []): void {
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = [...path, key]
      const stylusVar = `${prefix}-${currentPath.join('-')}`
      
      if (typeof value === 'string' || typeof value === 'number') {
        stylus += `${stylusVar} = ${value}\n`
      } else if (typeof value === 'object' && value !== null) {
        processTokens(value as Record<string, unknown>, currentPath)
      }
    })
  }
  
  // Generate Stylus variables
  stylus += '// Token Variables\n'
  processTokens(tokens)
  stylus += '\n'
  
  // Generate utility mixins
  if (includeUtilities) {
    stylus += '// Utility Mixins\n'
    stylus += `ws-color(color, shade = 500)\n`
    stylus += `  color: lookup('${prefix}-color-' + color + '-' + shade)\n\n`
    
    stylus += `ws-bg-color(color, shade = 500)\n`
    stylus += `  background-color: lookup('${prefix}-color-' + color + '-' + shade)\n\n`
    
    stylus += `ws-spacing(property, size)\n`
    stylus += `  {property}: lookup('${prefix}-spacing-' + size)\n\n`
    
    stylus += `ws-font-size(size)\n`
    stylus += `  font-size: lookup('${prefix}-font-size-' + size)\n\n`
    
    stylus += `ws-border-radius(size = 'md')\n`
    stylus += `  border-radius: lookup('${prefix}-border-radius-' + size)\n\n`
  }
  
  return stylus
}

export function exportToXML(tokens: Record<string, unknown>, options: { rootElement?: string; includeMetadata?: boolean } = {}): string {
  const { rootElement = 'designTokens', includeMetadata = true } = options
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  
  // Add metadata if requested
  if (includeMetadata) {
    xml += `<!-- Websmith Design Tokens -->\n`
    xml += `<!-- Generated: ${new Date().toISOString()} -->\n`
    xml += `<!-- Version: 1.0.0 -->\n\n`
  }
  
  xml += `<${rootElement}>\n`
  
  function processTokens(obj: Record<string, unknown>, path: string[] = [], indent: number = 1): void {
    const spaces = '  '.repeat(indent)
    
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        xml += `${spaces}<${key}>${value}</${key}>\n`
      } else if (typeof value === 'object' && value !== null) {
        xml += `${spaces}<${key}>\n`
        processTokens(value as Record<string, unknown>, [...path, key], indent + 1)
        xml += `${spaces}</${key}>\n`
      }
    })
  }
  
  processTokens(tokens)
  xml += `</${rootElement}>\n`
  
  return xml
}

export function exportToJavaScript(tokens: Record<string, unknown>, options: { format?: 'esm' | 'cjs' | 'umd'; variableName?: string } = {}): string {
  const { format = 'esm', variableName = 'designTokens' } = options
  const tokensString = JSON.stringify(tokens, null, 2)
  
  switch (format) {
    case 'esm':
      return `// Websmith Design Tokens - ES Module\n` +
             `// Generated automatically - do not edit manually\n\n` +
             `export const ${variableName} = ${tokensString};\n\n` +
             `export default ${variableName};\n`
    
    case 'cjs':
      return `// Websmith Design Tokens - CommonJS\n` +
             `// Generated automatically - do not edit manually\n\n` +
             `'use strict';\n\n` +
             `module.exports = ${tokensString};\n\n` +
             `module.exports.default = ${tokensString};\n`
    
    case 'umd':
      return `// Websmith Design Tokens - UMD\n` +
             `// Generated automatically - do not edit manually\n\n` +
             `(function (root, factory) {\n` +
             `  if (typeof define === 'function' && define.amd) {\n` +
             `    define([], factory);\n` +
             `  } else if (typeof module === 'object' && module.exports) {\n` +
             `    module.exports = factory();\n` +
             `  } else {\n` +
             `    root.${variableName} = factory();\n` +
             `  }\n` +
             `}(typeof self !== 'undefined' ? self : this, function () {\n` +
             `  return ${tokensString};\n` +
             `}));\n`
    
    default:
      return tokensString
  }
}

export function exportToAndroidXML(tokens: Record<string, unknown>, options: { resourcePrefix?: string } = {}): string {
  const { resourcePrefix = 'ws_' } = options
  let xml = '<?xml version="1.0" encoding="utf-8"?>\n'
  xml += '<resources>\n'
  
  // Process colors
  xml += '  <!-- Colors -->\n'
  Object.entries(colors).forEach(([colorName, shades]) => {
    Object.entries(shades).forEach(([shade, value]) => {
      xml += `  <color name="${resourcePrefix}${colorName}_${shade}">${value}</color>\n`
    })
  })
  
  // Process spacing as dimensions
  xml += '\n  <!-- Spacing -->\n'
  Object.entries(spacing).forEach(([key, value]) => {
    xml += `  <dimen name="${resourcePrefix}spacing_${key}">${value}</dimen>\n`
  })
  
  // Process typography
  xml += '\n  <!-- Typography -->\n'
  Object.entries(typography.fontSize).forEach(([key, value]) => {
    xml += `  <dimen name="${resourcePrefix}font_size_${key}">${Array.isArray(value) ? value[0] : value}</dimen>\n`
  })
  
  Object.entries(typography.fontWeight).forEach(([key, value]) => {
    xml += `  <integer name="${resourcePrefix}font_weight_${key}">${value}</integer>\n`
  })
  
  xml += '</resources>\n'
  
  return xml
}

export function exportToIOSSwift(tokens: Record<string, unknown>, options: { structName?: string; useUIColor?: boolean } = {}): string {
  const { structName = 'DesignTokens', useUIColor = true } = options
  let swift = `// Websmith Design Tokens - Swift\n`
  swift += `// Generated automatically - do not edit manually\n\n`
  swift += `import UIKit\n\n`
  swift += `struct ${structName} {\n`
  
  // Process colors
  swift += `    // MARK: - Colors\n`
  Object.entries(colors).forEach(([colorName, shades]) => {
    swift += `    struct ${colorName.charAt(0).toUpperCase() + colorName.slice(1)} {\n`
    Object.entries(shades).forEach(([shade, value]) => {
      if (useUIColor) {
        swift += `        static let ${shade} = UIColor(hex: "${value}")\n`
      } else {
        swift += `        static let ${shade} = "${value}"\n`
      }
    })
    swift += `    }\n`
  })
  
  // Process spacing
  swift += `\n    // MARK: - Spacing\n`
  Object.entries(spacing).forEach(([key, value]) => {
    swift += `    static let spacing${key.charAt(0).toUpperCase() + key.slice(1)}: CGFloat = ${value}\n`
  })
  
  // Process typography
  swift += `\n    // MARK: - Typography\n`
  Object.entries(typography.fontSize).forEach(([key, value]) => {
    swift += `    static let fontSize${key.charAt(0).toUpperCase() + key.slice(1)}: CGFloat = ${Array.isArray(value) ? value[0] : value}\n`
  })
  
  swift += `}\n\n`
  
  // Add UIColor extension if needed
  if (useUIColor) {
    swift += `// MARK: - UIColor Extension\n`
    swift += `extension UIColor {\n`
    swift += `    convenience init(hex: String) {\n`
    swift += `        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)\n`
    swift += `        var int: UInt64 = 0\n`
    swift += `        Scanner(string: hex).scanHexInt64(&int)\n`
    swift += `        let a, r, g, b: UInt64\n`
    swift += `        switch hex.count {\n`
    swift += `        case 3: // RGB (12-bit)\n`
    swift += `            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)\n`
    swift += `        case 6: // RGB (24-bit)\n`
    swift += `            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)\n`
    swift += `        case 8: // ARGB (32-bit)\n`
    swift += `            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)\n`
    swift += `        default:\n`
    swift += `            (a, r, g, b) = (1, 1, 1, 0)\n`
    swift += `        }\n`
    swift += `        self.init(red: CGFloat(r) / 255, green: CGFloat(g) / 255, blue: CGFloat(b) / 255, alpha: CGFloat(a) / 255)\n`
    swift += `    }\n`
    swift += `}\n`
  }
  
  return swift
}

export function exportToTypeScript(tokens: Record<string, unknown>, interfaceName: string = 'DesignTokens'): string {
  let ts = `export interface ${interfaceName} {\n`
  
  function processTokens(obj: Record<string, unknown>, path: string[] = [], indent: number = 1): void {
    const spaces = '  '.repeat(indent)
    
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'string') {
        ts += `${spaces}${key}: string\n`
      } else if (typeof value === 'number') {
        ts += `${spaces}${key}: number\n`
      } else if (typeof value === 'object' && value !== null) {
        ts += `${spaces}${key}: {\n`
        processTokens(value as Record<string, unknown>, [...path, key], indent + 1)
        ts += `${spaces}}\n`
      }
    })
  }
  
  processTokens(tokens)
  ts += '}\n'
  
  // Add actual token values as const
  ts += `\nexport const tokens: ${interfaceName} = ${JSON.stringify(tokens, null, 2)}\n`
  
  return ts
}

// Helper function to convert hex to RGB
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0'
}

export function exportToStyleDictionary(): Record<string, unknown> {
  return {
    colors,
    spacing,
    typography,
    shadows,
    borders,
    themes,
  }
}

export function exportToJSONSchema(): Record<string, unknown> {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {
      colors: { type: 'object' },
      spacing: { type: 'object' },
      typography: { type: 'object' },
      shadows: { type: 'object' },
      borders: { type: 'object' },
      themes: { type: 'object' },
    },
    required: ['colors', 'spacing', 'typography', 'shadows', 'borders'],
  }
}

export function exportToFigmaTokens(): Record<string, unknown> {
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