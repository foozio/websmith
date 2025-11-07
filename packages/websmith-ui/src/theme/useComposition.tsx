/**
 * React hooks for theme composition
 */

import { useState, useCallback, useMemo } from 'react'
import {
  ThemeComposer,
  type ThemeTokens,
  type ComposedTheme,
  type ThemePreset,
  mergeThemes,
  createVariants,
  applyOverrides,
  transformTheme,
  applyPreset
} from './composition'

/**
 * Hook for managing theme composition
 */
export function useThemeComposer(baseTheme?: ThemeTokens) {
  const [composer] = useState(() => new ThemeComposer(baseTheme))
  const [version, setVersion] = useState(0)

  const forceUpdate = useCallback(() => {
    setVersion(v => v + 1)
  }, [])

  const registerTheme = useCallback((theme: ComposedTheme) => {
    composer.registerTheme(theme)
    forceUpdate()
  }, [composer, forceUpdate])

  const extendTheme = useCallback((name: string, parentName: string, overrides: ThemeTokens) => {
    const theme = composer.extendTheme(name, parentName, overrides)
    forceUpdate()
    return theme
  }, [composer, forceUpdate])

  const composeThemes = useCallback((name: string, ...themeNames: string[]) => {
    const theme = composer.composeThemes(name, ...themeNames)
    forceUpdate()
    return theme
  }, [composer, forceUpdate])

  const addVariant = useCallback((themeName: string, variantName: string, tokens: ThemeTokens) => {
    composer.addVariant(themeName, variantName, tokens)
    forceUpdate()
  }, [composer, forceUpdate])

  const getTheme = useCallback((name: string) => {
    return composer.getTheme(name)
  }, [composer, version]) // eslint-disable-line react-hooks/exhaustive-deps

  const getAllThemes = useCallback(() => {
    return composer.getAllThemes()
  }, [composer, version]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    composer,
    registerTheme,
    extendTheme,
    composeThemes,
    addVariant,
    getTheme,
    getAllThemes
  }
}

/**
 * Hook for merging themes
 */
export function useMergedTheme(...themes: ThemeTokens[]): ThemeTokens {
  return useMemo(() => mergeThemes(...themes), [themes])
}

/**
 * Hook for creating theme variants
 */
export function useThemeVariants(
  baseTokens: ThemeTokens,
  variants: Record<string, ThemeTokens>
): Record<string, ThemeTokens> {
  return useMemo(
    () => createVariants(baseTokens, variants),
    [baseTokens, variants]
  )
}

/**
 * Hook for conditional theme overrides
 */
export function useConditionalTheme(
  tokens: ThemeTokens,
  condition: boolean,
  overrides: ThemeTokens
): ThemeTokens {
  return useMemo(
    () => applyOverrides(tokens, condition, overrides),
    [tokens, condition, overrides]
  )
}

/**
 * Hook for transforming theme tokens
 */
export function useTransformedTheme(
  tokens: ThemeTokens,
  transformer: (key: string, value: any, path: string[]) => any
): ThemeTokens {
  return useMemo(
    () => transformTheme(tokens, transformer),
    [tokens, transformer]
  )
}

/**
 * Hook for applying theme preset
 */
export function useThemePreset(preset: ThemePreset, overrides?: ThemeTokens): ThemeTokens {
  return useMemo(
    () => applyPreset(preset, overrides),
    [preset, overrides]
  )
}

/**
 * Hook for managing active theme variant
 */
export function useThemeVariant(
  baseTokens: ThemeTokens,
  variants: Record<string, ThemeTokens>,
  initialVariant?: string
) {
  const [activeVariant, setActiveVariant] = useState(initialVariant || 'default')

  const variantTokens = useMemo(
    () => createVariants(baseTokens, variants),
    [baseTokens, variants]
  )

  const currentTokens = useMemo(
    () => variantTokens[activeVariant] || baseTokens,
    [variantTokens, activeVariant, baseTokens]
  )

  return {
    variant: activeVariant,
    setVariant: setActiveVariant,
    tokens: currentTokens,
    availableVariants: Object.keys(variants)
  }
}

/**
 * Hook for responsive theme tokens
 */
export function useResponsiveTheme(
  breakpoints: Record<string, ThemeTokens>,
  currentBreakpoint: string
): ThemeTokens {
  return useMemo(
    () => breakpoints[currentBreakpoint] || breakpoints.default || {},
    [breakpoints, currentBreakpoint]
  )
}

/**
 * Hook for theme inheritance chain
 */
export function useThemeInheritance(
  composer: ThemeComposer,
  themeName: string
): ComposedTheme[] {
  return useMemo(() => {
    const chain: ComposedTheme[] = []
    let current = composer.getTheme(themeName)

    while (current) {
      chain.push(current)
      if (current.parent) {
        current = composer.getTheme(current.parent)
      } else {
        break
      }
    }

    return chain.reverse()
  }, [composer, themeName])
}
