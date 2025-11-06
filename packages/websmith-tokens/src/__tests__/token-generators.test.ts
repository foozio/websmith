import { describe, expect, it } from 'vitest'
import {
  generateGrayPalette,
  generatePalette,
  generatePrimaryPalette,
} from '../colors/generator'
import { generateSpacingScale } from '../spacing/generator'
import { typography } from '../typography'

describe('color token generators', () => {
  it('creates the expected HSL palette with default shades', () => {
    const palette = generatePalette({ h: 210, s: 60, l: 50 })

    expect(Object.keys(palette)).toEqual([
      '50',
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900',
      '950',
    ])
    expect(palette['50']).toBe('hsl(210, 60%, 98%)')
    expect(palette['500']).toBe('hsl(210, 60%, 60%)')
    expect(palette['900']).toBe('hsl(210, 60%, 20%)')
  })

  it('generates gray and primary palettes with predefined saturation', () => {
    const gray = generateGrayPalette()
    const primary = generatePrimaryPalette()

    expect(gray['500']).toBe('hsl(210, 20%, 60%)')
    expect(primary['500']).toBe('hsl(210, 100%, 60%)')
  })
})

describe('spacing token generator', () => {
  it('calculates spacing scale from the configured base', () => {
    const scale = generateSpacingScale()

    expect(scale['0']).toBe('0px')
    expect(scale['1']).toBe('4px') // 1 * 8 / 2
    expect(scale['4']).toBe('16px')
    expect(scale['64']).toBe('256px')
  })

  it('supports custom bases and steps', () => {
    const scale = generateSpacingScale(10, [0, 1, 2])

    expect(scale).toEqual({
      0: '0px',
      1: '5px',
      2: '10px',
    })
  })
})

describe('typography tokens', () => {
  it('exposes the expected font families and sizes', () => {
    expect(typography.fontFamily.sans).toContain('Inter')
    expect(typography.fontSize['2xl']).toEqual([
      '24px',
      { lineHeight: '32px' },
    ])
    expect(typography.fontWeight.bold).toBe('700')
    expect(typography.letterSpacing.wider).toBe('0.05em')
  })
})
