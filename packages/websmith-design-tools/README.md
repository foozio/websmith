# @websmith/design-tools

Design tools integration for Websmith design tokens with Sketch, Adobe XD, and Figma support.

## Installation

```bash
npm install @websmith/design-tools @websmith/tokens
# or
yarn add @websmith/design-tools @websmith/tokens
# or
pnpm add @websmith/design-tools @websmith/tokens
```

## CLI Usage

### Export Tokens

Export Websmith tokens to design tool formats:

```bash
# Export to Sketch format
websmith-design export sketch ./tokens.sketch

# Export to Figma format
websmith-design export figma ./figma-variables.json

# Export to Adobe XD format
websmith-design export xd ./xd-styles.json

# Export to JSON format
websmith-design export json ./tokens.json

# Export with custom theme and prefix
websmith-design export sketch ./dark-tokens.sketch --theme dark --prefix myapp
```

### Validate Tokens

Validate token files for correctness:

```bash
websmith-design validate ./tokens.json
```

### Get Info

Show available formats and options:

```bash
websmith-design info
```

## Programmatic Usage

### Export Functions

```typescript
import { exportTokens, DesignToolsExporter } from '@websmith/design-tools'

// Export using utility function
exportTokens('sketch', './tokens.sketch', {
  theme: 'light',
  prefix: 'ws'
})

// Use the exporter class for more control
const exporter = new DesignToolsExporter('dark')
exporter.exportToFile('figma', './figma-variables.json')
```

### Sketch Export

```typescript
import { exportToSketch, exportSketchFile } from '@websmith/design-tools/sketch'

const sketchData = exportToSketch({ theme: 'light' })
exportSketchFile('./tokens.sketch')
```

### Figma Export

```typescript
import { exportToFigma, exportFigmaFile } from '@websmith/design-tools/figma'

const figmaData = exportToFigma({ theme: 'dark' })
exportFigmaFile('./figma-variables.json')
```

### Adobe XD Export

```typescript
import { exportToAdobeXD, exportAdobeXDFile } from '@websmith/design-tools/adobe-xd'

const xdData = exportToAdobeXD({ theme: 'light' })
exportAdobeXDFile('./xd-styles.json')
```

## Export Formats

### Sketch Format

Exports to Sketch shared styles format:

```json
{
  "version": "2.0",
  "compatibilityVersion": "2.0",
  "app": "com.bohemiancoding.sketch3",
  "sharedStyles": [
    {
      "_class": "sharedStyle",
      "name": "ws/background",
      "value": {
        "fills": [
          {
            "color": {
              "_class": "color",
              "red": 1,
              "green": 1,
              "blue": 1,
              "alpha": 1
            }
          }
        ]
      }
    }
  ]
}
```

### Figma Format

Exports to Figma variables format:

```json
{
  "name": "Websmith Light Theme",
  "variables": [
    {
      "id": "VariableID:background",
      "name": "ws/background",
      "type": "COLOR",
      "valuesByMode": {
        "light": {
          "r": 1,
          "g": 1,
          "b": 1,
          "a": 1
        }
      }
    }
  ],
  "variableCollections": [
    {
      "id": "VariableCollectionId:1",
      "name": "Light Theme",
      "modes": [
        {
          "modeId": "light",
          "name": "Light"
        }
      ]
    }
  ]
}
```

### Adobe XD Format

Exports to Adobe XD styles format:

```json
{
  "version": "1.0",
  "styles": [
    {
      "name": "ws-background",
      "type": "color",
      "value": "hsl(0, 0%, 100%)",
      "category": "colors"
    }
  ],
  "metadata": {
    "exportedAt": "2024-01-01T00:00:00.000Z",
    "source": "websmith",
    "theme": "light"
  }
}
```

## Validation

Validate token files for consistency and correctness:

```typescript
import { validateTokenFile } from '@websmith/design-tools'

const result = validateTokenFile('./tokens.json')
if (!result.isValid) {
  console.log('Errors:', result.errors)
  console.log('Warnings:', result.warnings)
}
```

## CI/CD Integration

Use in automated workflows:

```yaml
# .github/workflows/design-tokens.yml
name: Export Design Tokens
on: push:
    paths:
      - 'packages/websmith-tokens/**'

jobs:
  export:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build -- --filter=packages/websmith-tokens
      - run: npx websmith-design export sketch ./design-tokens.sketch
      - run: npx websmith-design export figma ./figma-variables.json
      - uses: actions/upload-artifact@v3
        with:
          name: design-tokens
          path: |
            ./design-tokens.sketch
            ./figma-variables.json
```

## API Reference

### Classes

- `DesignToolsExporter`: Main exporter class with validation and export methods

### Functions

- `exportTokens(format, outputPath, options?)`: Export tokens to file
- `validateTokenFile(filePath)`: Validate token file format

### Options

```typescript
interface ExportOptions {
  theme?: 'light' | 'dark'
  prefix?: string
  outputPath?: string
  includeMetadata?: boolean
  format?: 'json' | 'css' | 'sketch' | 'figma' | 'xd'
}
```

## Supported Tools

- **Sketch 69+**: Shared styles and color palettes
- **Figma**: Variables and component tokens
- **Adobe XD**: Design tokens and styles

## License

MIT
