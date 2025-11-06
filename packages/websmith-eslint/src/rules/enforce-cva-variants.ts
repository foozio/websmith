import type { Rule } from 'eslint'
import type { CallExpression, ObjectExpression, Property } from 'estree'

// Enforce that cva() calls include a `variants` object with at least one key
const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Ensure class-variance-authority (cva) calls define variants',
      recommended: false,
    },
    messages: {
      missingVariants: 'cva() should include a `variants` object with at least one key for consistency.',
    },
    schema: [],
  },
  create(context) {
    function isIdentifierCva(node: CallExpression) {
      return (
        node.callee.type === 'Identifier' && node.callee.name === 'cva'
      )
    }

    function getSecondArgObject(node: CallExpression): ObjectExpression | null {
      const second = node.arguments[1]
      if (!second || second.type !== 'ObjectExpression') return null
      return second
    }

    function findProperty(obj: ObjectExpression, name: string): Property | null {
      for (const prop of obj.properties) {
        if (prop.type !== 'Property') continue
        if (prop.key.type === 'Identifier' && prop.key.name === name) return prop
        if (prop.key.type === 'Literal' && prop.key.value === name) return prop
      }
      return null
    }

    return {
      CallExpression(node: any) {
        const call = node as CallExpression
        if (!isIdentifierCva(call)) return
        const optionsObj = getSecondArgObject(call)
        if (!optionsObj) return

        const variantsProp = findProperty(optionsObj, 'variants')
        if (!variantsProp) {
          context.report({ node: optionsObj, messageId: 'missingVariants' })
          return
        }

        // Ensure variants object has at least one key
        if (
          variantsProp.value.type === 'ObjectExpression' &&
          variantsProp.value.properties.filter(p => p.type === 'Property').length === 0
        ) {
          context.report({ node: variantsProp.value, messageId: 'missingVariants' })
        }
      },
    }
  },
}

export default rule
