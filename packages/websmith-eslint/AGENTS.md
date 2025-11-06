# Websmith ESLint Plugin Guide

## Mission
Provide ESLint rules that enforce Websmith Kit patterns, best practices, and design system consistency across projects.

## Available Rules

### `no-hardcoded-colors`
**Status**: Enabled (warn)
**Purpose**: Prevents hardcoded color values; encourages use of design tokens.

```javascript
// ❌ Bad
<div style={{ color: '#FF0000' }}>Red text</div>
const styles = { backgroundColor: 'rgb(255, 0, 0)' }

// ✅ Good
<div style={{ color: 'var(--ws-color-primary-500)' }}>Primary text</div>
const styles = { backgroundColor: 'var(--ws-color-accent-500)' }
```

### `enforce-cva-variants`
**Status**: Disabled (off)
**Purpose**: Ensures class-variance-authority (cva) calls define proper variants.

```javascript
// ❌ Bad
const buttonVariants = cva('base-classes')

// ✅ Good
const buttonVariants = cva('base-classes', {
  variants: {
    variant: {
      default: 'bg-blue-600',
      destructive: 'bg-red-600'
    },
    size: {
      sm: 'px-2 py-1',
      lg: 'px-6 py-3'
    }
  }
})
```

## Usage

### Installation
```bash
npm install @websmith/eslint-plugin --save-dev
```

### Configuration
```javascript
// .eslintrc.js or eslint.config.js
module.exports = {
  plugins: ['@websmith/eslint-plugin'],
  rules: {
    '@websmith/eslint-plugin/no-hardcoded-colors': 'warn',
    '@websmith/eslint-plugin/enforce-cva-variants': 'off',
  },
}
```

## Development

### Adding New Rules
1. Create rule file in `src/rules/`
2. Export from `src/index.ts`
3. Add to `package.json` exports
4. Update documentation

### Testing Rules
```bash
npm run build
npm test -- --testPathPattern=rules
```

## Release Process
- Rules are published with the main Websmith Kit releases
- Breaking changes require major version bumps
- New rules default to 'off' until proven stable
