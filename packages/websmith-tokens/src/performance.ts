/**
 * Performance monitoring for token generation
 */

export interface TokenGenerationMetrics {
  operation: string
  duration: number
  timestamp: number
  tokensGenerated?: number
  cacheHit?: boolean
  metadata?: Record<string, unknown>
}

class TokenPerformanceMonitor {
  private metrics: TokenGenerationMetrics[] = []
  private enabled: boolean = false

  constructor() {
    this.enabled = process.env.NODE_ENV === 'development' || process.env.WEBSMITH_PERF === 'true'
  }

  enable(): void {
    this.enabled = true
  }

  disable(): void {
    this.enabled = false
  }

  isEnabled(): boolean {
    return this.enabled
  }

  startMeasure(operation: string): (metadata?: Omit<TokenGenerationMetrics, 'operation' | 'duration' | 'timestamp'>) => void {
    if (!this.enabled) {
      return () => {}
    }

    const startTime = performance.now()

    return (metadata?) => {
      const duration = performance.now() - startTime
      this.recordMetric({
        operation,
        duration,
        timestamp: Date.now(),
        ...metadata,
      })
    }
  }

  recordMetric(metric: TokenGenerationMetrics): void {
    if (!this.enabled) return

    this.metrics.push(metric)

    if (process.env.NODE_ENV === 'development') {
      console.debug(
        `[Websmith Tokens] ${metric.operation}: ${metric.duration.toFixed(2)}ms`,
        metric.tokensGenerated ? `(${metric.tokensGenerated} tokens)` : '',
        metric.cacheHit ? '(cache hit)' : ''
      )
    }
  }

  getMetrics(): TokenGenerationMetrics[] {
    return [...this.metrics]
  }

  getMetricsByOperation(operation: string): TokenGenerationMetrics[] {
    return this.metrics.filter(m => m.operation === operation)
  }

  getSummary() {
    const byOperation = new Map<string, TokenGenerationMetrics[]>()

    for (const metric of this.metrics) {
      const existing = byOperation.get(metric.operation) || []
      existing.push(metric)
      byOperation.set(metric.operation, existing)
    }

    const summary: Record<string, {
      count: number
      totalDuration: number
      avgDuration: number
      minDuration: number
      maxDuration: number
      totalTokens: number
      cacheHits: number
    }> = {}

    for (const [operation, metrics] of Array.from(byOperation.entries())) {
      const durations = metrics.map((m: TokenGenerationMetrics) => m.duration)
      const totalTokens = metrics.reduce((sum: number, m: TokenGenerationMetrics) => sum + (m.tokensGenerated || 0), 0)
      const cacheHits = metrics.filter((m: TokenGenerationMetrics) => m.cacheHit).length

      summary[operation] = {
        count: metrics.length,
        totalDuration: durations.reduce((sum: number, d: number) => sum + d, 0),
        avgDuration: durations.reduce((sum: number, d: number) => sum + d, 0) / durations.length,
        minDuration: Math.min(...durations),
        maxDuration: Math.max(...durations),
        totalTokens,
        cacheHits,
      }
    }

    return summary
  }

  logSummary(): void {
    const summary = this.getSummary()

    console.group('[Websmith Tokens Performance Summary]')
    console.table(
      Object.entries(summary).map(([operation, stats]) => ({
        Operation: operation,
        'Calls': stats.count,
        'Total (ms)': stats.totalDuration.toFixed(2),
        'Avg (ms)': stats.avgDuration.toFixed(2),
        'Min (ms)': stats.minDuration.toFixed(2),
        'Max (ms)': stats.maxDuration.toFixed(2),
        'Tokens': stats.totalTokens,
        'Cache Hits': stats.cacheHits,
      }))
    )
    console.groupEnd()
  }

  clear(): void {
    this.metrics = []
  }

  exportJSON(): string {
    return JSON.stringify({
      timestamp: Date.now(),
      metrics: this.metrics,
      summary: this.getSummary(),
    }, null, 2)
  }
}

export const tokenPerformanceMonitor = new TokenPerformanceMonitor()

/**
 * Measure token generation performance
 */
export function measureTokenGeneration<T>(
  operation: string,
  fn: () => T,
  tokensGenerated?: number
): T {
  const end = tokenPerformanceMonitor.startMeasure(operation)
  try {
    const result = fn()
    end({ tokensGenerated })
    return result
  } catch (error) {
    end({ tokensGenerated, metadata: { error: true } })
    throw error
  }
}
