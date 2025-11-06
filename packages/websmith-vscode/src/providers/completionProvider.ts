import * as vscode from 'vscode'
import { WebsmithManager } from '../managers/websmithManager'

export class WebsmithCompletionProvider implements vscode.CompletionItemProvider {
  constructor(private manager: WebsmithManager) {}

  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.CompletionItem[] {
    const line = document.lineAt(position).text
    const prefix = line.substring(0, position.character)

    const items: vscode.CompletionItem[] = []

    // Component completions
    if (this.shouldProvideComponents(prefix, document.languageId)) {
      items.push(...this.getComponentCompletions())
    }

    // Token completions
    if (this.shouldProvideTokens(prefix, document.languageId)) {
      items.push(...this.getTokenCompletions())
    }

    return items
  }

  private shouldProvideComponents(prefix: string, languageId: string): boolean {
    const componentPatterns = ['<', 'Button', 'Card', 'Dialog', 'Avatar', 'Badge', 'Label', 'Input', 'Select']
    return componentPatterns.some(pattern => prefix.includes(pattern)) && 
           ['typescriptreact', 'javascriptreact'].includes(languageId)
  }

  private shouldProvideTokens(prefix: string, languageId: string): boolean {
    const tokenPatterns = ['var(', '--ws-', 'color', 'spacing', 'font', 'shadow', 'border']
    return tokenPatterns.some(pattern => prefix.includes(pattern)) && 
           ['typescript', 'typescriptreact', 'javascript', 'javascriptreact', 'css', 'scss', 'less'].includes(languageId)
  }

  private getComponentCompletions(): vscode.CompletionItem[] {
    const components = [
      {
        label: 'Button',
        kind: vscode.CompletionItemKind.Class,
        insertText: new vscode.SnippetString('Button variant="${1:default}" size="${2:default}">${3:Button Text}</Button>'),
        documentation: 'A customizable button component with variants and sizes'
      },
      {
        label: 'Card',
        kind: vscode.CompletionItemKind.Class,
        insertText: new vscode.SnippetString('Card>\n  <CardHeader>\n    <CardTitle>${1:Card Title}</CardTitle>\n    <CardDescription>${2:Card Description}</CardDescription>\n  </CardHeader>\n  <CardContent>\n    ${3:Card Content}\n  </CardContent>\n</Card>'),
        documentation: 'A flexible card container with header and content sections'
      },
      {
        label: 'Dialog',
        kind: vscode.CompletionItemKind.Class,
        insertText: new vscode.SnippetString('Dialog>\n  <DialogTrigger asChild>\n    <Button variant="outline">${1:Open Dialog}</Button>\n  </DialogTrigger>\n  <DialogContent>\n    <DialogHeader>\n      <DialogTitle>${2:Dialog Title}</DialogTitle>\n      <DialogDescription>${3:Dialog Description}</DialogDescription>\n    </DialogHeader>\n  </DialogContent>\n</Dialog>'),
        documentation: 'A modal dialog component with trigger and content'
      },
      {
        label: 'Avatar',
        kind: vscode.CompletionItemKind.Class,
        insertText: new vscode.SnippetString('Avatar>\n  <AvatarImage src="${1:https://example.com/avatar.jpg}" alt="${2:User Avatar}" />\n  <AvatarFallback>${3:U}</AvatarFallback>\n</Avatar>'),
        documentation: 'An avatar component with image and fallback'
      },
      {
        label: 'Badge',
        kind: vscode.CompletionItemKind.Class,
        insertText: new vscode.SnippetString('Badge variant="${1:default}">${2:Badge Text}</Badge>'),
        documentation: 'A small badge component for status and labels'
      },
      {
        label: 'Label',
        kind: vscode.CompletionItemKind.Class,
        insertText: new vscode.SnippetString('Label htmlFor="${1:input-id}">${2:Label Text}</Label>'),
        documentation: 'A label component for form inputs'
      },
      {
        label: 'Input',
        kind: vscode.CompletionItemKind.Class,
        insertText: new vscode.SnippetString('Input type="${1:text}" placeholder="${2:Enter text...}" />'),
        documentation: 'A customizable input component'
      },
      {
        label: 'Select',
        kind: vscode.CompletionItemKind.Class,
        insertText: new vscode.SnippetString('Select>\n  <SelectTrigger>\n    <SelectValue placeholder="${1:Select an option}" />\n  </SelectTrigger>\n  <SelectContent>\n    <SelectItem value="${2:option1}">${3:Option 1}</SelectItem>\n    <SelectItem value="${4:option2}">${5:Option 2}</SelectItem>\n  </SelectContent>\n</Select>'),
        documentation: 'A select dropdown component'
      }
    ]

    return components.map(comp => {
      const item = new vscode.CompletionItem(comp.label, comp.kind)
      item.insertText = comp.insertText
      item.documentation = new vscode.MarkdownString(comp.documentation)
      item.detail = 'Websmith UI Component'
      return item
    })
  }

  private getTokenCompletions(): vscode.CompletionItem[] {
    const tokens = [
      // Colors
      { label: 'var(--ws-color-primary-50)', kind: vscode.CompletionItemKind.Color, documentation: 'Primary color, shade 50' },
      { label: 'var(--ws-color-primary-500)', kind: vscode.CompletionItemKind.Color, documentation: 'Primary color, shade 500' },
      { label: 'var(--ws-color-primary-900)', kind: vscode.CompletionItemKind.Color, documentation: 'Primary color, shade 900' },
      { label: 'var(--ws-color-secondary-500)', kind: vscode.CompletionItemKind.Color, documentation: 'Secondary color, shade 500' },
      { label: 'var(--ws-color-accent-500)', kind: vscode.CompletionItemKind.Color, documentation: 'Accent color, shade 500' },
      
      // Spacing
      { label: 'var(--ws-spacing-xs)', kind: vscode.CompletionItemKind.Variable, documentation: 'Extra small spacing (0.25rem)' },
      { label: 'var(--ws-spacing-sm)', kind: vscode.CompletionItemKind.Variable, documentation: 'Small spacing (0.5rem)' },
      { label: 'var(--ws-spacing-md)', kind: vscode.CompletionItemKind.Variable, documentation: 'Medium spacing (1rem)' },
      { label: 'var(--ws-spacing-lg)', kind: vscode.CompletionItemKind.Variable, documentation: 'Large spacing (1.5rem)' },
      { label: 'var(--ws-spacing-xl)', kind: vscode.CompletionItemKind.Variable, documentation: 'Extra large spacing (2rem)' },
      
      // Typography
      { label: 'var(--ws-font-size-xs)', kind: vscode.CompletionItemKind.Variable, documentation: 'Extra small font size' },
      { label: 'var(--ws-font-size-base)', kind: vscode.CompletionItemKind.Variable, documentation: 'Base font size' },
      { label: 'var(--ws-font-size-lg)', kind: vscode.CompletionItemKind.Variable, documentation: 'Large font size' },
      
      // Shadows
      { label: 'var(--ws-shadow-sm)', kind: vscode.CompletionItemKind.Variable, documentation: 'Small shadow' },
      { label: 'var(--ws-shadow-md)', kind: vscode.CompletionItemKind.Variable, documentation: 'Medium shadow' },
      { label: 'var(--ws-shadow-lg)', kind: vscode.CompletionItemKind.Variable, documentation: 'Large shadow' },
      
      // Borders
      { label: 'var(--ws-border-radius-sm)', kind: vscode.CompletionItemKind.Variable, documentation: 'Small border radius' },
      { label: 'var(--ws-border-radius-md)', kind: vscode.CompletionItemKind.Variable, documentation: 'Medium border radius' },
      { label: 'var(--ws-border-radius-lg)', kind: vscode.CompletionItemKind.Variable, documentation: 'Large border radius' },
      { label: 'var(--ws-border-radius-full)', kind: vscode.CompletionItemKind.Variable, documentation: 'Full border radius' },
    ]

    return tokens.map(token => {
      const item = new vscode.CompletionItem(token.label, token.kind)
      item.documentation = new vscode.MarkdownString(token.documentation)
      item.detail = 'Websmith Design Token'
      item.insertText = token.label
      return item
    })
  }
}
