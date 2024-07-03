export type OpenAPISchemas = {
  get: {
    '/health': {
      query: never,
      params: never,
      body: never,
      response: unknown
    },
    '/api/notary/': {
      query: never,
      params: never,
      body: never,
      response: unknown
    },
    '/api/notary/detail/{id}': {
      query: never,
      params: {
        'id': string
      },
      body: never,
      response: unknown
    },
    '/api/s3/presignedUrl': {
      query: {
        'fileName': string
      },
      params: never,
      body: never,
      response: unknown
    },
    '/api/s3/viewUrl': {
      query: {
        'fileName': string
      },
      params: never,
      body: never,
      response: unknown
    },
    '/api/s3/templates': {
      query: never,
      params: never,
      body: never,
      response: unknown
    },
    '/api/me': {
      query: never,
      params: never,
      body: never,
      response: unknown
    }
  },
  post: {
    '/api/auth/login': {
      query: never,
      params: never,
      body: {
        username: string,
        password: string
      },
      response: unknown
    },
    '/api/notary/': {
      query: never,
      params: never,
      body: {
        no: string,
        category: (string | string | string),
        notary: string,
        date?: (any | any),
        location?: (string | any),
        startTime?: (any | any),
        endTime?: (any | any),
        audioUrl?: (string | any),
        fileUrl: string
      },
      response: unknown
    },
    '/api/notary/parse-variables/{id}': {
      query: never,
      params: {
        'id': string
      },
      body: never,
      response: unknown
    },
    '/api/notary/generate-word/{id}': {
      query: never,
      params: {
        'id': string
      },
      body: never,
      response: unknown
    },
    '/api/tingwu/callback': {
      query: never,
      params: never,
      body: {
        Code: string,
        Data?: {
        Test: string
      },
        Message: string,
        RequestId: string
      },
      response: unknown
    }
  },
  delete: {
    '/api/notary/remove/{id}': {
      query: never,
      params: {
        'id': string
      },
      body: never,
      response: unknown
    }
  }
}