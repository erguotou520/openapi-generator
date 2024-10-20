import type { OpenAPIV3 } from 'openapi-types'
import { schemaAny } from './schema.any'
import { safeKey } from './utils'

export function componentsSchemas(it: Record<string, OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject>) {
  return `{
  ${Object.keys(it || {})
    .map(key => {
      const schema = it[key]
      return `
    ${safeKey(key)}: ${schemaAny(schema, 4)}`
    })
    .join(',\n')}
  }`
}
