# @websmith/design-tools

## 1.0.0

### Major Changes

- Initial release of design tools integration for Websmith tokens
- CLI tool for automated token export and validation
- Support for Sketch, Figma, and Adobe XD export formats
- TypeScript-first implementation with comprehensive type definitions
- Programmatic API for custom integrations and workflows

### Features

- **CLI Tool**: `websmith-design` command-line interface for token operations
- **Export Formats**: Support for Sketch (.sketch), Figma (.json), Adobe XD (.json), and JSON formats
- **Token Validation**: Comprehensive validation with error reporting and suggestions
- **Theme Support**: Export light and dark themes with proper color transformations
- **TypeScript Integration**: Full TypeScript support with generated type definitions
- **Color Conversion**: HSL to RGB conversion for design tool compatibility

### CLI Commands

- **`websmith-design export <format> <output>`**: Export tokens to specified format
- **`websmith-design validate <file>`**: Validate token file format and content
- **`websmith-design info`**: Display available formats and usage information
- **Options Support**: Theme selection, prefix customization, metadata inclusion

### Export Formats

- **Sketch Format**: Shared styles JSON with proper Sketch object structure
- **Figma Format**: Variables API compatible format with collections and modes
- **Adobe XD Format**: Component styles format with XD-compatible structure
- **JSON Format**: Generic token format for custom integrations

### Programmatic API

- **`DesignToolsExporter`**: Main exporter class with validation and export methods
- **`exportTokens()`**: Utility function for file-based exports
- **`validateTokenFile()`**: Token file validation utility
- **Format-specific exports**: Dedicated functions for each design tool format

### Color Processing

- **HSL to RGB Conversion**: Accurate color space conversion for design tools
- **Sketch Color Format**: Proper color object structure for Sketch compatibility
- **Figma Color Format**: RGBA color format for Figma variables
- **Adobe XD Colors**: HSL color values for XD compatibility

### Validation Features

- **Format Validation**: Ensure exported files match design tool specifications
- **Color Validation**: Verify color values are valid and properly formatted
- **Structure Validation**: Confirm JSON structure matches expected format
- **Error Reporting**: Detailed error messages with suggestions for fixes

### Development Experience

- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Error Handling**: Clear error messages and validation feedback
- **Documentation**: Comprehensive README with usage examples
- **CLI Help**: Built-in help system with command descriptions
- **Progress Feedback**: Console output for export operations

### File Operations

- **Safe File Writing**: Atomic file operations with proper error handling
- **Path Resolution**: Support for relative and absolute file paths
- **JSON Formatting**: Pretty-printed JSON output for readability
- **File Validation**: Pre-flight checks for file permissions and paths

### Build Integration

- **ESM Modules**: Modern ES module format for better tree-shaking
- **Zero Dependencies**: Minimal dependencies for CLI functionality
- **Cross-platform**: Works on macOS, Linux, and Windows
- **Node.js Compatibility**: Supports Node.js 16+ with modern features

### Future Extensibility

- **Plugin Architecture**: Extensible design for additional format support
- **Import Capabilities**: Foundation for bidirectional token synchronization
- **Custom Formats**: Support for additional design tools and formats
- **Advanced Validation**: Enhanced validation rules and quality checks
