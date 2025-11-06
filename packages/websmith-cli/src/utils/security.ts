import { validate, ValidationError as ClassValidatorValidationError } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { resolve } from 'path'

/**
 * Validates project names to prevent injection attacks
 */
export function validateProjectName(name: string): boolean {
  // Check for empty name
  if (!name || name.trim().length === 0) {
    return false
  }

  // Check for path traversal attempts
  if (name.includes('..') || name.includes('/') || name.includes('\\')) {
    return false
  }

  // Check for command injection patterns
  const dangerousPatterns = [
    /&/, /;/, /\|/, /`/, /\$/, /\(/, /\)/, /</, />/, /"/, /'/,
    /\s/, /\n/, /\r/, /\t/, /\\x00/, /\\x1a/
  ]
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(name)) {
      return false
    }
  }

  // Check for valid npm package name pattern
  const validNamePattern = /^[a-z0-9-_]+$/
  return validNamePattern.test(name)
}

/**
 * Sanitizes file paths to prevent directory traversal
 */
export function sanitizePath(path: string): string {
  // Remove any directory traversal attempts
  return path.replace(/\.\./g, '').replace(/[\/\\]/g, '_')
}

/**
 * Validates component names
 */
export function validateComponentName(name: string): boolean {
  if (!name || name.trim().length === 0) {
    return false
  }

  // Check for path traversal
  if (name.includes('..') || name.includes('/') || name.includes('\\')) {
    return false
  }

  // Check for valid component name pattern (PascalCase)
  const validComponentPattern = /^[A-Z][a-zA-Z0-9]*$/
  return validComponentPattern.test(name)
}

/**
 * Validates theme preset names
 */
export function validateThemePreset(preset: string): boolean {
  if (!preset || preset.trim().length === 0) {
    return false
  }

  const validPresets = ['modern', 'classic', 'minimal', 'brand']
  return validPresets.includes(preset.toLowerCase())
}

/**
 * Sanitizes user input for display
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/["']/g, '') // Remove quotes
    .replace(/[&]/g, '') // Remove ampersands
    .trim()
}

/**
 * Validates file paths to ensure they're within allowed directories
 */
export function validateFilePath(filePath: string, allowedBase: string): boolean {
  const resolved = resolve(allowedBase, filePath)
  return resolved.startsWith(resolve(allowedBase))
}

/**
 * Error class for validation failures
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

/**
 * Validates and sanitizes CLI arguments
 */
export function validateCliArgs(args: Record<string, unknown>, schema: unknown): Record<string, unknown> {
  const validated = plainToClass(schema as new () => unknown, args)
  const errors = validate(validated)
  
  if (errors.length > 0) {
    throw new ValidationError(`Validation failed: ${errors.map((e: ClassValidatorValidationError) => e.toString()).join(', ')}`)
  }
  
  return validated as Record<string, unknown>
}
