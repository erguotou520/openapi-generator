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