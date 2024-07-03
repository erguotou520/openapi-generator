import { schemaObject } from './schema.object'
import { schemaRef } from './schema.ref'
import { fixKey } from './utils'

export function componentsSchemas(it: any) {
  return Object.keys(it.schemas || {})
    .map(key => {
      const schema = it.schemas[key]
      let schemaDefinition

      if ('$ref' in schema) {
        schemaDefinition = schemaRef({ ref: schema.$ref })
      } else {
        schemaDefinition = schemaObject({ obj: schema })
      }

      return `export type ${fixKey(key)} = ${schemaDefinition} & BasicDto`
    })
    .join('\n\n')
}
