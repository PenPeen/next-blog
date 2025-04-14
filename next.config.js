/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'localhost:5001',
      process.env.NEXT_PUBLIC_RAILS_API_DOMAIN,
      'placehold.jp',
    ].filter(Boolean),
  },
}

module.exports = nextConfig
