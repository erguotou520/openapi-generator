import type { OpenAPIV3 } from 'openapi-types'
import { schemaAny } from './schema.any'

export function generateOpenAPISchemas(it: {
  components: OpenAPIV3.ComponentsObject
  apiGroups: Record<
    string,
    Record<
      string,
      OpenAPIV3.OperationObject & { queryList: OpenAPIV3.ParameterObject[]; paramList: OpenAPIV3.ParameterObject[] }
    >
  >
}) {
  return `export type OpenAPISchemas = {
  ${Object.keys(it.apiGroups || {})
    .map(
      method => `
  ${method}: {${Object.keys(it.apiGroups[method] || {})
    .map(path => {
      const { queryList, paramList, requestBody, responses } = it.apiGroups[method][path]
      let body: null | string | OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject = null
      if (requestBody) {
        if ('$ref' in requestBody) {
          body = requestBody.$ref
        } else {
          body =
            requestBody.content['application/json']?.schema ||
            requestBody.content['multipart/form-data']?.schema ||
            null
        }
      }
      const resp = responses['200'] || responses['201']
      let responseContent: null | string | OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject = null
      if (resp) {
        if ('$ref' in resp) {
          responseContent = resp.$ref
        } else {
          responseContent = resp.content?.['application/json']?.schema || resp.content?.['*/*']?.schema || null
        }
      }
      return `
    '${path}': {
      query: ${
        queryList.length > 0
          ? `{
        ${queryList
          .map(
            query =>
              `'${query.name}'${!query.required ? '?' : ''}: ${query.schema ? schemaAny(query.schema) : 'unknown'},`
          )
          .join('')}
      }`
          : 'never'
      },
      params: ${
        paramList.length > 0
          ? `{
        ${paramList
          .map(
            param =>
              `'${param.name}'${!param.required ? '?' : ''}: ${param.schema ? schemaAny(param.schema) : 'unknown'},`
          )
          .join('')}
      }`
          : 'never'
      },
      body: ${body ? schemaAny(body) : 'never'},
      response: ${responseContent ? schemaAny(responseContent) : 'unknown'}
    },`
    })
    .join('')}
  },`
    )
    .join('')}
}`
}
