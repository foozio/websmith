---
"@websmith/ui": minor
---

Implement advanced dark mode system

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
