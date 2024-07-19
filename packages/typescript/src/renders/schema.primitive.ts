import { getConfig } from '@/config'

export function schemaPrimitive(it: { type: string; format?: string }) {
  const { preferUnknownType } = getConfig()
  if (['number', 'integer'].includes(it.type)) {
    return 'number'
  }
  if (it.type === 'boolean') {
    return 'boolean'
  }
  if (it.type === 'string') {
    return it.format === 'binary' ? 'File' : 'string'
  }
  return preferUnknownType
}
