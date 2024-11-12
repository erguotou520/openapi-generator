import { getConfig } from '@/config'

export function schemaPrimitive(it: { type: string; format?: string; const?: any }) {
  const { preferUnknownType } = getConfig()
  if (['number', 'integer'].includes(it.type)) {
    if (it.const) {
      return it.const
    }
    return 'number'
  }
  if (it.type === 'boolean') {
    if (it.const) {
      return it.const
    }
    return 'boolean'
  }
  if (it.type === 'string') {
    if (it.const) {
      return `'${it.const}'`
    }
    return it.format === 'binary' ? 'File' : 'string'
  }
  return preferUnknownType
}
