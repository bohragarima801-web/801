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

      // ── Consolidation redirects: Mahamrityunjaya Puja variants
      {
        source: '/pujas/maha-mrityunjay-jaap',
        destination: '/pujas/mahamrityunjaya-jaap-rudrabhishekam',
        permanent: true,
      },
      {
        source: '/pujas/mahamrityujaya-jaap-rudrabhishekam',
        destination: '/pujas/mahamrityunjaya-jaap-rudrabhishekam',
        permanent: true,
      },
      {
        source: '/pujas/11000-mahamrityunjaya-jaap-maharudrabhishekam',
        destination: '/pujas/mahamrityunjaya-jaap-rudrabhishekam',
        permanent: true,
      },
      {
        source: '/pujas/11000-maha-mrityunjay-mantra-jaap-panchamrit',
        destination: '/pujas/mahamrityunjaya-jaap-rudrabhishekam',
        permanent: true,
      },
      {
        source: '/pujas/maha-shiv-rudra-abhishek-pooja-21-brahmins',
        destination: '/pujas/mahamrityunjaya-jaap-rudrabhishekam',
        permanent: true,
      },

      // ── Consolidation redirects: Maa Baglamukhi Hawan variants
      {
        source: '/pujas/maa-bagalamukhi-',
        destination: '/pujas/maa-baglamukhi-mahayagya-mirchi-havan',
        permanent: true,
      },
      {
        source: '/pujas/maa-baglamukhi-mirchi-hawan',
        destination: '/pujas/maa-baglamukhi-mahayagya-mirchi-havan',
        permanent: true,
      },
      {
        source: '/pujas/maa-bagalamukhi-mirchi-hawan',
        destination: '/pujas/maa-baglamukhi-mahayagya-mirchi-havan',
        permanent: true,
      },
      {
        source: '/pujas/mata-baglamukhi-mirchi-havan-sarva-karya-siddhi-mahayagya',
        destination: '/pujas/maa-baglamukhi-mahayagya-mirchi-havan',
        permanent: true,
      },

      // ── Consolidation redirects: Maa Varahi variants
      {
        source: '/pujas/maa-varahi-land-property-dispute-yagya',
        destination: '/pujas/maa-varahi-puja-yagya',
        permanent: true,
      },

      // ── Consolidation redirects: Pitra Shanti variants
      {
        source: '/pujas/vip-pitra-shanti-gita-path-shwet-til-hawan',
        destination: '/pujas/pitra-shanti-vishesh-sarva-pitra-tarpan-puja',
        permanent: true,
      },
      {
        source: '/pujas/pitra-gita-path-shwet-til-puja',
        destination: '/pujas/pitra-shanti-vishesh-sarva-pitra-tarpan-puja',
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

      // ── Fix 404s: Renamed Puja and category slugs
      {
        source: '/pujas/durga-saptashati-hawan-puja',
        destination: '/pujas/durga-saptashati-108-samagri-mahayagya',
        permanent: true,
      },
      {
        source: '/pujas/maa-bagalamukhi-kavach-puja',
        destination: '/pujas/maa-bagalamukhi-kavach-haldi-abhishek-puja',
        permanent: true,
      },
      {
        source: '/pujas/maa-ashta-lakshmi-karz-mukti-puja',
        destination: '/pujas/maa-ashta-lakshmi-16-day-karz-mukti-mahayagya',
        permanent: true,
      },
      {
        source: '/pujas/maa-pratyangira-hawan-yagya',
        destination: '/pujas/maa-pratyangira-tantrok-hawan-bali-yagya',
        permanent: true,
      },
      {
        source: '/pujas/kaal-sarp-dosh-nivaran-puja-jodhpur',
        destination: '/pujas/kalsarp-dosh-shanti-puja',
        permanent: true,
      },
      {
        source: '/pujas/category/devi',
        destination: '/pujas/category/devi-pujas',
        permanent: true,
      },
    ]
  },

  serverExternalPackages: ['sharp'],
}

module.exports = nextConfig
