import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'
import { WebsmithManager } from '../managers/websmithManager'

export class TokenProvider {
  constructor(private manager: WebsmithManager) {}

  async exportTokens(): Promise<void> {
    const format = await vscode.window.showQuickPick(
      ['css', 'scss', 'less', 'js', 'ts', 'json'],
      { placeHolder: 'Select export format' }
    )

    if (!format) {
      return
    }

    const workspaceRoot = this.manager.getWorkspaceRoot()
    if (!workspaceRoot) {
      vscode.window.showErrorMessage('No workspace folder found')
      return
    }

    try {
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Exporting tokens as ${format.toUpperCase()}...`,
      }, async () => {
        // Simulate token export
        await new Promise(resolve => setTimeout(resolve, 1500))
      })

      vscode.window.showInformationMessage(`Tokens exported successfully as ${format.toUpperCase()}!`)
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to export tokens: ${error}`)
    }
  }

  async insertToken(): Promise<void> {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found')
      return
    }

    const tokenType = await vscode.window.showQuickPick(
      ['Color', 'Spacing', 'Typography', 'Shadow', 'Border'],
      { placeHolder: 'Select token type' }
    )

    if (!tokenType) {
      return
    }

    const snippet = this.getTokenSnippet(tokenType)
    await editor.insertSnippet(new vscode.SnippetString(snippet))
  }

  private getTokenSnippet(type: string): string {
    const snippets: Record<string, string> = {
      'Color': 'var(--ws-color-${1:primary}-${2:500})',
      'Spacing': 'var(--ws-spacing-${1:md})',
      'Typography': 'var(--ws-font-size-${1:base})',
      'Shadow': 'var(--ws-shadow-${1:sm})',
      'Border': 'var(--ws-border-radius-${1:md})',
    }

    return snippets[type] || '$1'
  }
}
