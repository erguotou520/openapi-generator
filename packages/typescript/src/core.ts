import { resolve } from 'node:path'
import { Eta } from 'eta'
import { fetchOpenAPISchema } from './fetcher'
import { saveTextToFile } from './file'
import type { GenerateOptions } from './types'

const eta = new Eta({ rmWhitespace: true })

export async function generate(options: GenerateOptions): Promise<void> {
  const schema = await fetchOpenAPISchema(options.specUrl, options)
  if (schema) {
    // 保存 schema 到文件
    saveTextToFile(options.tempFilePath || 'node_modules/.o2t/openapi.json', JSON.stringify(schema, null, 2))
    // 模板输出
    const output = await eta.renderAsync(resolve(__dirname, 'templates/schema.eta.ts'), {
  
    })
    // 保存输出到文件
    await saveTextToFile(resolve(options.outputDir || 'src/api', 'schema.ts'), output)
  }
}
