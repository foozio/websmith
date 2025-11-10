# Websmith Accessibility Tools

WCAG 2.1 compliance checking and accessibility auditing for design systems.

## Features

- **Color Contrast Checking**: WCAG AA/AAA contrast validation
- **ARIA Validation**: Check proper ARIA attribute usage
- **Keyboard Navigation**: Verify keyboard accessibility
- **Focus Indicators**: Ensure visible focus states
- **Text Alternatives**: Validate alt text and labels
- **Form Labels**: Check form input labeling
- **Heading Hierarchy**: Validate semantic heading structure
- **Comprehensive Reporting**: Generate accessibility reports

## Installation

```bash
npm install @websmith/a11y
```

## Quick Start

```typescript
import { A11yAuditor, checkContrast, meetsWCAG } from '@websmith/a11y'

// Quick contrast check
const passes = meetsWCAG('#000000', '#FFFFFF', 'AA')  // true

// Detailed contrast check
const result = checkContrast('#767676', '#FFFFFF')
console.log(result.ratio)  // 4.54:1
console.log(result.passes.AA)  // true

// Full audit
const auditor = new A11yAuditor()
auditor.setWCAGLevel('AA')

auditor.checkColorContrast('#767676', '#FFFFFF', {
  fontSize: 16,
  element: 'button'
})

const report = auditor.generateReport()
console.log(`Score: ${report.score}/100`)
```

## Color Contrast

### Basic Contrast Check

```typescript
import { checkContrast } from '@websmith/a11y'

const result = checkContrast('#000000', '#FFFFFF')

console.log(result.ratio)  // 21:1
console.log(result.passes.AA)  // true (4.5:1 required)
console.log(result.passes.AAA)  // true (7:1 required)
console.log(result.passes.AALarge)  // true (3:1 required)
```

### Context-Aware Checking

```typescript
// Large text (18px+ or 14px+ bold)
const largeText = checkContrast('#767676', '#FFFFFF', 18, false)
console.log(largeText.passes.AA)  // true (3:1 required for large text)

// Bold text
const boldText = checkContrast('#767676', '#FFFFFF', 14, true)
console.log(boldText.passes.AA)  // true
```

### Quick Helper

```typescript
import { meetsWCAG } from '@websmith/a11y'

// Check if colors meet WCAG AA
if (meetsWCAG(textColor, backgroundColor, 'AA')) {
  // Colors are accessible
}

// Check for AAA compliance
if (meetsWCAG(textColor, backgroundColor, 'AAA')) {
  // Colors meet stricter standard
}
```

## Accessibility Auditor

### Creating an Auditor

```typescript
import { A11yAuditor } from '@websmith/a11y'

const auditor = new A11yAuditor()
auditor.setWCAGLevel('AA')  // 'A', 'AA', or 'AAA'
```

### Color Contrast Auditing

```typescript
auditor.checkColorContrast('#767676', '#FFFFFF', {
  fontSize: 16,
  isBold: false,
  element: 'button.primary'
})

// Check multiple color combinations
const colors = [
  { fg: '#000', bg: '#FFF' },
  { fg: '#767676', bg: '#FFFFFF' },
  { fg: '#CCCCCC', bg: '#FFFFFF' }
]

colors.forEach(({ fg, bg }) => {
  auditor.checkColorContrast(fg, bg)
})
```

### ARIA Validation

```typescript
// Check interactive element
auditor.checkARIA({
  role: 'button',
  ariaLabel: 'Close dialog',
  interactive: true
})

// Invalid role
auditor.checkARIA({
  role: 'invalid-role',  // Will trigger warning
  interactive: true
})

// Missing label
auditor.checkARIA({
  interactive: true  // Will trigger error
})

// aria-hidden on interactive element
auditor.checkARIA({
  ariaHidden: true,
  interactive: true  // Will trigger error
})
```

### Keyboard Navigation

```typescript
// Check keyboard accessibility
auditor.checkKeyboardNav({
  interactive: true,
  tabIndex: 0,
  hasKeyHandler: true
})

// Missing keyboard access
auditor.checkKeyboardNav({
  interactive: true,
  tabIndex: -1  // Will trigger error
})
```

### Focus Indicators

```typescript
// Check for visible focus styles
auditor.checkFocusIndicator(true, 'button.primary')  // Pass
auditor.checkFocusIndicator(false, 'link.nav')  // Fail
```

### Text Alternatives

```typescript
// Image with alt text
auditor.checkTextAlternative({
  type: 'image',
  alt: 'Company logo'
})

// Missing alt text
auditor.checkTextAlternative({
  type: 'image'  // Will trigger error
})

// Decorative image
auditor.checkTextAlternative({
  type: 'image',
  alt: '',
  decorative: true
})
```

### Heading Hierarchy

```typescript
// Valid hierarchy
auditor.checkHeadingHierarchy(2, 1)  // h1 → h2 ✓

// Skipped level
auditor.checkHeadingHierarchy(3, 1)  // h1 → h3 ✗ (warning)
```

### Form Labels

```typescript
// Properly labeled input
auditor.checkFormLabel({
  type: 'text',
  label: 'Email address'
})

// Missing label
auditor.checkFormLabel({
  type: 'text'  // Will trigger error
})

// Placeholder only (not sufficient)
auditor.checkFormLabel({
  type: 'text',
  placeholder: 'Enter email'  // Will trigger warning
})
```

## Reporting

### Generate Report

```typescript
const report = auditor.generateReport()

console.log(report)
// {
//   timestamp: Date,
//   violations: [...],
//   passed: 85,
//   failed: 3,
//   warnings: 2,
//   score: 80,
//   wcagLevel: 'AA'
// }
```

### Get Violations

```typescript
// All violations
const all = auditor.getViolations()

// Errors only
const errors = auditor.getViolations('error')

// Warnings only
const warnings = auditor.getViolations('warning')

// Info only
const info = auditor.getViolations('info')
```

### Export JSON

```typescript
const json = auditor.exportJSON()
// Save to file or send to analytics
```

## WCAG Compliance Levels

### Level A (Minimum)
- Text alternatives
- Keyboard accessible
- Sufficient time
- Seizure prevention
- Navigable
- Readable
- Predictable
- Input assistance
- Compatible

### Level AA (Recommended)
- All Level A criteria
- Contrast (minimum): 4.5:1 for normal text, 3:1 for large text
- Resize text
- Images of text
- Reflow
- Non-text contrast
- Text spacing
- Focus visible

### Level AAA (Enhanced)
- All Level A and AA criteria
- Contrast (enhanced): 7:1 for normal text, 4.5:1 for large text
- Low or no background audio
- Visual presentation
- Images of text (no exception)

## Integration Examples

### With React Components

```typescript
import { A11yAuditor } from '@websmith/a11y'

function Button({ color, bgColor, children }) {
  const auditor = new A11yAuditor()
  
  // Check in development
  if (process.env.NODE_ENV === 'development') {
    auditor.checkColorContrast(color, bgColor, {
      element: 'Button'
    })
    
    const violations = auditor.getViolations('error')
    if (violations.length > 0) {
      console.warn('Accessibility violations:', violations)
    }
  }
  
  return <button style={{ color, backgroundColor: bgColor }}>{children}</button>
}
```

### With Design Tokens

```typescript
import { meetsWCAG } from '@websmith/a11y'
import { colors } from '@websmith/tokens'

// Validate token combinations
Object.entries(colors).forEach(([name, shades]) => {
  Object.entries(shades).forEach(([shade, value]) => {
    const passes = meetsWCAG(value, '#FFFFFF', 'AA')
    if (!passes) {
      console.warn(`${name}.${shade} fails contrast on white background`)
    }
  })
})
```

### With Testing

```typescript
import { A11yAuditor } from '@websmith/a11y'

describe('Component Accessibility', () => {
  it('should meet WCAG AA contrast requirements', () => {
    const auditor = new A11yAuditor()
    auditor.setWCAGLevel('AA')
    
    auditor.checkColorContrast('#000000', '#FFFFFF')
    
    const errors = auditor.getViolations('error')
    expect(errors).toHaveLength(0)
  })
  
  it('should have proper ARIA labels', () => {
    const auditor = new A11yAuditor()
    
    auditor.checkARIA({
      role: 'button',
      ariaLabel: 'Close',
      interactive: true
    })
    
    const errors = auditor.getViolations('error')
    expect(errors).toHaveLength(0)
  })
})
```

### With CI/CD

```typescript
// accessibility-check.ts
import { A11yAuditor } from '@websmith/a11y'
import { colors } from './design-tokens'

const auditor = new A11yAuditor()
auditor.setWCAGLevel('AA')

// Check all color combinations
Object.values(colors).forEach(color => {
  auditor.checkColorContrast(color, '#FFFFFF')
  auditor.checkColorContrast(color, '#000000')
})

const report = auditor.generateReport()

if (report.failed > 0) {
  console.error(`Accessibility check failed: ${report.failed} errors`)
  process.exit(1)
}

console.log(`✓ Accessibility check passed (score: ${report.score}/100)`)
```

## Best Practices

1. **Check Early**: Validate accessibility during design
2. **Automate**: Integrate into CI/CD pipeline
3. **Test Real Content**: Use actual text and colors
4. **Consider Context**: Large text has different requirements
5. **Go Beyond Minimum**: Aim for AA or AAA when possible
6. **Test with Users**: Automated tools catch ~30% of issues
7. **Document Exceptions**: Note when and why standards aren't met

## API Reference

### Functions

- `getContrastRatio(color1, color2)` - Calculate contrast ratio
- `checkContrast(fg, bg, fontSize?, isBold?)` - Check contrast with context
- `meetsWCAG(fg, bg, level?)` - Quick WCAG compliance check
- `getA11yAuditor()` - Get default auditor instance
- `initA11yAuditor(level?)` - Create new auditor

### Classes

- `A11yAuditor` - Main auditing class

### Types

- `A11yViolation` - Violation details
- `ContrastResult` - Contrast check result
- `A11yReport` - Audit report

## License

MIT
