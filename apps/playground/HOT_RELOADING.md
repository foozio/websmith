# Hot Reloading Theme System

## Overview

The Websmith Kit playground now features a comprehensive hot reloading theme system that allows real-time customization of design tokens and instant visual feedback. This system enables developers to experiment with colors, spacing, typography, and other design properties without page refreshes.

## Features

### 🎨 **Real-Time Theme Customization**
- **Live Color Updates**: Change primary, secondary, accent, background, and foreground colors instantly
- **Dynamic Spacing**: Adjust spacing scale (xs, sm, md, lg, xl) in real-time
- **Border Radius Control**: Customize border radius for rounded components
- **Theme Mode Switching**: Toggle between light, dark, and system themes

### 🔄 **Hot Reloading Capabilities**
- **CSS Variable Injection**: Custom properties are injected directly into the DOM
- **Component State Preservation**: Form inputs and component states remain intact during theme changes
- **Instant Visual Feedback**: See changes immediately without page reload
- **Theme Export**: Export custom themes as JSON files for reuse

### 🛠️ **Developer Experience**
- **Interactive Controls**: Color pickers, text inputs, and toggle switches
- **Live Preview**: Dedicated section showing theme changes in context
- **Reset Functionality**: Quickly revert to default theme values
- **Theme Persistence**: Theme changes are maintained during the session

## Architecture

### Theme Provider

The theme system uses `next-themes` for base theme management:

```typescript
// app/layout.tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

### CSS Variable System

Custom theme values are applied as CSS variables:

```css
:root {
  --websmith-primary: #3b82f6;
  --websmith-secondary: #64748b;
  --websmith-accent: #f59e0b;
  --websmith-background: #ffffff;
  --websmith-foreground: #09090b;
  --websmith-spacing-xs: 0.25rem;
  --websmith-spacing-sm: 0.5rem;
  --websmith-spacing-md: 1rem;
  --websmith-spacing-lg: 1.5rem;
  --websmith-spacing-xl: 2rem;
  --websmith-border-radius: 0.5rem;
}
```

### Component Integration

Components consume theme variables with fallbacks:

```typescript
<div
  style={{
    backgroundColor: 'var(--websmith-background, hsl(var(--background)))',
    color: 'var(--websmith-foreground, hsl(var(--foreground)))',
    borderRadius: 'var(--websmith-border-radius, 0.5rem)',
  }}
>
  Content
</div>
```

## Usage Guide

### Basic Theme Customization

1. **Open the Playground**: Navigate to the playground app
2. **Use Theme Toggle**: Click the sun/moon icon in the top-right corner
3. **Access Customizer**: Use the theme customizer panel on the right side
4. **Make Changes**: Adjust colors, spacing, and border radius
5. **See Results**: Changes are applied instantly to all components

### Color Customization

- **Color Pickers**: Click the color swatch to open the color picker
- **Hex Input**: Type hex values directly into the text input
- **Live Preview**: See color changes immediately across all components

### Spacing Adjustments

- **Scale Values**: Modify spacing scale values using text inputs
- **CSS Units**: Use any valid CSS unit (rem, px, em, etc.)
- **Global Impact**: Spacing changes affect all components using the scale

### Theme Export

1. **Click Export**: Use the Export button in the customizer
2. **Download JSON**: Theme configuration is downloaded as JSON
3. **Reuse Theme**: Import the theme data in other projects

## Implementation Details

### Theme Customizer Component

The `ThemeCustomizer` component handles:

- State management for theme values
- CSS variable injection
- Theme export functionality
- Reset to defaults

```typescript
export function ThemeCustomizer({ onThemeChange }: ThemeCustomizerProps) {
  const [customColors, setCustomColors] = useState({
    primary: "#3b82f6",
    secondary: "#64748b",
    // ... other colors
  })

  const handleColorChange = (colorKey: string, value: string) => {
    const newColors = { ...customColors, [colorKey]: value }
    setCustomColors(newColors)
    applyThemeToDocument(newColors, customSpacing, customBorderRadius)
    onThemeChange?.({ colors: newColors, spacing: customSpacing, borderRadius: customBorderRadius })
  }
}
```

### Theme Toggle Component

The `ThemeToggle` component provides theme mode switching:

```typescript
export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
```

### CSS Variable Application

Theme values are applied to the document root:

```typescript
const applyThemeToDocument = (colors: typeof customColors, spacing: typeof customSpacing, borderRadius: string) => {
  const root = document.documentElement
  
  // Apply custom colors
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--websmith-${key}`, value)
  })

  // Apply custom spacing
  Object.entries(spacing).forEach(([key, value]) => {
    root.style.setProperty(`--websmith-spacing-${key}`, value)
  })

  // Apply custom border radius
  root.style.setProperty('--websmith-border-radius', borderRadius)
}
```

## Performance Considerations

### Efficient Updates

- **Direct DOM Manipulation**: CSS variables are updated directly without re-rendering
- **Minimal State Changes**: Only changed values trigger updates
- **Debounced Inputs**: Text inputs are debounced to prevent excessive updates

### Memory Management

- **Component Cleanup**: Event listeners and timers are properly cleaned up
- **State Reset**: Theme values are reset when component unmounts
- **Variable Cleanup**: CSS variables are removed on theme reset

## Browser Compatibility

### Supported Features

- **CSS Custom Properties**: Supported in all modern browsers
- **Color Pickers**: Native HTML5 color input support
- **Theme Persistence**: Uses localStorage for theme preferences
- **System Theme Detection**: Respects OS-level theme preferences

### Fallbacks

- **CSS Variable Fallbacks**: Default values provided for older browsers
- **Theme Detection**: Manual theme detection for unsupported browsers
- **Color Input**: Text input fallback for browsers without color picker support

## Future Enhancements

### Planned Features

- **Typography Customization**: Font family, size, and weight controls
- **Animation Settings**: Transition duration and easing customization
- **Component-Specific Themes**: Individual component theme overrides
- **Theme Templates**: Pre-built theme templates and presets
- **Import/Export**: Theme import functionality and sharing

### Advanced Customization

- **Gradient Support**: Linear and gradient color customization
- **Shadow Controls**: Box shadow and text shadow customization
- **Grid System**: Custom grid and layout settings
- **Breakpoint Management**: Responsive breakpoint customization

## Integration with Design Tokens

### Token System Integration

The hot reloading system is designed to integrate with the Websmith token system:

```typescript
// Future integration with @websmith/tokens
import { colors, spacing, typography } from '@websmith/tokens'

const applyTokenTheme = () => {
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--websmith-${key}`, value)
  })
}
```

### Theme Validation

Future versions will include theme validation:

```typescript
const validateTheme = (theme: ThemeConfig) => {
  // Validate color contrast ratios
  // Check spacing scale consistency
  // Verify accessibility compliance
}
```

## Troubleshooting

### Common Issues

1. **Theme Not Applying**: Check browser console for CSS variable errors
2. **Colors Not Updating**: Verify hex value format and browser support
3. **Spacing Not Working**: Ensure valid CSS units are used
4. **Export Not Working**: Check browser download permissions

### Debug Mode

Enable debug mode to see theme changes:

```typescript
const applyThemeToDocument = (theme: ThemeConfig) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Applying theme:', theme)
  }
  // ... apply theme
}
```

## Contributing

### Adding New Theme Properties

1. **Update State**: Add new properties to component state
2. **Add Controls**: Create UI controls for new properties
3. **Apply Variables**: Add CSS variable application logic
4. **Update Types**: Update TypeScript interfaces
5. **Add Tests**: Write tests for new functionality

### Performance Optimization

- Use React.memo for expensive components
- Implement proper debouncing for user inputs
- Optimize CSS variable updates
- Add performance monitoring

This hot reloading theme system provides a powerful foundation for real-time theme customization and experimentation in the Websmith Kit ecosystem.
