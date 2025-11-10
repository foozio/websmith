import { css } from 'styled-components'
import type { TokenPath, TokenFunction } from './types'

// Template literal helper for token interpolation
export function token(strings: TemplateStringsArray, ...values: any[]): any {
  let result = ''

  strings.forEach((str, i) => {
    result += str
    if (i < values.length) {
      const value = values[i]
      if (typeof value === 'string' && value.startsWith('colors.') || value.startsWith('spacing.') || value.startsWith('shadows.') || value.startsWith('borders.')) {
        result += `var(--ws-${value.replace('.', '-')})`
      } else {
        result += value
      }
    }
  })

  return result
}

// Utility function to get token value from theme
export function getTokenValue(path: TokenPath, fallback?: string): (props: any) => string {
  return (props: any) => {
    const keys = path.split('.')
    let value: any = props.theme

    for (const key of keys) {
      value = value?.[key]
    }

    return typeof value === 'string' ? value : (fallback || '')
  }
}

// Color utility
export function getColor(colorName: string, fallback?: string): (props: any) => string {
  return (props: any) => {
    const color = props.theme?.colors?.[colorName] || props.theme?.[colorName]
    return color || fallback || ''
  }
}

// Spacing utility
export function getSpacing(spacingName: string, fallback?: string): (props: any) => string {
  return (props: any) => {
    const spacing = props.theme?.spacing?.[spacingName] || props.theme?.[spacingName]
    return spacing || fallback || ''
  }
}

// Shadow utility
export function getShadow(shadowName: string, fallback?: string): (props: any) => string {
  return (props: any) => {
    const shadow = props.theme?.shadows?.[shadowName] || props.theme?.[shadowName]
    return shadow || fallback || ''
  }
}

// Border utility
export function getBorder(borderName: string, fallback?: string): (props: any) => string {
  return (props: any) => {
    const border = props.theme?.borders?.[borderName] || props.theme?.[borderName]
    return border || fallback || ''
  }
}

// Typography utility
export function getTypography(typographyName: string, property?: string): (props: any) => any {
  return (props: any) => {
    const typography = props.theme?.typography?.[typographyName] || props.theme?.[typographyName]

    if (!typography) return {}

    if (property && typeof typography === 'object') {
      return typography[property] || typography
    }

    return typography
  }
}

// CSS helper for responsive design
export function responsive(
  property: string,
  values: Record<string, any>,
  breakpoints?: Record<string, string>
): any {
  let styles = ''

  Object.entries(values).forEach(([breakpoint, value]) => {
    if (breakpoint === 'default' || breakpoint === '_') {
      styles += `${property}: ${value};`
    } else {
      const bp = breakpoints?.[breakpoint] || breakpoint
      styles += `@media (min-width: ${bp}) { ${property}: ${value}; }`
    }
  })

  return css`${styles}`
}

// Animation helpers
export function transition(
  properties: string | string[] = 'all',
  duration: string = '0.2s',
  easing: string = 'ease-in-out'
): any {
  const props = Array.isArray(properties) ? properties.join(', ') : properties
  return css`
    transition: ${props} ${duration} ${easing};
  `
}

// Focus ring helper
export function focusRing(
  color: string = 'var(--ws-ring)',
  width: string = '2px',
  offset: string = '2px'
): any {
  return css`
    &:focus {
      outline: ${width} solid ${color};
      outline-offset: ${offset};
    }

    &:focus:not(:focus-visible) {
      outline: none;
    }

    &:focus-visible {
      outline: ${width} solid ${color};
      outline-offset: ${offset};
    }
  `
}

// Truncate text helper
export function truncate(lines?: number): any {
  if (lines === 1 || !lines) {
    return css`
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `
  }

  return css`
    display: -webkit-box;
    -webkit-line-clamp: ${lines};
    -webkit-box-orient: vertical;
    overflow: hidden;
  `
}

// Flexbox helpers
export function flex(
  direction: 'row' | 'column' | 'row-reverse' | 'column-reverse' = 'row',
  align: 'stretch' | 'center' | 'start' | 'end' | 'baseline' = 'stretch',
  justify: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly' = 'start'
): any {
  const justifyContent = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly'
  }[justify] || justify

  return css`
    display: flex;
    flex-direction: ${direction};
    align-items: ${align};
    justify-content: ${justifyContent};
  `
}

// Grid helpers
export function grid(
  columns: number | string = 1,
  gap: string = '0'
): any {
  return css`
    display: grid;
    grid-template-columns: ${typeof columns === 'number' ? `repeat(${columns}, 1fr)` : columns};
    gap: ${gap};
  `
}

// Absolute positioning helpers
export function absolute(
  top?: string | number,
  right?: string | number,
  bottom?: string | number,
  left?: string | number
): any {
  return css`
    position: absolute;
    ${top !== undefined ? `top: ${top};` : ''}
    ${right !== undefined ? `right: ${right};` : ''}
    ${bottom !== undefined ? `bottom: ${bottom};` : ''}
    ${left !== undefined ? `left: ${left};` : ''}
  `
}

// Size helpers
export function size(width: string | number, height?: string | number): any {
  return css`
    width: ${width};
    height: ${height || width};
  `
}

// Border radius helpers
export function borderRadius(size: string | number = 'var(--ws-border-radius-md)'): any {
  return css`
    border-radius: ${size};
  `
}

// Box shadow helpers
export function boxShadow(shadow: string = 'var(--ws-shadow-md)'): any {
  return css`
    box-shadow: ${shadow};
  `
}

// Text helpers
export function textAlign(align: 'left' | 'center' | 'right' | 'justify' = 'left'): any {
  return css`
    text-align: ${align};
  `
}

export function fontSize(size: string = 'var(--ws-font-size-md)'): any {
  return css`
    font-size: ${size};
  `
}

export function fontWeight(weight: string | number = 'var(--ws-font-weight-normal)'): any {
  return css`
    font-weight: ${weight};
  `
}
