/**
 * Advanced dark mode and theme management system
 */

export type ThemeMode = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

export interface ThemeConfig {
  defaultMode?: ThemeMode
  storageKey?: string
  attribute?: string
  enableTransitions?: boolean
  transitionDuration?: number
  disableTransitionOnChange?: boolean
}

export interface ThemeState {
  mode: ThemeMode
  resolvedTheme: ResolvedTheme
  systemTheme: ResolvedTheme
}

const DEFAULT_CONFIG: Required<ThemeConfig> = {
  defaultMode: 'system',
  storageKey: 'websmith-theme',
  attribute: 'data-theme',
  enableTransitions: true,
  transitionDuration: 200,
  disableTransitionOnChange: false
}

/**
 * Theme Manager class
 * Handles theme switching, system preference detection, and persistence
 */
export class ThemeManager {
  private mode: ThemeMode
  private config: Required<ThemeConfig>
  private listeners: Set<(state: ThemeState) => void> = new Set()
  private mediaQuery: MediaQueryList | null = null
  private systemTheme: ResolvedTheme = 'light'

  constructor(config: ThemeConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.mode = this.loadMode()
    
    if (typeof window !== 'undefined') {
      this.initializeSystemTheme()
      this.applyTheme()
    }
  }

  /**
   * Initialize system theme detection
   */
  private initializeSystemTheme(): void {
    if (typeof window === 'undefined') return

    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    this.systemTheme = this.mediaQuery.matches ? 'dark' : 'light'

    // Listen for system theme changes
    const handler = (e: MediaQueryListEvent) => {
      this.systemTheme = e.matches ? 'dark' : 'light'
      if (this.mode === 'system') {
        this.applyTheme()
        this.notifyListeners()
      }
    }

    // Modern browsers
    if (this.mediaQuery.addEventListener) {
      this.mediaQuery.addEventListener('change', handler)
    } else {
      // Legacy browsers
      this.mediaQuery.addListener(handler)
    }
  }

  /**
   * Load theme mode from storage
   */
  private loadMode(): ThemeMode {
    if (typeof window === 'undefined') {
      return this.config.defaultMode
    }

    try {
      const stored = localStorage.getItem(this.config.storageKey)
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored as ThemeMode
      }
    } catch (error) {
      console.warn('[ThemeManager] Failed to load theme from storage:', error)
    }

    return this.config.defaultMode
  }

  /**
   * Save theme mode to storage
   */
  private saveMode(mode: ThemeMode): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(this.config.storageKey, mode)
    } catch (error) {
      console.warn('[ThemeManager] Failed to save theme to storage:', error)
    }
  }

  /**
   * Get resolved theme (actual light/dark value)
   */
  getResolvedTheme(): ResolvedTheme {
    if (this.mode === 'system') {
      return this.systemTheme
    }
    return this.mode
  }

  /**
   * Apply theme to document
   */
  private applyTheme(): void {
    if (typeof window === 'undefined') return

    const resolvedTheme = this.getResolvedTheme()
    const root = document.documentElement

    // Disable transitions during theme change if configured
    if (this.config.disableTransitionOnChange) {
      const css = document.createElement('style')
      css.textContent = '* { transition: none !important; }'
      document.head.appendChild(css)

      // Force reflow
      void root.offsetHeight

      setTimeout(() => {
        document.head.removeChild(css)
      }, 0)
    }

    // Apply theme attribute
    root.setAttribute(this.config.attribute, resolvedTheme)

    // Also set class for compatibility
    root.classList.remove('light', 'dark')
    root.classList.add(resolvedTheme)

    // Set color-scheme for native elements
    root.style.colorScheme = resolvedTheme
  }

  /**
   * Set theme mode
   */
  setMode(mode: ThemeMode): void {
    if (this.mode === mode) return

    this.mode = mode
    this.saveMode(mode)
    this.applyTheme()
    this.notifyListeners()
  }

  /**
   * Get current theme mode
   */
  getMode(): ThemeMode {
    return this.mode
  }

  /**
   * Get current theme state
   */
  getState(): ThemeState {
    return {
      mode: this.mode,
      resolvedTheme: this.getResolvedTheme(),
      systemTheme: this.systemTheme
    }
  }

  /**
   * Toggle between light and dark
   */
  toggle(): void {
    const resolved = this.getResolvedTheme()
    this.setMode(resolved === 'light' ? 'dark' : 'light')
  }

  /**
   * Subscribe to theme changes
   */
  subscribe(listener: (state: ThemeState) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /**
   * Notify all listeners of theme change
   */
  private notifyListeners(): void {
    const state = this.getState()
    this.listeners.forEach(listener => listener(state))
  }

  /**
   * Check if dark mode is active
   */
  isDark(): boolean {
    return this.getResolvedTheme() === 'dark'
  }

  /**
   * Check if light mode is active
   */
  isLight(): boolean {
    return this.getResolvedTheme() === 'light'
  }

  /**
   * Check if system mode is enabled
   */
  isSystem(): boolean {
    return this.mode === 'system'
  }

  /**
   * Force theme update (useful after external changes)
   */
  forceUpdate(): void {
    this.applyTheme()
    this.notifyListeners()
  }

  /**
   * Clear stored theme preference
   */
  clearStorage(): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(this.config.storageKey)
    } catch (error) {
      console.warn('[ThemeManager] Failed to clear theme storage:', error)
    }
  }

  /**
   * Cleanup (remove event listeners)
   */
  destroy(): void {
    if (this.mediaQuery) {
      if (this.mediaQuery.removeEventListener) {
        this.mediaQuery.removeEventListener('change', () => {})
      } else {
        this.mediaQuery.removeListener(() => {})
      }
    }
    this.listeners.clear()
  }
}

/**
 * Default theme manager instance
 */
let defaultThemeManager: ThemeManager | null = null

/**
 * Initialize default theme manager
 */
export function initThemeManager(config?: ThemeConfig): ThemeManager {
  defaultThemeManager = new ThemeManager(config)
  return defaultThemeManager
}

/**
 * Get default theme manager instance
 */
export function getThemeManager(): ThemeManager {
  if (!defaultThemeManager) {
    defaultThemeManager = new ThemeManager()
  }
  return defaultThemeManager
}

/**
 * Utility: Get system theme preference
 */
export function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  return mediaQuery.matches ? 'dark' : 'light'
}

/**
 * Utility: Check if dark mode is preferred by system
 */
export function prefersDarkMode(): boolean {
  return getSystemTheme() === 'dark'
}

/**
 * Utility: Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  return mediaQuery.matches
}
