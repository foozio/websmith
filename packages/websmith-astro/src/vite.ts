import { websmith } from '@websmith/vite'
import type { WebsmithAstroOptions } from './types'
import { resolve } from 'path'

export function createWebsmithVitePlugin(options: WebsmithAstroOptions = {}) {
  const {
    tokensPath = './tokens.config.js',
    outputPath = './src/styles/websmith.css',
    theme = 'light',
    prefix = 'ws',
    ...rest
  } = options

  return websmith({
    tokensPath: resolve(process.cwd(), tokensPath),
    outputPath: resolve(process.cwd(), outputPath),
    theme,
    prefix,
    watchFiles: true,
    ...rest
  })
}

export default createWebsmithVitePlugin
