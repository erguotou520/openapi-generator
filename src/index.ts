import { isAbsolute, resolve } from 'node:path'
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
  // 将参数分割为带参数和不带参数的两组
  const args: Record<string, string | boolean> = {};
  const commands: string[] = [];

  for (let i = 0; i < _args.length; i++) {
    if (_args[i].startsWith('-')) {
      // 带参数的选项
      const key = _args[i].replace(/^-+/, '');
      if (i + 1 < _args.length && !_args[i + 1].startsWith('-')) {
        args[key] = _args[i + 1];
        i++; // 跳过下一个参数，因为它是当前选项的值
      } else {
        args[key] = true;
      }
    } else {
      // 不带参数的选项或命令
      commands.push(_args[i]);
    }
  }
  if (commands[0] === 'init') {
    await initConfigFile()
  } else if (commands[0] === 'generate') {
    let config: UserDefinedGenerateOptions | undefined
    // 检查是否通过 -f 参数指定了配置文件路径
    let configFilePath = args.f as string || configFileName;
    // 如果是相对路径，转换为绝对路径
    if (!isAbsolute(configFilePath)) {
      configFilePath = resolve(process.cwd(), configFilePath);
    }
    try {
      const mod = await import(configFilePath)
      config = mod.default || mod
    } catch (e) {
      console.error(`Please create the file ${configFilePath} first.`)
      process.exit(1)
    }
    if (!config?.specUrl) {
      console.error(`Please provide the OpenAPI spec URL in ${configFilePath}.`)
      process.exit(1)
    }
    const configWithDefaults = setConfig(config)
    if (!commands[1]) {
      console.warn('No generator specified, default to "typescript".')
    }
    const generator = (commands[1] || 'typescript') as SupportedGenerators
    if (!SUPPORTED_GENERATORS.includes(generator)) {
      console.error(`Unsupported generator: ${generator}. Supported generators: ${SUPPORTED_GENERATORS.join(', ')}.`)
      process.exit(1)
    }
    await generate(configWithDefaults, generator)
  } else {
    console.log(`Usage: o2t <command> [options]

Commands:
  init                  Initialize a new ${configFileName} file
  generate [generator]  Generate code based on an OpenAPI spec
`)
  }
}
