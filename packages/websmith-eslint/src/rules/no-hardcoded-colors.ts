import type { Rule } from 'eslint'

// Warn when hardcoded color values are used instead of tokens
const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow hardcoded colors; use Websmith design tokens instead',
      recommended: false,
    },
    messages: {
      hardcodedColor: 'Avoid hardcoded color "{{value}}". Use a Websmith token (e.g., var(--ws-color-...)).',
    },
    schema: [],
  },
  create(context) {
    const COLOR_REGEX = /#([0-9a-fA-F]{3,8})\b|rgb\(|hsl\(|oklch\(|oklab\(/

    return {
      Literal(node: any) {
        if (typeof node.value === 'string' && COLOR_REGEX.test(node.value)) {
          context.report({ node, messageId: 'hardcodedColor', data: { value: node.value } })
        }
      },
      TemplateElement(node: any) {
        const raw = node.value?.raw as string | undefined
        if (raw && COLOR_REGEX.test(raw)) {
          context.report({ node, messageId: 'hardcodedColor', data: { value: raw } })
        }
      },
    }
  },
}

export default rule
