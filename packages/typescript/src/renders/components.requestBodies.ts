import { getConfig } from '@/config'
import type { OpenAPIV3 } from 'openapi-types'
import { schemaAny } from './schema.any'
import { getPreferredSchema, getReferenceName } from './utils'

export function componentsRequestBodies(it: Record<string, OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject>) {
  const {preferUnknownType} = getConfig()
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
    '${key}' = ${preferUnknownType}`
      }
      const resp = getPreferredSchema(schema.content)
      return `
    '${key}':  ${resp?.schema ? schemaAny(resp.schema, 4) : preferUnknownType}`
    })
    .join(',\n')}
  }`
}
