/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https: http:; font-src 'self' data: https:; connect-src 'self' https: http: wss: ws:; frame-src 'self' https: http:; object-src 'none'; base-uri 'self'; form-action 'self';"
          }
        ]
      }
    ]
  },
  allowedDevOrigins: [
    '*.preview.emergentagent.com',
    '*.preview.emergentcf.cloud',
    '*.cluster-12.preview.emergentcf.cloud',
  ],
  async redirects() {
    return [
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
    ]
  },

  serverExternalPackages: ['sharp'],
}

module.exports = nextConfig
