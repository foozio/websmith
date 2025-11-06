import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import wsplugin from './packages/websmith-eslint/dist/index.js';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        HTMLElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLTextAreaElement: 'readonly',
        HTMLAnchorElement: 'readonly',
        HTMLHeadingElement: 'readonly',
        HTMLParagraphElement: 'readonly',
        HTMLSpanElement: 'readonly',
        HTMLUListElement: 'readonly',
        HTMLOListElement: 'readonly',
        HTMLLIElement: 'readonly',
        HTMLTableElement: 'readonly',
        HTMLTableSectionElement: 'readonly',
        HTMLTableRowElement: 'readonly',
        HTMLTableCellElement: 'readonly',
        HTMLTableCaptionElement: 'readonly',
        // React globals
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      '@websmith/eslint-plugin': wsplugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-empty-object-type': 'off',
      // Websmith rules
      '@websmith/eslint-plugin/no-hardcoded-colors': 'warn',
      '@websmith/eslint-plugin/enforce-cva-variants': 'off',
    },
    ignores: ['dist/**', 'node_modules/**', '.next/**'],
  },
];