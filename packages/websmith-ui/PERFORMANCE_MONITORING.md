# Performance Monitoring Guide

Websmith UI includes comprehensive performance monitoring utilities to help you measure and optimize component render performance, interaction latency, and async operations.

## Features

- **Automatic render tracking** - Monitor component mount, update, and unmount times
- **Interaction measurement** - Track user interaction performance (clicks, form submissions, etc.)
- **Async operation tracking** - Measure API calls and async computations
- **Statistical reporting** - Get min, max, average, and percentile metrics
- **Development-only** - Zero overhead in production builds
- **React hooks** - Easy integration with React components

## Quick Start

### Enable Performance Monitoring

Performance monitoring is automatically enabled in development mode. To enable it explicitly:

```typescript
import { performanceMonitor } from '@websmith/ui'

// Enable monitoring
performanceMonitor.enable()

// Check if enabled
console.log(performanceMonitor.isEnabled()) // true

// Disable monitoring
performanceMonitor.disable()
```

### Environment Variables

- `NODE_ENV=development` - Auto-enables monitoring
- `WEBSMITH_PERF=true` - Force enable monitoring in any environment

## React Hooks

### useRenderPerformance

Track component render performance automatically:

```tsx
import { useRenderPerformance } from '@websmith/ui'

function MyComponent({ data }) {
  useRenderPerformance('MyComponent', { dataSize: data.length })
  
  return <div>{/* component content */}</div>
}
```

This tracks:
- Initial mount time
- Re-render frequency
- Component lifetime
- Total render count

### usePerformanceMeasure

Measure specific operations within a component:

```tsx
import { usePerformanceMeasure } from '@websmith/ui'

function DataProcessor() {
  const measure = usePerformanceMeasure('DataProcessor.process')
  
  const handleProcess = () => {
    const end = measure.start({ itemCount: 100 })
    // ... do expensive work
    end()
  }
  
  return <button onClick={handleProcess}>Process</button>
}
```

### useAsyncPerformance

Track async operations like API calls:

```tsx
import { useAsyncPerformance } from '@websmith/ui'

function UserProfile({ userId }) {
  const measureAsync = useAsyncPerformance('UserProfile.fetchUser')
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    measureAsync(async () => {
      const response = await fetch(`/api/users/${userId}`)
      const data = await response.json()
      setUser(data)
      return data
    }, { userId })
  }, [userId])
  
  return <div>{user?.name}</div>
}
```

### useInteractionPerformance

Wrap event handlers to measure interaction latency:

```tsx
import { useInteractionPerformance } from '@websmith/ui'

function SearchBox() {
  const trackInteraction = useInteractionPerformance('SearchBox')
  
  const handleSearch = trackInteraction('search', (query) => {
    // Search logic
    console.log('Searching for:', query)
  })
  
  const handleClear = trackInteraction('clear', () => {
    // Clear logic
  })
  
  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      <button onClick={handleClear}>Clear</button>
    </div>
  )
}
```

### usePerformanceMetrics

Get real-time performance metrics:

```tsx
import { usePerformanceMetrics } from '@websmith/ui'

function PerformanceDebugger() {
  const metrics = usePerformanceMetrics('MyComponent.render')
  
  return (
    <div>
      <h3>Performance Metrics</h3>
      <p>Total measurements: {metrics.length}</p>
      <ul>
        {metrics.map((m, i) => (
          <li key={i}>
            {m.name}: {m.duration.toFixed(2)}ms
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### usePerformanceReport

Get statistical summary of performance data:

```tsx
import { usePerformanceReport } from '@websmith/ui'

function PerformanceReport() {
  const report = usePerformanceReport('MyComponent')
  
  return (
    <div>
      <h3>Performance Report</h3>
      <table>
        <tr><td>Average:</td><td>{report.summary.average.toFixed(2)}ms</td></tr>
        <tr><td>Min:</td><td>{report.summary.min.toFixed(2)}ms</td></tr>
        <tr><td>Max:</td><td>{report.summary.max.toFixed(2)}ms</td></tr>
        <tr><td>P50:</td><td>{report.summary.p50.toFixed(2)}ms</td></tr>
        <tr><td>P95:</td><td>{report.summary.p95.toFixed(2)}ms</td></tr>
        <tr><td>P99:</td><td>{report.summary.p99.toFixed(2)}ms</td></tr>
      </table>
    </div>
  )
}
```

## Utility Functions

### measurePerformance

Measure synchronous function execution:

```typescript
import { measurePerformance } from '@websmith/ui'

const result = measurePerformance('expensiveCalculation', () => {
  // Expensive computation
  return complexCalculation()
}, { inputSize: 1000 })
```

### measurePerformanceAsync

Measure async function execution:

```typescript
import { measurePerformanceAsync } from '@websmith/ui'

const data = await measurePerformanceAsync('fetchData', async () => {
  const response = await fetch('/api/data')
  return response.json()
}, { endpoint: '/api/data' })
```

### @measure Decorator

Decorate class methods to automatically measure performance:

```typescript
import { measure } from '@websmith/ui'

class DataService {
  @measure('DataService.fetchUsers')
  async fetchUsers() {
    const response = await fetch('/api/users')
    return response.json()
  }
  
  @measure() // Auto-generates name: DataService.processData
  processData(data: any[]) {
    return data.map(item => transform(item))
  }
}
```

## Performance Monitor API

### Direct API Usage

```typescript
import { performanceMonitor } from '@websmith/ui'

// Start measuring
const end = performanceMonitor.start('myOperation')

// ... do work

// End measuring with optional metadata
end({ itemsProcessed: 100, cacheHit: true })

// Get all metrics
const metrics = performanceMonitor.getMetrics()

// Get metrics by name
const myMetrics = performanceMonitor.getMetricsByName('myOperation')

// Get performance report
const report = performanceMonitor.getReport('myOperation')

// Log report to console
performanceMonitor.logReport('myOperation')

// Export as JSON
const json = performanceMonitor.exportJSON()

// Clear all metrics
performanceMonitor.clear()
```

## Performance Reports

### Report Structure

```typescript
interface PerformanceReport {
  metrics: PerformanceMetric[]
  summary: {
    total: number      // Total duration of all measurements
    average: number    // Average duration
    min: number        // Minimum duration
    max: number        // Maximum duration
    p50: number        // 50th percentile (median)
    p95: number        // 95th percentile
    p99: number        // 99th percentile
  }
}
```

### Interpreting Results

- **Average** - Good for understanding typical performance
- **P50 (Median)** - Better than average for skewed distributions
- **P95** - Captures most user experiences (95% of operations)
- **P99** - Identifies worst-case scenarios
- **Min/Max** - Useful for detecting anomalies

## Best Practices

### 1. Use Descriptive Names

```typescript
// ❌ Bad
useRenderPerformance('Component')

// ✅ Good
useRenderPerformance('UserProfile.render', { userId: user.id })
```

### 2. Add Meaningful Metadata

```typescript
// ❌ Bad
const end = measure.start()
end()

// ✅ Good
const end = measure.start()
end({ 
  itemCount: items.length,
  cacheHit: fromCache,
  userId: user.id 
})
```

### 3. Monitor Critical Paths

Focus on:
- Initial page load
- User interactions (clicks, form submissions)
- Data fetching
- Heavy computations
- List rendering with many items

### 4. Set Performance Budgets

```typescript
const report = performanceMonitor.getReport('CriticalComponent')

if (report.summary.p95 > 100) {
  console.warn('P95 exceeds 100ms budget!')
}
```

### 5. Clean Up in Production

Performance monitoring is disabled by default in production, but you can explicitly disable it:

```typescript
if (process.env.NODE_ENV === 'production') {
  performanceMonitor.disable()
}
```

## Integration with DevTools

### Chrome DevTools Performance Tab

The performance monitor uses the native Performance API, so measurements appear in Chrome DevTools:

1. Open DevTools → Performance tab
2. Start recording
3. Interact with your app
4. Stop recording
5. Look for "User Timing" marks in the timeline

### React DevTools Profiler

Combine with React DevTools Profiler for comprehensive insights:

```tsx
import { Profiler } from 'react'
import { performanceMonitor } from '@websmith/ui'

function App() {
  return (
    <Profiler
      id="App"
      onRender={(id, phase, actualDuration) => {
        performanceMonitor.recordMetric({
          name: `${id}.${phase}`,
          duration: actualDuration,
          timestamp: Date.now(),
        })
      }}
    >
      {/* app content */}
    </Profiler>
  )
}
```

## Troubleshooting

### Metrics Not Appearing

1. Check if monitoring is enabled:
   ```typescript
   console.log(performanceMonitor.isEnabled())
   ```

2. Verify environment:
   ```typescript
   console.log(process.env.NODE_ENV)
   console.log(process.env.WEBSMITH_PERF)
   ```

3. Enable explicitly:
   ```typescript
   performanceMonitor.enable()
   ```

### High Overhead

Performance monitoring has minimal overhead (~0.1-0.5ms per measurement), but if you're concerned:

1. Reduce measurement frequency
2. Use sampling (measure 1 in N operations)
3. Disable in production

### Memory Concerns

The monitor stores up to 1000 metrics by default. To clear:

```typescript
// Clear periodically
setInterval(() => {
  performanceMonitor.clear()
}, 60000) // Every minute
```

## Examples

### Complete Component Example

```tsx
import { 
  useRenderPerformance,
  useInteractionPerformance,
  useAsyncPerformance 
} from '@websmith/ui'

function UserDashboard({ userId }) {
  useRenderPerformance('UserDashboard', { userId })
  
  const trackInteraction = useInteractionPerformance('UserDashboard')
  const measureAsync = useAsyncPerformance('UserDashboard.fetchData')
  
  const [data, setData] = useState(null)
  
  useEffect(() => {
    measureAsync(async () => {
      const response = await fetch(`/api/users/${userId}/dashboard`)
      const result = await response.json()
      setData(result)
      return result
    }, { userId })
  }, [userId])
  
  const handleRefresh = trackInteraction('refresh', async () => {
    await measureAsync(async () => {
      const response = await fetch(`/api/users/${userId}/dashboard`)
      const result = await response.json()
      setData(result)
      return result
    }, { userId, action: 'refresh' })
  })
  
  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleRefresh}>Refresh</button>
      {data && <DashboardContent data={data} />}
    </div>
  )
}
```

## Further Reading

- [Web Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [React Profiler API](https://react.dev/reference/react/Profiler)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
