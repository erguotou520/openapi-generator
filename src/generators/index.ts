import type { GenerateSchemaOptions, SupportedGenerators } from '@/types'
import { generateOpenAPISchemas as generateTypescriptOpenAPISchemas } from './typescript/schema'

export function generateSchemas(spec: GenerateSchemaOptions, generator: SupportedGenerators): [string, string] {
  if (generator === 'typescript') {
    return [generateTypescriptOpenAPISchemas(spec), 'schema.ts']
  }
  throw new Error(`Unsupported generator: ${generator}`)
}
