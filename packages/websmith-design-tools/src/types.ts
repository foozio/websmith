import { themes } from '@websmith/tokens'

export interface DesignToken {
  name: string
  value: string | number
  type: 'color' | 'typography' | 'spacing' | 'shadow' | 'border' | 'other'
  category?: string
  description?: string
}

export interface DesignTokens {
  colors: Record<string, DesignToken>
  typography: Record<string, DesignToken>
  spacing: Record<string, DesignToken>
  shadows: Record<string, DesignToken>
  borders: Record<string, DesignToken>
}

export interface SketchSharedStyle {
  _class: 'sharedStyle'
  do_objectID: string
  name: string
  value: any
}

export interface FigmaVariable {
  id: string
  name: string
  type: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN'
  valuesByMode: Record<string, any>
  variableCollectionId: string
}

export interface AdobeXDStyle {
  name: string
  type: 'color' | 'typography' | 'effect'
  value: any
  category?: string
}

export interface ExportOptions {
  theme?: 'light' | 'dark'
  prefix?: string
  outputPath?: string
  includeMetadata?: boolean
  format?: 'json' | 'css' | 'sketch' | 'figma' | 'xd'
}

export interface ImportOptions {
  format?: 'sketch' | 'figma' | 'xd' | 'json' | 'csv'
  validate?: boolean
  mergeStrategy?: 'replace' | 'merge' | 'keep-existing'
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  suggestions: string[]
}

export interface SyncOptions {
  source: 'sketch' | 'figma' | 'xd' | 'json'
  target: 'websmith' | 'sketch' | 'figma' | 'xd'
  bidirectional?: boolean
  conflictResolution?: 'source-wins' | 'target-wins' | 'manual'
}

// Utility types
export type ThemeTokens = typeof themes.light
export type ColorToken = DesignToken & { type: 'color' }
export type TypographyToken = DesignToken & { type: 'typography' }
export type SpacingToken = DesignToken & { type: 'spacing' }
export type ShadowToken = DesignToken & { type: 'shadow' }
export type BorderToken = DesignToken & { type: 'border' }

// CLI command types
export interface CLICommand {
  name: string
  description: string
  action: (...args: any[]) => Promise<void> | void
  options?: Array<{
    flags: string
    description: string
    defaultValue?: any
  }>
}

// Export format types
export interface SketchExportFormat {
  version: string
  compatibilityVersion: string
  app: string
  appVersion: string
  sharedStyles: SketchSharedStyle[]
}

export interface FigmaExportFormat {
  name: string
  variables: FigmaVariable[]
  variableCollections: Array<{
    id: string
    name: string
    modes: Array<{
      modeId: string
      name: string
    }>
  }>
}

export interface AdobeXDExportFormat {
  version: string
  styles: AdobeXDStyle[]
  metadata: {
    exportedAt: string
    source: string
    theme: string
  }
}
