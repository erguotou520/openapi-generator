import { getReferenceName } from './utils'

export function schemaRef({ ref }: { ref: string }) {
  return getReferenceName(ref)
}
