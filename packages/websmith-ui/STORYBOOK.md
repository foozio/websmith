# Storybook Integration Guide

## Overview

Websmith Kit includes a comprehensive Storybook setup for component development, testing, and documentation. Storybook provides an isolated development environment for UI components, making it easier to build, test, and document components in isolation.

## Features

### 🎨 **Enhanced Configuration**
- **Multiple Addons**: Actions, Controls, Viewport, Backgrounds, A11y, Measure, Outline
- **TypeScript Support**: Full autodocs generation with prop types
- **Responsive Design**: Mobile, tablet, and desktop viewports
- **Theme Support**: Light and dark theme backgrounds
- **Accessibility Testing**: Built-in a11y addon for accessibility compliance

### 📚 **Comprehensive Documentation**
- **Auto-generated Docs**: Component documentation automatically generated from TypeScript types
- **Interactive Examples**: Live playground for testing component variations
- **Story Descriptions**: Detailed explanations for each story and component
- **Usage Examples**: Real-world implementation patterns

### 🔧 **Development Experience**
- **Hot Reloading**: Instant updates during development
- **Component Isolation**: Test components without app dependencies
- **Design System Integration**: Consistent theming and tokens
- **Interactive Controls**: Modify props in real-time

## Getting Started

### Installation

```bash
# Install dependencies (if not already installed)
npm install

# Start Storybook development server
npm run storybook
```

### Building for Production

```bash
# Build static Storybook files
npm run build-storybook
```

## Available Commands

```bash
# Start development server on port 6006
npm run storybook

# Build static Storybook for deployment
npm run build-storybook

# View Storybook in production mode
npm run storybook -- --no-dev-cache
```

## Component Stories

### Story Structure

Each component follows this story structure:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Component description here',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Control definitions here
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    // Default props here
  },
};
```

### Story Categories

1. **Basic Variants**: Primary component configurations
2. **Interactive Examples**: User interaction patterns
3. **Edge Cases**: Error states and boundary conditions
4. **Accessibility**: A11y compliance examples
5. **Custom Styling**: Customization examples
6. **Real-world Usage**: Practical implementation patterns

## Addons Configuration

### Controls
Modify component props in real-time:
- **Select Controls**: For enum/union types
- **Text Controls**: For string props
- **Boolean Controls**: For boolean props
- **Color Controls**: For color props

### Viewport
Test responsive design:
- **Mobile**: 375x667px
- **Tablet**: 768x1024px
- **Desktop**: 1024x768px
- **Custom**: Add your own viewports

### Backgrounds
Test different contexts:
- **Light**: White background
- **Dark**: Dark background
- **Custom**: Add brand colors

### Accessibility
Built-in a11y testing:
- **Color Contrast**: WCAG compliance
- **Keyboard Navigation**: Tab order testing
- **Screen Reader**: ARIA attribute validation
- **Focus Management**: Focus indicator testing

## Best Practices

### Story Organization

1. **Group Related Stories**: Use consistent naming
2. **Provide Context**: Include descriptions for each story
3. **Show Variations**: Display all important states
4. **Interactive Examples**: Include click handlers and interactions
5. **Real Data**: Use realistic content and examples

### Component Documentation

1. **Component Descriptions**: Explain purpose and usage
2. **Prop Documentation**: Describe each prop clearly
3. **Usage Examples**: Show common patterns
4. **Accessibility Notes**: Include a11y considerations
5. **Design Guidelines**: Reference design system tokens

### Performance Considerations

1. **Lazy Loading**: Use dynamic imports for heavy components
2. **Story Isolation**: Keep stories focused and minimal
3. **Mock Data**: Use lightweight test data
4. **Optimize Imports**: Import only what's needed

## Available Stories

### Currently Implemented
- ✅ **Button**: Variants, sizes, states, accessibility
- ✅ **Alert**: Types, interactions, dismissible
- ✅ **Checkbox**: States, groups, accessibility
- ✅ **Stack**: Layout variations, responsive
- ✅ **Avatar**: Images, fallbacks, groups
- ✅ **Card**: Layouts, content types, styling
- ✅ **Dialog**: Forms, confirmations, sizes
- ✅ **Badge**: Variants, status, notifications

### Planned Stories
- 📋 **Input**: Types, validation, states
- 📋 **Select**: Options, groups, search
- 📋 **Table**: Data, sorting, pagination
- 📋 **Tabs**: Navigation, content, vertical
- 📋 **Toast**: Positions, types, actions
- 📋 **Dropdown**: Menus, triggers, positioning

## Integration with Design Tokens

Storybook is configured to use Websmith design tokens:

```typescript
// Access tokens in stories
import { tokens } from '@websmith/tokens';

// Use in components
<div style={{ color: tokens.colors.primary[500] }}>
  Content
</div>
```

## Testing Integration

### Visual Testing with Chromatic

```bash
# Run Chromatic for visual regression testing
npx chromatic --project-token=YOUR_TOKEN
```

### Accessibility Testing

Stories include a11y testing with axe-core:
- Automated accessibility checks
- WCAG 2.1 compliance
- Screen reader compatibility
- Keyboard navigation testing

### Unit Testing Integration

Stories can be used for component testing:
```typescript
import { composeStories } from '@storybook/testing-react';
import * as stories from './Button.stories';

const { Default, Primary } = composeStories(stories);

test('renders default button', async () => {
  const { getByRole } = render(<Default />);
  expect(getByRole('button')).toBeInTheDocument();
});
```

## Deployment

### Static Export

```bash
# Build for deployment
npm run build-storybook

# Deploy to any static hosting service
# - Vercel, Netlify, GitHub Pages, etc.
```

### CI/CD Integration

```yaml
# .github/workflows/storybook.yml
name: Storybook
on: [push, pull_request]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run build-storybook
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./storybook-static
```

## Contributing

### Adding New Stories

1. **Create Story File**: `ComponentName.stories.tsx`
2. **Follow Template**: Use the established story structure
3. **Include Variants**: Show all important states
4. **Add Documentation**: Include descriptions and examples
5. **Test Accessibility**: Ensure a11y compliance

### Updating Configuration

1. **Addons**: Configure in `.storybook/main.ts`
2. **Themes**: Update `.storybook/preview.ts`
3. **Styles**: Modify `.storybook/preview.css`
4. **Types**: Update TypeScript configuration

## Troubleshooting

### Common Issues

1. **Import Errors**: Check relative paths and exports
2. **Type Errors**: Ensure proper TypeScript configuration
3. **Styling Issues**: Verify Tailwind CSS setup
4. **Build Failures**: Check Storybook configuration syntax

### Performance Issues

1. **Slow Loading**: Optimize imports and story complexity
2. **Memory Usage**: Use story isolation and cleanup
3. **Build Size**: Exclude unnecessary dependencies

## Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Chromatic Visual Testing](https://www.chromatic.com/)
- [Accessibility Testing](https://github.com/storybookjs/storybook/tree/main/addons/a11y)
- [Design Systems with Storybook](https://storybook.js.org/tutorials/design-systems-for-developers)
