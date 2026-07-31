import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'sonner'
import { Suspense } from 'react'
import { CustomInjector } from '@/components/custom-injector'
import { PixelInjector } from '@/components/pixel-injector'
import { TranslationProvider } from '@/components/translation-provider'
import { getDynamicSiteConfig, getSetting } from '@/lib/settings'

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-inter' })

export async function generateMetadata(): Promise<Metadata> {
  const dynamicConfig = await getDynamicSiteConfig()
  const googleVerification = await getSetting('seo.google_verification')
  const baseUrl = dynamicConfig.url || 'https://divyayagyam.com'

  return {
    title: { default: `${dynamicConfig.name} — ${dynamicConfig.tagline}`, template: `%s | ${dynamicConfig.name}` },
    description: dynamicConfig.description,
    keywords: dynamicConfig.keywords,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: baseUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: `${dynamicConfig.name} — ${dynamicConfig.tagline}`,
      description: dynamicConfig.description,
      url: baseUrl,
      siteName: dynamicConfig.name,
      locale: 'en_IN',
      type: 'website',
      images: [{
        url: dynamicConfig.logo || dynamicConfig.ogImage || `${baseUrl}/logo.jpg`,
        width: 1200,
        height: 630,
        alt: `${dynamicConfig.name} Logo`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dynamicConfig.name} — ${dynamicConfig.tagline}`,
      description: dynamicConfig.description,
      images: [dynamicConfig.logo || dynamicConfig.ogImage || `${baseUrl}/logo.jpg`],
    },
    verification: {
      google: googleVerification || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    },
    manifest: '/manifest.json',
    icons: {
      icon: dynamicConfig.logo || '/logo.jpg',
      shortcut: dynamicConfig.logo || '/logo.jpg',
      apple: dynamicConfig.logo || '/apple-touch-icon.png'
    },
    appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: dynamicConfig.name },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FF8C21' },
    { media: '(prefers-color-scheme: dark)', color: '#1a0f08' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi" suppressHydrationWarning>
      <body className={`${inter.className} ${inter.variable} font-sans bg-watermark overflow-x-hidden`} suppressHydrationWarning>
        <Providers>
          {children}
          <div id="__dvj_slot" />
          <Toaster position="top-right" richColors closeButton />
          <CustomInjector />
          <Suspense fallback={null}>
            <PixelInjector />
          </Suspense>
          <TranslationProvider />
        </Providers>
      </body>
    </html>
  )
}

