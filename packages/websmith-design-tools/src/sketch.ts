// Sketch-specific export utilities
import { DesignToolsExporter } from './index'
import type { SketchExportFormat, ExportOptions } from './types'

export function exportToSketch(options: ExportOptions = {}): SketchExportFormat {
  const exporter = new DesignToolsExporter(options.theme)
  return exporter.exportToSketch(options)
}

export function exportSketchFile(outputPath: string, options: ExportOptions = {}): void {
  const exporter = new DesignToolsExporter(options.theme)
  exporter.exportToFile('sketch', outputPath, options)
}
