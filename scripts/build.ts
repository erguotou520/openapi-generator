import { rename } from 'node:fs/promises'
// import isolatedDecl from 'bun-plugin-isolated-decl'
import { transform } from '@swc/core'
import dts from 'bun-plugin-dts'

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

const { code } = await transform(await Bun.file('./dist/index.mjs').text(), {
  sourceMaps: false,
  minify: true,
})
await Bun.write('dist/index.js', code)

const { code: clientCode } = await transform(await Bun.file('./dist/client/index.mjs').text(), {
  sourceMaps: false,
  minify: true,
})
await Bun.write('dist/client/index.js', clientCode)
