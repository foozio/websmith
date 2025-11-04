// Typography scale - Modular scale
export function generateModularScale(baseSize: number = 16, ratio: number = 1.25, steps: number = 9): Record<string, string> {
  const scale: Record<string, string> = {}
  const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl']

  for (let i = 0; i < steps; i++) {
    const size = baseSize * Math.pow(ratio, i - 2) // Start from smaller sizes
    scale[sizes[i]] = `${Math.round(size)}px`
  }

  return scale
}

export function generateLineHeights(fontSizes: Record<string, string>): Record<string, string> {
  const lineHeights: Record<string, string> = {}

  Object.keys(fontSizes).forEach(key => {
    const size = parseInt(fontSizes[key])
    // Simple line height calculation
    const lh = key.includes('xl') ? size * 1.1 : size * 1.5
    lineHeights[key] = `${Math.round(lh)}px`
  })

  return lineHeights
}