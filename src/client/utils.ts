// qs
export function queryStringify(obj: { [key: string]: any }): string {
  return Object.keys(obj)
    .reduce<string[]>((arr, key) => {
      const value = obj[key]
      if (value !== null && value !== undefined && value !== '') {
        // 数组使用逗号拼接
        if (Array.isArray(value)) {
          if (value.length) {
            arr.push(`${encodeURIComponent(key)}=${encodeURIComponent(value.join(','))}`)
          }
        } else {
          arr.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        }
      }
      return arr
    }, [])
    .join('&')
}

// url path join
export function urlJoin(...paths: string[]) {
  return paths.map(path => path.replace(/\/+$/, '')).join('/')
}