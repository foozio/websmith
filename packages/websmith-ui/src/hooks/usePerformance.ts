/**
 * React hooks for performance monitoring
 */

import { useEffect, useRef, useCallback } from 'react'
import { performanceMonitor } from '../utils/performance'

/**
 * Hook to measure component render performance
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   useRenderPerformance('MyComponent')
 *   return <div>Hello</div>
 * }
 * ```
 */
export function useRenderPerformance(componentName: string, metadata?: Record<string, unknown>) {
  const renderCount = useRef(0)
  const mountTime = useRef<number>(0)

  useEffect(() => {
    renderCount.current += 1
    
    if (renderCount.current === 1) {
      // First render (mount)
      mountTime.current = performance.now()
      performanceMonitor.recordMetric({
        name: `${componentName}.mount`,
        duration: 0,
        timestamp: Date.now(),
        metadata,
      })
    } else {
      // Subsequent renders (updates)
      const now = performance.now()
      const timeSinceMount = now - mountTime.current
      
      performanceMonitor.recordMetric({
        name: `${componentName}.render`,
        duration: timeSinceMount,
        timestamp: Date.now(),
        metadata: {
          ...metadata,
          renderCount: renderCount.current,
        },
      })
    }
  })

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      const unmountTime = performance.now()
      const lifetime = unmountTime - mountTime.current
      
      performanceMonitor.recordMetric({
        name: `${componentName}.unmount`,
        duration: lifetime,
        timestamp: Date.now(),
        metadata: {
          ...metadata,
          totalRenders: renderCount.current,
        },
      })
    }
  }, [componentName, metadata])
}

/**
 * Hook to measure the performance of a specific operation
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const measure = usePerformanceMeasure('MyComponent.operation')
 *   
 *   const handleClick = () => {
 *     const end = measure.start()
 *     // ... do work
 *     end()
 *   }
 *   
 *   return <button onClick={handleClick}>Click</button>
 * }
 * ```
 */
export function usePerformanceMeasure(name: string) {
  const start = useCallback((metadata?: Record<string, unknown>) => {
    return performanceMonitor.start(name)
  }, [name])

  return { start }
}

/**
 * Hook to measure async operations
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const measureAsync = useAsyncPerformance('MyComponent.fetchData')
 *   
 *   useEffect(() => {
 *     measureAsync(async () => {
 *       const data = await fetch('/api/data')
 *       return data.json()
 *     })
 *   }, [])
 * }
 * ```
 */
export function useAsyncPerformance(name: string) {
  return useCallback(
    async <T>(fn: () => Promise<T>, metadata?: Record<string, unknown>): Promise<T> => {
      const end = performanceMonitor.start(name)
      try {
        const result = await fn()
        end(metadata)
        return result
      } catch (error) {
        end({ ...metadata, error: true })
        throw error
      }
    },
    [name]
  )
}

/**
 * Hook to track component interaction performance
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const trackInteraction = useInteractionPerformance('MyComponent')
 *   
 *   return (
 *     <button onClick={trackInteraction('click', () => {
 *       // handle click
 *     })}>
 *       Click me
 *     </button>
 *   )
 * }
 * ```
 */
export function useInteractionPerformance(componentName: string) {
  return useCallback(
    <T extends (...args: any[]) => any>(
      interactionName: string,
      handler: T,
      metadata?: Record<string, unknown>
    ): T => {
      return ((...args: any[]) => {
        const end = performanceMonitor.start(`${componentName}.${interactionName}`)
        try {
          const result = handler(...args)
          
          // Handle async handlers
          if (result instanceof Promise) {
            return result.finally(() => {
              end(metadata)
            })
          }
          
          end(metadata)
          return result
        } catch (error) {
          end({ ...metadata, error: true })
          throw error
        }
      }) as T
    },
    [componentName]
  )
}

/**
 * Hook to get performance metrics
 * 
 * @example
 * ```tsx
 * function PerformanceDebugger() {
 *   const metrics = usePerformanceMetrics()
 *   
 *   return (
 *     <div>
 *       <h2>Performance Metrics</h2>
 *       <pre>{JSON.stringify(metrics, null, 2)}</pre>
 *     </div>
 *   )
 * }
 * ```
 */
export function usePerformanceMetrics(filterName?: string) {
  const metricsRef = useRef(performanceMonitor.getMetrics())

  useEffect(() => {
    const interval = setInterval(() => {
      metricsRef.current = filterName
        ? performanceMonitor.getMetricsByName(filterName)
        : performanceMonitor.getMetrics()
    }, 1000)

    return () => clearInterval(interval)
  }, [filterName])

  return metricsRef.current
}

/**
 * Hook to get performance report
 */
export function usePerformanceReport(filterName?: string) {
  const reportRef = useRef(performanceMonitor.getReport(filterName))

  useEffect(() => {
    const interval = setInterval(() => {
      reportRef.current = performanceMonitor.getReport(filterName)
    }, 1000)

    return () => clearInterval(interval)
  }, [filterName])

  return reportRef.current
}
