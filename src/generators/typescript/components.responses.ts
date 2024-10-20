import { getConfig } from '@/config'
import type { OpenAPIV3 } from 'openapi-types'
import { schemaAny } from './schema.any'
import { getPreferredSchema, getReferenceName, safeKey } from './utils'

export function componentsResponses(it: Record<string, OpenAPIV3.ReferenceObject | OpenAPIV3.ResponseObject>) {
  const { preferUnknownType } = getConfig()
  return `{
  ${Object.keys(it || {})
    .map(key => {
      const schema = it[key]
      if ('$ref' in schema) {
        return `${safeKey(key)} = ${getReferenceName(schema.$ref)}`
      }
      if (!schema.content) {
        return `${safeKey(key)} = ${preferUnknownType}`
      }
      const resp = getPreferredSchema(schema.content, ['200', '201'])
      return `${safeKey(key)}: ${resp?.schema ? schemaAny(resp, 4) : preferUnknownType}`
    })
    .join(',\n')}}`
}
