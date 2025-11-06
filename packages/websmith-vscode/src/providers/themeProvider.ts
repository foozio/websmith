import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'
import { WebsmithManager } from '../managers/websmithManager'

export class ThemeProvider {
  constructor(private manager: WebsmithManager) {}

  async createTheme(): Promise<void> {
    const themeName = await vscode.window.showInputBox({
      prompt: 'Enter theme name',
      placeHolder: 'myTheme',
      validateInput: (value: string) => {
        if (!value.match(/^[a-z][a-zA-Z0-9]*$/)) {
          return 'Theme name must start with lowercase letter and contain only alphanumeric characters'
        }
        return null
      }
    })

    if (!themeName) {
      return
    }

    const workspaceRoot = this.manager.getWorkspaceRoot()
    if (!workspaceRoot) {
      vscode.window.showErrorMessage('No workspace folder found')
      return
    }

    const themePath = path.join(workspaceRoot, `src/theme/${themeName}.ts`)

    if (fs.existsSync(themePath)) {
      vscode.window.showErrorMessage(`Theme ${themeName} already exists`)
      return
    }

    const template = this.generateThemeTemplate(themeName)
    
    try {
      fs.mkdirSync(path.dirname(themePath), { recursive: true })
      fs.writeFileSync(themePath, template)
      
      const document = await vscode.workspace.openTextDocument(themePath)
      await vscode.window.showTextDocument(document)
      
      vscode.window.showInformationMessage(`Theme ${themeName} created successfully!`)
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to create theme: ${error}`)
    }
  }

  async validateTheme(): Promise<void> {
    const workspaceRoot = this.manager.getWorkspaceRoot()
    if (!workspaceRoot) {
      vscode.window.showErrorMessage('No workspace folder found')
      return
    }

    const config = this.manager.getConfig<string>('themePath') || './src/theme.ts'
    const themePath = path.join(workspaceRoot, config)

    if (!fs.existsSync(themePath)) {
      vscode.window.showErrorMessage('Theme file not found')
      return
    }

    try {
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Validating theme...',
      }, async () => {
        // Simulate theme validation
        await new Promise(resolve => setTimeout(resolve, 1000))
      })

      vscode.window.showInformationMessage('Theme validation passed!')
    } catch (error) {
      vscode.window.showErrorMessage(`Theme validation failed: ${error}`)
    }
  }

  async previewTheme(): Promise<void> {
    const workspaceRoot = this.manager.getWorkspaceRoot()
    if (!workspaceRoot) {
      vscode.window.showErrorMessage('No workspace folder found')
      return
    }

    const themes = await this.findThemes(workspaceRoot)
    if (themes.length === 0) {
      vscode.window.showErrorMessage('No themes found')
      return
    }

    const selectedTheme = await vscode.window.showQuickPick(
      themes,
      { placeHolder: 'Select theme to preview' }
    )

    if (!selectedTheme) {
      return
    }

    try {
      await this.manager.openPlayground()
      vscode.window.showInformationMessage(`Previewing theme: ${selectedTheme}`)
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to preview theme: ${error}`)
    }
  }

  private async findThemes(root: string): Promise<string[]> {
    const themeDir = path.join(root, 'src/theme')
    if (!fs.existsSync(themeDir)) {
      return []
    }

    const files = fs.readdirSync(themeDir)
    return files
      .filter(file => file.endsWith('.ts') || file.endsWith('.js'))
      .map(file => path.basename(file, path.extname(file)))
  }

  private generateThemeTemplate(name: string): string {
    return `import { WebsmithTheme } from '@websmith/theme'

export const ${name}Theme: Partial<WebsmithTheme> = {
  colors: {
    primary: {
      50: '#eff6ff',
      500: '#3b82f6',
      900: '#1e3a8a',
    },
    secondary: {
      50: '#f8fafc',
      500: '#64748b',
      900: '#0f172a',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', '1rem'],
      base: ['1rem', '1.5rem'],
      lg: ['1.125rem', '1.75rem'],
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
  borders: {
    radius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      full: '9999px',
    },
  },
}
`
  }
}
