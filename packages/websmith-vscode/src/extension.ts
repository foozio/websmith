import * as vscode from 'vscode'
import { WebsmithManager } from './managers/websmithManager'
import { ComponentProvider } from './providers/componentProvider'
import { TokenProvider } from './providers/tokenProvider'
import { ThemeProvider } from './providers/themeProvider'
import { WebsmithCompletionProvider } from './providers/completionProvider'
import { WebsmithHoverProvider } from './providers/hoverProvider'

export function activate(context: vscode.ExtensionContext) {
  console.log('Websmith Kit extension is now active!')

  // Initialize managers
  const websmithManager = new WebsmithManager(context)
  
  // Initialize providers
  const componentProvider = new ComponentProvider(websmithManager)
  const tokenProvider = new TokenProvider(websmithManager)
  const themeProvider = new ThemeProvider(websmithManager)
  const completionProvider = new WebsmithCompletionProvider(websmithManager)
  const hoverProvider = new WebsmithHoverProvider(websmithManager)

  // Register completion providers
  const completionDisposable = vscode.languages.registerCompletionItemProvider(
    ['typescript', 'typescriptreact', 'javascript', 'javascriptreact'],
    completionProvider,
    '<', '"', "'", ' '
  )

  // Register hover provider
  const hoverDisposable = vscode.languages.registerHoverProvider(
    ['typescript', 'typescriptreact', 'javascript', 'javascriptreact'],
    hoverProvider
  )

  // Register tree view provider
  const treeDataProvider = vscode.window.createTreeView('websmithExplorer', {
    treeDataProvider: componentProvider,
    showCollapseAll: true
  })

  // Register commands
  const commands = [
    vscode.commands.registerCommand('websmith.createComponent', () => 
      componentProvider.createComponent()
    ),
    vscode.commands.registerCommand('websmith.createTheme', () => 
      themeProvider.createTheme()
    ),
    vscode.commands.registerCommand('websmith.exportTokens', () => 
      tokenProvider.exportTokens()
    ),
    vscode.commands.registerCommand('websmith.validateTheme', () => 
      themeProvider.validateTheme()
    ),
    vscode.commands.registerCommand('websmith.generateDeclarations', () => 
      websmithManager.generateDeclarations()
    ),
    vscode.commands.registerCommand('websmith.openPlayground', () => 
      websmithManager.openPlayground()
    ),
    vscode.commands.registerCommand('websmith.openStorybook', () => 
      websmithManager.openStorybook()
    ),
    vscode.commands.registerCommand('websmith.insertComponent', () => 
      componentProvider.insertComponent()
    ),
    vscode.commands.registerCommand('websmith.insertToken', () => 
      tokenProvider.insertToken()
    ),
    vscode.commands.registerCommand('websmith.previewTheme', () => 
      themeProvider.previewTheme()
    ),
  ]

  // Register all disposables
  context.subscriptions.push(
    ...commands,
    completionDisposable,
    hoverDisposable,
    treeDataProvider,
    websmithManager
  )

  // Initialize configuration
  websmithManager.initialize()

  // Show welcome message on first activation
  if (context.globalState.get('websmith.welcomeShown') !== true) {
    vscode.window.showInformationMessage(
      'Welcome to Websmith Kit! 🎨',
      'Get Started',
      'View Documentation'
    ).then((selection: string | undefined) => {
      if (selection === 'Get Started') {
        vscode.commands.executeCommand('websmith.createComponent')
      } else if (selection === 'View Documentation') {
        vscode.env.openExternal(vscode.Uri.parse('https://websmith-kit.vercel.app'))
      }
    })
    context.globalState.update('websmith.welcomeShown', true)
  }
}

export function deactivate() {
  console.log('Websmith Kit extension deactivated')
}
