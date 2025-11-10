import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/sketch.ts', 'src/adobe-xd.ts', 'src/figma.ts', 'src/cli.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  target: 'es2020',
})
