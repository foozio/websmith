import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/vite.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['astro', 'vite'],
  target: 'es2020',
})
