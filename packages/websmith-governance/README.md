# Websmith Governance Tools

Design system governance, monitoring, and compliance tools for maintaining consistency and tracking usage across your organization.

## Features

- **Usage Tracking**: Monitor component and token usage across your codebase
- **Deprecation Management**: Track and warn about deprecated items
- **Validation Rules**: Enforce design system standards
- **Coverage Metrics**: Measure design system adoption
- **Reporting**: Generate comprehensive governance reports
- **Analytics**: Identify unused components and tokens

## Installation

```bash
npm install @websmith/governance
```

## Quick Start

```typescript
import { GovernanceManager, getGovernanceManager } from '@websmith/governance'

// Get default manager
const governance = getGovernanceManager()

// Track component usage
governance.trackComponentUsage('Button', 'src/pages/Home.tsx')
governance.trackComponentUsage('Card', 'src/components/Dashboard.tsx')

// Track token usage
governance.trackTokenUsage('colors.primary.500', 'color', 'Button')
governance.trackTokenUsage('spacing.4', 'spacing', 'Card')

// Register deprecations
governance.registerDeprecation({
  item: 'OldButton',
  type: 'component',
  reason: 'Replaced with new Button component',
  replacement: 'Button',
  deprecatedSince: '1.0.0',
  removeIn: '2.0.0'
})

// Generate report
const report = governance.generateReport(50, 200) // 50 total components, 200 total tokens
console.log(report)
```

## Core Concepts

### Usage Tracking

Track how components and tokens are used across your codebase:

```typescript
// Track component usage
governance.trackComponentUsage('Button', 'src/pages/Home.tsx')
governance.trackComponentUsage('Button', 'src/pages/About.tsx')

// Get usage statistics
const usage = governance.getComponentUsage()
// [{ component: 'Button', count: 2, locations: [...], lastUsed: Date }]

// Find unused components
const unused = governance.getUnusedComponents(['Button', 'Card', 'Modal'])
// ['Modal'] - if Modal was never tracked
```

### Token Tracking

Monitor design token usage:

```typescript
// Track token usage
governance.trackTokenUsage('colors.primary.500', 'color', 'Button')
governance.trackTokenUsage('colors.primary.500', 'color', 'Link')

// Get token statistics
const tokenUsage = governance.getTokenUsage()
// [{ token: 'colors.primary.500', type: 'color', count: 2, components: ['Button', 'Link'] }]

// Find unused tokens
const unusedTokens = governance.getUnusedTokens([
  'colors.primary.500',
  'colors.secondary.500'
])
```

### Deprecation Management

Track deprecated items and provide migration paths:

```typescript
governance.registerDeprecation({
  item: 'OldButton',
  type: 'component',
  reason: 'Replaced with new Button component with better accessibility',
  replacement: 'Button',
  deprecatedSince: '1.0.0',
  removeIn: '2.0.0'
})

// Get all deprecations
const deprecations = governance.getDeprecations()
```

### Validation Rules

Enforce design system standards:

```typescript
import { GovernanceValidator, defaultRules } from '@websmith/governance'

const validator = new GovernanceValidator()

// Add default rules
defaultRules.forEach(rule => validator.addRule(rule))

// Add custom rule
validator.addRule({
  name: 'require-aria-label',
  description: 'Interactive components must have aria-label',
  severity: 'error',
  check: (context) => {
    if (context.isInteractive && !context.hasAriaLabel) {
      return {
        rule: 'require-aria-label',
        severity: 'error',
        message: 'Interactive component missing aria-label',
        location: context.location,
        suggestion: 'Add aria-label prop for accessibility'
      }
    }
    return null
  }
})

// Validate
const violations = validator.validate(context)
```

### Coverage Metrics

Measure design system adoption:

```typescript
const coverage = governance.calculateCoverage(50, 200)
console.log(coverage)
// {
//   componentsUsed: 25,
//   componentsTotal: 50,
//   tokensUsed: 150,
//   tokensTotal: 200,
//   coveragePercentage: 62.5
// }
```

### Reporting

Generate comprehensive reports:

```typescript
const report = governance.generateReport(50, 200)

console.log(report)
// {
//   timestamp: Date,
//   componentUsage: [...],
//   tokenUsage: [...],
//   deprecations: [...],
//   violations: [...],
//   coverage: { ... }
// }

// Export as JSON
const json = governance.exportJSON(50, 200)
```

## API Reference

### GovernanceManager

#### Methods

- `trackComponentUsage(component, location)` - Track component usage
- `trackTokenUsage(token, type, component)` - Track token usage
- `registerDeprecation(deprecation)` - Register deprecated item
- `addViolation(violation)` - Add validation violation
- `getComponentUsage()` - Get component usage statistics
- `getTokenUsage()` - Get token usage statistics
- `getUnusedComponents(allComponents)` - Find unused components
- `getUnusedTokens(allTokens)` - Find unused tokens
- `getDeprecations()` - Get all deprecations
- `getViolations(severity?)` - Get violations (optionally filtered)
- `calculateCoverage(totalComponents, totalTokens)` - Calculate coverage
- `generateReport(totalComponents, totalTokens)` - Generate full report
- `exportJSON(totalComponents, totalTokens)` - Export report as JSON
- `clear()` - Clear all data

### GovernanceValidator

#### Methods

- `addRule(rule)` - Add validation rule
- `validate(context)` - Validate against all rules
- `getRules()` - Get all rules

## Use Cases

### 1. Component Adoption Tracking

Track which components are being used and where:

```typescript
const governance = getGovernanceManager()

// In your build process or runtime
governance.trackComponentUsage('Button', filePath)

// Generate adoption report
const report = governance.generateReport(totalComponents, totalTokens)
console.log(`Component adoption: ${report.coverage.coveragePercentage}%`)
```

### 2. Token Usage Analysis

Identify which tokens are used and which can be removed:

```typescript
// Track token usage
governance.trackTokenUsage('colors.primary.500', 'color', 'Button')

// Find unused tokens
const allTokens = Object.keys(designTokens)
const unused = governance.getUnusedTokens(allTokens)

console.log(`Unused tokens (${unused.length}):`, unused)
```

### 3. Deprecation Warnings

Warn developers about deprecated items:

```typescript
// Register deprecation
governance.registerDeprecation({
  item: 'LegacyModal',
  type: 'component',
  reason: 'Use new Dialog component',
  replacement: 'Dialog',
  deprecatedSince: '2.0.0',
  removeIn: '3.0.0'
})

// Check for deprecations in CI/CD
const deprecations = governance.getDeprecations()
if (deprecations.length > 0) {
  console.warn('Deprecated items found:', deprecations)
}
```

### 4. Design System Compliance

Enforce design system standards:

```typescript
const validator = new GovernanceValidator()
validator.addRule(noHardcodedColorsRule)

// Validate in linting process
const violations = validator.validate(codeContext)
if (violations.some(v => v.severity === 'error')) {
  throw new Error('Design system violations found')
}
```

### 5. Migration Planning

Identify components that need updating:

```typescript
// Find components using deprecated tokens
const report = governance.generateReport(50, 200)

report.tokenUsage
  .filter(t => deprecatedTokens.includes(t.token))
  .forEach(usage => {
    console.log(`${usage.token} used in:`, usage.components)
  })
```

## Integration Examples

### With Build Tools

```typescript
// webpack.config.js
const { getGovernanceManager } = require('@websmith/governance')

module.exports = {
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.done.tap('GovernancePlugin', () => {
          const governance = getGovernanceManager()
          const report = governance.generateReport(50, 200)
          fs.writeFileSync('governance-report.json', JSON.stringify(report, null, 2))
        })
      }
    }
  ]
}
```

### With Testing

```typescript
// governance.test.ts
import { getGovernanceManager } from '@websmith/governance'

describe('Design System Governance', () => {
  it('should have no deprecated components in use', () => {
    const governance = getGovernanceManager()
    const deprecations = governance.getDeprecations()
    expect(deprecations).toHaveLength(0)
  })

  it('should meet minimum coverage threshold', () => {
    const governance = getGovernanceManager()
    const coverage = governance.calculateCoverage(50, 200)
    expect(coverage.coveragePercentage).toBeGreaterThan(70)
  })
})
```

### With CI/CD

```yaml
# .github/workflows/governance.yml
name: Design System Governance

on: [push]

jobs:
  governance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Generate Governance Report
        run: npm run governance:report
      - name: Check Coverage
        run: npm run governance:check
```

## Best Practices

1. **Track Early**: Start tracking from day one
2. **Regular Reports**: Generate reports weekly or monthly
3. **Set Thresholds**: Define minimum coverage percentages
4. **Automate**: Integrate with CI/CD pipelines
5. **Communicate**: Share reports with team
6. **Act on Data**: Use insights to improve adoption
7. **Clean Up**: Remove unused components and tokens

## Troubleshooting

### No data in reports
- Ensure tracking is enabled
- Check that tracking calls are being made
- Verify manager instance is shared

### Inaccurate coverage
- Ensure all components/tokens are counted
- Check for duplicate tracking
- Verify total counts are correct

## Roadmap

- [ ] Visual dashboard
- [ ] Automated recommendations
- [ ] Integration with design tools
- [ ] Historical trend analysis
- [ ] Team-based metrics
- [ ] Custom report formats

## License

MIT
