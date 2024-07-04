type IsOptional<T> = Extract<T, undefined | null | any> extends never ? false : true

type RequiredKeys<T> = {
  [K in keyof T]-?: IsOptional<T[K]> extends true ? never : K
}[keyof T]

type HasRequiredFields<T> = RequiredKeys<T> extends never ? false : true

type ApiOptions = { query?: any; params?: any; body?: any }

type OptionsType<T extends ApiOptions> = {
  query: T['query'] extends never ? never : T['query']
  params: T['params'] extends never ? never : T['params']
  body: T['body'] extends never ? never : T['body']
}

type RequiredOptions<T extends ApiOptions> = {
  [K in keyof OptionsType<T> as HasRequiredFields<NonNullable<OptionsType<T>[K]>> extends true
    ? K
    : never]: NonNullable<OptionsType<T>[K]>
}

type OptionalOptions<T extends ApiOptions> = {
  [K in keyof OptionsType<T> as
    | (HasRequiredFields<NonNullable<OptionsType<T>[K]>> extends false ? K : never)
    | (OptionsType<T>[K] extends any ? K : never)]?: OptionsType<T>[K]
}

type MergedOptions<T extends ApiOptions> = RequiredOptions<T> & Partial<OptionalOptions<T>>

export type CreateFetchClientConfig = {
  /**
   * fetch 函数提供商，默认使用 globalThis.fetch
   */
  fetchImpl?: typeof globalThis.fetch,
  /**
   * 自定义query 序列化
   */
  querySerializer?: (query: any) => string
  /**
   * 请求前拦截器
   */
  requestInterceptor?: (request: Request) => Promise<Request | null | undefined>
  /**
   * 响应拦截器
   */
  responseInterceptor?: (request: Request, response: Response) => Promise<Response>
  /**
   * 如何从错误的响应中获取错误信息
   */
  errorMessageExtractor?: (response: Response) => string
}

export type ResponseType<T> = { error: true, message: string, response?: Response } | { error: false, data: T }

export function createFetchClient<
  OpenApis extends {
    [method: string]: {
      [path: string]: {
        query: any
        params: any
        body: any
        response: any
      }
    }
  }
>(config: CreateFetchClientConfig) {
  const fetchImpl = config.fetchImpl || globalThis.fetch

  function createMethod<M extends keyof OpenApis>(method: M) {
    return async <P extends keyof OpenApis[M]>(
      path: P,
      ...args: keyof MergedOptions<OpenApis[M][P]> extends never ? [] : [options: MergedOptions<OpenApis[M][P]>]
    ): Promise<ResponseType<OpenApis[M][P]['response']>> => {
      let url = path as string
      const options = args[0] || {}

      // Handle path parameters
      if ('params' in options && options.params) {
        for (const [key, value] of Object.entries(options.params)) {
          const v = encodeURIComponent(String(value))
          url = url.replace(`{${key}}`, v).replace(`:${key}`, v)
        }
      }

      // Handle query parameters
      if ('query' in options && options.query) {
        const queryString = config?.querySerializer?.(options.query) || new URLSearchParams(options.query as Record<string, string>).toString()
        url += `?${queryString}`
      }

      const request = new Request(url, {
        method: method as string,
        headers: {
          'Content-Type': 'application/json'
        },
        body: 'body' in options && options.body ? JSON.stringify(options.body) : undefined
      })

      if (config.requestInterceptor) {
        const changedRequest = await config.requestInterceptor(request)
        if (changedRequest) {
          Object.assign(request, changedRequest)
        }
      }
      try {
        let response = await fetchImpl(request)
        if (config.responseInterceptor) {
          response = await config.responseInterceptor(request, response)
        }
        if (!response.ok) {
          return { error: true, message: config.errorMessageExtractor?.(response) || response.statusText, response }
        }
        const contentType = response.headers.get('content-type')
        if (contentType?.includes('application/json')) {
          return { error: false, data: await response.json() }
        }
        if (contentType?.includes('text/plain')) {
          return { error: false, data: await response.text() }
        }
        return { error: false, data: response }
      } catch (error) {
        return { error: true, message: (error as Error).message }
      }
    }
  }

  return {
    get: createMethod('get'),
    post: createMethod('post'),
    put: createMethod('put'),
    delete: createMethod('delete'),
    patch: createMethod('patch')
  }
}