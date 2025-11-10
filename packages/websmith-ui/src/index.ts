// Main exports - all components
export * from "./components"

// Code-split entry points for selective imports
export * as CoreComponents from "./components/core"
export * as FormComponents from "./components/forms"
export * as LayoutComponents from "./components/layout"
export * as OverlayComponents from "./components/overlay"
export * as DataComponents from "./components/data"

// Lazy-loaded components for performance
// Note: These exports intentionally override regular component exports
// to provide opt-in lazy loading for heavy components (Dialog, Table, Dropdown, Toast)
export * from "./components/lazy"

// Performance monitoring utilities
export { 
  performanceMonitor,
  measurePerformance,
  measurePerformanceAsync,
  measure,
  type PerformanceMetric,
  type PerformanceReport,
} from "./utils/performance"

export {
  useRenderPerformance,
  usePerformanceMeasure,
  useAsyncPerformance,
  useInteractionPerformance,
  usePerformanceMetrics,
  usePerformanceReport,
} from "./hooks/usePerformance"

// Internationalization (i18n) utilities
export {
  I18n,
  initI18n,
  getI18n,
  t,
  formatNumber,
  formatDate,
  formatRelativeTime,
  plural,
  type Locale,
  type TranslationMessages,
  type I18nConfig,
} from "./i18n"

export {
  I18nProvider,
  useI18n,
  useTranslation,
  useFormattedNumber,
  useFormattedDate,
  useFormattedRelativeTime,
  withI18n,
  LocaleMatch,
  Trans,
  type I18nProviderProps,
  type LocaleMatchProps,
  type TransProps,
} from "./i18n/context"

export {
  en,
  es,
  fr,
  defaultLocales,
  getLocale,
  getAvailableLocales,
} from "./i18n/locales"

// Theme and dark mode utilities
export {
  ThemeManager,
  initThemeManager,
  getThemeManager,
  getSystemTheme,
  prefersDarkMode,
  prefersReducedMotion,
  type ThemeMode,
  type ResolvedTheme,
  type ThemeConfig,
  type ThemeState,
} from "./theme"

export {
  ThemeProvider,
  useTheme,
  useThemeMode,
  useResolvedTheme,
  useIsDark,
  useIsLight,
  useThemeToggle,
  useSystemTheme,
  usePrefersReducedMotion,
  withTheme,
  ThemeMatch,
  ThemeSwitch,
  ThemeScript,
  type ThemeProviderProps,
  type ThemeMatchProps,
  type ThemeSwitchProps,
} from "./theme/context"

export {
  ThemeToggle,
  ThemeSelect,
  ThemeButtonGroup,
  type ThemeToggleProps,
  type ThemeSelectProps,
  type ThemeButtonGroupProps,
} from "./theme/ThemeToggle"

// Theme composition and inheritance
export {
  ThemeComposer,
  createTheme,
  extendTheme,
  mergeThemes,
  createVariants,
  applyOverrides,
  createResponsiveTokens,
  interpolateTokens,
  createSemanticTheme,
  validateTheme,
  extractThemeSubset,
  transformTheme,
  createPreset,
  applyPreset,
  getThemeComposer,
  initThemeComposer,
  type ThemeTokens,
  type ThemeVariant,
  type ComposedTheme,
  type ThemePreset,
} from "./theme/composition"

export {
  useThemeComposer,
  useMergedTheme,
  useThemeVariants,
  useConditionalTheme,
  useTransformedTheme,
  useThemePreset,
  useThemeVariant,
  useResponsiveTheme,
  useThemeInheritance,
} from "./theme/useComposition"