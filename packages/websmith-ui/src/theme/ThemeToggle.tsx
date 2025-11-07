/**
 * Theme Toggle Component
 * Pre-built component for switching between themes
 */

import React from 'react'
import { useTheme } from './context'
import type { ThemeMode } from './index'

export interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
  showIcon?: boolean
  iconSize?: number
  style?: React.CSSProperties
}

/**
 * Simple theme toggle button
 */
export function ThemeToggle({
  className = '',
  showLabel = false,
  showIcon = true,
  iconSize = 20,
  style
}: ThemeToggleProps) {
  const { resolvedTheme, toggle } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={toggle}
      className={`theme-toggle ${className}`.trim()}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      style={style}
    >
      {showIcon && (
        <span className="theme-toggle-icon" style={{ width: iconSize, height: iconSize }}>
          {isDark ? (
            // Sun icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          ) : (
            // Moon icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </span>
      )}
      {showLabel && (
        <span className="theme-toggle-label">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  )
}

export interface ThemeSelectProps {
  className?: string
  showLabel?: boolean
  style?: React.CSSProperties
}

/**
 * Theme selector dropdown
 */
export function ThemeSelect({
  className = '',
  showLabel = true,
  style
}: ThemeSelectProps) {
  const { mode, setMode } = useTheme()

  return (
    <div className={`theme-select ${className}`.trim()} style={style}>
      {showLabel && (
        <label htmlFor="theme-select" className="theme-select-label">
          Theme:
        </label>
      )}
      <select
        id="theme-select"
        value={mode}
        onChange={(e) => setMode(e.target.value as ThemeMode)}
        className="theme-select-input"
        aria-label="Select theme"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  )
}

export interface ThemeButtonGroupProps {
  className?: string
  showIcons?: boolean
  style?: React.CSSProperties
}

/**
 * Theme button group (light/dark/system)
 */
export function ThemeButtonGroup({
  className = '',
  showIcons = true,
  style
}: ThemeButtonGroupProps) {
  const { mode, setMode } = useTheme()

  const buttons: Array<{ value: ThemeMode; label: string; icon: React.ReactNode }> = [
    {
      value: 'light',
      label: 'Light',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2m-8-10h2m16 0h2m-4.93-5.07 1.41 1.41M6.34 17.66l1.41 1.41" />
        </svg>
      )
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )
    },
    {
      value: 'system',
      label: 'System',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="14" x="2" y="3" rx="2" />
          <line x1="8" x2="16" y1="21" y2="21" />
          <line x1="12" x2="12" y1="17" y2="21" />
        </svg>
      )
    }
  ]

  return (
    <div className={`theme-button-group ${className}`.trim()} style={style} role="group" aria-label="Theme selection">
      {buttons.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => setMode(value)}
          className={`theme-button ${mode === value ? 'active' : ''}`.trim()}
          aria-label={`${label} theme`}
          aria-pressed={mode === value}
        >
          {showIcons && <span className="theme-button-icon">{icon}</span>}
          <span className="theme-button-label">{label}</span>
        </button>
      ))}
    </div>
  )
}
