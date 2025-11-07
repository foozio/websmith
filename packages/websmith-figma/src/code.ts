/**
 * Websmith Figma Plugin - Main Code
 * Extracts design tokens from Figma and syncs with Websmith Kit
 */

interface DesignTokens {
  colors: Record<string, any>
  typography: Record<string, any>
  spacing: Record<string, any>
  effects: Record<string, any>
}

/**
 * Convert RGB to HEX
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Extract color tokens from Figma paint styles
 */
function extractColorTokens(): Record<string, any> {
  const colors: Record<string, any> = {}
  const paintStyles = figma.getLocalPaintStyles()

  for (const style of paintStyles) {
    const paint = style.paints[0]
    if (paint && paint.type === 'SOLID') {
      const { r, g, b } = paint.color
      const hex = rgbToHex(r, g, b)
      const opacity = paint.opacity !== undefined ? paint.opacity : 1

      // Parse style name (e.g., "primary/500" or "gray/100")
      const nameParts = style.name.split('/')
      if (nameParts.length === 2) {
        const [colorName, shade] = nameParts
        if (!colors[colorName]) {
          colors[colorName] = {}
        }
        colors[colorName][shade] = opacity < 1 ? `${hex}${Math.round(opacity * 255).toString(16)}` : hex
      } else {
        colors[style.name] = opacity < 1 ? `${hex}${Math.round(opacity * 255).toString(16)}` : hex
      }
    }
  }

  return colors
}

/**
 * Extract typography tokens from Figma text styles
 */
function extractTypographyTokens(): Record<string, any> {
  const typography: Record<string, any> = {
    fontFamily: {},
    fontSize: {},
    fontWeight: {},
    lineHeight: {},
    letterSpacing: {}
  }

  const textStyles = figma.getLocalTextStyles()

  for (const style of textStyles) {
    const name = style.name.toLowerCase().replace(/\s+/g, '-')

    typography.fontFamily[name] = style.fontName.family
    typography.fontSize[name] = `${style.fontSize}px`
    
    // Map Figma font weights to numeric values
    const weightMap: Record<string, number> = {
      'Thin': 100,
      'Extra Light': 200,
      'Light': 300,
      'Regular': 400,
      'Medium': 500,
      'Semi Bold': 600,
      'Bold': 700,
      'Extra Bold': 800,
      'Black': 900
    }
    typography.fontWeight[name] = weightMap[style.fontName.style] || 400

    if (style.lineHeight.unit === 'PIXELS') {
      typography.lineHeight[name] = `${style.lineHeight.value}px`
    } else if (style.lineHeight.unit === 'PERCENT') {
      typography.lineHeight[name] = style.lineHeight.value / 100
    }

    if (style.letterSpacing.unit === 'PIXELS') {
      typography.letterSpacing[name] = `${style.letterSpacing.value}px`
    } else if (style.letterSpacing.unit === 'PERCENT') {
      typography.letterSpacing[name] = `${style.letterSpacing.value}%`
    }
  }

  return typography
}

/**
 * Extract spacing tokens from layout grids and auto-layout
 */
function extractSpacingTokens(): Record<string, string> {
  const spacing: Record<string, string> = {}
  
  // Common spacing scale
  const spacingScale = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 128]
  
  spacingScale.forEach((value, index) => {
    spacing[index.toString()] = `${value}px`
  })

  return spacing
}

/**
 * Extract effect tokens (shadows, blurs)
 */
function extractEffectTokens(): Record<string, any> {
  const effects: Record<string, any> = {
    shadows: {},
    blur: {}
  }

  const effectStyles = figma.getLocalEffectStyles()

  for (const style of effectStyles) {
    const name = style.name.toLowerCase().replace(/\s+/g, '-')

    for (const effect of style.effects) {
      if (effect.type === 'DROP_SHADOW' || effect.type === 'INNER_SHADOW') {
        const { r, g, b } = effect.color
        const hex = rgbToHex(r, g, b)
        const alpha = effect.color.a

        effects.shadows[name] = {
          offsetX: `${effect.offset.x}px`,
          offsetY: `${effect.offset.y}px`,
          blur: `${effect.radius}px`,
          spread: `${effect.spread || 0}px`,
          color: alpha < 1 ? `${hex}${Math.round(alpha * 255).toString(16)}` : hex,
          type: effect.type === 'INNER_SHADOW' ? 'inset' : 'drop'
        }
      } else if (effect.type === 'LAYER_BLUR') {
        effects.blur[name] = `${effect.radius}px`
      }
    }
  }

  return effects
}

/**
 * Extract all design tokens
 */
function extractAllTokens(): DesignTokens {
  return {
    colors: extractColorTokens(),
    typography: extractTypographyTokens(),
    spacing: extractSpacingTokens(),
    effects: extractEffectTokens()
  }
}

/**
 * Format tokens for Websmith Kit
 */
function formatForWebsmith(tokens: DesignTokens): string {
  const formatted = {
    colors: tokens.colors,
    typography: tokens.typography,
    spacing: tokens.spacing,
    shadows: tokens.effects.shadows,
    blur: tokens.effects.blur
  }

  return JSON.stringify(formatted, null, 2)
}

/**
 * Main plugin logic
 */
figma.showUI(__html__, { width: 400, height: 600 })

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'extract-tokens') {
    try {
      const tokens = extractAllTokens()
      figma.ui.postMessage({
        type: 'tokens-extracted',
        tokens: tokens,
        formatted: formatForWebsmith(tokens)
      })
    } catch (error) {
      figma.ui.postMessage({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      })
    }
  }

  if (msg.type === 'copy-to-clipboard') {
    // Figma doesn't support clipboard API directly, so we send back to UI
    figma.ui.postMessage({
      type: 'copy-ready',
      data: msg.data
    })
  }

  if (msg.type === 'close') {
    figma.closePlugin()
  }
}

// Send initial message
figma.ui.postMessage({ type: 'ready' })
