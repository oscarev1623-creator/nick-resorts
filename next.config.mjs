/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['192.168.131.250', 'localhost', '127.0.0.1'],
  // Desactivar Turbopack
  experimental: {
    turbo: false,
  },
}

export default nextConfig