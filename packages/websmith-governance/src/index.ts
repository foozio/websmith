/**
 * Websmith Design System Governance Tools
 * Track usage, enforce standards, and maintain consistency
 */

export interface UsageMetric {
  component: string
  count: number
  locations: string[]
  lastUsed: Date
}

export interface TokenUsage {
  token: string
  type: 'color' | 'spacing' | 'typography' | 'shadow' | 'other'
  count: number
  components: string[]
}

export interface DeprecationWarning {
  item: string
  type: 'component' | 'token' | 'prop'
  reason: string
  replacement?: string
  deprecatedSince: string
  removeIn?: string
}

export interface GovernanceReport {
  timestamp: Date
  componentUsage: UsageMetric[]
  tokenUsage: TokenUsage[]
  deprecations: DeprecationWarning[]
  violations: ValidationViolation[]
  coverage: CoverageMetrics
}

export interface ValidationViolation {
  rule: string
  severity: 'error' | 'warning' | 'info'
  message: string
  location: string
  suggestion?: string
}

export interface CoverageMetrics {
  componentsUsed: number
  componentsTotal: number
  tokensUsed: number
  tokensTotal: number
  coveragePercentage: number
}

/**
 * Governance Manager
 */
export class GovernanceManager {
  private usageData: Map<string, UsageMetric> = new Map()
  private tokenUsageData: Map<string, TokenUsage> = new Map()
  private deprecations: DeprecationWarning[] = []
  private violations: ValidationViolation[] = []

  /**
   * Track component usage
   */
  trackComponentUsage(component: string, location: string): void {
    const existing = this.usageData.get(component)
    
    if (existing) {
      existing.count++
      if (!existing.locations.includes(location)) {
        existing.locations.push(location)
      }
      existing.lastUsed = new Date()
    } else {
      this.usageData.set(component, {
        component,
        count: 1,
        locations: [location],
        lastUsed: new Date()
      })
    }
  }

  /**
   * Track token usage
   */
  trackTokenUsage(
    token: string,
    type: TokenUsage['type'],
    component: string
  ): void {
    const existing = this.tokenUsageData.get(token)
    
    if (existing) {
      existing.count++
      if (!existing.components.includes(component)) {
        existing.components.push(component)
      }
    } else {
      this.tokenUsageData.set(token, {
        token,
        type,
        count: 1,
        components: [component]
      })
    }
  }

  /**
   * Register deprecation
   */
  registerDeprecation(deprecation: DeprecationWarning): void {
    this.deprecations.push(deprecation)
  }

  /**
   * Add validation violation
   */
  addViolation(violation: ValidationViolation): void {
    this.violations.push(violation)
  }

  /**
   * Get component usage statistics
   */
  getComponentUsage(): UsageMetric[] {
    return Array.from(this.usageData.values()).sort((a, b) => b.count - a.count)
  }

  /**
   * Get token usage statistics
   */
  getTokenUsage(): TokenUsage[] {
    return Array.from(this.tokenUsageData.values()).sort((a, b) => b.count - a.count)
  }

  /**
   * Get unused components
   */
  getUnusedComponents(allComponents: string[]): string[] {
    const used = new Set(this.usageData.keys())
    return allComponents.filter(c => !used.has(c))
  }

  /**
   * Get unused tokens
   */
  getUnusedTokens(allTokens: string[]): string[] {
    const used = new Set(this.tokenUsageData.keys())
    return allTokens.filter(t => !used.has(t))
  }

  /**
   * Get deprecation warnings
   */
  getDeprecations(): DeprecationWarning[] {
    return this.deprecations
  }

  /**
   * Get validation violations
   */
  getViolations(severity?: ValidationViolation['severity']): ValidationViolation[] {
    if (severity) {
      return this.violations.filter(v => v.severity === severity)
    }
    return this.violations
  }

  /**
   * Calculate coverage metrics
   */
  calculateCoverage(totalComponents: number, totalTokens: number): CoverageMetrics {
    const componentsUsed = this.usageData.size
    const tokensUsed = this.tokenUsageData.size
    
    const componentCoverage = totalComponents > 0 ? (componentsUsed / totalComponents) * 100 : 0
    const tokenCoverage = totalTokens > 0 ? (tokensUsed / totalTokens) * 100 : 0
    const averageCoverage = (componentCoverage + tokenCoverage) / 2

    return {
      componentsUsed,
      componentsTotal: totalComponents,
      tokensUsed,
      tokensTotal: totalTokens,
      coveragePercentage: Math.round(averageCoverage * 100) / 100
    }
  }

  /**
   * Generate governance report
   */
  generateReport(totalComponents: number, totalTokens: number): GovernanceReport {
    return {
      timestamp: new Date(),
      componentUsage: this.getComponentUsage(),
      tokenUsage: this.getTokenUsage(),
      deprecations: this.getDeprecations(),
      violations: this.getViolations(),
      coverage: this.calculateCoverage(totalComponents, totalTokens)
    }
  }

  /**
   * Export report as JSON
   */
  exportJSON(totalComponents: number, totalTokens: number): string {
    return JSON.stringify(this.generateReport(totalComponents, totalTokens), null, 2)
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.usageData.clear()
    this.tokenUsageData.clear()
    this.deprecations = []
    this.violations = []
  }
}

/**
 * Validation Rules
 */
export interface ValidationRule {
  name: string
  description: string
  severity: 'error' | 'warning' | 'info'
  check: (context: any) => ValidationViolation | null
}

export class GovernanceValidator {
  private rules: ValidationRule[] = []

  /**
   * Add validation rule
   */
  addRule(rule: ValidationRule): void {
    this.rules.push(rule)
  }

  /**
   * Validate against all rules
   */
  validate(context: any): ValidationViolation[] {
    const violations: ValidationViolation[] = []

    for (const rule of this.rules) {
      const violation = rule.check(context)
      if (violation) {
        violations.push(violation)
      }
    }

    return violations
  }

  /**
   * Get all rules
   */
  getRules(): ValidationRule[] {
    return this.rules
  }
}

/**
 * Default validation rules
 */
export const defaultRules: ValidationRule[] = [
  {
    name: 'no-hardcoded-colors',
    description: 'Colors should use design tokens, not hardcoded values',
    severity: 'warning',
    check: (context) => {
      if (context.hasHardcodedColor) {
        return {
          rule: 'no-hardcoded-colors',
          severity: 'warning',
          message: 'Hardcoded color detected. Use design tokens instead.',
          location: context.location,
          suggestion: 'Replace with a color token from the design system'
        }
      }
      return null
    }
  },
  {
    name: 'no-hardcoded-spacing',
    description: 'Spacing should use design tokens, not hardcoded values',
    severity: 'warning',
    check: (context) => {
      if (context.hasHardcodedSpacing) {
        return {
          rule: 'no-hardcoded-spacing',
          severity: 'warning',
          message: 'Hardcoded spacing detected. Use spacing tokens instead.',
          location: context.location,
          suggestion: 'Replace with a spacing token from the design system'
        }
      }
      return null
    }
  },
  {
    name: 'deprecated-component',
    description: 'Component is deprecated and should not be used',
    severity: 'error',
    check: (context) => {
      if (context.isDeprecated) {
        return {
          rule: 'deprecated-component',
          severity: 'error',
          message: `Component "${context.component}" is deprecated.`,
          location: context.location,
          suggestion: context.replacement ? `Use "${context.replacement}" instead` : undefined
        }
      }
      return null
    }
  }
]

/**
 * Default governance manager instance
 */
let defaultManager: GovernanceManager | null = null

/**
 * Get default governance manager
 */
export function getGovernanceManager(): GovernanceManager {
  if (!defaultManager) {
    defaultManager = new GovernanceManager()
  }
  return defaultManager
}

/**
 * Initialize governance manager
 */
export function initGovernance(): GovernanceManager {
  defaultManager = new GovernanceManager()
  return defaultManager
}
