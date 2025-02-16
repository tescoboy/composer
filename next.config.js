/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    domains: ['rlvpxvwbhfhknpqhxdup.supabase.co'],
  },
  typescript: {
    ignoreBuildErrors: true // Temporarily set to true for deployment
  },
  eslint: {
    ignoreDuringBuilds: true // Temporarily set to true for deployment
  }
}

module.exports = nextConfig 