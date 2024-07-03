export function schemaRef({ ref }: { ref: string }) {
  const splited = ref.split('/');
  return `APISchemas.${(splited[splited.length - 1]).replace(/[.]/g, '_')}`;
}