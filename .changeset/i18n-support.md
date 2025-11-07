---
"@websmith/ui": minor
---

Add comprehensive internationalization (i18n) support

- Implement lightweight i18n system with translation management
- Add React Context and hooks (useTranslation, useI18n, useFormattedNumber, useFormattedDate, useFormattedRelativeTime)
- Create declarative components (I18nProvider, Trans, LocaleMatch)
- Include built-in translations for English, Spanish, and French
- Add comprehensive translations for all UI components (buttons, forms, tables, dialogs, etc.)
- Support parameter interpolation and nested translation keys
- Provide locale-aware number, date, and relative time formatting using Intl API
- Add pluralization helper
- Include HOC for class components (withI18n)
- Full TypeScript support with type-safe translation keys
- Zero external dependencies - uses native Intl API
- Comprehensive test coverage (22 passing tests)
- Detailed documentation with examples and best practices

Features:
- Translation key management with dot notation
- Dynamic locale switching
- Fallback locale support
- Parameter interpolation
- Locale-aware formatting (numbers, dates, relative time)
- Conditional rendering based on locale
- Easy extensibility for custom locales
