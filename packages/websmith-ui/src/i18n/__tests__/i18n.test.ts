import { describe, expect, it, beforeEach } from 'vitest'
import { I18n, formatNumber, formatDate, formatRelativeTime, plural } from '../index'

describe('I18n', () => {
  const messages = {
    en: {
      hello: 'Hello',
      greeting: 'Hello, {name}!',
      nested: {
        key: 'Nested value'
      }
    },
    es: {
      hello: 'Hola',
      greeting: 'Hola, {name}!',
      nested: {
        key: 'Valor anidado'
      }
    }
  }

  let i18n: I18n

  beforeEach(() => {
    i18n = new I18n({
      locale: 'en',
      messages,
      fallbackLocale: 'en'
    })
  })

  describe('basic translation', () => {
    it('translates simple keys', () => {
      expect(i18n.t('hello')).toBe('Hello')
    })

    it('translates nested keys', () => {
      expect(i18n.t('nested.key')).toBe('Nested value')
    })

    it('returns key if translation not found', () => {
      expect(i18n.t('nonexistent')).toBe('nonexistent')
    })

    it('interpolates parameters', () => {
      expect(i18n.t('greeting', { name: 'World' })).toBe('Hello, World!')
    })

    it('interpolates multiple parameters', () => {
      i18n.addMessages('en', {
        multi: 'Hello {first} {last}!'
      })
      expect(i18n.t('multi', { first: 'John', last: 'Doe' })).toBe('Hello John Doe!')
    })
  })

  describe('locale management', () => {
    it('gets current locale', () => {
      expect(i18n.getLocale()).toBe('en')
    })

    it('sets locale', () => {
      i18n.setLocale('es')
      expect(i18n.getLocale()).toBe('es')
      expect(i18n.t('hello')).toBe('Hola')
    })

    it('falls back to fallback locale for missing keys', () => {
      i18n.setLocale('es')
      i18n.addMessages('es', { onlyInSpanish: 'Solo en español' })
      i18n.addMessages('en', { onlyInEnglish: 'Only in English' })
      
      expect(i18n.t('onlyInEnglish')).toBe('Only in English')
    })

    it('warns and uses fallback for nonexistent locale', () => {
      i18n.setLocale('fr')
      expect(i18n.getLocale()).toBe('en')
    })

    it('gets available locales', () => {
      expect(i18n.getAvailableLocales()).toEqual(['en', 'es'])
    })
  })

  describe('message management', () => {
    it('adds messages to existing locale', () => {
      i18n.addMessages('en', {
        newKey: 'New value'
      })
      expect(i18n.t('newKey')).toBe('New value')
    })

    it('checks if translation exists', () => {
      expect(i18n.has('hello')).toBe(true)
      expect(i18n.has('nonexistent')).toBe(false)
    })
  })
})

describe('formatNumber', () => {
  it('formats numbers based on locale', () => {
    const formatted = formatNumber(1234.56)
    expect(formatted).toContain('1')
    expect(formatted).toContain('234')
  })

  it('formats with options', () => {
    const formatted = formatNumber(1234.56, {
      style: 'currency',
      currency: 'USD'
    })
    expect(formatted).toContain('$')
    expect(formatted).toContain('1,234')
  })
})

describe('formatDate', () => {
  it('formats dates based on locale', () => {
    const date = new Date('2024-01-15')
    const formatted = formatDate(date)
    expect(formatted).toContain('2024')
    expect(formatted).toContain('1')
    expect(formatted).toContain('15')
  })

  it('formats with options', () => {
    const date = new Date('2024-01-15')
    const formatted = formatDate(date, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    expect(formatted).toContain('2024')
    expect(formatted).toContain('January')
  })
})

describe('formatRelativeTime', () => {
  it('formats relative time', () => {
    const formatted = formatRelativeTime(-1, 'day')
    expect(formatted.toLowerCase()).toContain('yesterday')
  })

  it('formats future time', () => {
    const formatted = formatRelativeTime(1, 'day')
    expect(formatted.toLowerCase()).toContain('tomorrow')
  })
})

describe('plural', () => {
  it('returns zero form', () => {
    expect(plural(0, { zero: 'no items', one: 'one item', other: '{count} items' }))
      .toBe('no items')
  })

  it('returns one form', () => {
    expect(plural(1, { one: 'one item', other: '{count} items' }))
      .toBe('one item')
  })

  it('returns other form', () => {
    expect(plural(5, { one: 'one item', other: '{count} items' }))
      .toBe('{count} items')
  })

  it('uses other form when zero not provided', () => {
    expect(plural(0, { one: 'one item', other: 'no items' }))
      .toBe('no items')
  })
})
