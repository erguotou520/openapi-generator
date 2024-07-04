import type { OpenAPIV3 } from 'openapi-types'
import { schemaArray } from './schema.array'
import { schemaObject } from './schema.object'
import { schemaPrimitive } from './schema.primitive'
import { schemaRef } from './schema.ref'

export function schemaAny(
  it: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | OpenAPIV3.BaseSchemaObject,
  spacePrefix = 0
): string {
  if (('oneOf' in it && it.oneOf) || ('anyOf' in it && it.anyOf)) {
    const list = (it.oneOf || it.anyOf) as (OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject)[]
    return `(${list.map(item => schemaAny(item, spacePrefix)).join(' | ')})`
  }
  if ('allOf' in it && it.allOf) {
    return `(${(it.allOf as (OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject)[])
      .map((item: any) => schemaAny(item, spacePrefix))
      .join(' & ')})`
  }
  if ('$ref' in it) {
    return schemaRef({ ref: it.$ref })
  }
  if ('type' in it && it.type) {
    if (['string', 'number', 'integer', 'boolean'].includes(it.type)) {
      return schemaPrimitive({ type: it.type, format: it.format })
    }
    if (it.type === 'array' || ('items' in it && it.items)) {
      return schemaArray({ type: 'array', items: it.items || [] }, spacePrefix)
    }
    if (it.type === 'object' || it.properties) {
      return schemaObject(it, spacePrefix)
    }
  }
  return 'unknown'
}
