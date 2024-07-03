import { schemaAny } from './schema.any'
import { fixKey } from './utils'

export function componentsRequestBodies(it: any) {
  return Object.keys(it.requestBodies || {})
    .map(key => {
      const entity = it.requestBodies[key]
      const schema = entity.content['application/json'].schema
      return `export type ${fixKey(key)} = ${schemaAny(schema)} & BasicDto`
    })
    .join('\n\n')
}
