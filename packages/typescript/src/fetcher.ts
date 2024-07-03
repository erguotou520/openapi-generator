import type { OpenAPIV3 } from 'openapi-types'
// import ora from 'ora'
import swaggerConvert from 'swagger2openapi'
import type { GenerateOptions } from './types'

export async function fetchOpenAPISchema(url: string, options: GenerateOptions) {
  // const spinner = ora('Fetching OpenAPI schema').start()
  const { customHeaders, basicAuth, isVersion2 } = options
  try {
    const response = await fetch(url, {
      headers: {
        ...customHeaders,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(basicAuth
          ? {
              Authorization: `Basic ${btoa(`${basicAuth.username}:${basicAuth.password}`)}`
            }
          : {})
      }
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch OpenAPI schema: ${response.status} ${response.statusText}`)
    }
    // 保存到文件
    const schema = await response.json()
    if (isVersion2 || ('swagger' in schema && schema.swagger === '2.0')) {
      const ret = await new Promise((resolve, reject) => {
        swaggerConvert.convertObj(schema, { patch: true, warnOnly: true }, (error, options) => {
          if (error) {
            reject(error)
          } else {
            resolve(options.openapi)
          }
        })
      })
      return ret as OpenAPIV3.Document
    }
    return schema as OpenAPIV3.Document
  } catch (error) {
    // spinner.fail((error as Error).message)
    console.log(error)
    return null
  } finally {
    // spinner.stop()
  }
}
