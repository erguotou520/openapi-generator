import type { OpenAPIV3 } from 'openapi-types'

type MakeRequired<T, K extends keyof T> = {
  [P in K]-?: T[P]
} & Omit<T, K>

export type UserDefinedGenerateOptions = {
  /**
   * The URL of the OpenAPI specification file.
   */
  specUrl: string
  /**
   * Whether the OpenAPI specification is swagger version 2, you may not need to set this property as the generator will automatically detect the version of the specification.
   */
  isVersion2?: boolean
  /**
   * The directory where the generated code will be saved. (default: "src/api").
   */
  outputDir?: string
  /**
   * The path of the temporary file used to store the downloaded OpenAPI specification file. (default: "node_modules/.o2t/openapi.json").
   */
  tempFilePath?: string
  /**
   * When the type is unknown, whether to use "any" or "unknown" type. (default: "any").
   */
  preferUnknownType?: 'any' | 'unknown'
  /**
   * Custom headers to be added to fetch the OpenAPI specification file. For example, you may need to add a token or a cookie to access the file.
   */
  customHeaders?: Record<string, string>
  /**
   * Basic authentication information to be added to fetch the OpenAPI specification file. For example, you may need to access a private API that requires authentication.
   */
  basicAuth?: {
    username: string
    password: string
  }
}

export type GenerateOptions = MakeRequired<
  UserDefinedGenerateOptions,
  'outputDir' | 'tempFilePath' | 'preferUnknownType'
>

export type GenerateSchemaOptions = {
  components: OpenAPIV3.ComponentsObject
  apiGroups: Record<
    string,
    Record<
      string,
      OpenAPIV3.OperationObject & { queryList: OpenAPIV3.ParameterObject[]; paramList: OpenAPIV3.ParameterObject[]; headerList: OpenAPIV3.ParameterObject[] }
    >
  >
}

export const SUPPORTED_GENERATORS = ['typescript'] as const
export type SupportedGenerators = typeof SUPPORTED_GENERATORS[number]
