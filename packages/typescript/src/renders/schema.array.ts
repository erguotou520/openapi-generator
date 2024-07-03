import type { OpenAPIV3 } from 'openapi-types'
import { schemaAny } from './schema.any'
import { schemaComment } from './schema.comment'

export function schemaArray(it: OpenAPIV3.ArraySchemaObject) {
  const arrayType = `${schemaAny(it.items || [])}[]`
  return `${schemaComment(it)}${arrayType}`
}
