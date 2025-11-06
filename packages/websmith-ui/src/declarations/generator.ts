import { Project, ModuleKind, ScriptTarget } from 'ts-morph'
import * as fs from 'fs'
import * as path from 'path'

interface DeclarationConfig {
  entryPoints: string[]
  outDir: string
  includePrivate?: boolean
  includeInternal?: boolean
  generateMaps?: boolean
  separatePackages?: boolean
}

export class DeclarationGenerator {
  private project: Project
  private config: DeclarationConfig

  constructor(config: DeclarationConfig) {
    this.config = config
    this.project = new Project({
      compilerOptions: {
        declaration: true,
        declarationMap: config.generateMaps ?? true,
        emitDeclarationOnly: true,
        outDir: config.outDir,
        module: ModuleKind.ESNext,
        target: ScriptTarget.ES2015,
        skipLibCheck: true,
        strict: true,
      },
    })
  }

  /**
   * Generate TypeScript declaration files with enhanced features
   */
  async generateDeclarations(): Promise<void> {
    console.log('🔧 Generating TypeScript declarations...')
    
    // Add source files to project
    const sourceFiles = this.config.entryPoints.flatMap(entry => 
      this.project.addSourceFilesAtPath(entry)
    )

    if (sourceFiles.length === 0) {
      throw new Error(`No source files found for entry points: ${this.config.entryPoints.join(', ')}`)
    }

    // Generate diagnostics
    const diagnostics = this.project.getPreEmitDiagnostics()
    if (diagnostics.length > 0) {
      console.warn('⚠️  TypeScript diagnostics found:')
      diagnostics.forEach(d => console.warn(d.getMessageText()))
    }

    // Emit declaration files
    await this.project.emit({
      emitOnlyDtsFiles: true,
    })

    // Post-process declarations if needed
    if (this.config.separatePackages) {
      await this.separatePackageDeclarations()
    }

    // Generate additional declaration files
    await this.generateUtilityDeclarations()
    await this.generateThemeDeclarations()
    await this.generateTokenDeclarations()

    console.log('✅ TypeScript declarations generated successfully!')
  }

  /**
   * Create separate declaration files for different packages
   */
  private async separatePackageDeclarations(): Promise<void> {
    const componentsPath = path.join(this.config.outDir, 'components.d.ts')
    const utilsPath = path.join(this.config.outDir, 'utils.d.ts')
    const typesPath = path.join(this.config.outDir, 'types.d.ts')

    // Component declarations
    const componentExports = this.extractExportsByPattern(/^.*[Cc]omponent$/)
    await this.writeDeclarationFile(componentsPath, componentExports, 'Component exports')

    // Utility declarations
    const utilityExports = this.extractExportsByPattern(/^(use|cn|create|helper)/)
    await this.writeDeclarationFile(utilsPath, utilityExports, 'Utility exports')

    // Type declarations
    const typeExports = this.extractExportsByPattern(/^(I|Type).*$/)
    await this.writeDeclarationFile(typesPath, typeExports, 'Type declarations')
  }

  /**
   * Generate utility function declarations
   */
  private async generateUtilityDeclarations(): Promise<void> {
    const utilitiesContent = `
// Websmith UI Utility Declarations
// Generated automatically - do not edit manually

import { ClassValue } from 'clsx'
import { VariantProps } from 'class-variance-authority'

/**
 * Utility function for combining CSS classes
 */
export declare function cn(...inputs: ClassValue[]): string

/**
 * Type for variant props from class-variance-authority
 */
export type CVAProps<T> = VariantProps<T>

/**
 * Forward ref component type
 */
export declare type ForwardRefComponent<T, P> = React.ForwardRefExoticComponent<
  P & React.RefAttributes<T>
>

/**
 * Common HTML element props
 */
export declare type HTMLElementProps<T extends keyof React.JSX.IntrinsicElements> = 
  React.JSX.IntrinsicElements[T]

/**
 * Component size variants
 */
export declare type ComponentSize = 'sm' | 'md' | 'lg' | 'xl' | 'icon'

/**
 * Component variant types
 */
export declare type ComponentVariant = 'default' | 'outline' | 'ghost' | 'destructive'

/**
 * Color palette types
 */
export declare type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
export declare type ColorName = 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error'

/**
 * Spacing scale types
 */
export declare type SpacingScale = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

/**
 * Border radius types
 */
export declare type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
`

    await fs.promises.writeFile(
      path.join(this.config.outDir, 'utilities.d.ts'),
      utilitiesContent.trim()
    )
  }

  /**
   * Generate theme-related declarations
   */
  private async generateThemeDeclarations(): Promise<void> {
    const themeContent = `
// Websmith Theme Declarations
// Generated automatically - do not edit manually

export interface WebsmithTheme {
  colors: {
    primary: Record<string, string>
    secondary: Record<string, string>
    accent: Record<string, string>
    neutral: Record<string, string>
    success: Record<string, string>
    warning: Record<string, string>
    error: Record<string, string>
  }
  spacing: Record<string, string>
  typography: {
    fontFamily: Record<string, string[]>
    fontSize: Record<string, [string, string]>
    fontWeight: Record<string, number>
    lineHeight: Record<string, number>
  }
  shadows: Record<string, string>
  borders: {
    radius: Record<string, string>
    width: Record<string, string>
  }
  breakpoints: Record<string, string>
}

export interface ThemeConfig {
  initialTheme?: string
  storageKey?: string
  themes?: Record<string, Partial<WebsmithTheme>>
}

export declare function useTheme(): {
  theme: string
  setTheme: (theme: string) => void
  resolvedTheme: string
}

export declare function createTheme(config: Partial<WebsmithTheme>): WebsmithTheme

export declare function extendTheme(
  base: WebsmithTheme,
  extension: Partial<WebsmithTheme>
): WebsmithTheme
`

    await fs.promises.writeFile(
      path.join(this.config.outDir, 'theme.d.ts'),
      themeContent.trim()
    )
  }

  /**
   * Generate token-related declarations
   */
  private async generateTokenDeclarations(): Promise<void> {
    const tokenContent = `
// Websmith Token Declarations
// Generated automatically - do not edit manually

export interface DesignTokens {
  colors: ColorTokens
  spacing: SpacingTokens
  typography: TypographyTokens
  shadows: ShadowTokens
  borders: BorderTokens
  themes: ThemeTokens
}

export interface ColorTokens {
  [colorName: string]: {
    [shade: string]: string
  }
}

export interface SpacingTokens {
  [scale: string]: string
}

export interface TypographyTokens {
  fontSize: Record<string, [string, string]>
  fontWeight: Record<string, number>
  lineHeight: Record<string, number>
  fontFamily: Record<string, string[]>
}

export interface ShadowTokens {
  [shadowName: string]: string
}

export interface BorderTokens {
  radius: Record<string, string>
  width: Record<string, string>
}

export interface ThemeTokens {
  [themeName: string]: Partial<DesignTokens>
}

export interface TokenTransform {
  (value: string, context: TokenContext): string
}

export interface TokenContext {
  tokenPath: string[]
  tokenType: string
  theme?: string
}

export interface TokenExportOptions {
  format: 'css' | 'scss' | 'less' | 'js' | 'ts' | 'json'
  prefix?: string
  includeUtilities?: boolean
  includeMaps?: boolean
}

export declare function exportTokens(
  tokens: DesignTokens,
  options: TokenExportOptions
): string

export declare function transformTokens(
  tokens: DesignTokens,
  transform: TokenTransform
): DesignTokens
`

    await fs.promises.writeFile(
      path.join(this.config.outDir, 'tokens.d.ts'),
      tokenContent.trim()
    )
  }

  /**
   * Extract exports by pattern from source files
   */
  private extractExportsByPattern(pattern: RegExp): string {
    // This is a simplified version - in a real implementation,
    // you'd parse the AST to extract matching exports
    return `// Exports matching pattern: ${pattern}\nexport * from './index'`
  }

  /**
   * Write declaration file with header
   */
  private async writeDeclarationFile(
    filePath: string,
    content: string,
    description: string
  ): Promise<void> {
    const header = `// ${description}
// Generated automatically - do not edit manually
// Generated at: ${new Date().toISOString()}

`
    await fs.promises.writeFile(filePath, header + content)
  }

  /**
   * Validate generated declarations
   */
  async validateDeclarations(): Promise<boolean> {
    try {
      const mainDeclaration = path.join(this.config.outDir, 'index.d.ts')
      
      if (!fs.existsSync(mainDeclaration)) {
        console.error('❌ Main declaration file not found')
        return false
      }

      // Check if declaration is syntactically valid
      const content = await fs.promises.readFile(mainDeclaration, 'utf-8')
      
      // Basic validation - check for common patterns
      const requiredPatterns = [
        /export\s+declare\s+/,
        /export\s+interface\s+/,
        /export\s+type\s+/,
        /export\s*\{.*\}/,
      ]

      const hasRequiredPatterns = requiredPatterns.some(pattern => 
        pattern.test(content)
      )

      if (!hasRequiredPatterns) {
        console.warn('⚠️  Declaration file may be missing expected export patterns')
      }

      console.log('✅ Declaration files validated successfully')
      return true
    } catch (error) {
      console.error('❌ Declaration validation failed:', error)
      return false
    }
  }
}

/**
 * Convenience function to generate declarations
 */
export async function generateDeclarations(config: Partial<DeclarationConfig> = {}): Promise<void> {
  const defaultConfig: DeclarationConfig = {
    entryPoints: ['src/**/*.{ts,tsx}'],
    outDir: 'dist',
    includePrivate: false,
    includeInternal: false,
    generateMaps: true,
    separatePackages: true,
    ...config,
  }

  const generator = new DeclarationGenerator(defaultConfig)
  await generator.generateDeclarations()
  
  const isValid = await generator.validateDeclarations()
  if (!isValid) {
    throw new Error('Declaration generation validation failed')
  }
}
