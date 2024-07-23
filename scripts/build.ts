import { rename } from 'node:fs/promises'
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

await rename('dist/index.js', 'dist/index.mjs')
await rename('dist/client/index.js', 'dist/client/index.mjs')