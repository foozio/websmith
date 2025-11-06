import type { Rule } from 'eslint'
import noHardcodedColors from './rules/no-hardcoded-colors'
import enforceCvaVariants from './rules/enforce-cva-variants'

export const rules: Record<string, Rule.RuleModule> = {
  'no-hardcoded-colors': noHardcodedColors,
  'enforce-cva-variants': enforceCvaVariants,
}

export const configs = {
  recommended: {
    plugins: ['@websmith/eslint-plugin'],
    rules: {
      '@websmith/eslint-plugin/no-hardcoded-colors': 'warn',
      '@websmith/eslint-plugin/enforce-cva-variants': 'off',
    },
  },
}

export default {
  rules,
  configs,
}
