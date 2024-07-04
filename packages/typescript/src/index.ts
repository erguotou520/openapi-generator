import { resolve } from 'node:path'
import { generate } from './core'
import type { GenerateOptions } from './types'
export type { GenerateOptions } from './types'

export function defineConfig(config: GenerateOptions) {
  return config
}

export async function run(_args: string[]) {
  let config: GenerateOptions | undefined
  try {
    const mod = await import(resolve(process.cwd(), 'o2t.config.js'))
    config = mod.default || mod
  } catch (e) {
    console.error('Please create a ota.config.js file first.')
    process.exit(1)
  }
  if (!config?.specUrl) {
    console.error('Please provide the OpenAPI spec URL in o2t.config.js.')
    process.exit(1)
  }
  await generate(config)
}
