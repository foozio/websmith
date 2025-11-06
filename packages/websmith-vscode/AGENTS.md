# Websmith VS Code Extension Guide

## Mission
Enhance developer experience for Websmith Kit users through intelligent IDE integration, code completion, and productivity tools.

## Extension Features

### Component Management
- **Component Explorer**: Tree view of available Websmith components
- **Quick Insert**: Context menu and command palette insertion
- **Code Snippets**: Pre-built templates for common component patterns
- **IntelliSense**: Smart completion with documentation hover

### Token Integration
- **Token Browser**: Explore and insert design tokens
- **Export Commands**: Generate tokens in multiple formats (CSS, SCSS, JSON)
- **Snippet Support**: Token insertion with proper CSS variable syntax
- **Validation**: Theme and token configuration checking

### Theme Tools
- **Theme Creator**: Scaffold new theme configurations
- **Validator**: Check theme structure and token references
- **Preview**: Open themes in the playground for visual inspection
- **Hot Reload**: Integration with playground theme switching

### Development Workflow
- **Declaration Generation**: Generate TypeScript declarations from CLI
- **Playground Integration**: Direct links to component testing
- **Storybook Access**: Quick access to component stories
- **Workspace Detection**: Automatic Websmith project recognition

## Commands

- `websmith.createComponent` - Scaffold new component with template
- `websmith.createTheme` - Generate theme configuration file
- `websmith.exportTokens` - Export design tokens to various formats
- `websmith.validateTheme` - Validate theme configuration
- `websmith.generateDeclarations` - Generate TypeScript declarations
- `websmith.openPlayground` - Launch component playground
- `websmith.openStorybook` - Open Storybook interface
- `websmith.insertComponent` - Insert component at cursor
- `websmith.insertToken` - Insert design token reference
- `websmith.previewTheme` - Preview theme in playground

## Configuration

```json
{
  "websmith.autoImport": true,
  "websmith.themePath": "./src/theme.ts",
  "websmith.tokensPath": "./src/tokens.ts",
  "websmith.componentsPath": "./src/components",
  "websmith.enableIntellisense": true,
  "websmith.showPreview": true,
  "websmith.exportFormat": "css"
}
```

## Development

### Extension Structure
```
src/
├── extension.ts          # Main activation file
├── managers/
│   └── websmithManager.ts # Core functionality
├── providers/
│   ├── componentProvider.ts # Component tree/commands
│   ├── tokenProvider.ts     # Token management
│   ├── themeProvider.ts     # Theme tools
│   ├── completionProvider.ts # IntelliSense
│   └── hoverProvider.ts     # Documentation hover
├── resources/            # Icons and assets
└── snippets/             # Code snippets
```

### Building & Testing
```bash
npm run compile          # Build extension
npm run watch           # Watch mode
code --extensionDevelopmentPath=. # Test in VS Code
```

### Publishing
1. Update version in `package.json`
2. Build: `npm run compile`
3. Package: `vsce package`
4. Publish: `vsce publish`

## User Experience Goals

- **Zero Configuration**: Works out-of-the-box with Websmith projects
- **Non-Intrusive**: Only activates in relevant file types
- **Performance**: Fast, lightweight, and responsive
- **Accessible**: Keyboard navigation and screen reader support
- **Discoverable**: Helpful onboarding and documentation

## Maintenance

- **Version Sync**: Keep in sync with Websmith Kit releases
- **Compatibility**: Support latest VS Code versions
- **Feedback Loop**: Collect user feedback for improvements
- **Documentation**: Update extension docs with new features
