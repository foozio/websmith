import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'es2015',
  external: ['@websmith/theme', '@websmith/tokens', '@websmith/ui'],
  banner: {
    js: '#!/usr/bin/env node'
  }
})