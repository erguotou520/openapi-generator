type MakeRequired<T, K extends keyof T> = {
  [P in K]-?: T[P]
} & Omit<T, K>

export type UserDefinedGenerateOptions = {
  specUrl: string
  isVersion2?: boolean
  outputDir?: string
  tempFilePath?: string
  /**
   * 对于不能解析的类型，更倾向于使用any还是unknown，默认为any
   */
  preferUnknownType?: 'any' | 'unknown'
  customHeaders?: Record<string, string>
  basicAuth?: {
    username: string
    password: string
  }
}

export type GenerateOptions = MakeRequired<
  UserDefinedGenerateOptions,
  'outputDir' | 'tempFilePath' | 'preferUnknownType'
>
