import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'sonner'
import { Suspense } from 'react'
import Script from 'next/script'
import { CustomInjector } from '@/components/custom-injector'
import { PixelInjector } from '@/components/pixel-injector'
import { TranslationProvider } from '@/components/translation-provider'
import { getDynamicSiteConfig, getSetting } from '@/lib/settings'
import { generateOrganizationSchema, generateWebSiteSchema, generateLocalBusinessSchema } from '@/lib/seo'

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-inter' })

export async function generateMetadata(): Promise<Metadata> {
  const dynamicConfig = await getDynamicSiteConfig()
  const googleVerification = await getSetting('seo.google_verification')
  const baseUrl = dynamicConfig.url || 'https://divyayagyam.com'
  const siteName = dynamicConfig.name || 'DivyaYagyam'
  const defaultDescription = 'Book authentic online pujas at Kashi Vishwanath, Mahakaleshwar & heritage temples. Verified Pandits, name-gotra sankalp, live video proof on WhatsApp & sacred prasad home delivery.'

  return {
    title: {
      default: `${siteName} — ऑनलाइन पूजा बुकिंग | Online Puja Booking India`,
      template: `%s | ${siteName}`
    },
    description: dynamicConfig.description || defaultDescription,
    keywords: dynamicConfig.keywords || [
      'online puja booking', 'ऑनलाइन पूजा', 'divyayagyam', 'vedic puja',
      'kashi vishwanath puja', 'mahakaleshwar puja', 'rudraksha', 'puja samagri',
      'astrology online', 'jyotish', 'sanatan seva'
    ],
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: './',
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
      title: `${siteName} — ऑनलाइन पूजा बुकिंग | Online Puja Booking India`,
      description: dynamicConfig.description || defaultDescription,
      url: baseUrl,
      siteName: siteName,
      locale: 'hi_IN',
      type: 'website',
      images: [{
        url: dynamicConfig.logo || dynamicConfig.ogImage || `${baseUrl}/logo.jpg`,
        width: 1200,
        height: 630,
        alt: `${siteName} Logo`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${siteName} — ऑनलाइन पूजा बुकिंग | Online Puja Booking India`,
      description: dynamicConfig.description || defaultDescription,
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
    appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: siteName },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFDF7' },
    { media: '(prefers-color-scheme: dark)', color: '#8B1A21' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

import { WhatsAppFloatingWidget } from '@/components/whatsapp-floating-widget'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const globalSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      generateOrganizationSchema(),
      generateWebSiteSchema(),
      generateLocalBusinessSchema(),
    ],
  }

  return (
    <html lang="hi" suppressHydrationWarning>
      <body className={`${inter.className} ${inter.variable} font-sans bg-watermark overflow-x-hidden`} suppressHydrationWarning>
        <Script
          id="schema-global-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
        <Providers>
          {children}
          <div id="__dvj_slot" />
          <Toaster position="top-right" richColors closeButton />
          <CustomInjector />
          <Suspense fallback={null}>
            <PixelInjector />
          </Suspense>
          <TranslationProvider />
          <WhatsAppFloatingWidget />
        </Providers>
      </body>
    </html>
  )
}
