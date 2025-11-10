/**
 * Websmith Accessibility Auditing Tools
 * WCAG 2.1 compliance checking and accessibility validation
 */

export interface A11yViolation {
  rule: string
  severity: 'error' | 'warning' | 'info'
  message: string
  element?: string
  wcagLevel: 'A' | 'AA' | 'AAA'
  wcagCriteria: string
  suggestion?: string
}

export interface ContrastResult {
  ratio: number
  passes: {
    AA: boolean
    AAA: boolean
    AALarge: boolean
    AAALarge: boolean
  }
  foreground: string
  background: string
}

export interface A11yReport {
  timestamp: Date
  violations: A11yViolation[]
  passed: number
  failed: number
  warnings: number
  score: number
  wcagLevel: 'A' | 'AA' | 'AAA'
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null
}

/**
 * Calculate relative luminance
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const sRGB = c / 255
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (!rgb1 || !rgb2) return 0

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)

  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check if contrast ratio meets WCAG standards
 */
export function checkContrast(
  foreground: string,
  background: string,
  fontSize: number = 16,
  isBold: boolean = false
): ContrastResult {
  const ratio = getContrastRatio(foreground, background)
  const isLargeText = fontSize >= 18 || (fontSize >= 14 && isBold)

  return {
    ratio,
    passes: {
      AA: ratio >= (isLargeText ? 3 : 4.5),
      AAA: ratio >= (isLargeText ? 4.5 : 7),
      AALarge: ratio >= 3,
      AAALarge: ratio >= 4.5
    },
    foreground,
    background
  }
}

/**
 * Accessibility Auditor
 */
export class A11yAuditor {
  private violations: A11yViolation[] = []
  private wcagLevel: 'A' | 'AA' | 'AAA' = 'AA'

  /**
   * Set WCAG compliance level
   */
  setWCAGLevel(level: 'A' | 'AA' | 'AAA'): void {
    this.wcagLevel = level
  }

  /**
   * Add violation
   */
  addViolation(violation: A11yViolation): void {
    this.violations.push(violation)
  }

  /**
   * Check color contrast
   */
  checkColorContrast(
    foreground: string,
    background: string,
    context: { fontSize?: number; isBold?: boolean; element?: string } = {}
  ): void {
    const result = checkContrast(
      foreground,
      background,
      context.fontSize,
      context.isBold
    )

    const requiredRatio = this.wcagLevel === 'AAA' ? 7 : 4.5
    const passes = this.wcagLevel === 'AAA' ? result.passes.AAA : result.passes.AA

    if (!passes) {
      this.addViolation({
        rule: 'color-contrast',
        severity: 'error',
        message: `Insufficient color contrast: ${result.ratio.toFixed(2)}:1 (required: ${requiredRatio}:1)`,
        element: context.element,
        wcagLevel: this.wcagLevel,
        wcagCriteria: '1.4.3',
        suggestion: `Increase contrast between ${foreground} and ${background}`
      })
    }
  }

  /**
   * Check ARIA attributes
   */
  checkARIA(element: {
    role?: string
    ariaLabel?: string
    ariaLabelledBy?: string
    ariaDescribedBy?: string
    ariaHidden?: boolean
    interactive?: boolean
  }): void {
    // Interactive elements need accessible names
    if (element.interactive && !element.ariaLabel && !element.ariaLabelledBy) {
      this.addViolation({
        rule: 'aria-label-required',
        severity: 'error',
        message: 'Interactive element missing accessible name',
        wcagLevel: 'A',
        wcagCriteria: '4.1.2',
        suggestion: 'Add aria-label or aria-labelledby attribute'
      })
    }

    // Check valid ARIA roles
    const validRoles = [
      'button', 'link', 'navigation', 'main', 'complementary',
      'banner', 'contentinfo', 'search', 'form', 'region',
      'article', 'dialog', 'alertdialog', 'alert', 'status'
    ]

    if (element.role && !validRoles.includes(element.role)) {
      this.addViolation({
        rule: 'valid-aria-role',
        severity: 'warning',
        message: `Invalid ARIA role: ${element.role}`,
        wcagLevel: 'A',
        wcagCriteria: '4.1.2',
        suggestion: 'Use a valid ARIA role or remove the role attribute'
      })
    }

    // aria-hidden on interactive elements
    if (element.ariaHidden && element.interactive) {
      this.addViolation({
        rule: 'aria-hidden-interactive',
        severity: 'error',
        message: 'Interactive element should not have aria-hidden="true"',
        wcagLevel: 'A',
        wcagCriteria: '4.1.2',
        suggestion: 'Remove aria-hidden or make element non-interactive'
      })
    }
  }

  /**
   * Check keyboard navigation
   */
  checkKeyboardNav(element: {
    interactive?: boolean
    tabIndex?: number
    hasKeyHandler?: boolean
  }): void {
    // Interactive elements need keyboard access
    if (element.interactive && element.tabIndex === -1) {
      this.addViolation({
        rule: 'keyboard-accessible',
        severity: 'error',
        message: 'Interactive element not keyboard accessible',
        wcagLevel: 'A',
        wcagCriteria: '2.1.1',
        suggestion: 'Remove tabIndex="-1" or add keyboard event handlers'
      })
    }

    // Custom interactive elements need key handlers
    if (element.interactive && !element.hasKeyHandler && element.tabIndex !== undefined) {
      this.addViolation({
        rule: 'keyboard-handler-required',
        severity: 'warning',
        message: 'Interactive element missing keyboard event handlers',
        wcagLevel: 'A',
        wcagCriteria: '2.1.1',
        suggestion: 'Add onKeyDown or onKeyPress handlers for Enter and Space keys'
      })
    }
  }

  /**
   * Check focus indicators
   */
  checkFocusIndicator(hasFocusStyle: boolean, element?: string): void {
    if (!hasFocusStyle) {
      this.addViolation({
        rule: 'focus-indicator',
        severity: 'error',
        message: 'Missing visible focus indicator',
        element,
        wcagLevel: 'AA',
        wcagCriteria: '2.4.7',
        suggestion: 'Add visible focus styles (outline, border, or background change)'
      })
    }
  }

  /**
   * Check text alternatives
   */
  checkTextAlternative(element: {
    type: 'image' | 'icon' | 'media'
    alt?: string
    ariaLabel?: string
    decorative?: boolean
  }): void {
    if (!element.decorative && !element.alt && !element.ariaLabel) {
      this.addViolation({
        rule: 'text-alternative',
        severity: 'error',
        message: `${element.type} missing text alternative`,
        wcagLevel: 'A',
        wcagCriteria: '1.1.1',
        suggestion: 'Add alt text or aria-label describing the content'
      })
    }

    // Decorative images should have empty alt
    if (element.decorative && element.alt && element.alt !== '') {
      this.addViolation({
        rule: 'decorative-alt',
        severity: 'info',
        message: 'Decorative image should have empty alt text',
        wcagLevel: 'A',
        wcagCriteria: '1.1.1',
        suggestion: 'Use alt="" for decorative images'
      })
    }
  }

  /**
   * Check heading hierarchy
   */
  checkHeadingHierarchy(currentLevel: number, previousLevel: number): void {
    if (currentLevel > previousLevel + 1) {
      this.addViolation({
        rule: 'heading-hierarchy',
        severity: 'warning',
        message: `Heading level skipped: h${previousLevel} to h${currentLevel}`,
        wcagLevel: 'A',
        wcagCriteria: '1.3.1',
        suggestion: 'Use sequential heading levels (h1, h2, h3, etc.)'
      })
    }
  }

  /**
   * Check form labels
   */
  checkFormLabel(input: {
    type: string
    label?: string
    ariaLabel?: string
    ariaLabelledBy?: string
    placeholder?: string
  }): void {
    if (!input.label && !input.ariaLabel && !input.ariaLabelledBy) {
      this.addViolation({
        rule: 'form-label',
        severity: 'error',
        message: `Form ${input.type} missing label`,
        wcagLevel: 'A',
        wcagCriteria: '3.3.2',
        suggestion: 'Add a <label> element or aria-label attribute'
      })
    }

    // Placeholder is not a substitute for label
    if (input.placeholder && !input.label && !input.ariaLabel) {
      this.addViolation({
        rule: 'placeholder-not-label',
        severity: 'warning',
        message: 'Placeholder text is not a substitute for a label',
        wcagLevel: 'A',
        wcagCriteria: '3.3.2',
        suggestion: 'Add a visible label in addition to placeholder'
      })
    }
  }

  /**
   * Get all violations
   */
  getViolations(severity?: A11yViolation['severity']): A11yViolation[] {
    if (severity) {
      return this.violations.filter(v => v.severity === severity)
    }
    return this.violations
  }

  /**
   * Generate accessibility report
   */
  generateReport(): A11yReport {
    const errors = this.violations.filter(v => v.severity === 'error').length
    const warnings = this.violations.filter(v => v.severity === 'warning').length
    const total = this.violations.length
    const passed = Math.max(0, 100 - total)

    return {
      timestamp: new Date(),
      violations: this.violations,
      passed,
      failed: errors,
      warnings,
      score: Math.max(0, 100 - (errors * 10 + warnings * 5)),
      wcagLevel: this.wcagLevel
    }
  }

  /**
   * Export report as JSON
   */
  exportJSON(): string {
    return JSON.stringify(this.generateReport(), null, 2)
  }

  /**
   * Clear all violations
   */
  clear(): void {
    this.violations = []
  }
}

/**
 * Default auditor instance
 */
let defaultAuditor: A11yAuditor | null = null

/**
 * Get default auditor
 */
export function getA11yAuditor(): A11yAuditor {
  if (!defaultAuditor) {
    defaultAuditor = new A11yAuditor()
  }
  return defaultAuditor
}

/**
 * Initialize new auditor
 */
export function initA11yAuditor(wcagLevel: 'A' | 'AA' | 'AAA' = 'AA'): A11yAuditor {
  defaultAuditor = new A11yAuditor()
  defaultAuditor.setWCAGLevel(wcagLevel)
  return defaultAuditor
}

/**
 * Quick contrast check helper
 */
export function meetsWCAG(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA'
): boolean {
  const result = checkContrast(foreground, background)
  return level === 'AAA' ? result.passes.AAA : result.passes.AA
}
