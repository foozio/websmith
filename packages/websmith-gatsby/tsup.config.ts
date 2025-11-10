import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/gatsby-node.ts'],
  format: ['cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'es2015',
  outDir: 'dist',
  banner: {
    js: '#!/usr/bin/env node'
  }
})
