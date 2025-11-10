# Websmith Figma Plugin

Sync design tokens between Figma and Websmith Kit.

## Features

- **Extract Color Tokens**: Convert Figma paint styles to color tokens
- **Extract Typography**: Convert text styles to typography tokens
- **Extract Spacing**: Generate spacing scale from layout grids
- **Extract Effects**: Convert shadows and blurs to effect tokens
- **Export Formats**: JSON format compatible with Websmith Kit
- **Copy to Clipboard**: Easy token export

## Installation

### For Development

1. Install dependencies:
```bash
cd packages/websmith-figma
npm install
```

2. Build the plugin:
```bash
npm run build
```

3. In Figma:
   - Go to Plugins → Development → Import plugin from manifest
   - Select `manifest.json` from this directory

### For Users

Install from Figma Community (coming soon)

## Usage

1. Open your Figma file with design styles
2. Run the plugin: Plugins → Websmith Token Sync
3. Click "Extract Tokens" to scan your file
4. Review extracted tokens
5. Click "Copy JSON" to copy tokens
6. Paste into your Websmith project

## Token Naming Conventions

### Colors
- Use format: `colorName/shade` (e.g., `primary/500`, `gray/100`)
- Single colors: Use simple names (e.g., `background`, `text`)

### Typography
- Use descriptive names (e.g., `Heading 1`, `Body Text`, `Caption`)
- Plugin converts to kebab-case automatically

### Effects
- Name shadows descriptively (e.g., `Card Shadow`, `Button Hover`)
- Plugin extracts all shadow properties

## Output Format

```json
{
  "colors": {
    "primary": {
      "500": "#0ea5e9",
      "600": "#0284c7"
    }
  },
  "typography": {
    "fontFamily": {
      "heading-1": "Inter"
    },
    "fontSize": {
      "heading-1": "32px"
    }
  },
  "spacing": {
    "0": "0px",
    "1": "4px",
    "2": "8px"
  },
  "shadows": {
    "card-shadow": {
      "offsetX": "0px",
      "offsetY": "2px",
      "blur": "8px",
      "spread": "0px",
      "color": "#00000026"
    }
  }
}
```

## Integration with Websmith

1. Extract tokens from Figma
2. Save to `tokens/figma-tokens.json` in your project
3. Import in your token configuration:

```typescript
import figmaTokens from './tokens/figma-tokens.json'
import { mergeThemes } from '@websmith/ui'

const tokens = mergeThemes(figmaTokens, customTokens)
```

## Development

```bash
# Watch mode
npm run dev

# Build
npm run build

# Build plugin code only
npm run build:plugin

# Build UI only
npm run build:ui
```

## Troubleshooting

### No tokens extracted
- Ensure you have local styles defined in Figma
- Check that styles are not from external libraries

### Colors not matching
- Figma uses RGB, plugin converts to HEX
- Opacity is preserved in HEX alpha channel

### Typography missing
- Ensure text styles are defined locally
- Check font weights are standard values

## Roadmap

- [ ] Bidirectional sync (import tokens to Figma)
- [ ] Variable support for Figma Variables
- [ ] Custom export formats
- [ ] Batch processing multiple files
- [ ] Token validation
- [ ] Conflict resolution

## Contributing

See main Websmith Kit contributing guidelines.

## License

MIT
