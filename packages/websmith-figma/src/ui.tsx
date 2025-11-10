import React from 'react'
import ReactDOM from 'react-dom/client'

// This is the UI component that runs in the Figma plugin interface
const App: React.FC = () => {
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Inter, system-ui, sans-serif',
      backgroundColor: '#ffffff',
      minHeight: '100vh'
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '16px'
      }}>
        Websmith Design Tokens
      </h1>

      <p style={{
        color: '#6b7280',
        lineHeight: '1.5',
        marginBottom: '20px'
      }}>
        Sync your design tokens with Websmith Kit
      </p>

      <button
        style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '6px',
          border: 'none',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer'
        }}
        onClick={() => {
          // Send message to Figma backend
          parent.postMessage({
            pluginMessage: {
              type: 'sync-tokens'
            }
          }, '*')
        }}
      >
        Sync Tokens
      </button>
    </div>
  )
}

// Create React root and render
const container = document.createElement('div')
document.body.appendChild(container)

const root = ReactDOM.createRoot(container)
root.render(<App />)

// Listen for messages from Figma backend
window.onmessage = (event: MessageEvent) => {
  const message = event.data.pluginMessage

  if (message && message.type === 'sync-complete') {
    alert('Tokens synchronized successfully!')
  }

  if (message && message.type === 'sync-error') {
    alert(`Error: ${message.error}`)
  }
}
