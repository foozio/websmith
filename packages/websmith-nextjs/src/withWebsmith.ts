import { NextConfig } from 'next'
import { WebsmithNextGenerator } from './index'
import type { WebsmithNextOptions, WebsmithConfig } from './types'
import { resolve } from 'path'

export function withWebsmith(
  nextConfig: NextConfig = {},
  options: WebsmithNextOptions = {}
): WebsmithConfig {
  const generator = new WebsmithNextGenerator(options)
  
  // Generate tokens at build time
  const websmithConfig: WebsmithConfig = {
    ...nextConfig,
    websmith: options,
    
    // Configure webpack to include Websmith CSS
    webpack(config: any, context: any) {
      // Custom webpack config for Websmith
      if (!context.isServer) {
        // Client-side configuration
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          path: false,
        }
      }

      // Add Websmith CSS processing
      config.module.rules.push({
        test: /\.websmith\.css$/,
        use: ['style-loader', 'css-loader'],
      })

      return typeof nextConfig.webpack === 'function'
        ? nextConfig.webpack(config, context)
        : config
    },
    
    // Redirects for token endpoints (optional)
    async redirects() {
      const redirects = await (typeof nextConfig.redirects === 'function'
        ? nextConfig.redirects()
        : [])

      return [
        {
          source: '/tokens',
          destination: '/api/tokens',
          permanent: false,
        },
        ...redirects,
      ]
    },
    
    // Headers for security and caching
    async headers() {
      const headers = await (typeof nextConfig.headers === 'function'
        ? nextConfig.headers()
        : [])

      return [
        {
          source: '/styles/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        ...headers,
      ]
    },
  }

  return websmithConfig
}

// Export for convenience
export default withWebsmith
