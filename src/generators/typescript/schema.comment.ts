import type { OpenAPIV3 } from 'openapi-types'
import { generateSpace } from './utils'

export function schemaComment(it: OpenAPIV3.SchemaObject, spacePrefix = 0) {
  if (it.title || it.example || it.description || it.enum || it.default !== undefined) {
    let comment = '/**\n'

    if (it.title) {
      comment += `${generateSpace(spacePrefix + 1)}* ${it.title}\n`
    }

    if (it.description) {
      comment += `${generateSpace(spacePrefix + 1)}* @description ${it.description}\n`
    }

    if (it.example) {
      comment += `${generateSpace(spacePrefix + 1)}* @example ${it.example}\n`
    }

    if (it.enum) {
      comment += `${generateSpace(spacePrefix + 1)}* @enum ${it.enum}\n`
    }

    if (it.default !== undefined) {
      comment += `${generateSpace(spacePrefix + 1)}* @default ${it.default}\n`
    }

    comment += `${generateSpace(spacePrefix + 1)}*/\n`
    return comment
  }
  return ''
}
