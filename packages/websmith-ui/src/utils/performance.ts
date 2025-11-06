/**
 * Performance monitoring utilities for Websmith UI components
 * Provides hooks and utilities for measuring component render performance
 */

export interface PerformanceMetric {
  name: string
  duration: number
  timestamp: number
  metadata?: Record<string, unknown>
}

export interface PerformanceReport {
  metrics: PerformanceMetric[]
  summary: {
    total: number
    average: number
    min: number
    max: number
    p50: number
    p95: number
    p99: number
  }
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private enabled: boolean = false
  private maxMetrics: number = 1000

  constructor() {
    // Enable in development or when explicitly set
    this.enabled = 
      typeof process !== 'undefined' && 
      (process.env.NODE_ENV === 'development' || 
       process.env.WEBSMITH_PERF === 'true')
  }

  /**
   * Enable performance monitoring
   */
  enable(): void {
    this.enabled = true
  }

  /**
   * Disable performance monitoring
   */
  disable(): void {
    this.enabled = false
  }

  /**
   * Check if monitoring is enabled
   */
  isEnabled(): boolean {
    return this.enabled
  }

  /**
   * Start measuring a performance metric
   */
  start(name: string): (metadata?: Record<string, unknown>) => void {
    if (!this.enabled) {
      return () => {} // No-op if disabled
    }

    const startTime = performance.now()
    const startMark = `${name}-start`
    
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(startMark)
    }

    return (metadata?: Record<string, unknown>) => {
      this.end(name, startTime, metadata)
    }
  }

  /**
   * End measuring a performance metric
   */
  private end(
    name: string, 
    startTime: number, 
    metadata?: Record<string, unknown>
  ): void {
    if (!this.enabled) return

    const endTime = performance.now()
    const duration = endTime - startTime
    const endMark = `${name}-end`

    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(endMark)
      performance.measure(name, `${name}-start`, endMark)
    }

    this.recordMetric({
      name,
      duration,
      timestamp: Date.now(),
      metadata,
    })
  }

  /**
   * Record a performance metric
   */
  recordMetric(metric: PerformanceMetric): void {
    if (!this.enabled) return

    this.metrics.push(metric)

    // Prevent memory leaks by limiting stored metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift()
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Websmith Perf] ${metric.name}: ${metric.duration.toFixed(2)}ms`, metric.metadata)
    }
  }

  /**
   * Get all recorded metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  /**
   * Get metrics filtered by name
   */
  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(m => m.name === name)
  }

  /**
   * Generate a performance report
   */
  getReport(filterName?: string): PerformanceReport {
    const metrics = filterName 
      ? this.getMetricsByName(filterName)
      : this.metrics

    if (metrics.length === 0) {
      return {
        metrics: [],
        summary: {
          total: 0,
          average: 0,
          min: 0,
          max: 0,
          p50: 0,
          p95: 0,
          p99: 0,
        },
      }
    }

    const durations = metrics.map(m => m.duration).sort((a, b) => a - b)
    const total = durations.reduce((sum, d) => sum + d, 0)

    return {
      metrics,
      summary: {
        total,
        average: total / durations.length,
        min: durations[0],
        max: durations[durations.length - 1],
        p50: this.percentile(durations, 50),
        p95: this.percentile(durations, 95),
        p99: this.percentile(durations, 99),
      },
    }
  }

  /**
   * Calculate percentile
   */
  private percentile(sorted: number[], p: number): number {
    const index = Math.ceil((sorted.length * p) / 100) - 1
    return sorted[Math.max(0, index)]
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = []
    
    if (typeof performance !== 'undefined' && performance.clearMarks) {
      performance.clearMarks()
      performance.clearMeasures()
    }
  }

  /**
   * Export metrics as JSON
   */
  exportJSON(): string {
    return JSON.stringify({
      timestamp: Date.now(),
      metrics: this.metrics,
      report: this.getReport(),
    }, null, 2)
  }

  /**
   * Log performance report to console
   */
  logReport(filterName?: string): void {
    const report = this.getReport(filterName)
    
    console.group(`[Websmith Performance Report]${filterName ? ` - ${filterName}` : ''}`)
    console.table({
      'Total Measurements': report.metrics.length,
      'Total Duration': `${report.summary.total.toFixed(2)}ms`,
      'Average': `${report.summary.average.toFixed(2)}ms`,
      'Min': `${report.summary.min.toFixed(2)}ms`,
      'Max': `${report.summary.max.toFixed(2)}ms`,
      'P50 (Median)': `${report.summary.p50.toFixed(2)}ms`,
      'P95': `${report.summary.p95.toFixed(2)}ms`,
      'P99': `${report.summary.p99.toFixed(2)}ms`,
    })
    console.groupEnd()
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

/**
 * Measure the execution time of a function
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T,
  metadata?: Record<string, unknown>
): T {
  const end = performanceMonitor.start(name)
  try {
    const result = fn()
    end(metadata)
    return result
  } catch (error) {
    end({ ...metadata, error: true })
    throw error
  }
}

/**
 * Measure the execution time of an async function
 */
export async function measurePerformanceAsync<T>(
  name: string,
  fn: () => Promise<T>,
  metadata?: Record<string, unknown>
): Promise<T> {
  const end = performanceMonitor.start(name)
  try {
    const result = await fn()
    end(metadata)
    return result
  } catch (error) {
    end({ ...metadata, error: true })
    throw error
  }
}

/**
 * Decorator for measuring method performance
 */
export function measure(name?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value
    const metricName = name || `${target.constructor.name}.${propertyKey}`

    descriptor.value = function (...args: any[]) {
      return measurePerformance(metricName, () => originalMethod.apply(this, args))
    }

    return descriptor
  }
}
