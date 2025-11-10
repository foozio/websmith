# @websmith/ui

## 2.0.0

### Major Changes

- cea4995: Release v1.2.0 with ecosystem integrations

### Minor Changes

- 919d5d0: Implement advanced dark mode system

  - Create comprehensive ThemeManager class for theme management
  - Add automatic system preference detection and synchronization
  - Implement persistent theme storage with localStorage
  - Add React Context and hooks (useTheme, useThemeMode, useResolvedTheme, useIsDark, useIsLight, useThemeToggle)
  - Create pre-built components (ThemeProvider, ThemeToggle, ThemeSelect, ThemeButtonGroup)
  - Support three modes: light, dark, and system
  - Add smooth transitions with configurable duration
  - Implement FOUC (Flash of Unstyled Content) prevention with ThemeScript
  - Add conditional rendering components (ThemeMatch, ThemeSwitch)
  - Include utility hooks (useSystemTheme, usePrefersReducedMotion)
  - Support multiple theme attributes (data-theme, class, color-scheme)
  - Full TypeScript support with comprehensive types
  - Zero external dependencies
  - HOC support for class components (withTheme)

  Features:

  - Automatic system preference detection
  - Real-time sync with OS theme changes
  - Persistent theme preference across sessions
  - Smooth theme transitions
  - Accessibility support (prefers-reduced-motion)
  - Server-side rendering compatible
  - Customizable storage key and attribute
  - Event-based theme change notifications

- 3c131cf: Add comprehensive internationalization (i18n) support

  - Implement lightweight i18n system with translation management
  - Add React Context and hooks (useTranslation, useI18n, useFormattedNumber, useFormattedDate, useFormattedRelativeTime)
  - Create declarative components (I18nProvider, Trans, LocaleMatch)
  - Include built-in translations for English, Spanish, and French
  - Add comprehensive translations for all UI components (buttons, forms, tables, dialogs, etc.)
  - Support parameter interpolation and nested translation keys
  - Provide locale-aware number, date, and relative time formatting using Intl API
  - Add pluralization helper
  - Include HOC for class components (withI18n)
  - Full TypeScript support with type-safe translation keys
  - Zero external dependencies - uses native Intl API
  - Comprehensive test coverage (22 passing tests)
  - Detailed documentation with examples and best practices

  Features:

  - Translation key management with dot notation
  - Dynamic locale switching
  - Fallback locale support
  - Parameter interpolation
  - Locale-aware formatting (numbers, dates, relative time)
  - Conditional rendering based on locale
  - Easy extensibility for custom locales

- 6ad24b8: Add theme inheritance and composition features

  - Create ThemeComposer class for managing theme relationships
  - Implement theme inheritance with parent-child relationships
  - Add deep merge utilities for combining theme tokens
  - Support theme variants and overrides
  - Create React hooks for theme composition (useThemeComposer, useMergedTheme, useThemeVariants)
  - Add conditional theme application (useConditionalTheme)
  - Implement theme transformation utilities
  - Support theme presets with applyPreset
  - Add responsive theme tokens support
  - Create semantic theme mapping utilities
  - Include theme validation and extraction tools
  - Add interpolation between theme values
  - Full TypeScript support with comprehensive types

  Features:

  - Theme inheritance chains
  - Deep merging of theme tokens
  - Theme variants and overrides
  - Conditional theme application
  - Theme transformation pipeline
  - Preset system for reusable themes
  - Responsive breakpoint support
  - Semantic token mapping
  - Theme validation
  - Token interpolation

## 1.0.0

### Major Changes

- cdfe45e: Initial release of Websmith Kit - a comprehensive design system and component library for modern web applications.
