# @websmith/figma-plugin

## 2.0.0

### Major Changes

- cea4995: Release v1.2.0 with ecosystem integrations

### Minor Changes

- 515e701: Create Figma plugin for design token synchronization

  - Extract color tokens from Figma paint styles
  - Extract typography tokens from text styles
  - Extract spacing tokens from layout grids
  - Extract effect tokens (shadows, blurs)
  - Convert Figma styles to Websmith-compatible JSON format
  - Support nested color naming (e.g., primary/500)
  - Automatic RGB to HEX conversion with opacity support
  - Font weight mapping from Figma to numeric values
  - Line height and letter spacing extraction
  - Shadow properties extraction (offset, blur, spread, color)
  - Plugin UI for token extraction and export
  - Copy to clipboard functionality
  - Full TypeScript support

  Features:

  - One-click token extraction
  - Websmith Kit compatible output format
  - Support for color palettes
  - Typography system extraction
  - Effect system extraction
  - Easy integration workflow
