import { ValidationError } from './security'

/**
 * Custom error classes for different types of CLI errors
 */
export class CLIError extends Error {
  constructor(message: string, public code: string = 'CLI_ERROR') {
    super(message)
    this.name = 'CLIError'
  }
}

export class FileSystemError extends CLIError {
  constructor(message: string, public path?: string) {
    super(message, 'FILESYSTEM_ERROR')
    this.name = 'FileSystemError'
  }
}

export class NetworkError extends CLIError {
  constructor(message: string, public url?: string) {
    super(message, 'NETWORK_ERROR')
    this.name = 'NetworkError'
  }
}

export class ConfigurationError extends CLIError {
  constructor(message: string, public configKey?: string) {
    super(message, 'CONFIGURATION_ERROR')
    this.name = 'ConfigurationError'
  }
}

/**
 * Error handler utility for consistent error reporting
 */
export class ErrorHandler {
  /**
   * Handle and format errors for CLI output
   */
  static handle(error: unknown, context?: string): never {
    if (error instanceof ValidationError) {
      console.error(`❌ Validation Error: ${error.message}`)
      if (context) {
        console.error(`   Context: ${context}`)
      }
      process.exit(1)
    }

    if (error instanceof FileSystemError) {
      console.error(`❌ File System Error: ${error.message}`)
      if (error.path) {
        console.error(`   Path: ${error.path}`)
      }
      if (context) {
        console.error(`   Context: ${context}`)
      }
      console.error('   Please check file permissions and disk space')
      process.exit(1)
    }

    if (error instanceof NetworkError) {
      console.error(`❌ Network Error: ${error.message}`)
      if (error.url) {
        console.error(`   URL: ${error.url}`)
      }
      if (context) {
        console.error(`   Context: ${context}`)
      }
      console.error('   Please check your internet connection')
      process.exit(1)
    }

    if (error instanceof ConfigurationError) {
      console.error(`❌ Configuration Error: ${error.message}`)
      if (error.configKey) {
        console.error(`   Config: ${error.configKey}`)
      }
      if (context) {
        console.error(`   Context: ${context}`)
      }
      console.error('   Please check your configuration files')
      process.exit(1)
    }

    if (error instanceof CLIError) {
      console.error(`❌ CLI Error [${error.code}]: ${error.message}`)
      if (context) {
        console.error(`   Context: ${context}`)
      }
      process.exit(1)
    }

    if (error instanceof Error) {
      console.error(`❌ Unexpected Error: ${error.message}`)
      if (context) {
        console.error(`   Context: ${context}`)
      }
      console.error('   This appears to be an unexpected error')
      process.exit(1)
    }

    // Unknown error type
    console.error('❌ Unknown Error: An unexpected error occurred')
    if (context) {
      console.error(`   Context: ${context}`)
    }
    console.error('   Please report this issue with details about what you were doing')
    process.exit(1)
  }

  /**
   * Wrap async functions with error handling
   */
  static async wrap<T>(
    fn: () => Promise<T>,
    context?: string
  ): Promise<T> {
    try {
      return await fn()
    } catch (error) {
      this.handle(error, context)
    }
  }

  /**
   * Wrap sync functions with error handling
   */
  static wrapSync<T>(
    fn: () => T,
    context?: string
  ): T {
    try {
      return fn()
    } catch (error) {
      this.handle(error, context)
    }
  }

  /**
   * Validate and handle file system operations
   */
  static validatePath(path: string, operation: string): void {
    if (!path || path.trim().length === 0) {
      throw new FileSystemError(`Invalid path provided for ${operation}`, path)
    }

    // Check for dangerous path patterns
    const dangerousPatterns = [
      /\.\./,  // Parent directory traversal
      /^\/(etc|usr|bin|sbin|var|root)/,  // System directories
      /[\/\\]node_modules[\/\\]/,  // Node modules (should be handled differently)
    ]

    for (const pattern of dangerousPatterns) {
      if (pattern.test(path)) {
        throw new FileSystemError(
          `Potentially dangerous path detected for ${operation}`,
          path
        )
      }
    }
  }

  /**
   * Validate network URLs
   */
  static validateUrl(url: string, operation: string): void {
    if (!url || url.trim().length === 0) {
      throw new NetworkError(`Invalid URL provided for ${operation}`, url)
    }

    try {
      new URL(url)
    } catch {
      throw new NetworkError(`Invalid URL format for ${operation}`, url)
    }

    // Check for potentially dangerous protocols
    const allowedProtocols = ['http:', 'https:', 'ftp:']
    const parsedUrl = new URL(url)
    
    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      throw new NetworkError(
        `Unsupported protocol '${parsedUrl.protocol}' for ${operation}`,
        url
      )
    }
  }

  /**
   * Validate configuration values
   */
  static validateConfig(
    key: string,
    value: unknown,
    expectedType: string,
    operation: string
  ): void {
    if (value === null || value === undefined) {
      throw new ConfigurationError(
        `Missing required configuration '${key}' for ${operation}`,
        key
      )
    }

    const actualType = typeof value
    if (actualType !== expectedType) {
      throw new ConfigurationError(
        `Configuration '${key}' must be of type ${expectedType}, got ${actualType}`,
        key
      )
    }
  }
}

/**
 * Decorator for adding error handling to CLI command functions
 */
export function withErrorHandling(context?: string) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value

    descriptor.value = function (...args: any[]) {
      try {
        const result = method.apply(this, args)
        
        // Handle async methods
        if (result && typeof result.catch === 'function') {
          return result.catch((error: unknown) => {
            ErrorHandler.handle(error, context || propertyName)
          })
        }
        
        return result
      } catch (error) {
        ErrorHandler.handle(error, context || propertyName)
      }
    }

    return descriptor
  }
}
