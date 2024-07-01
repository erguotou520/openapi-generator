export type GenerateOptions = {
  specUrl: string;
  isVersion2?: boolean,
  outputDir?: string;
  tempFilePath?: string;
  customHeaders?: Record<string, string>,
  basicAuth?: {
    username: string,
    password: string
  },
}