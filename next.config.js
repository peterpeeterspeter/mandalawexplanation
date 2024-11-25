/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.replicate.delivery',
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
