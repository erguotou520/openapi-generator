import { resolve } from 'node:path'
import { configFileName, generate } from './core'
export { generate } from './core'
import { setConfig } from './config'
import { initConfigFile } from './init'
import { SUPPORTED_GENERATORS, type SupportedGenerators, type UserDefinedGenerateOptions } from './types'
export type { UserDefinedGenerateOptions as GenerateOptions } from './types'

export function defineConfig(config: UserDefinedGenerateOptions): UserDefinedGenerateOptions {
  return config
}

export async function run(_args: string[]): Promise<void> {
  if (_args[0] === 'init') {
    await initConfigFile()
  } else if (_args[0] === 'generate') {
    let config: UserDefinedGenerateOptions | undefined
    try {
      const mod = await import(resolve(process.cwd(), configFileName))
      config = mod.default || mod
    } catch (e) {
      console.error(`Please create a ${configFileName} file first.`)
      process.exit(1)
    }
    if (!config?.specUrl) {
      console.error(`Please provide the OpenAPI spec URL in ${configFileName}.`)
      process.exit(1)
    }
    const configWithDefaults = setConfig(config)
    const generator = (_args[1] || 'typescript') as SupportedGenerators
    if (!SUPPORTED_GENERATORS.includes(generator)) {
      console.error(`Unsupported generator: ${generator}. Supported generators: ${SUPPORTED_GENERATORS.join(', ')}.`)
      process.exit(1)
    }
    await generate(configWithDefaults, generator)
  }
}
