import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/withWebsmith.ts', 'src/tailwind.ts', 'src/provider.tsx'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['next', 'react', 'tailwindcss'],
  target: 'es2020',
})
