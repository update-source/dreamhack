import type { NextConfig } from 'next'
import { randomBytes } from 'crypto'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost'],
    },
  },
  images: {
    remotePatterns: [
      {
        hostname: 'localhost',
      },
    ],
  },
  compiler: {
    define: {
      BUILD_ID: randomBytes(16).toString('hex'),
    },
  },
  output: 'standalone',
}

export default nextConfig
