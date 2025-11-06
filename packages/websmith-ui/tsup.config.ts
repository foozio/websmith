import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    core: 'src/components/core.ts',
    forms: 'src/components/forms.ts',
    layout: 'src/components/layout.ts',
    overlay: 'src/components/overlay.ts',
    data: 'src/components/data.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  treeshake: true,
  sourcemap: true,
  clean: true,
  minify: false, // Let consumers handle minification
  target: 'es2020',
  external: [
    'react',
    'react-dom',
    /^@radix-ui\/.*/,
  ],
  esbuildOptions(options) {
    options.mangleProps = undefined // Preserve prop names for better debugging
    options.keepNames = true // Keep function/class names for better stack traces
  },
})