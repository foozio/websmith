# Token Export Formats

## Overview

Websmith Kit provides comprehensive token export capabilities supporting multiple formats and platforms. Design tokens can be exported to various formats ensuring consistency across different development environments and tools.

## Available Export Formats

### 🎨 **CSS Formats**

#### CSS Custom Properties
```typescript
import { exportToCSSCustomProperties } from '@websmith/tokens'

const css = exportToCSSCustomProperties(tokens, {
  prefix: 'ws',
  includeFallbacks: true,
  includeTheme: true
})
```

**Features:**
- CSS custom properties with fallbacks
- RGB values for opacity support
- Dark theme variations
- High contrast theme support
- Utility classes for quick access

**Output Example:**
```css
:root {
  --ws-color-primary-500: #3b82f6;
  --ws-color-primary-500-rgb: 59, 130, 246;
  --ws-spacing-md: 1rem;
}

[data-theme="dark"] {
  --ws-background: #09090b;
  --ws-foreground: #fafafa;
}

.ws-bg-primary { background-color: var(--ws-color-primary-500); }
```

#### Standard CSS
```typescript
import { exportToCSS } from '@websmith/tokens'

const css = exportToCSS(tokens, 'ws')
```

### 🎯 **Preprocessor Formats**

#### SCSS with Maps and Mixins
```typescript
import { exportToSCSS } from '@websmith/tokens'

const scss = exportToSCSS(tokens, {
  prefix: 'ws',
  includeMaps: true,
  includeUtilities: true
})
```

**Features:**
- SCSS variables with prefix
- SCSS maps for dynamic access
- Utility mixins for common patterns
- Nested token structure

**Output Example:**
```scss
// Token Variables
$ws-color-primary-500: #3b82f6;
$ws-spacing-md: 1rem;

// SCSS Maps
$ws-colors: (
  'primary': (
    '500': #3b82f6,
  ),
);

// Utility Mixins
@mixin ws-color($color, $shade: 500) {
  color: $ws-color-#{$color}-#{$shade};
}

@mixin ws-bg-color($color, $shade: 500) {
  background-color: $ws-color-#{$color}-#{$shade};
}
```

#### LESS with Variables and Mixins
```typescript
import { exportToLESS } from '@websmith/tokens'

const less = exportToLESS(tokens, {
  prefix: 'ws',
  includeMaps: true,
  includeUtilities: true
})
```

**Features:**
- LESS variables with @ prefix
- Utility mixins for dynamic styling
- Variable interpolation support

**Output Example:**
```less
// Token Variables
@ws-color-primary-500: #3b82f6;
@ws-spacing-md: 1rem;

// Utility Mixins
.ws-color(@color, @shade: 500) {
  color: @@{ws-color-@{color}-@{shade}};
}

.ws-bg-color(@color, @shade: 500) {
  background-color: @@{ws-color-@{color}-@{shade}};
}
```

#### Stylus with Variables and Functions
```typescript
import { exportToStylus } from '@websmith/tokens'

const stylus = exportToStylus(tokens, {
  prefix: 'ws',
  includeUtilities: true
})
```

**Features:**
- Stylus variables
- Function-based utilities
- Lookup-based token access

**Output Example:**
```stylus
// Token Variables
ws-color-primary-500 = #3b82f6
ws-spacing-md = 1rem

// Utility Functions
ws-color(color, shade = 500)
  color: lookup('ws-color-' + color + '-' + shade)

ws-bg-color(color, shade = 500)
  background-color: lookup('ws-color-' + color + '-' + shade)
```

### 💻 **JavaScript/TypeScript Formats**

#### JavaScript (ES Modules, CommonJS, UMD)
```typescript
import { exportToJavaScript } from '@websmith/tokens'

// ES Module
const esm = exportToJavaScript(tokens, {
  format: 'esm',
  variableName: 'designTokens'
})

// CommonJS
const cjs = exportToJavaScript(tokens, {
  format: 'cjs',
  variableName: 'designTokens'
})

// UMD
const umd = exportToJavaScript(tokens, {
  format: 'umd',
  variableName: 'designTokens'
})
```

**Output Example (ESM):**
```javascript
// Websmith Design Tokens - ES Module
export const designTokens = {
  "colors": {
    "primary": {
      "500": "#3b82f6"
    }
  }
};

export default designTokens;
```

#### TypeScript with Interfaces
```typescript
import { exportToTypeScript } from '@websmith/tokens'

const ts = exportToTypeScript(tokens, 'DesignTokens')
```

**Features:**
- TypeScript interface definitions
- Type-safe token access
- Const assertion for immutability

**Output Example:**
```typescript
export interface DesignTokens {
  colors: {
    primary: {
      [key: string]: string;
    };
  };
}

export const tokens: DesignTokens = {
  "colors": {
    "primary": {
      "500": "#3b82f6"
    }
  }
};
```

### 📱 **Mobile Platform Formats**

#### Android XML Resources
```typescript
import { exportToAndroidXML } from '@websmith/tokens'

const androidXml = exportToAndroidXML(tokens, {
  resourcePrefix: 'ws_'
})
```

**Features:**
- Android color resources
- Dimension resources for spacing
- Integer resources for font weights
- Proper XML formatting

**Output Example:**
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
  <!-- Colors -->
  <color name="ws_primary_500">#3b82f6</color>
  
  <!-- Spacing -->
  <dimen name="ws_spacing_md">1rem</dimen>
  
  <!-- Typography -->
  <dimen name="ws_font_size_base">1rem</dimen>
  <integer name="ws_font_weight_normal">400</integer>
</resources>
```

#### iOS Swift with UIColor
```typescript
import { exportToIOSSwift } from '@websmith/tokens'

const swift = exportToIOSSwift(tokens, {
  structName: 'DesignTokens',
  useUIColor: true
})
```

**Features:**
- Swift struct with nested types
- UIColor integration with hex support
- CGFloat values for spacing and typography
- Proper Swift naming conventions

**Output Example:**
```swift
// Websmith Design Tokens - Swift
import UIKit

struct DesignTokens {
    // MARK: - Colors
    struct Primary {
        static let color500 = UIColor(hex: "#3b82f6")
    }
    
    // MARK: - Spacing
    static let spacingMd: CGFloat = 1.0
    
    // MARK: - Typography
    static let fontSizeBase: CGFloat = 1.0
}

// MARK: - UIColor Extension
extension UIColor {
    convenience init(hex: String) {
        // Hex to UIColor conversion logic
    }
}
```

### 📄 **Data Formats**

#### JSON with Pretty Printing
```typescript
import { exportToJSON } from '@websmith/tokens'

const json = exportToJSON(tokens, {
  pretty: true
})
```

#### XML with Metadata
```typescript
import { exportToXML } from '@websmith/tokens'

const xml = exportToXML(tokens, {
  rootElement: 'designTokens',
  includeMetadata: true
})
```

**Output Example:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- Websmith Design Tokens -->
<!-- Generated: 2025-01-06T13:15:00.000Z -->
<!-- Version: 1.0.0 -->

<designTokens>
  <colors>
    <primary>
      <500>#3b82f6</500>
    </primary>
  </colors>
  <spacing>
    <md>1rem</md>
  </spacing>
</designTokens>
```

### 🏗️ **Design System Formats**

#### Style Dictionary Format
```typescript
import { exportToStyleDictionary } from '@websmith/tokens'

const styleDict = exportToStyleDictionary()
```

#### JSON Schema for Validation
```typescript
import { exportToJSONSchema } from '@websmith/tokens'

const schema = exportToJSONSchema()
```

#### Figma Tokens Format
```typescript
import { exportToFigmaTokens } from '@websmith/tokens'

const figmaTokens = exportToFigmaTokens()
```

## Usage Examples

### Web Development
```typescript
import { exportToCSSCustomProperties, exportToSCSS } from '@websmith/tokens'

// Generate CSS custom properties for modern browsers
const cssVars = exportToCSSCustomProperties(tokens)

// Generate SCSS with mixins for legacy support
const scssTokens = exportToSCSS(tokens, {
  prefix: 'brand',
  includeUtilities: true
})

// Write to files
fs.writeFileSync('tokens.css', cssVars)
fs.writeFileSync('tokens.scss', scssTokens)
```

### Mobile Development
```typescript
import { exportToAndroidXML, exportToIOSSwift } from '@websmith/tokens'

// Android resources
const androidRes = exportToAndroidXML(tokens, {
  resourcePrefix: 'app_'
})
fs.writeFileSync('android/app/src/main/res/values/tokens.xml', androidRes)

// iOS Swift tokens
const iosTokens = exportToIOSSwift(tokens, {
  structName: 'AppTokens',
  useUIColor: true
})
fs.writeFileSync('ios/App/Tokens.swift', iosTokens)
```

### Design Tool Integration
```typescript
import { exportToFigmaTokens, exportToJSONSchema } from '@websmith/tokens'

// Figma plugin integration
const figmaData = exportToFigmaTokens()
figma.ui.postMessage({ type: 'tokens', data: figmaData })

// Schema validation
const schema = exportToJSONSchema()
const ajv = new Ajv()
const validate = ajv.compile(schema)
const isValid = validate(tokens)
```

## Configuration Options

### Common Options
- **prefix**: Variable prefix (default: 'ws')
- **includeMetadata**: Add generation metadata
- **includeUtilities**: Generate utility functions/mixins
- **includeMaps**: Include data maps for dynamic access

### Format-Specific Options
- **CSS Custom Properties**: includeFallbacks, includeTheme
- **JavaScript**: format ('esm' | 'cjs' | 'umd'), variableName
- **iOS Swift**: structName, useUIColor
- **Android XML**: resourcePrefix

## Build Integration

### Package.json Scripts
```json
{
  "scripts": {
    "tokens:export:css": "node scripts/export-tokens.js css",
    "tokens:export:scss": "node scripts/export-tokens.js scss",
    "tokens:export:mobile": "node scripts/export-tokens.js mobile",
    "tokens:export:all": "node scripts/export-tokens.js all"
  }
}
```

### Export Script Example
```javascript
// scripts/export-tokens.js
const { tokens } = require('@websmith/tokens')
const { 
  exportToCSSCustomProperties, 
  exportToSCSS, 
  exportToAndroidXML,
  exportToIOSSwift 
} = require('@websmith/tokens')

const format = process.argv[2]

switch (format) {
  case 'css':
    fs.writeFileSync('dist/tokens.css', exportToCSSCustomProperties(tokens))
    break
  case 'scss':
    fs.writeFileSync('dist/tokens.scss', exportToSCSS(tokens))
    break
  case 'mobile':
    fs.writeFileSync('dist/android.xml', exportToAndroidXML(tokens))
    fs.writeFileSync('dist/ios.swift', exportToIOSSwift(tokens))
    break
  case 'all':
    // Export all formats
    break
}
```

## Best Practices

### Token Organization
- Use semantic naming conventions
- Group related tokens together
- Maintain consistent naming across formats
- Include documentation for complex tokens

### Export Strategy
- Export to formats needed by your platforms
- Use version control for token changes
- Validate exports before deployment
- Automate exports in CI/CD pipeline

### Performance Considerations
- Choose appropriate format for use case
- Minimize export file size
- Use compression for production
- Implement caching for large token sets

## Troubleshooting

### Common Issues
1. **Invalid CSS Values**: Ensure all color values are valid CSS colors
2. **TypeScript Errors**: Check interface generation for complex nested objects
3. **Mobile Format Issues**: Verify platform-specific value types
4. **File Encoding**: Use UTF-8 encoding for all export files

### Debug Mode
Enable debug logging to troubleshoot export issues:
```typescript
const tokens = exportToCSSCustomProperties(tokens, { 
  prefix: 'ws',
  debug: true 
})
```

This comprehensive export system ensures design tokens can be used consistently across all platforms and development environments in the Websmith Kit ecosystem.
