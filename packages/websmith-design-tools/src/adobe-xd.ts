// Adobe XD-specific export utilities
import { DesignToolsExporter } from './index'
import type { AdobeXDExportFormat, ExportOptions } from './types'

export function exportToAdobeXD(options: ExportOptions = {}): AdobeXDExportFormat {
  const exporter = new DesignToolsExporter(options.theme)
  return exporter.exportToAdobeXD(options)
}

export function exportAdobeXDFile(outputPath: string, options: ExportOptions = {}): void {
  const exporter = new DesignToolsExporter(options.theme)
  exporter.exportToFile('xd', outputPath, options)
}
