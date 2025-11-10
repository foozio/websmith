// Figma-specific export utilities
import { DesignToolsExporter } from './index'
import type { FigmaExportFormat, ExportOptions } from './types'

export function exportToFigma(options: ExportOptions = {}): FigmaExportFormat {
  const exporter = new DesignToolsExporter(options.theme)
  return exporter.exportToFigma(options)
}

export function exportFigmaFile(outputPath: string, options: ExportOptions = {}): void {
  const exporter = new DesignToolsExporter(options.theme)
  exporter.exportToFile('figma', outputPath, options)
}
