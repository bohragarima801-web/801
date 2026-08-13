import type { Metadata, Viewport } from 'next'
import { Inter, Outfit, Cinzel, Noto_Serif_Devanagari, Noto_Sans_Devanagari, Mukta, Poppins } from 'next/font/google'
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

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-inter', display: 'swap' })
const outfit = Outfit({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-outfit', display: 'swap' })
const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '600', '700', '800'], variable: '--font-cinzel', display: 'swap' })
const notoSerifDevanagari = Noto_Serif_Devanagari({ subsets: ['devanagari'], weight: ['400', '500', '600', '700', '800'], variable: '--font-noto-serif-devanagari', display: 'swap' })
const notoSansDevanagari = Noto_Sans_Devanagari({ subsets: ['devanagari'], weight: ['400', '500', '600', '700', '800'], variable: '--font-noto-sans-devanagari', display: 'swap' })
const mukta = Mukta({ subsets: ['devanagari', 'latin'], weight: ['400', '500', '600', '700'], variable: '--font-mukta', display: 'swap' })
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-poppins', display: 'swap' })

export async function generateMetadata(): Promise<Metadata> {
  const dynamicConfig = await getDynamicSiteConfig()
  const googleVerification = await getSetting('seo.google_verification')
  const baseUrl = dynamicConfig.url || 'https://divyayagyam.com'
  const siteName = dynamicConfig.name || 'DivyaYagyam'
  const defaultDescription = 'Book authentic online pujas at Kashi Vishwanath, Mahakaleshwar & heritage temples in India. Verified Vedic Pandits, name-gotra sankalp, WhatsApp video proof & sacred prasad home delivery.'

  return {
    title: {
      default: `दिव्ययज्ञम् (DivyaYagyam) — ऑनलाइन पूजा बुकिंग | Online Puja Booking India`,
      template: `%s | ${siteName}`
    },
    description: dynamicConfig.description || defaultDescription,
    keywords: dynamicConfig.keywords || [
      'online puja booking', 'ऑनलाइन पूजा', 'divyayagyam', 'दिव्ययज्ञम्', 'vedic puja',
      'kashi vishwanath puja', 'mahakaleshwar puja', 'rudraksha', 'puja samagri',
      'astrology online', 'jyotish', 'sanatan seva'
    ],
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: baseUrl,
      languages: {
        'hi-IN': baseUrl,
        'en-IN': baseUrl,
        'x-default': baseUrl,
      },
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
      title: `दिव्ययज्ञम् (DivyaYagyam) — ऑनलाइन पूजा बुकिंग | Online Puja Booking India`,
      description: dynamicConfig.description || defaultDescription,
      url: baseUrl,
      siteName: 'दिव्ययज्ञम् (DivyaYagyam)',
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
    { media: '(prefers-color-scheme: light)', color: '#FF8C21' },
    { media: '(prefers-color-scheme: dark)', color: '#1a0f08' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

import { WhatsAppFloatingWidget } from '@/components/whatsapp-floating-widget'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const stripContext = (obj: any) => {
    const { '@context': _, ...rest } = obj
    return rest
  }

  const globalSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      stripContext(generateOrganizationSchema()),
      stripContext(generateWebSiteSchema()),
      stripContext(generateLocalBusinessSchema()),
    ],
  }

  return (
    <html lang="hi" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        {/* Google Fonts Preconnect for ultra-fast Devanagari font rendering */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Prevents Google Translate from auto-corrupting brand names & mantras */}
        <meta name="google" content="notranslate" />
      </head>
      <body className={`${notoSansDevanagari.className} ${notoSansDevanagari.variable} ${notoSerifDevanagari.variable} ${inter.variable} ${outfit.variable} ${cinzel.variable} ${mukta.variable} ${poppins.variable} font-sans bg-[#FFFBF7] text-[#111827] overflow-x-hidden selection:bg-[#FF7A00]/20 selection:text-[#FF7A00] antialiased`} suppressHydrationWarning>
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
