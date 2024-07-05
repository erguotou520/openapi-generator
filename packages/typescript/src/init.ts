import { stat, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { configFileName } from './core'

export async function initConfigFile() {
  const configFilePath = resolve(process.cwd(), configFileName)
  // 配置文件是否存在
  if (await stat(configFilePath).catch(() => false)) {
    console.warn(`Config file ${configFilePath} already exists, skipping initialization.`)
  } else {
    await writeFile(configFilePath, `import { defineConfig } from '@doremijs/o2t'
export default defineConfig({
  // TODO: Replace your OpenAPI spec URL
  specUrl: 'https://petstore.swagger.io/v2/swagger.json',
})`)
  }
}