/**
 * React context and hooks for theme management
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react'
import { ThemeManager, type ThemeMode, type ResolvedTheme, type ThemeConfig, type ThemeState } from './index'

interface ThemeContextValue {
  mode: ThemeMode
  resolvedTheme: ResolvedTheme
  systemTheme: ResolvedTheme
  setMode: (mode: ThemeMode) => void
  toggle: () => void
  isDark: boolean
  isLight: boolean
  isSystem: boolean
  themeManager: ThemeManager
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export interface ThemeProviderProps {
  children: ReactNode
  config?: ThemeConfig
  forcedTheme?: ResolvedTheme
  enableSystem?: boolean
  enableColorScheme?: boolean
}

/**
 * Theme Provider Component
 * Wraps your app to provide theme functionality
 */
export function ThemeProvider({
  children,
  config,
  forcedTheme,
  enableSystem = true,
  enableColorScheme = true
}: ThemeProviderProps) {
  const [themeManager] = useState(() => new ThemeManager(config))
  const [state, setState] = useState<ThemeState>(themeManager.getState())

  useEffect(() => {
    // Subscribe to theme changes
    const unsubscribe = themeManager.subscribe(setState)
    
    // Initial theme application
    themeManager.forceUpdate()
    
    return unsubscribe
  }, [themeManager])

  // Handle forced theme
  useEffect(() => {
    if (forcedTheme) {
      const root = document.documentElement
      root.setAttribute('data-theme', forcedTheme)
      root.classList.remove('light', 'dark')
      root.classList.add(forcedTheme)
      
      if (enableColorScheme) {
        root.style.colorScheme = forcedTheme
      }
    }
  }, [forcedTheme, enableColorScheme])

  const setMode = useCallback((mode: ThemeMode) => {
    if (!enableSystem && mode === 'system') {
      console.warn('[ThemeProvider] System theme is disabled')
      return
    }
    themeManager.setMode(mode)
  }, [themeManager, enableSystem])

  const toggle = useCallback(() => {
    themeManager.toggle()
  }, [themeManager])

  const value = useMemo(() => ({
    mode: forcedTheme ? (forcedTheme as ThemeMode) : state.mode,
    resolvedTheme: forcedTheme || state.resolvedTheme,
    systemTheme: state.systemTheme,
    setMode,
    toggle,
    isDark: forcedTheme ? forcedTheme === 'dark' : state.resolvedTheme === 'dark',
    isLight: forcedTheme ? forcedTheme === 'light' : state.resolvedTheme === 'light',
    isSystem: !forcedTheme && state.mode === 'system',
    themeManager
  }), [state, forcedTheme, setMode, toggle, themeManager])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Hook to access theme context
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

/**
 * Hook for theme mode only
 */
export function useThemeMode() {
  const { mode, setMode } = useTheme()
  return [mode, setMode] as const
}

/**
 * Hook for resolved theme only
 */
export function useResolvedTheme(): ResolvedTheme {
  const { resolvedTheme } = useTheme()
  return resolvedTheme
}

/**
 * Hook to check if dark mode is active
 */
export function useIsDark(): boolean {
  const { isDark } = useTheme()
  return isDark
}

/**
 * Hook to check if light mode is active
 */
export function useIsLight(): boolean {
  const { isLight } = useTheme()
  return isLight
}

/**
 * Hook for theme toggle function
 */
export function useThemeToggle(): () => void {
  const { toggle } = useTheme()
  return toggle
}

/**
 * Hook to detect system theme preference
 */
export function useSystemTheme(): ResolvedTheme {
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => {
    if (typeof window === 'undefined') return 'light'
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    return mediaQuery.matches ? 'dark' : 'light'
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    } else {
      mediaQuery.addListener(handler)
      return () => mediaQuery.removeListener(handler)
    }
  }, [])

  return systemTheme
}

/**
 * Hook to detect if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === 'undefined') return false
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    return mediaQuery.matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches)
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    } else {
      mediaQuery.addListener(handler)
      return () => mediaQuery.removeListener(handler)
    }
  }, [])

  return prefersReduced
}

/**
 * HOC to inject theme props
 */
export function withTheme<P extends object>(
  Component: React.ComponentType<P & { theme: ThemeContextValue }>
) {
  return function WithThemeComponent(props: P) {
    const theme = useTheme()
    return <Component {...props} theme={theme} />
  }
}

/**
 * Component for conditional rendering based on theme
 */
export interface ThemeMatchProps {
  theme: ResolvedTheme | ResolvedTheme[]
  children: ReactNode
  fallback?: ReactNode
}

export function ThemeMatch({ theme: matchTheme, children, fallback = null }: ThemeMatchProps) {
  const { resolvedTheme } = useTheme()
  
  const matches = Array.isArray(matchTheme)
    ? matchTheme.includes(resolvedTheme)
    : resolvedTheme === matchTheme
  
  return matches ? <>{children}</> : <>{fallback}</>
}

/**
 * Component for theme-specific content
 */
export interface ThemeSwitchProps {
  light?: ReactNode
  dark?: ReactNode
}

export function ThemeSwitch({ light, dark }: ThemeSwitchProps) {
  const { isDark } = useTheme()
  return <>{isDark ? dark : light}</>
}

/**
 * Script component for preventing flash of unstyled content (FOUC)
 * Place this in your HTML <head> before any other scripts
 */
export function ThemeScript({ storageKey = 'websmith-theme', attribute = 'data-theme' }: { storageKey?: string; attribute?: string }) {
  const script = `
    (function() {
      try {
        var theme = localStorage.getItem('${storageKey}') || 'system';
        var resolved = theme;
        
        if (theme === 'system') {
          var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          resolved = isDark ? 'dark' : 'light';
        }
        
        document.documentElement.setAttribute('${attribute}', resolved);
        document.documentElement.classList.add(resolved);
        document.documentElement.style.colorScheme = resolved;
      } catch (e) {}
    })();
  `

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  )
}
