export type PromiseOr<T> = T | Promise<T>

type HasRequiredFields<T> = keyof T extends never // Check if the type has no keys (empty object case)
  ? false
  : { [K in keyof T]-?: {} extends Pick<T, K> ? false : true }[keyof T] extends false
    ? false
    : true

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
  [K in keyof OptionsType<T> as HasRequiredFields<NonNullable<OptionsType<T>[K]>> extends false
    ? K
    : never]?: OptionsType<T>[K]
}

type MergedOptions<T extends ApiOptions> = RequiredOptions<T> & Partial<OptionalOptions<T>>

type HasAnyRequiredOption<T extends ApiOptions> = [keyof RequiredOptions<T>] extends [never] ? false : true

export type CreateFetchClientConfig = {
  /**
   * fetch provider, default to globalThis.fetch
   */
  fetchImpl?: typeof globalThis.fetch
  /**
   * custom query serializer, default to URLSearchParams.toString()
   */
  querySerializer?: (query: any) => string
  /**
   * request interceptor
   */
  requestInterceptor?: (request: Request) => PromiseOr<Request | null | undefined>
  /**
   * response interceptor
   */
  responseInterceptor?: (request: Request, response: Response) => PromiseOr<Response>
  /**
   * how to get error message from response, default to response.statusText
   */
  errorMessageExtractor?: (response: Response) => string
  /**
   * custom error message handler, default to console.error
   */
  errorHandler?: (message: string, response: Response | null, error: Error | null) => void
}

export type ResponseType<T> =
  | { error: true; message: string; response?: Response; data: null }
  | { error: false; data: T }

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
>(config: CreateFetchClientConfig = {}) {
  const fetchImpl = config.fetchImpl || globalThis.fetch

  function createMethod<M extends keyof OpenApis>(method: M) {
    return async <P extends keyof OpenApis[M]>(
      path: P,
      ...args: HasAnyRequiredOption<OpenApis[M][P]> extends true
        ? [options: MergedOptions<OpenApis[M][P]>]
        : [options?: MergedOptions<OpenApis[M][P]>]
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
        const queryString =
          config?.querySerializer?.(options.query) ||
          new URLSearchParams(options.query as Record<string, string>).toString()
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
          const message = config.errorMessageExtractor?.(response) || response.statusText
          config.errorHandler?.(message, response, null)
          return { error: true, message, response, data: null }
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
        const message = (error as Error).message
        config.errorHandler?.(message, null, error as Error)
        return { error: true, message, data: null }
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
