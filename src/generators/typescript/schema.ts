import { getConfig } from '@/config'
import type { GenerateSchemaOptions } from '@/types'
import type { OpenAPIV3 } from 'openapi-types'
import { componentsRequestBodies } from './components.requestBodies'
import { componentsResponses } from './components.responses'
import { componentsSchemas } from './components.schemas'
import { schemaAny } from './schema.any'
import { schemaComment } from './schema.comment'
import { generateSpace, getPreferredSchema, safeKey } from './utils'

export function generateOpenAPISchemas(it: GenerateSchemaOptions) {
  return `export type OpenAPIComponents = {
  schemas: ${it.components.schemas ? componentsSchemas(it.components.schemas) : 'never'},
  responses: ${it.components.responses ? componentsResponses(it.components.responses) : 'never'},
  // parameters: {},
  // headers: {},
  requestBodies: ${it.components.requestBodies ? componentsRequestBodies(it.components.requestBodies) : 'never'}
}
  
export type OpenAPIs = {
  ${Object.keys(it.apiGroups || {})
    .map(
      method => `
  ${method}: {${Object.keys(it.apiGroups[method] || {})
    .map(path => {
      const { preferUnknownType } = getConfig()
      const { queryList, paramList, requestBody, responses, description, summary } = it.apiGroups[method][path]
      let body: null | OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject = null
      if (requestBody) {
        if ('$ref' in requestBody) {
          body = requestBody
        } else {
          // application/json form-data/multipart wwww-form-urlencoded
          body = getPreferredSchema(requestBody.content)?.schema || null
        }
      }
      // 200 201
      const resp = getPreferredSchema(responses, ['200', '201'])
      let responseContent: null | string | OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject = null
      if (resp) {
        if ('$ref' in resp) {
          responseContent = resp
        } else {
          if (resp.content) {
            // application/json */*
            const _schema = getPreferredSchema(resp.content)
            if (_schema?.schema) {
              responseContent = _schema.schema
            }
          }
        }
      }
      return `
    ${summary || description ? `${schemaComment({ title: summary, description }, 4)}${generateSpace(4)}` : ''}'${path}': {
      query: ${
        queryList.length > 0
          ? `{
        ${queryList
          .map(
            query =>
              `${safeKey(query.name)}${!query.required ? '?' : ''}: ${query.schema ? schemaAny(query.schema, 8) : preferUnknownType},`
          )
          .join(`\n${generateSpace(8)}`)}
      }`
          : 'never'
      },
      params: ${
        paramList.length > 0
          ? `{
        ${paramList
          .map(
            param =>
              `${safeKey(param.name)}${!param.required ? '?' : ''}: ${param.schema ? schemaAny(param.schema, 8) : preferUnknownType},`
          )
          .join(`\n${generateSpace(8)}`)}
      }`
          : 'never'
      },
      body: ${body ? schemaAny(body, 6) : 'never'},
      response: ${responseContent ? schemaAny(responseContent, 6) : preferUnknownType}
    },`
    })
    .join('')}
  },`
    )
    .join('')}
}`
}
