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
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https: http:; font-src 'self' data: https:; connect-src 'self' https: http: wss: ws:; frame-src 'self' https: http:; object-src 'none'; base-uri 'self'; form-action 'self';"
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
        source: '/tools/milan',
        destination: '/tools/kundali-milan',
        permanent: true,
      },
      {
        source: '/tools/Kunadali-milan',
        destination: '/tools/kundali-milan',
        permanent: true,
      },
      {
        source: '/tools/muhurat',
        destination: '/muhurat',
        permanent: true,
      },
      {
        source: '/tools/festivals',
        destination: '/festivals',
        permanent: true,
      },
      {
        source: '/tools/free-kundali',
        destination: '/tools/kundali',
        permanent: true,
      },
      {
        source: '/tools/japa-mala-counter',
        destination: '/tools/mala',
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
        source: '/book-chadawa',
        destination: '/book-chadhawa',
        permanent: true,
      },
      {
        source: '/chadhawa',
        destination: '/book-chadhawa',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },

      // ── Consolidation redirects: Tools cannibalizing main pages
      {
        source: '/tools/panchang',
        destination: '/panchang',
        permanent: true,
      },
      {
        source: '/tools/vedic-maha-calculator-check-today-s-choghadiya-hora-rahu-kaal',
        destination: '/tools/vedic-maha-calculator',
        permanent: true,
      },
      {
        source: '/astro',
        destination: '/horoscope',
        permanent: true,
      },

      // ── Category alias redirects
      {
        source: '/pujas/category/devi',
        destination: '/pujas/category/devi-pujas',
        permanent: true,
      },

      // ── Consolidate old/deleted product URLs to live products (Prevents 404s on Google)
      {
        source: '/products/siddha-abhimantrit-rudraksha-mala',
        destination: '/products/rudraksh-mala-abhimantrit',
        permanent: true,
      },
      {
        source: '/products/rudraksha-mala',
        destination: '/products/rudraksh-mala-abhimantrit',
        permanent: true,
      },
      {
        source: '/products/rudraksh-mala',
        destination: '/products/rudraksh-mala-abhimantrit',
        permanent: true,
      },
      {
        source: '/products/siddha-9-abhimantrit-lakshmi-kaudi-set-free-gifts',
        destination: '/products/original-pili-kaudi-yellow-cowrie-for-wealth-attraction-prosperity-pack-of-21',
        permanent: true,
      },
      {
        source: '/products/laxmi-kaudi',
        destination: '/products/original-pili-kaudi-yellow-cowrie-for-wealth-attraction-prosperity-pack-of-21',
        permanent: true,
      },
      {
        source: '/products/pili-kaudi',
        destination: '/products/original-pili-kaudi-yellow-cowrie-for-wealth-attraction-prosperity-pack-of-21',
        permanent: true,
      },
      {
        source: '/products/pure-gomti-chakra',
        destination: '/products/pure-gomati-chakra',
        permanent: true,
      },
      {
        source: '/products/gomati-chakra',
        destination: '/products/pure-gomati-chakra',
        permanent: true,
      },
    ]
  },

  serverExternalPackages: ['sharp'],
}

module.exports = nextConfig
