import dts from 'bun-plugin-dts'
// import isolatedDecl from 'bun-plugin-isolated-decl'

await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  format: 'esm',
  target: 'node',
  plugins: [dts()],
  // plugins: [isolatedDecl()]
})

await Bun.build({
  entrypoints: ['./src/client/index.ts'],
  outdir: './dist/client',
  format: 'esm',
  target: 'browser',
  plugins: [dts()],
  // plugins: [isolatedDecl()]
})
