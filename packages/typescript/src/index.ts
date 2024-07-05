import { resolve } from 'node:path'
import { configFileName, generate } from './core'
export { generate } from './core'
import { initConfigFile } from './init'
import type { GenerateOptions } from './types'
export type { GenerateOptions } from './types'

export function defineConfig(config: GenerateOptions): GenerateOptions {
  return config
}

export async function run(_args: string[]): Promise<void> {
  if (_args[0] === 'init') {
    await initConfigFile()
  } else {
    let config: GenerateOptions | undefined
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
    await generate(config)
  }
}
