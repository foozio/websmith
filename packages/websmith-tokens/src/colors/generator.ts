// Color palette generator
export interface HSLColor {
  h: number
  s: number
  l: number
}

export function generatePalette(baseHSL: HSLColor, shades: number[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]): Record<string, string> {
  const palette: Record<string, string> = {}

  shades.forEach(shade => {
    let lightness = 0

    if (shade === 50) lightness = 98
    else if (shade === 100) lightness = 95
    else if (shade === 200) lightness = 90
    else if (shade === 300) lightness = 80
    else if (shade === 400) lightness = 70
    else if (shade === 500) lightness = 60
    else if (shade === 600) lightness = 50
    else if (shade === 700) lightness = 40
    else if (shade === 800) lightness = 30
    else if (shade === 900) lightness = 20
    else if (shade === 950) lightness = 10

    palette[shade] = `hsl(${baseHSL.h}, ${baseHSL.s}%, ${lightness}%)`
  })

  return palette
}

export function generateGrayPalette(baseHue: number = 210): Record<string, string> {
  return generatePalette({ h: baseHue, s: 20, l: 50 })
}

export function generatePrimaryPalette(baseHue: number = 210): Record<string, string> {
  return generatePalette({ h: baseHue, s: 100, l: 50 })
}