import { themes } from '@websmith/tokens'
import type {
  DesignTokens,
  ExportOptions,
  ValidationResult,
  SketchExportFormat,
  FigmaExportFormat,
  AdobeXDExportFormat
} from './types'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

export class DesignToolsExporter {
  private tokens: DesignTokens

  constructor(theme: 'light' | 'dark' = 'light') {
    this.tokens = this.loadTokens(theme)
  }

  private loadTokens(theme: 'light' | 'dark'): DesignTokens {
    const themeTokens = themes[theme]

    return {
      colors: Object.entries(themeTokens).reduce((acc, [key, value]) => {
        acc[key] = {
          name: key,
          value: typeof value === 'string' ? value : String(value),
          type: 'color',
          category: 'colors'
        }
        return acc
      }, {} as Record<string, any>),

      typography: {},
      spacing: {},
      shadows: {},
      borders: {}
    }
  }

  exportToSketch(options: ExportOptions = {}): SketchExportFormat {
    const { prefix = 'ws', includeMetadata = true } = options

    const sharedStyles = Object.entries(this.tokens.colors).map(([key, token]) => ({
      _class: 'sharedStyle' as const,
      do_objectID: `sharedStyle-${key}`,
      name: `${prefix}/${key}`,
      value: {
        _class: 'style' as const,
        fills: [{
          _class: 'fill' as const,
          isEnabled: true,
          color: this.hslToSketchColor(token.value as string),
          fillType: 0,
          noiseIndex: 0,
          noiseIntensity: 0,
          patternFillType: 1,
          patternTileScale: 1
        }]
      }
    }))

    const result: SketchExportFormat = {
      version: '2.0',
      compatibilityVersion: '2.0',
      app: 'com.bohemiancoding.sketch3',
      appVersion: '69',
      sharedStyles
    }

    if (includeMetadata) {
      Object.assign(result, {
        metadata: {
          exportedAt: new Date().toISOString(),
          source: 'websmith',
          theme: options.theme || 'light'
        }
      })
    }

    return result
  }

  exportToFigma(options: ExportOptions = {}): FigmaExportFormat {
    const { prefix = 'ws', theme = 'light' } = options

    const variables = Object.entries(this.tokens.colors).map(([key, token]) => ({
      id: `VariableID:${key}`,
      name: `${prefix}/${key}`,
      type: 'COLOR' as const,
      valuesByMode: {
        [theme]: this.hslToFigmaColor(token.value as string)
      },
      variableCollectionId: 'VariableCollectionId:1'
    }))

    return {
      name: `Websmith ${theme} Theme`,
      variables,
      variableCollections: [{
        id: 'VariableCollectionId:1',
        name: `${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`,
        modes: [{
          modeId: theme,
          name: theme.charAt(0).toUpperCase() + theme.slice(1)
        }]
      }]
    }
  }

  exportToAdobeXD(options: ExportOptions = {}): AdobeXDExportFormat {
    const { prefix = 'ws' } = options

    const styles = Object.entries(this.tokens.colors).map(([key, token]) => ({
      name: `${prefix}-${key}`,
      type: 'color' as const,
      value: token.value,
      category: 'colors'
    }))

    return {
      version: '1.0',
      styles,
      metadata: {
        exportedAt: new Date().toISOString(),
        source: 'websmith',
        theme: options.theme || 'light'
      }
    }
  }

  exportToJSON(options: ExportOptions = {}): DesignTokens {
    return this.tokens
  }

  exportToFile(format: 'sketch' | 'figma' | 'xd' | 'json', outputPath: string, options: ExportOptions = {}): void {
    let data: any

    switch (format) {
      case 'sketch':
        data = this.exportToSketch(options)
        break
      case 'figma':
        data = this.exportToFigma(options)
        break
      case 'xd':
        data = this.exportToAdobeXD(options)
        break
      case 'json':
        data = this.exportToJSON(options)
        break
      default:
        throw new Error(`Unsupported export format: ${format}`)
    }

    const fullPath = resolve(outputPath)
    writeFileSync(fullPath, JSON.stringify(data, null, 2))
  }

  validateTokens(): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    const suggestions: string[] = []

    // Basic validation
    if (Object.keys(this.tokens.colors).length === 0) {
      errors.push('No color tokens found')
    }

    // Check for invalid color values
    Object.entries(this.tokens.colors).forEach(([key, token]) => {
      if (!this.isValidColor(token.value as string)) {
        errors.push(`Invalid color value for ${key}: ${token.value}`)
      }
    })

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    }
  }

  private hslToSketchColor(hslString: string): any {
    // Convert HSL to RGB for Sketch
    const rgb = this.hslToRgb(hslString)
    return {
      _class: 'color',
      alpha: 1,
      blue: rgb.b / 255,
      green: rgb.g / 255,
      red: rgb.r / 255
    }
  }

  private hslToFigmaColor(hslString: string): any {
    // Figma uses RGBA format
    const rgb = this.hslToRgb(hslString)
    return {
      r: rgb.r / 255,
      g: rgb.g / 255,
      b: rgb.b / 255,
      a: 1
    }
  }

  private hslToRgb(hsl: string): { r: number, g: number, b: number } {
    // Simple HSL to RGB conversion
    const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
    if (!match) return { r: 0, g: 0, b: 0 }

    const h = parseInt(match[1]) / 360
    const s = parseInt(match[2]) / 100
    const l = parseInt(match[3]) / 100

    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs((h * 6) % 2 - 1))
    const m = l - c / 2

    let r = 0, g = 0, b = 0

    if (0 <= h && h < 1/6) { r = c; g = x; b = 0 }
    else if (1/6 <= h && h < 2/6) { r = x; g = c; b = 0 }
    else if (2/6 <= h && h < 3/6) { r = 0; g = c; b = x }
    else if (3/6 <= h && h < 4/6) { r = 0; g = x; b = c }
    else if (4/6 <= h && h < 5/6) { r = x; g = 0; b = c }
    else if (5/6 <= h && h < 1) { r = c; g = 0; b = x }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    }
  }

  private isValidColor(color: string): boolean {
    // Basic validation for HSL colors
    return /^hsl\(\d+,\s*\d+%,\s*\d+%\)$/.test(color)
  }
}

// Utility functions
export function exportTokens(
  format: 'sketch' | 'figma' | 'xd' | 'json',
  outputPath: string,
  options: ExportOptions = {}
): void {
  const exporter = new DesignToolsExporter(options.theme)
  exporter.exportToFile(format, outputPath, options)
}

export function validateTokenFile(filePath: string): ValidationResult {
  // Basic validation implementation
  const exporter = new DesignToolsExporter()
  return exporter.validateTokens()
}

export type { ExportOptions, ValidationResult }
