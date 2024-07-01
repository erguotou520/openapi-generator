export type OpenAPISchemas = {
  get: {
    '/health': {
      queries: {
        },
      response: {
        
      }
    },
    '/api/notary/': {
      queries: {
        },
      response: {
        
      }
    },
    '/api/notary/detail/{id}': {
      queries: {
        },
      response: {
        
      }
    },
    '/api/s3/presignedUrl': {
      queries: {
        'fileName': string,
      },
      response: {
        
      }
    },
    '/api/s3/viewUrl': {
      queries: {
        'fileName': string,
      },
      response: {
        
      }
    },
    '/api/s3/templates': {
      queries: {
        },
      response: {
        
      }
    },
    '/api/me': {
      queries: {
        },
      response: {
        
      }
    },
    },
  post: {
    '/api/auth/login': {
      queries: {
        },
      response: {
        
      }
    },
    '/api/notary/': {
      queries: {
        },
      response: {
        
      }
    },
    '/api/notary/parse-variables/{id}': {
      queries: {
        },
      response: {
        
      }
    },
    '/api/notary/generate-word/{id}': {
      queries: {
        },
      response: {
        
      }
    },
    '/api/tingwu/callback': {
      queries: {
        },
      response: {
        
      }
    },
    },
  delete: {
    '/api/notary/remove/{id}': {
      queries: {
        },
      response: {
        
      }
    },
    },
  }
