import { OpenAPIV3 } from 'openapi-types'
import { getPreferredSchema, getReferenceName } from './utils'
import { schemaAny } from './schema.any'

export function componentsResponses(it: Record<string, OpenAPIV3.ReferenceObject | OpenAPIV3.ResponseObject>) {
  return `{
  ${Object.keys(it || {})
    .map(key => {
      const schema = it[key]
      if ('$ref' in schema) {
        return `'${key}' = ${getReferenceName(schema.$ref)}`
      }
      if (!schema.content) {
        return `'${key}' = unknown`
      }
      const resp = getPreferredSchema(schema.content, ['200', '201'])
      return `'${key}': ${resp?.schema ? schemaAny(resp, 4) : 'unknown'}`
    })
    .join(',\n')}}`
}
