import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/theme.ts', 'src/utils.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['styled-components', 'react'],
  target: 'es2020',
})
