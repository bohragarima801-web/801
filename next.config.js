/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 604800, // 7 days — better for mobile repeat visitors
    deviceSizes: [375, 430, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      {
        source: '/:path*.(png|jpg|jpeg|gif|webp|avif|ico|svg|woff|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:; style-src 'self' 'unsafe-inline' https: http:; img-src 'self' data: blob: https: http:; font-src 'self' data: https: http:; connect-src 'self' https: http: wss: ws:; frame-src 'self' https: http:; object-src 'none'; base-uri 'self'; form-action 'self';"
          }
        ]
      }
    ]
  },

  async redirects() {
    return [
      // ── CRITICAL: www → non-www canonical redirect (301 permanent)
      // Fixes Google "Duplicate, chose different canonical" issue
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.divyayagyam.com' }],
        destination: 'https://divyayagyam.com/:path*',
        permanent: true,
      },
      {
        source: '/store',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/tools/Kunadali-milan',
        destination: '/tools/kundali-milan',
        permanent: true,
      },
      {
        source: '/vip-pujas/:slug',
        destination: '/pujas/:slug',
        permanent: true,
      },
      // Common typos & variants
      {
        source: '/puja',
        destination: '/pujas',
        permanent: true,
      },
      {
        source: '/product',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/blog/:slug/amp',
        destination: '/blog/:slug',
        permanent: true,
      },
      {
        source: '/pujas/rudrabhishek-mahapuja',
        destination: '/pujas/mahamrityunjaya-jaap-rudrabhishekam',
        permanent: true,
      },
      {
        source: '/pujas/rudrabhishek',
        destination: '/pujas/mahamrityunjaya-jaap-rudrabhishekam',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },

  serverExternalPackages: ['sharp'],
}

module.exports = nextConfig
