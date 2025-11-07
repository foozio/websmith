/**
 * Figma Plugin API Type Declarations
 * Minimal types needed for the plugin to compile
 */

declare const figma: PluginAPI
declare const __html__: string

interface PluginAPI {
  showUI(html: string, options?: ShowUIOptions): void
  closePlugin(message?: string): void
  ui: UIAPI
  getLocalPaintStyles(): PaintStyle[]
  getLocalTextStyles(): TextStyle[]
  getLocalEffectStyles(): EffectStyle[]
}

interface ShowUIOptions {
  width?: number
  height?: number
  visible?: boolean
}

interface UIAPI {
  postMessage(message: any): void
  onmessage: ((message: any) => void) | null
}

interface PaintStyle {
  name: string
  paints: Paint[]
}

interface TextStyle {
  name: string
  fontName: FontName
  fontSize: number
  lineHeight: LineHeight
  letterSpacing: LetterSpacing
}

interface EffectStyle {
  name: string
  effects: Effect[]
}

interface Paint {
  type: 'SOLID' | 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'IMAGE'
  color?: RGB
  opacity?: number
}

interface RGB {
  r: number
  g: number
  b: number
}

interface RGBA extends RGB {
  a: number
}

interface FontName {
  family: string
  style: string
}

interface LineHeight {
  value: number
  unit: 'PIXELS' | 'PERCENT' | 'AUTO'
}

interface LetterSpacing {
  value: number
  unit: 'PIXELS' | 'PERCENT'
}

interface Effect {
  type: 'DROP_SHADOW' | 'INNER_SHADOW' | 'LAYER_BLUR' | 'BACKGROUND_BLUR'
  color: RGBA
  offset?: Vector
  radius: number
  spread?: number
  visible?: boolean
}

interface Vector {
  x: number
  y: number
}
