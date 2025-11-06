import * as vscode from 'vscode'
import { WebsmithManager } from '../managers/websmithManager'

export class WebsmithHoverProvider implements vscode.HoverProvider {
  constructor(private manager: WebsmithManager) {}

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.Hover | undefined {
    const range = document.getWordRangeAtPosition(position)
    if (!range) {
      return undefined
    }

    const word = document.getText(range)
    
    // Provide hover for components
    const componentInfo = this.getComponentInfo(word)
    if (componentInfo) {
      return new vscode.Hover(componentInfo)
    }

    // Provide hover for tokens
    const tokenInfo = this.getTokenInfo(word)
    if (tokenInfo) {
      return new vscode.Hover(tokenInfo)
    }

    return undefined
  }

  private getComponentInfo(component: string): vscode.MarkdownString | undefined {
    const components: Record<string, string> = {
      'Button': `**Button Component**

A customizable button component with multiple variants and sizes.

**Props:**
- \`variant\`: 'default' | 'outline' | 'ghost' | 'destructive'
- \`size\`: 'default' | 'sm' | 'lg' | 'icon'
- \`asChild\?: boolean\`

**Example:**
\`\`\`tsx
<Button variant="default" size="md">
  Click me
</Button>
\`\`\``,
      
      'Card': `**Card Component**

A flexible card container with header and content sections.

**Sub-components:**
- \`CardHeader\`: Container for title and description
- \`CardTitle\`: Card title
- \`CardDescription\`: Card description  
- \`CardContent\`: Main content area
- \`CardFooter\`: Bottom section

**Example:**
\`\`\`tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
\`\`\``,

      'Dialog': `**Dialog Component**

A modal dialog component with trigger and content.

**Sub-components:**
- \`DialogTrigger\`: Element that opens the dialog
- \`DialogContent\`: Dialog content container
- \`DialogHeader\`: Header section
- \`DialogTitle\`: Dialog title
- \`DialogDescription\`: Dialog description
- \`DialogFooter\`: Footer section

**Example:**
\`\`\`tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
\`\`\``,

      'Avatar': `**Avatar Component**

An avatar component with image and fallback support.

**Sub-components:**
- \`AvatarImage\`: Image element
- \`AvatarFallback\`: Fallback content

**Props:**
- \`src?\`: Image source URL
- \`alt?\`: Alt text for image

**Example:**
\`\`\`tsx
<Avatar>
  <AvatarImage src="https://example.com/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
\`\`\``,

      'Badge': `**Badge Component**

A small badge component for status and labels.

**Props:**
- \`variant\`: 'default' | 'secondary' | 'destructive' | 'outline'

**Example:**
\`\`\`tsx
<Badge variant="default">New</Badge>
\`\`\``,

      'Label': `**Label Component**

A label component for form inputs.

**Props:**
- \`htmlFor\`: ID of the input element

**Example:**
\`\`\`tsx
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />
\`\`\``,

      'Input': `**Input Component**

A customizable input component.

**Props:**
- \`type\`: Input type (text, email, password, etc.)
- \`placeholder\`: Placeholder text
- \`disabled?\`: Disable the input

**Example:**
\`\`\`tsx
<Input type="email" placeholder="Enter your email" />
\`\`\``,

      'Select': `**Select Component**

A select dropdown component.

**Sub-components:**
- \`SelectTrigger\`: Trigger element
- \`SelectValue\`: Display value
- \`SelectContent\`: Dropdown content
- \`SelectItem\`: Individual option

**Example:**
\`\`\`tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
\`\`\``,
    }

    const info = components[component]
    return info ? new vscode.MarkdownString(info) : undefined
  }

  private getTokenInfo(token: string): vscode.MarkdownString | undefined {
    const tokens: Record<string, string> = {
      '--ws-color-primary-500': `**Primary Color (500)**

The main primary color of the design system.

**Usage:**
\`\`\`css
color: var(--ws-color-primary-500);
background-color: var(--ws-color-primary-500);
\`\`\``,
      
      '--ws-spacing-md': `**Medium Spacing**

Standard medium spacing unit (1rem).

**Usage:**
\`\`\`css
padding: var(--ws-spacing-md);
margin: var(--ws-spacing-md);
gap: var(--ws-spacing-md);
\`\`\``,
      
      '--ws-font-size-base': `**Base Font Size**

Default font size for body text (1rem).

**Usage:**
\`\`\`css
font-size: var(--ws-font-size-base);
\`\`\``,
      
      '--ws-shadow-md': `**Medium Shadow**

Standard medium shadow for elevated elements.

**Usage:**
\`\`\`css
box-shadow: var(--ws-shadow-md);
\`\`\``,
      
      '--ws-border-radius-md': `**Medium Border Radius**

Standard medium border radius (0.375rem).

**Usage:**
\`\`\`css
border-radius: var(--ws-border-radius-md);
\`\`\``,
    }

    const info = tokens[token]
    return info ? new vscode.MarkdownString(info) : undefined
  }
}
