import type { GenerateOptions, UserDefinedGenerateOptions } from './types'

let config: GenerateOptions | undefined

export function setConfig(_config: UserDefinedGenerateOptions): GenerateOptions {
  config = Object.assign({
    outputDir: 'src/api',
    preferUnknownType: 'any',
    tempFilePath: 'node_modules/.o2t/openapi.json'
  } as Partial<UserDefinedGenerateOptions>, _config) as GenerateOptions
  return config
}

export function getConfig(): GenerateOptions {
  if (!config) {
    throw new Error('Config not set')
  }
  return config
}