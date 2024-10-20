import type { OpenAPIV3 } from 'openapi-types'
import { schemaAny } from './schema.any'
import { schemaComment } from './schema.comment'
import { generateSpace, safeKey } from './utils'

export function schemaObject(obj: OpenAPIV3.NonArraySchemaObject, spacePrefix = 0) {
  return `{
${Object.keys(obj.properties || {})
  .map(key => {
    const item = obj.properties![key]
    const isOptional = 'required' in item || !(obj.required || []).includes(key)
    // 注释
    // key: type
    return `${'$ref' in item ? '' : `${generateSpace(spacePrefix + 2)}${schemaComment(item, spacePrefix + 2)}\n`}${generateSpace(spacePrefix + 2)}${
      safeKey(key)
    }${isOptional ? '?' : ''}: ${schemaAny(item, spacePrefix + 2)},`
  })
  .join('\n')}
${generateSpace(spacePrefix)}}`
}
