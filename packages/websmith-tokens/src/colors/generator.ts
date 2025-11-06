// Color palette generator with mathematical calculations
export interface HSLColor {
  h: number
  s: number
  l: number
}

export interface LCHColor {
  l: number  // Lightness 0-100
  c: number  // Chroma 0-100+
  h: number  // Hue 0-360
}

export interface OKLCHColor {
  l: number  // Lightness 0-1 (perceptually uniform)
  c: number  // Chroma 0-0.4 (perceptually uniform)
  h: number  // Hue 0-360
}

/**
 * Mathematically calculate lightness values for color shades
 * Uses exponential scaling for more perceptually uniform distribution
 */
function calculateLightness(shade: number, baseLightness: number = 60): number {
  // Use exponential function for more natural lightness distribution
  // Lighter shades (50-400): exponential curve towards white
  if (shade <= 500) {
    const lightnessFactor = Math.pow((500 - shade) / 450, 0.8)
    return baseLightness + (98 - baseLightness) * lightnessFactor
  } else {
    // Darker shades (600-950): exponential curve towards black
    const darknessFactor = Math.pow((shade - 500) / 450, 0.9)
    return baseLightness - (baseLightness - 10) * darknessFactor
  }
}

/**
 * Generate color palette with mathematically calculated lightness values
 */
export function generatePalette(
  baseHSL: HSLColor, 
  shades: number[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
): Record<string, string> {
  const palette: Record<string, string> = {}

  shades.forEach(shade => {
    const lightness = calculateLightness(shade, baseHSL.l)
    palette[shade] = `hsl(${baseHSL.h}, ${baseHSL.s}%, ${lightness}%)`
  })

  return palette
}

/**
 * Convert HSL to LCH color space
 */
export function hslToLCH(hsl: HSLColor): LCHColor {
  // Convert HSL to RGB first
  const h = hsl.h / 360
  const s = hsl.s / 100
  const l = hsl.l / 100

  let rVal, gVal, bVal

  if (s === 0) {
    rVal = gVal = bVal = l // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    rVal = hue2rgb(p, q, h + 1/3)
    gVal = hue2rgb(p, q, h)
    bVal = hue2rgb(p, q, h - 1/3)
  }

  // Convert RGB to XYZ (sRGB D65)
  const rLinear = rVal <= 0.04045 ? rVal / 12.92 : Math.pow((rVal + 0.055) / 1.055, 2.4)
  const gLinear = gVal <= 0.04045 ? gVal / 12.92 : Math.pow((gVal + 0.055) / 1.055, 2.4)
  const bLinear = bVal <= 0.04045 ? bVal / 12.92 : Math.pow((bVal + 0.055) / 1.055, 2.4)

  const x = rLinear * 0.4124564 + gLinear * 0.3575761 + bLinear * 0.1804375
  const y = rLinear * 0.2126729 + gLinear * 0.7151522 + bLinear * 0.0721750
  const z = rLinear * 0.0193339 + gLinear * 0.1191920 + bLinear * 0.9503041

  // Convert XYZ to CIELAB
  const xn = 0.95047
  const yn = 1.00000
  const zn = 1.08883

  const fx = x / xn
  const fy = y / yn
  const fz = z / zn

  const epsilon = 0.008856
  const kappa = 903.3

  const fx3 = Math.pow(fx, 3)
  const fy3 = Math.pow(fy, 3)

  const lLab = fy3 > epsilon ? 116 * fy - 16 : kappa * fy
  const aLab = 500 * (fx3 > epsilon ? Math.cbrt(fx) - Math.cbrt(fy) : (fx - fy) / (kappa * Math.sqrt(fy)))
  const bLab = 200 * (fy3 > epsilon ? Math.cbrt(fy) - Math.cbrt(fz) : (fy - fz) / (kappa * Math.sqrt(fy)))

  // Convert CIELAB to LCH
  const c = Math.sqrt(aLab * aLab + bLab * bLab)
  const hDeg = Math.atan2(bLab, aLab) * 180 / Math.PI
  const hNormalized = hDeg < 0 ? hDeg + 360 : hDeg

  return { l: lLab, c, h: hNormalized }
}

/**
 * Convert LCH to HSL color space
 */
export function lchToHSL(lch: LCHColor): HSLColor {
  // Convert LCH to CIELAB
  const a = lch.c * Math.cos(lch.h * Math.PI / 180)
  const bVal = lch.c * Math.sin(lch.h * Math.PI / 180)

  // Convert CIELAB to XYZ
  const y = (lch.l + 16) / 116
  const x = a / 500 + y
  const z = y - bVal / 200

  const xn = 0.95047
  const yn = 1.00000
  const zn = 1.08883

  const x3 = Math.pow(x, 3)
  const y3 = Math.pow(y, 3)
  const z3 = Math.pow(z, 3)

  const fx = x3 > 0.008856 ? x : (116 * x - 16) / 903.3
  const fy = y3 > 0.008856 ? y : (116 * y - 16) / 903.3
  const fz = z3 > 0.008856 ? z : (116 * z - 16) / 903.3

  const xFinal = fx * xn
  const yFinal = fy * yn
  const zFinal = fz * zn

  // Convert XYZ to linear RGB
  const rLinear = xFinal * 3.2404542 - yFinal * 1.5371385 - zFinal * 0.4985314
  const gLinear = -xFinal * 0.9692660 + yFinal * 1.8760108 + zFinal * 0.0415560
  const bLinear = xFinal * 0.0556434 - yFinal * 0.2040259 + zFinal * 1.0572252

  // Convert linear RGB to sRGB
  const r = rLinear <= 0.0031308 ? 12.92 * rLinear : 1.055 * Math.pow(rLinear, 1 / 2.4) - 0.055
  const g = gLinear <= 0.0031308 ? 12.92 * gLinear : 1.055 * Math.pow(gLinear, 1 / 2.4) - 0.055
  const bVal2 = bLinear <= 0.0031308 ? 12.92 * bLinear : 1.055 * Math.pow(bLinear, 1 / 2.4) - 0.055

  // Convert RGB to HSL
  const rClamped = Math.max(0, Math.min(1, r))
  const gClamped = Math.max(0, Math.min(1, g))
  const bClamped = Math.max(0, Math.min(1, bVal2))

  const max = Math.max(rClamped, gClamped, bClamped)
  const min = Math.min(rClamped, gClamped, bClamped)
  const diff = max - min

  let hDeg = 0
  let s = 0
  const l = (max + min) / 2

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min)
    
    switch (max) {
      case rClamped:
        hDeg = ((gClamped - bClamped) / diff + (gClamped < bClamped ? 6 : 0)) * 60
        break
      case gClamped:
        hDeg = ((bClamped - rClamped) / diff + 2) * 60
        break
      case bClamped:
        hDeg = ((rClamped - gClamped) / diff + 4) * 60
        break
    }
  }

  return { h: hDeg, s: s * 100, l: l * 100 }
}

/**
 * Convert HSL to OKLCH color space (perceptually uniform)
 */
export function hslToOKLCH(hsl: HSLColor): OKLCHColor {
  // This is a simplified approximation
  // For production use, consider using a library like culori
  const hDeg = hsl.h / 360
  const s = hsl.s / 100
  const l = hsl.l / 100

  // Convert to linear RGB approximation
  let rVal, gVal, bVal
  if (s === 0) {
    rVal = gVal = bVal = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    rVal = p + (q - p) * (hDeg < 1/3 ? 3 * hDeg : hDeg < 2/3 ? 2 - 3 * hDeg : 3 * (hDeg - 2/3))
    gVal = p + (q - p) * (hDeg < -1/3 ? hDeg + 4/3 : hDeg < 1/3 ? 3 * hDeg : 4/3 - 3 * hDeg)
    bVal = p + (q - p) * (hDeg < 0 ? hDeg + 2 : 2 - 3 * hDeg)
  }

  // Approximate OKLCH conversion
  const lOk = Math.cbrt(0.4122214708 * rVal + 0.5363325363 * gVal + 0.0514459929 * bVal)
  const m = Math.cbrt(0.2119034982 * rVal + 0.6806995451 * gVal + 0.1073969566 * bVal)
  const sOk = Math.cbrt(0.0883024619 * rVal + 0.2817188376 * gVal + 0.6309787005 * bVal)

  const lFinal = 0.2104542553 * lOk + 0.7936177850 * m - 0.0040720468 * sOk
  const aFinal = 1.9779984951 * lOk - 2.4285922050 * m + 0.4505937099 * sOk
  const bFinal = 0.0259040371 * lOk + 0.7827717662 * m - 0.8086757660 * sOk

  const c = Math.sqrt(aFinal * aFinal + bFinal * bFinal)
  const hFinal = Math.atan2(bFinal, aFinal) * 180 / Math.PI

  return { 
    l: Math.max(0, Math.min(1, lFinal)), 
    c: Math.max(0, Math.min(0.4, c)), 
    h: hFinal < 0 ? hFinal + 360 : hFinal 
  }
}

/**
 * Generate color palette in LCH color space
 */
export function generateLCHPalette(
  baseLCH: LCHColor,
  shades: number[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
): Record<string, string> {
  const palette: Record<string, string> = {}

  shades.forEach(shade => {
    const lightness = calculateLightness(shade, baseLCH.l)
    const lch = { l: lightness, c: baseLCH.c, h: baseLCH.h }
    const hsl = lchToHSL(lch)
    palette[shade] = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`
  })

  return palette
}

/**
 * Generate color palette in OKLCH color space (perceptually uniform)
 */
export function generateOKLCHPalette(
  baseOKLCH: OKLCHColor,
  shades: number[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
): Record<string, string> {
  const palette: Record<string, string> = {}

  shades.forEach(shade => {
    let lightness = 0
    if (shade <= 500) {
      const lightnessFactor = Math.pow((500 - shade) / 450, 0.8)
      lightness = baseOKLCH.l + (0.98 - baseOKLCH.l) * lightnessFactor
    } else {
      const darknessFactor = Math.pow((shade - 500) / 450, 0.9)
      lightness = baseOKLCH.l - (baseOKLCH.l - 0.1) * darknessFactor
    }
    lightness = Math.max(0.1, Math.min(0.98, lightness))
    
    const oklch = { 
      l: lightness, 
      c: baseOKLCH.c, 
      h: baseOKLCH.h 
    }
    
    // Convert back to HSL for CSS output
    const hsl = oklchToHSL(oklch)
    palette[shade] = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`
  })

  return palette
}

/**
 * Simplified OKLCH to HSL conversion
 */
function oklchToHSL(oklch: OKLCHColor): HSLColor {
  // This is a simplified approximation for demonstration
  // In production, use a proper color library
  const l = oklch.l * 100
  const s = Math.min(100, oklch.c * 250) // Approximate chroma to saturation
  return { h: oklch.h, s, l }
}

/**
 * Generate gray palette with mathematical calculations
 */
export function generateGrayPalette(baseHue: number = 210): Record<string, string> {
  return generatePalette({ h: baseHue, s: 20, l: 50 })
}

/**
 * Generate primary palette with mathematical calculations
 */
export function generatePrimaryPalette(baseHue: number = 210): Record<string, string> {
  return generatePalette({ h: baseHue, s: 100, l: 50 })
}

/**
 * Generate LCH-based primary palette
 */
export function generateLCHPrimaryPalette(baseHue: number = 210): Record<string, string> {
  return generateLCHPalette({ l: 60, c: 70, h: baseHue })
}

/**
 * Generate OKLCH-based primary palette (perceptually uniform)
 */
export function generateOKLCHPrimaryPalette(baseHue: number = 210): Record<string, string> {
  return generateOKLCHPalette({ l: 0.6, c: 0.15, h: baseHue })
}