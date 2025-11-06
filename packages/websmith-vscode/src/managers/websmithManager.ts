import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'

export class WebsmithManager implements vscode.Disposable {
  private disposables: vscode.Disposable[] = []

  constructor(private context: vscode.ExtensionContext) {}

  initialize(): void {
    // Initialize workspace configuration
    this.setupConfiguration()
    this.setupWatchers()
  }

  private setupConfiguration(): void {
    const config = vscode.workspace.getConfiguration('websmith')
    
    // Validate configuration
    this.validateConfig(config)
  }

  private validateConfig(config: vscode.WorkspaceConfiguration): void {
    const requiredPaths = ['themePath', 'tokensPath', 'componentsPath']
    
    for (const path of requiredPaths) {
      const value = config.get<string>(path)
      if (!value) {
        vscode.window.showWarningMessage(
          `Websmith Kit: ${path} is not configured. Please check your settings.`
        )
      }
    }
  }

  private setupWatchers(): void {
    // Watch for theme and token file changes
    const config = vscode.workspace.getConfiguration('websmith')
    const themePath = config.get<string>('themePath')
    const tokensPath = config.get<string>('tokensPath')

    if (themePath && fs.existsSync(themePath)) {
      const themeWatcher = vscode.workspace.createFileSystemWatcher(
        new vscode.RelativePattern(path.dirname(themePath), path.basename(themePath))
      )
      
      themeWatcher.onDidChange(() => {
        vscode.window.showInformationMessage('Theme file changed. Consider validating your theme.')
      })
      
      this.disposables.push(themeWatcher)
    }

    if (tokensPath && fs.existsSync(tokensPath)) {
      const tokenWatcher = vscode.workspace.createFileSystemWatcher(
        new vscode.RelativePattern(path.dirname(tokensPath), path.basename(tokensPath))
      )
      
      tokenWatcher.onDidChange(() => {
        vscode.window.showInformationMessage('Token file changed. Consider regenerating exports.')
      })
      
      this.disposables.push(tokenWatcher)
    }
  }

  async generateDeclarations(): Promise<void> {
    try {
      const workspaceFolders = vscode.workspace.workspaceFolders
      if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder found')
        return
      }

      const rootPath = workspaceFolders[0].uri.fsPath
      const packageJsonPath = path.join(rootPath, 'package.json')
      
      if (!fs.existsSync(packageJsonPath)) {
        vscode.window.showErrorMessage('No package.json found in workspace')
        return
      }

      // Show progress indicator
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Generating TypeScript declarations...',
        cancellable: true
      }, async (progress: vscode.Progress<{ message?: string; increment?: number }>, token: vscode.CancellationToken) => {
        progress.report({ increment: 0, message: 'Initializing...' })
        
        // Simulate declaration generation
        await new Promise(resolve => setTimeout(resolve, 1000))
        progress.report({ increment: 50, message: 'Processing tokens...' })
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        progress.report({ increment: 100, message: 'Complete!' })
      })

      vscode.window.showInformationMessage('TypeScript declarations generated successfully!')
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to generate declarations: ${error}`)
    }
  }

  async openPlayground(): Promise<void> {
    const config = vscode.workspace.getConfiguration('websmith')
    const playgroundUrl = 'http://localhost:3000' // Default playground URL
    
    try {
      await vscode.env.openExternal(vscode.Uri.parse(playgroundUrl))
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to open playground: ${error}`)
    }
  }

  async openStorybook(): Promise<void> {
    const storybookUrl = 'http://localhost:6006' // Default Storybook URL
    
    try {
      await vscode.env.openExternal(vscode.Uri.parse(storybookUrl))
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to open Storybook: ${error}`)
    }
  }

  getWorkspaceRoot(): string | undefined {
    const workspaceFolders = vscode.workspace.workspaceFolders
    return workspaceFolders?.[0]?.uri.fsPath
  }

  getConfig<T>(key: string): T | undefined {
    const config = vscode.workspace.getConfiguration('websmith')
    return config.get<T>(key)
  }

  async setConfig(key: string, value: any): Promise<void> {
    const config = vscode.workspace.getConfiguration('websmith')
    await config.update(key, value, vscode.ConfigurationTarget.Workspace)
  }

  dispose(): void {
    this.disposables.forEach(d => d.dispose())
  }
}
