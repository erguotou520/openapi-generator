import { resolve } from 'node:path'
import type { OpenAPIV3 } from 'openapi-types'
import { fetchOpenAPISchema } from './fetcher'
import { saveTextToFile } from './file'
import { prettier } from './prettier'
import { generateOpenAPISchemas } from './renders/schema'
import type { GenerateOptions } from './types'

export async function generate(options: GenerateOptions): Promise<void> {
  const schema = await fetchOpenAPISchema(options.specUrl, options)
  if (schema) {
    // 保存 schema 到文件
    saveTextToFile(options.tempFilePath || 'node_modules/.o2t/openapi.json', JSON.stringify(schema, null, 2))
    const components = schema.components ?? {}

    /**
     * 将parameters里的请求参数拆分成params和queryList
     * @param parameters openapi.parametes
     * @returns 路径参数集合与query参数集合
     */
    function extractParameters(parameters: (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[] = []) {
      const paramList: OpenAPIV3.ParameterObject[] = []
      const queryList: OpenAPIV3.ParameterObject[] = []
      for (const parameter of parameters) {
        let _parameter: OpenAPIV3.ParameterObject
        if ('$ref' in parameter) {
          const splited = parameter.$ref.split('/')
          const ref = components.parameters?.[splited[splited.length - 1]]
          _parameter = ref as OpenAPIV3.ParameterObject
        } else {
          _parameter = parameter
        }
        if (_parameter.in === 'path') {
          paramList.push(_parameter)
        } else if (_parameter.in === 'query') {
          queryList.push(_parameter)
        }
      }
      return { queryList, paramList }
    }

    // paths里的api按照method分组
    const paths = schema.paths ?? {}
    const apiGroups: Record<
      string,
      Record<
        string,
        OpenAPIV3.OperationObject & { queryList: OpenAPIV3.ParameterObject[]; paramList: OpenAPIV3.ParameterObject[] }
      >
    > = {}
    for (const [path, pathItem] of Object.entries(paths)) {
      if (pathItem) {
        for (const [method, operation] of Object.entries(pathItem)) {
          const _method = method.toLowerCase()
          apiGroups[_method] = apiGroups[_method] || {}
          // @ts-ignore
          apiGroups[_method][path] = operation
          const { queryList, paramList } = extractParameters(apiGroups[_method][path].parameters)
          apiGroups[_method][path].queryList = queryList
          apiGroups[_method][path].paramList = paramList
        }
      }
    }
    const output = generateOpenAPISchemas({ components, apiGroups })
    // 保存输出到文件
    await saveTextToFile(resolve(options.outputDir || 'src/api', 'schema.ts'), prettier(output))
  }
}
