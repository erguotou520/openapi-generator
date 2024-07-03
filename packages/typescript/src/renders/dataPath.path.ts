export function dataPathPath(it: any) {
  if (it.dataPath) {
    return it.dataPath.map((path: string) => `['${path}']`).join('');
  }
  return '';
}