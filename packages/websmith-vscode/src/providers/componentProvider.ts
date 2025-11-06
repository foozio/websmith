import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'
import { WebsmithManager } from '../managers/websmithManager'

export class ComponentProvider implements vscode.TreeDataProvider<WebsmithItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<WebsmithItem | undefined | null | void> = new vscode.EventEmitter<WebsmithItem | undefined | null | void>()
  readonly onDidChangeTreeData: vscode.Event<WebsmithItem | undefined | null | void> = this._onDidChangeTreeData.event

  constructor(private manager: WebsmithManager) {}

  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  getTreeItem(element: WebsmithItem): vscode.TreeItem {
    return element
  }

  getChildren(element?: WebsmithItem): Promise<WebsmithItem[]> {
    if (!element) {
      // Root level items
      return Promise.resolve(this.getRootItems())
    }
    
    return Promise.resolve(this.getChildItems(element))
  }

  private getRootItems(): WebsmithItem[] {
    return [
      new WebsmithItem(
        'Components',
        vscode.TreeItemCollapsibleState.Expanded,
        'components',
        'Browse and create Websmith components'
      ),
      new WebsmithItem(
        'Themes',
        vscode.TreeItemCollapsibleState.Expanded,
        'themes',
        'Manage and customize themes'
      ),
      new WebsmithItem(
        'Tokens',
        vscode.TreeItemCollapsibleState.Expanded,
        'tokens',
        'Export and manage design tokens'
      ),
    ]
  }

  private getChildItems(element: WebsmithItem): WebsmithItem[] {
    switch (element.contextValue) {
      case 'components':
        return this.getComponentItems()
      case 'themes':
        return this.getThemeItems()
      case 'tokens':
        return this.getTokenItems()
      default:
        return []
    }
  }

  private getComponentItems(): WebsmithItem[] {
    const components = [
      'Button', 'Card', 'Dialog', 'Avatar', 'Badge', 'Label', 'Input', 'Select'
    ]
    
    return components.map(name => 
      new WebsmithItem(
        name,
        vscode.TreeItemCollapsibleState.None,
        'component',
        `Insert ${name} component`,
        {
          command: 'websmith.insertComponent',
          title: 'Insert Component',
          arguments: [name]
        }
      )
    )
  }

  private getThemeItems(): WebsmithItem[] {
    return [
      new WebsmithItem(
        'Create Theme',
        vscode.TreeItemCollapsibleState.None,
        'create-theme',
        'Create a new theme configuration',
        {
          command: 'websmith.createTheme',
          title: 'Create Theme'
        }
      ),
      new WebsmithItem(
        'Validate Theme',
        vscode.TreeItemCollapsibleState.None,
        'validate-theme',
        'Validate current theme configuration',
        {
          command: 'websmith.validateTheme',
          title: 'Validate Theme'
        }
      ),
      new WebsmithItem(
        'Preview Theme',
        vscode.TreeItemCollapsibleState.None,
        'preview-theme',
        'Preview theme in playground',
        {
          command: 'websmith.previewTheme',
          title: 'Preview Theme'
        }
      ),
    ]
  }

  private getTokenItems(): WebsmithItem[] {
    return [
      new WebsmithItem(
        'Export Tokens',
        vscode.TreeItemCollapsibleState.None,
        'export-tokens',
        'Export design tokens in various formats',
        {
          command: 'websmith.exportTokens',
          title: 'Export Tokens'
        }
      ),
      new WebsmithItem(
        'Insert Token',
        vscode.TreeItemCollapsibleState.None,
        'insert-token',
        'Insert design token reference',
        {
          command: 'websmith.insertToken',
          title: 'Insert Token'
        }
      ),
    ]
  }

  async createComponent(): Promise<void> {
    const componentName = await vscode.window.showInputBox({
      prompt: 'Enter component name',
      placeHolder: 'MyComponent',
      validateInput: (value: string) => {
        if (!value.match(/^[A-Z][a-zA-Z0-9]*$/)) {
          return 'Component name must start with uppercase letter and contain only alphanumeric characters'
        }
        return null
      }
    })

    if (!componentName) {
      return
    }

    const workspaceRoot = this.manager.getWorkspaceRoot()
    if (!workspaceRoot) {
      vscode.window.showErrorMessage('No workspace folder found')
      return
    }

    const componentsPath = this.manager.getConfig<string>('componentsPath') || './src/components'
    const fullPath = path.join(workspaceRoot, componentsPath, `${componentName}.tsx`)

    if (fs.existsSync(fullPath)) {
      vscode.window.showErrorMessage(`Component ${componentName} already exists`)
      return
    }

    const template = this.generateComponentTemplate(componentName)
    
    try {
      fs.mkdirSync(path.dirname(fullPath), { recursive: true })
      fs.writeFileSync(fullPath, template)
      
      const document = await vscode.workspace.openTextDocument(fullPath)
      await vscode.window.showTextDocument(document)
      
      vscode.window.showInformationMessage(`Component ${componentName} created successfully!`)
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to create component: ${error}`)
    }
  }

  async insertComponent(componentName?: string): Promise<void> {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found')
      return
    }

    const selectedComponent = componentName || await vscode.window.showQuickPick(
      ['Button', 'Card', 'Dialog', 'Avatar', 'Badge', 'Label', 'Input', 'Select'],
      { placeHolder: 'Select a component to insert' }
    )

    if (!selectedComponent) {
      return
    }

    const snippet = this.getComponentSnippet(selectedComponent)
    await editor.insertSnippet(new vscode.SnippetString(snippet))
  }

  private generateComponentTemplate(name: string): string {
    return `import * as React from "react"
import { cn } from "../lib/utils"

export interface ${name}Props extends React.HTMLAttributes<HTMLDivElement> {
  // Add your component props here
}

export const ${name} = React.forwardRef<HTMLDivElement, ${name}Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("base-component-classes", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

${name}.displayName = "${name}"
`
  }

  private getComponentSnippet(name: string): string {
    const snippets: Record<string, string> = {
      'Button': '<Button variant="$1" size="$2">$3</Button>',
      'Card': '<Card>\n  <CardHeader>\n    <CardTitle>$1</CardTitle>\n    <CardDescription>$2</CardDescription>\n  </CardHeader>\n  <CardContent>\n    $3\n  </CardContent>\n</Card>',
      'Dialog': '<Dialog>\n  <DialogTrigger asChild>\n    <Button variant="outline">$1</Button>\n  </DialogTrigger>\n  <DialogContent>\n    <DialogHeader>\n      <DialogTitle>$2</DialogTitle>\n      <DialogDescription>$3</DialogDescription>\n    </DialogHeader>\n  </DialogContent>\n</Dialog>',
      'Avatar': '<Avatar>\n  <AvatarImage src="$1" alt="$2" />\n  <AvatarFallback>$3</AvatarFallback>\n</Avatar>',
      'Badge': '<Badge variant="$1">$2</Badge>',
      'Label': '<Label htmlFor="$1">$2</Label>',
      'Input': '<Input type="$1" placeholder="$2" />',
      'Select': '<Select>\n  <SelectTrigger>\n    <SelectValue placeholder="$1" />\n  </SelectTrigger>\n  <SelectContent>\n    <SelectItem value="$2">$3</SelectItem>\n  </SelectContent>\n</Select>',
    }

    return snippets[name] || `<${name}>$1</${name}>`
  }
}

export class WebsmithItem extends vscode.TreeItem {
  public readonly contextValue: string
  
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly itemType: string,
    public readonly tooltip?: string,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState)
    this.contextValue = itemType
    this.tooltip = tooltip || this.label
  }

  iconPath = {
    light: vscode.Uri.file(path.join(__filename, '..', '..', '..', 'resources', 'light', `${this.itemType}.svg`)),
    dark: vscode.Uri.file(path.join(__filename, '..', '..', '..', 'resources', 'dark', `${this.itemType}.svg`))
  }
}
