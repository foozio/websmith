"use client"

import { Button } from '@websmith/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@websmith/ui'
import { Badge } from '@websmith/ui'
import { Alert, AlertDescription } from '@websmith/ui'
import { ThemeToggle } from '@/components/theme-toggle'
import { ThemeCustomizer } from '@/components/theme-customizer'
import { useEffect, useState } from 'react'

export default function Home() {
  const [currentTheme, setCurrentTheme] = useState<Record<string, any>>({})

  useEffect(() => {
    // Apply initial theme variables
    const root = document.documentElement
    root.style.setProperty('--websmith-primary', '#3b82f6')
    root.style.setProperty('--websmith-secondary', '#64748b')
    root.style.setProperty('--websmith-accent', '#f59e0b')
    root.style.setProperty('--websmith-background', '#ffffff')
    root.style.setProperty('--websmith-foreground', '#09090b')
  }, [])

  const handleThemeChange = (theme: Record<string, any>) => {
    setCurrentTheme(theme)
    console.log('Theme updated:', theme)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header with Theme Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Websmith Kit Playground</h1>
            <p className="text-lg text-muted-foreground">
              Interactive playground with real-time theme customization
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Alert for Hot Reloading */}
        <Alert className="mb-8 border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            🎨 <strong>Hot Reloading Enabled:</strong> Theme changes are applied instantly. 
            Use the customizer panel to experiment with colors, spacing, and more!
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-12">
            {/* Buttons Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
              <div className="flex gap-4 flex-wrap">
                <Button>Default</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button size="sm">Small</Button>
                <Button size="lg">Large</Button>
              </div>
            </section>

            {/* Badges Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Badges</h2>
              <div className="flex gap-4 flex-wrap">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Error</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge className="bg-green-500 text-white">Success</Badge>
                <Badge className="bg-yellow-500 text-white">Warning</Badge>
              </div>
            </section>

            {/* Cards Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sample Card</CardTitle>
                    <CardDescription>
                      This card adapts to theme changes instantly
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Watch how this card responds to your theme customizations in real-time.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm">Action</Button>
                      <Button variant="outline" size="sm">Cancel</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Theme Status</CardTitle>
                    <CardDescription>
                      Current theme configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Custom Colors:</span>
                        <Badge variant="outline">
                          {Object.keys(currentTheme.colors || {}).length || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Custom Spacing:</span>
                        <Badge variant="outline">
                          {Object.keys(currentTheme.spacing || {}).length || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Border Radius:</span>
                        <Badge variant="outline">
                          {currentTheme.borderRadius ? 'Custom' : 'Default'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Interactive Demo Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Interactive Demo</h2>
              <Card 
                className="p-6"
                style={{
                  backgroundColor: 'var(--websmith-background, hsl(var(--background)))',
                  borderColor: 'var(--websmith-secondary, hsl(var(--border)))',
                  borderRadius: 'var(--websmith-border-radius, 0.5rem)',
                }}
              >
                <div className="space-y-4">
                  <h3 
                    className="text-xl font-semibold"
                    style={{ color: 'var(--websmith-primary, hsl(var(--primary)))' }}
                  >
                    Live Theme Preview
                  </h3>
                  <p style={{ color: 'var(--websmith-foreground, hsl(var(--foreground)))' }}>
                    This section demonstrates how theme changes affect components in real-time. 
                    Customize the theme using the panel on the right to see instant updates here.
                  </p>
                  <div 
                    className="flex gap-3"
                    style={{ gap: 'var(--websmith-spacing-md, 1rem)' }}
                  >
                    <Button 
                      style={{ 
                        backgroundColor: 'var(--websmith-primary, hsl(var(--primary)))',
                        borderColor: 'var(--websmith-primary, hsl(var(--primary)))',
                      }}
                    >
                      Primary Button
                    </Button>
                    <Button 
                      variant="outline"
                      style={{ 
                        borderColor: 'var(--websmith-secondary, hsl(var(--border)))',
                        color: 'var(--websmith-secondary, hsl(var(--foreground)))',
                      }}
                    >
                      Secondary Button
                    </Button>
                  </div>
                </div>
              </Card>
            </section>
          </div>

          {/* Theme Customizer Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ThemeCustomizer onThemeChange={handleThemeChange} />
              
              {/* Theme Info Card */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Hot Reloading Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Real-time theme updates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Live CSS variable injection</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Component state preservation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Theme export functionality</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}