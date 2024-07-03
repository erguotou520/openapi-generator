import { OpenAPIV3 } from 'openapi-types'
import { schemaAny } from './schema.any'
import { getPreferredSchema, getReferenceName } from './utils'

export function componentsRequestBodies(it: Record<string, OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject>) {
  return `{
  ${Object.keys(it || {})
    .map(key => {
      const schema = it[key]
      if ('$ref' in schema) {
        return `
    '${key}' = ${getReferenceName(schema.$ref)}`
      }
      if (!schema.content) {
        return `
    '${key}' = unknown`
      }
      const resp = getPreferredSchema(schema.content)
      return `
    '${key}':  ${resp?.schema ? schemaAny(resp.schema, 4) : 'unknown'}`
    })
    .join(',\n')}
  }`
}
