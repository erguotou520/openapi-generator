import type { OpenAPIV3 } from 'openapi-types'
import { schemaArray } from './schema.array'
import { schemaObject } from './schema.object'
import { schemaPrimitive } from './schema.primitive'
import { schemaRef } from './schema.ref'

export function schemaAny(it: string | OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | OpenAPIV3.BaseSchemaObject): string {
  if (it.oneOf || it.anyOf) {
    const list = it.oneOf || it.anyOf
    return `(${list.map((item: any) => schemaAny(item)).join(' | ')})`
  }
  if (it.allOf) {
    return `(${it.allOf.map((item: any) => schemaAny(item)).join(' & ')})`
  }
  if ('$ref' in it) {
    return schemaRef({ ref: it.$ref })
  }
  if (['string', 'number', 'integer', 'boolean'].includes(it.type)) {
    return schemaPrimitive(it)
  }
  if (it.type === 'array' || it.items) {
    return schemaArray(it)
  }
  if (it.type === 'object' || it.properties) {
    return schemaObject({ obj: it })
  }
  return 'any'
}
