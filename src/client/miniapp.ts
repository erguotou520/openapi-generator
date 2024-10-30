import type {
  CommonHeaders,
  ExternalOptions,
  HasAnyRequiredOption,
  MergedOptions,
  PromiseOr,
  ResponseType
} from './share'
import { queryStringify, urlJoin } from './utils'

export type GeneralCallbackArguments = { errMsg: string }

export type RequestTask<TData = any> = GeneralCallbackArguments & {
  data: TData
  header: CommonHeaders
  statusCode: number
  cookies?: string[]
  errMsg: string
  [key: string]: any
}

export type OnChunkReceivedCallback = (result: { data: ArrayBuffer } | { res: { data: ArrayBuffer } }) => void

export type RequestOptions<TData = any, U = any> = {
  url: string
  data?: U
  header?: CommonHeaders
  timeout?: number
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'TRACE' | 'CONNECT'
  dataType?: 'json' | 'text' | 'base64' | 'arraybuffer'
  responseType?: 'text' | 'arraybuffer'
  success?: (result: RequestTask<TData>) => void
  fail?: (result: GeneralCallbackArguments) => void
  complete?: (result: RequestTask<TData> | GeneralCallbackArguments) => void
}

export type RequestImpl<TData = any, U = any> = (option: RequestOptions<TData, U>) => Promise<RequestTask<TData>> & {
  abort: () => void
  onChunkReceived: (cb: OnChunkReceivedCallback) => void
  offChunkReceived: (cb: OnChunkReceivedCallback) => void
}

export type RequestInterceptor = (request: RequestOptions) => PromiseOr<RequestOptions | null | undefined>

export type ResponseInterceptor = (
  request: RequestOptions,
  response: RequestTask
) => PromiseOr<RequestTask | null | undefined>

export type ErrorHandler = (
  request: RequestOptions,
  response: RequestTask | GeneralCallbackArguments | null,
  error: Error | null
) => void

export type CreateMiniappClientConfig<UserRequestImpl extends RequestImpl> = {
  /**
   * fetch provider, default to globalThis.fetch
   */
  requestImpl?: UserRequestImpl
  /**
   * base URL
   */
  baseURL?: string
  /**
   * custom query serializer
   */
  querySerializer?: (query: any) => string
  /**
   * request timeout in milliseconds, default to 0 (no timeout)
   */
  requestTimeoutMs?: number
  /**
   * request interceptor
   */
  requestInterceptor?: RequestInterceptor
  /**
   * response interceptor
   */
  responseInterceptor?: ResponseInterceptor
  /**
   * custom error handler, default to console.error
   */
  errorHandler?: ErrorHandler
}

export function createMiniappClient<
  OpenApis extends {
    [method: string]: {
      [path: string]: {
        query: any
        params: any
        body: any
        headers?: any
        response: any
      }
    }
  },
  UserRequestImpl extends RequestImpl = RequestImpl
>(config: CreateMiniappClientConfig<UserRequestImpl> = {}) {
  // @ts-ignore
  const requestImpl: UserRequestImpl = config.requestImpl || wx.request

  function createMethod<M extends keyof OpenApis>(method: M) {
    return async <P extends keyof OpenApis[M]>(
      path: P,
      ...args: HasAnyRequiredOption<OpenApis[M][P]> extends true
        ? [options: MergedOptions<OpenApis[M][P]> & ExternalOptions]
        : [options?: MergedOptions<OpenApis[M][P]> & ExternalOptions]
    ): Promise<ResponseType<OpenApis[M][P]['response'], RequestTask>> => {
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
        const queryString = config?.querySerializer?.(options.query) || queryStringify(options.query)
        url += `?${queryString}`
      }

      // body
      let contentType: string | undefined

      let requestOptions: RequestOptions = {
        url,
        method: method as RequestOptions['method'],
        header: contentType ? { 'Content-Type': contentType } : {},
        data: (method as string).toLowerCase() === 'get' ? undefined : (options as any)?.body,
        timeout: (options as ExternalOptions).timeoutMs ?? config.requestTimeoutMs,
        ...(typeof window !== 'undefined' ? ({ credentials: 'include', mode: 'cors' } as Partial<RequestOptions>) : {})
      }

      if (config.requestInterceptor) {
        const changedRequest = await config.requestInterceptor(requestOptions)
        if (changedRequest) {
          // merge request
          requestOptions = changedRequest
        }
      }
      try {
        return new Promise(async resolve => {
          requestOptions.success = async result => {
            let response = result
            if (config.responseInterceptor) {
              try {
                const changedResponse = await config.responseInterceptor(requestOptions, result)
                if (changedResponse) {
                  response = changedResponse
                }
              } catch (error) {
                config.errorHandler?.(requestOptions, response, error as Error)
                resolve({ error: true, response, data: null })
                return
              }
            }
            resolve({ error: false, data: response.data })
            return
          }
          requestOptions.fail = result => {
            config.errorHandler?.(requestOptions, result, null)
            resolve({ error: true, data: null })
          }
          if (config.baseURL) {
            requestOptions.url = urlJoin(config.baseURL, requestOptions.url)
          }
          requestImpl(requestOptions)
        })
      } catch (error) {
        ;(config.errorHandler || console.error)(requestOptions, null, error as Error)
        return { error: true, data: null }
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
