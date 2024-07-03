import type { OpenAPIV3 } from 'openapi-types'
import { schemaAny } from './schema.any'
import { schemaComment } from './schema.comment'

export function schemaObject({ obj }: { obj: OpenAPIV3.BaseSchemaObject }) {
  return `{
    ${Object.keys(obj.properties || {})
      .map(key => {
        const item = obj.properties[key]
        const isOptional = item.required || !(obj.required || []).includes(key)
        return `${schemaComment(item)}
        ${key}${isOptional ? '?' : ''}: ${schemaAny(item)},`
      })
      .join('\n')}
      }`
}
