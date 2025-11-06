"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@websmith/ui"
import { Button } from "@websmith/ui"
import { Input } from "@websmith/ui"
import { Label } from "@websmith/ui"
import { Switch } from "@websmith/ui"

interface ThemeCustomizerProps {
  onThemeChange?: (theme: Record<string, any>) => void
}

export function ThemeCustomizer({ onThemeChange }: ThemeCustomizerProps) {
  const { theme, setTheme } = useTheme()
  const [customColors, setCustomColors] = React.useState({
    primary: "#3b82f6",
    secondary: "#64748b",
    accent: "#f59e0b",
    background: "#ffffff",
    foreground: "#09090b",
  })

  const [customSpacing, setCustomSpacing] = React.useState({
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  })

  const [customBorderRadius, setCustomBorderRadius] = React.useState("0.5rem")

  const handleColorChange = (colorKey: string, value: string) => {
    const newColors = { ...customColors, [colorKey]: value }
    setCustomColors(newColors)
    applyThemeToDocument(newColors, customSpacing, customBorderRadius)
    onThemeChange?.({ colors: newColors, spacing: customSpacing, borderRadius: customBorderRadius })
  }

  const handleSpacingChange = (spacingKey: string, value: string) => {
    const newSpacing = { ...customSpacing, [spacingKey]: value }
    setCustomSpacing(newSpacing)
    applyThemeToDocument(customColors, newSpacing, customBorderRadius)
    onThemeChange?.({ colors: customColors, spacing: newSpacing, borderRadius: customBorderRadius })
  }

  const handleBorderRadiusChange = (value: string) => {
    setCustomBorderRadius(value)
    applyThemeToDocument(customColors, customSpacing, value)
    onThemeChange?.({ colors: customColors, spacing: customSpacing, borderRadius: value })
  }

  const applyThemeToDocument = (colors: typeof customColors, spacing: typeof customSpacing, borderRadius: string) => {
    const root = document.documentElement
    
    // Apply custom colors
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--websmith-${key}`, value)
    })

    // Apply custom spacing
    Object.entries(spacing).forEach(([key, value]) => {
      root.style.setProperty(`--websmith-spacing-${key}`, value)
    })

    // Apply custom border radius
    root.style.setProperty('--websmith-border-radius', borderRadius)
  }

  const resetToDefaults = () => {
    const defaultColors = {
      primary: "#3b82f6",
      secondary: "#64748b",
      accent: "#f59e0b",
      background: "#ffffff",
      foreground: "#09090b",
    }
    const defaultSpacing = {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
    }
    const defaultBorderRadius = "0.5rem"

    setCustomColors(defaultColors)
    setCustomSpacing(defaultSpacing)
    setCustomBorderRadius(defaultBorderRadius)
    
    // Clear custom CSS variables
    const root = document.documentElement
    Object.keys(defaultColors).forEach(key => {
      root.style.removeProperty(`--websmith-${key}`)
    })
    Object.keys(defaultSpacing).forEach(key => {
      root.style.removeProperty(`--websmith-spacing-${key}`)
    })
    root.style.removeProperty('--websmith-border-radius')
    
    onThemeChange?.({})
  }

  const exportTheme = () => {
    const themeData = {
      colors: customColors,
      spacing: customSpacing,
      borderRadius: customBorderRadius,
      timestamp: new Date().toISOString(),
    }
    
    const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'websmith-custom-theme.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Theme Customizer
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={resetToDefaults}>
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={exportTheme}>
              Export
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Customize the theme in real-time. Changes are applied instantly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Mode Toggle */}
        <div className="space-y-2">
          <Label>Theme Mode</Label>
          <div className="flex space-x-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("light")}
            >
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("dark")}
            >
              Dark
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("system")}
            >
              System
            </Button>
          </div>
        </div>

        {/* Color Customization */}
        <div className="space-y-4">
          <Label>Colors</Label>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(customColors).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="text-xs font-medium capitalize">
                  {key}
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id={key}
                    type="color"
                    value={value}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="w-12 h-8 p-1 rounded"
                  />
                  <Input
                    value={value}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="flex-1 text-xs"
                    placeholder="#000000"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spacing Customization */}
        <div className="space-y-4">
          <Label>Spacing Scale</Label>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(customSpacing).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={`spacing-${key}`} className="text-xs font-medium capitalize">
                  {key}
                </Label>
                <Input
                  id={`spacing-${key}`}
                  value={value}
                  onChange={(e) => handleSpacingChange(key, e.target.value)}
                  className="text-xs"
                  placeholder="1rem"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Border Radius Customization */}
        <div className="space-y-2">
          <Label htmlFor="border-radius">Border Radius</Label>
          <Input
            id="border-radius"
            value={customBorderRadius}
            onChange={(e) => handleBorderRadiusChange(e.target.value)}
            placeholder="0.5rem"
          />
        </div>

        {/* Live Preview */}
        <div className="space-y-2">
          <Label>Live Preview</Label>
          <div 
            className="p-4 border rounded-lg"
            style={{
              backgroundColor: customColors.background,
              color: customColors.foreground,
              borderColor: customColors.secondary,
              borderRadius: customBorderRadius,
              padding: customSpacing.lg,
            }}
          >
            <h3 
              className="font-semibold mb-2"
              style={{ color: customColors.primary }}
            >
              Sample Component
            </h3>
            <p className="text-sm mb-3">
              This is a preview of your custom theme. All changes are applied in real-time.
            </p>
            <div className="flex space-x-2">
              <Button 
                size="sm"
                style={{ 
                  backgroundColor: customColors.primary,
                  borderColor: customColors.primary,
                }}
              >
                Primary
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                style={{ 
                  borderColor: customColors.secondary,
                  color: customColors.secondary,
                }}
              >
                Secondary
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
