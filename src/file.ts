import { mkdir, stat, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

export async function saveTextToFile(filePath: string, content: string) {
  // 如果文件不存在，则递归创建目录和文件
  const dir = dirname(filePath)
  if (!(await stat(dir).catch(() => false))) {
    await mkdir(dir, { recursive: true })
  }
  return writeFile(filePath, content, 'utf8')
}
