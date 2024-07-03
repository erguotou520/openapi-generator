export function dataPathExtend(it: any) {
  if (it.dataPath) {
    return ` extends {
      ${it.dataPath
        .map((path: string, index: number) => `${path}?: ${index !== it.dataPath.length - 1 ? '{' : 'any'}`)
        .join('\n')}
      ${'}'.repeat(it.dataPath.length)}
    `
  }
  return ''
}
