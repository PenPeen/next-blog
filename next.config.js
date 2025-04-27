/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
      },
      ...(process.env.NEXT_PUBLIC_RAILS_API_DOMAIN ? [
        {
          protocol: 'https',
          hostname: process.env.NEXT_PUBLIC_RAILS_API_DOMAIN,
        }
      ] : []),
      {
        protocol: 'https',
        hostname: 'placehold.jp',
      },
    ],
  },
}

module.exports = nextConfig
