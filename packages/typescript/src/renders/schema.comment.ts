import type { OpenAPIV3 } from 'openapi-types'

export function schemaComment(it: OpenAPIV3.ArraySchemaObject) {
  if (it.title || it.example || it.description || it.enum || it.default !== undefined) {
    let comment = '/**\n'

    if (it.title) {
      comment += ` * ${it.title}\n *\n`
    }

    if (it.description) {
      comment += ` * @description ${it.description}\n *\n`
    }

    if (it.example) {
      comment += ` * @example ${it.example}\n *\n`
    }

    if (it.enum) {
      comment += ` * @enum ${it.enum}\n *\n`
    }

    if (it.default !== undefined) {
      comment += ` * @default ${it.default}\n *\n`
    }

    comment += ' */\n'
    return comment
  }
  return ''
}
