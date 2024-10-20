import { OpenAPIV3 } from 'openapi-types'

/**
 * 修复key中一些错误的字符，兼容特殊的API场景
 * @param key 对象的键
 */
export function fixKey(key: string) {
  return key.replace(/[.]/g, '_')
}

/**
 * 去掉字符串中所有空格
 * @param str 字符串
 * @returns 去掉空格后的字符串
 */
export function trimKey(str: string) {
  const config = { trim: true }
  if (config.trim) {
    return str.replace(/ /g, '')
  }
  return str
}

export function generateSpace(count: number) {
  return new Array(count).fill(' ').join('')
}

export function getReferenceName($ref: string) {
  const parts = $ref.split('/')
  const category = parts[parts.length - 2]
  let last = parts[parts.length - 1]
  if (last.match(/(%[A-Z0-9]{2})/g)) {
    last = decodeURIComponent(last)
  }
  return `OpenAPIComponents['${category}']['${last}']`
}

export function getPreferredSchema<T>(schema: Record<string, T>, preferred?: string[]) {
  const keys = Object.keys(schema)
  if (!keys.length) {
    return null
  }
  // 优先按照 preferred 顺序查找
  if (preferred?.length) {
    for (const key of preferred) {
      if (schema[key]) {
        return schema[key]
      }
    }
  }
  return schema[keys[0]]
}

// 检查key是否需要加引号
export function safeKey(key: string) {
  if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
    return key
  }
  return `'${key}'`
}
