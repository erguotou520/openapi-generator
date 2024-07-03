export function prettier(content: string): string {
  return content
    // 格式化空对象
    .replace(/\{\s+\}/g, '{}')
    // 格式化多空行
    .replace(/\n\s*\n+/g, '\n')
    // 删除所有属性的最后一个逗号
    .replace(/,\s*$/g, '')
    .replace(/,(\s*})/g, '$1')
}