# Performance Monitoring Quick Start

## Installation

Performance monitoring is included in `@websmith/ui`. No additional installation needed.

## Enable Monitoring

### Automatic (Development)
Automatically enabled when `NODE_ENV=development`

### Manual
```typescript
import { performanceMonitor } from '@websmith/ui'

performanceMonitor.enable()
```

### Environment Variable
```bash
WEBSMITH_PERF=true npm run dev
```

## Basic Usage

### Track Component Renders
```tsx
import { useRenderPerformance } from '@websmith/ui'

function MyComponent() {
  useRenderPerformance('MyComponent')
  return <div>Hello</div>
}
```

### Track User Interactions
```tsx
import { useInteractionPerformance } from '@websmith/ui'

function Button() {
  const track = useInteractionPerformance('Button')
  
  const handleClick = track('click', () => {
    console.log('Clicked!')
  })
  
  return <button onClick={handleClick}>Click me</button>
}
```

### Track Async Operations
```tsx
import { useAsyncPerformance } from '@websmith/ui'

function DataLoader() {
  const measureAsync = useAsyncPerformance('DataLoader.fetch')
  
  useEffect(() => {
    measureAsync(async () => {
      const res = await fetch('/api/data')
      return res.json()
    })
  }, [])
}
```

### Measure Specific Operations
```tsx
import { usePerformanceMeasure } from '@websmith/ui'

function Processor() {
  const { start } = usePerformanceMeasure('Processor.heavy')
  
  const process = () => {
    const end = start()
    // ... heavy computation
    end({ itemCount: 100 })
  }
}
```

## View Results

### Console Report
```typescript
import { performanceMonitor } from '@websmith/ui'

// View all metrics
performanceMonitor.logReport()

// View specific component
performanceMonitor.logReport('MyComponent')
```

### Get Metrics Programmatically
```typescript
const metrics = performanceMonitor.getMetrics()
const report = performanceMonitor.getReport('MyComponent')

console.log('Average:', report.summary.average)
console.log('P95:', report.summary.p95)
```

### Export as JSON
```typescript
const json = performanceMonitor.exportJSON()
console.log(json)
```

## Common Patterns

### Monitor Critical Path
```tsx
function CriticalPage() {
  useRenderPerformance('CriticalPage')
  const track = useInteractionPerformance('CriticalPage')
  const measureAsync = useAsyncPerformance('CriticalPage.load')
  
  useEffect(() => {
    measureAsync(async () => {
      // Load critical data
    })
  }, [])
  
  const handleAction = track('action', () => {
    // Handle user action
  })
  
  return <div onClick={handleAction}>Content</div>
}
```

### Performance Budget Check
```typescript
const report = performanceMonitor.getReport('CriticalComponent')

if (report.summary.p95 > 100) {
  console.warn('⚠️ Performance budget exceeded!')
}
```

### Clear Metrics
```typescript
// Clear all metrics
performanceMonitor.clear()

// Clear periodically
setInterval(() => {
  performanceMonitor.clear()
}, 60000)
```

## Chrome DevTools Integration

1. Open DevTools → Performance tab
2. Start recording
3. Interact with your app
4. Stop recording
5. Look for "User Timing" marks

## Best Practices

✅ **DO:**
- Use descriptive names: `'UserProfile.render'`
- Add metadata: `{ userId: 123, itemCount: 50 }`
- Monitor critical paths
- Set performance budgets
- Clear metrics periodically

❌ **DON'T:**
- Use generic names: `'component'`
- Measure everything (focus on critical paths)
- Leave monitoring enabled in production
- Ignore performance warnings

## Troubleshooting

### Not seeing metrics?
```typescript
// Check if enabled
console.log(performanceMonitor.isEnabled())

// Enable manually
performanceMonitor.enable()
```

### Too much overhead?
```typescript
// Disable in production
if (process.env.NODE_ENV === 'production') {
  performanceMonitor.disable()
}
```

## Full Documentation

See [PERFORMANCE_MONITORING.md](./PERFORMANCE_MONITORING.md) for complete documentation.
