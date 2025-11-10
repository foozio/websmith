# @websmith/styled-components

Styled Components integration for Websmith design tokens with full TypeScript support and theme management.

## Installation

```bash
npm install @websmith/styled-components @websmith/tokens styled-components
# or
yarn add @websmith/styled-components @websmith/tokens styled-components
# or
pnpm add @websmith/styled-components @websmith/tokens styled-components
```

## Usage

### Basic Setup

Wrap your app with the WebsmithThemeProvider:

```tsx
import { WebsmithThemeProvider } from '@websmith/styled-components'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: var(--ws-font-family);
    background-color: var(--ws-background);
    color: var(--ws-foreground);
  }
`

function App() {
  return (
    <WebsmithThemeProvider theme="light">
      <GlobalStyle />
      <YourComponents />
    </WebsmithThemeProvider>
  )
}
```

### Styled Components

Use Websmith tokens in your styled components:

```tsx
import styled from 'styled-components'
import { getColor, getSpacing, transition } from '@websmith/styled-components'

const Button = styled.button`
  background-color: ${getColor('primary')};
  color: ${getColor('primary-foreground')};
  padding: ${getSpacing('sm')} ${getSpacing('md')};
  border-radius: var(--ws-border-radius-md);
  border: none;
  cursor: pointer;
  ${transition(['background-color', 'color'])};

  &:hover {
    background-color: ${getColor('primary', '#0066cc')};
  }

  &:focus {
    ${focusRing()}
  }
`
```

### Using the Theme Helper

Access tokens directly from the theme:

```tsx
const Card = styled.div`
  background-color: ${props => props.theme.colors.card || 'white'};
  color: ${props => props.theme.colors['card-foreground'] || 'black'};
  padding: ${props => props.theme.spacing.lg || '1rem'};
  border-radius: ${props => props.theme.borders.radius?.md || '8px'};
  box-shadow: ${props => props.theme.shadows.md || '0 4px 6px rgba(0,0,0,0.1)'};
`
```

### Theme Switching

Use the theme context to switch themes:

```tsx
import { useWebsmithTheme } from '@websmith/styled-components'

function ThemeToggle() {
  const { theme, toggleTheme } = useWebsmithTheme()

  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'dark' : 'light'} mode
    </button>
  )
}
```

### Custom Themes

Create custom themes by extending existing ones:

```tsx
import { createWebsmithTheme, extendWebsmithTheme } from '@websmith/styled-components'

// Create a new theme
const customTheme = createWebsmithTheme('light', {
  colors: {
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
    accent: '#ffe66d'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  }
})

// Extend an existing theme
const extendedTheme = extendWebsmithTheme(customTheme, {
  colors: {
    tertiary: '#a78bfa'
  }
})

function App() {
  return (
    <WebsmithThemeProvider theme={customTheme}>
      <YourComponents />
    </WebsmithThemeProvider>
  )
}
```

### Utility Functions

Use utility functions for common patterns:

```tsx
import { flex, focusRing, truncate, responsive } from '@websmith/styled-components'

const Header = styled.header`
  ${flex('row', 'center', 'between')}
  padding: ${getSpacing('md')};
  ${focusRing()}
`

const Title = styled.h1`
  ${truncate(2)}
  font-size: ${fontSize('var(--ws-font-size-xl)')};
  font-weight: ${fontWeight('bold')};
`

const Grid = styled.div`
  ${grid(3, getSpacing('md'))}

  ${responsive('grid-template-columns', {
    _: '1fr',
    md: 'repeat(2, 1fr)',
    lg: 'repeat(3, 1fr)'
  })}
`
```

### CSS Custom Properties

The integration automatically injects CSS custom properties:

```css
:root {
  --ws-background: hsl(0 0% 100%);
  --ws-foreground: hsl(222.2 84% 4.9%);
  --ws-primary: hsl(221.2 83.2% 53.3%);
  /* ... more tokens */
}

[data-theme="dark"], .dark {
  --ws-background: hsl(222.2 84% 4.9%);
  --ws-foreground: hsl(210 40% 98%);
  --ws-primary: hsl(217.2 91.2% 59.8%);
  /* ... dark mode tokens */
}
```

### TypeScript Support

Full TypeScript support with IntelliSense:

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const Button = styled.button<ButtonProps>`
  background-color: ${props => {
    switch (props.variant) {
      case 'primary':
        return props.theme.colors.primary
      case 'secondary':
        return props.theme.colors.secondary
      case 'outline':
        return 'transparent'
      default:
        return props.theme.colors.primary
    }
  }};
`
```

## API Reference

### Components

- `WebsmithThemeProvider`: Theme context provider
- `useWebsmithTheme()`: Hook for accessing theme context

### Theme Utilities

- `createWebsmithTheme(base, overrides)`: Create new themes
- `extendWebsmithTheme(base, extensions)`: Extend existing themes

### Token Helpers

- `getTokenValue(path, fallback?)`: Get token by path
- `getColor(name, fallback?)`: Get color token
- `getSpacing(name, fallback?)`: Get spacing token
- `getShadow(name, fallback?)`: Get shadow token
- `getBorder(name, fallback?)`: Get border token
- `getTypography(name, property?)`: Get typography token

### CSS Utilities

- `token`: Template literal helper
- `responsive(property, values, breakpoints?)`: Responsive styles
- `transition(properties?, duration?, easing?)`: Transition helper
- `focusRing(color?, width?, offset?)`: Focus ring styles
- `truncate(lines?)`: Text truncation
- `flex(direction?, align?, justify?)`: Flexbox helper
- `grid(columns?, gap?)`: CSS Grid helper

## License

MIT
