import { describe, it, expect } from 'vitest'
import { 
  validateProjectName, 
  validateComponentName, 
  validateThemePreset,
  sanitizePath,
  sanitizeInput,
  validateFilePath,
  ValidationError
} from '../utils/security'

describe('Security Utilities', () => {
  describe('validateProjectName', () => {
    it('should accept valid project names', () => {
      expect(validateProjectName('my-project')).toBe(true)
      expect(validateProjectName('my_app')).toBe(true)
      expect(validateProjectName('project123')).toBe(true)
      expect(validateProjectName('test')).toBe(true)
    })

    it('should reject invalid project names', () => {
      expect(validateProjectName('')).toBe(false)
      expect(validateProjectName('My-Project')).toBe(false)
      expect(validateProjectName('my project')).toBe(false)
      expect(validateProjectName('../malicious')).toBe(false)
      expect(validateProjectName('path/traversal')).toBe(false)
      expect(validateProjectName('rm -rf')).toBe(false)
      expect(validateProjectName('project;rm -rf')).toBe(false)
      expect(validateProjectName('project&&echo')).toBe(false)
      expect(validateProjectName('project|cat')).toBe(false)
      expect(validateProjectName('project`whoami`')).toBe(false)
      expect(validateProjectName('project$(whoami)')).toBe(false)
    })
  })

  describe('validateComponentName', () => {
    it('should accept valid component names', () => {
      expect(validateComponentName('Button')).toBe(true)
      expect(validateComponentName('Card')).toBe(true)
      expect(validateComponentName('MyComponent')).toBe(true)
      expect(validateComponentName('Component123')).toBe(true)
    })

    it('should reject invalid component names', () => {
      expect(validateComponentName('')).toBe(false)
      expect(validateComponentName('button')).toBe(false)
      expect(validateComponentName('Button-Component')).toBe(false)
      expect(validateComponentName('../Button')).toBe(false)
      expect(validateComponentName('Button;rm -rf')).toBe(false)
    })
  })

  describe('validateThemePreset', () => {
    it('should accept valid theme presets', () => {
      expect(validateThemePreset('modern')).toBe(true)
      expect(validateThemePreset('classic')).toBe(true)
      expect(validateThemePreset('minimal')).toBe(true)
      expect(validateThemePreset('brand')).toBe(true)
    })

    it('should reject invalid theme presets', () => {
      expect(validateThemePreset('')).toBe(false)
      expect(validateThemePreset('invalid')).toBe(false)
      expect(validateThemePreset('custom')).toBe(false)
      expect(validateThemePreset('modern;rm -rf')).toBe(false)
    })
  })

  describe('sanitizePath', () => {
    it('should sanitize dangerous paths', () => {
      expect(sanitizePath('../etc/passwd')).toBe('_etc_passwd')
      expect(sanitizePath('path/../../etc')).toBe('path___etc')
      expect(sanitizePath('normal\\path')).toBe('normal_path')
      expect(sanitizePath('clean-path')).toBe('clean-path')
    })
  })

  describe('sanitizeInput', () => {
    it('should sanitize dangerous input', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert(xss)/script')
      expect(sanitizeInput('normal text')).toBe('normal text')
      expect(sanitizeInput('text with "quotes"')).toBe('text with quotes')
      expect(sanitizeInput('text & more')).toBe('text  more')
    })
  })

  describe('validateFilePath', () => {
    it('should validate file paths within allowed directory', () => {
      expect(validateFilePath('file.txt', '/allowed/dir')).toBe(true)
      expect(validateFilePath('subdir/file.txt', '/allowed/dir')).toBe(true)
    })

    it('should reject paths outside allowed directory', () => {
      expect(validateFilePath('../file.txt', '/allowed/dir')).toBe(false)
      expect(validateFilePath('/etc/passwd', '/allowed/dir')).toBe(false)
    })
  })

  describe('ValidationError', () => {
    it('should create validation error with message', () => {
      const error = new ValidationError('Test message')
      expect(error.message).toBe('Test message')
      expect(error.name).toBe('ValidationError')
    })
  })
})
