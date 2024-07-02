export type OpenAPISchemas = {
  get: {
        '/health': {
      query: {
        },
      params: {
        },
      response: ''
    },
        '/api/notary/': {
      query: {
        },
      params: {
        },
      response: ''
    },
        '/api/notary/detail/{id}': {
      query: {
        },
      params: {
        'id': string,
      },
      response: ''
    },
        '/api/s3/presignedUrl': {
      query: {
        'fileName': string,
      },
      params: {
        },
      response: ''
    },
        '/api/s3/viewUrl': {
      query: {
        'fileName': string,
      },
      params: {
        },
      response: ''
    },
        '/api/s3/templates': {
      query: {
        },
      params: {
        },
      response: ''
    },
        '/api/me': {
      query: {
        },
      params: {
        },
      response: ''
    },
    },
  post: {
        '/api/auth/login': {
      query: {
        },
      params: {
        },
      response: ''
    },
        '/api/notary/': {
      query: {
        },
      params: {
        },
      response: ''
    },
        '/api/notary/parse-variables/{id}': {
      query: {
        },
      params: {
        'id': string,
      },
      response: ''
    },
        '/api/notary/generate-word/{id}': {
      query: {
        },
      params: {
        'id': string,
      },
      response: ''
    },
        '/api/tingwu/callback': {
      query: {
        },
      params: {
        },
      response: ''
    },
    },
  delete: {
        '/api/notary/remove/{id}': {
      query: {
        },
      params: {
        'id': string,
      },
      response: ''
    },
    },
  }
