import { schemaObject } from './schema.object'
import { fixKey } from './utils'

export function componentsResponses(it: any) {
  return Object.keys(it.responses || {})
    .map(key => {
      const schema = it.responses[key]
      const resp = schema.content['200'] || schema.content['201']
      if (resp?.schema) {
        return Object.keys(resp.schema || {})
          .map(schemaKey => {
            const schema = resp.schema[schemaKey]
            if ('$ref' in schema) {
              return `export interface ${fixKey(schemaKey)} extends BasicDto = ${schema.$ref}`
            }
            return `export interface ${fixKey(schemaKey)} extends BasicDto ${schemaObject({ obj: schema })}`
          })
          .join('\n\n')
      }
      return 'any'
    })
    .join('\n\n')
}
