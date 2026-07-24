import type { Metadata, Viewport } from 'next'
import { Poppins, Yatra_One } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { siteConfig } from '@/lib/site-config'
import { Toaster } from 'sonner'
import { CustomInjector } from '@/components/custom-injector'
import { TranslationProvider } from '@/components/translation-provider'


export const dynamic = 'force-dynamic'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-poppins' })
const yatraOne = Yatra_One({ subsets: ['latin', 'devanagari'], weight: ['400'], variable: '--font-yatra' })

import { getDynamicSiteConfig } from '@/lib/settings'

export async function generateMetadata(): Promise<Metadata> {
  const dynamicConfig = await getDynamicSiteConfig()
  return {
    title: { default: `${dynamicConfig.name} — ${dynamicConfig.tagline}`, template: `%s | ${dynamicConfig.name}` },
    description: dynamicConfig.description,
    keywords: dynamicConfig.keywords,
    metadataBase: new URL(dynamicConfig.url),
    openGraph: { title: dynamicConfig.name, description: dynamicConfig.description, url: dynamicConfig.url, siteName: dynamicConfig.name, type: 'website', images: [dynamicConfig.logo || dynamicConfig.ogImage] },
    twitter: { card: 'summary_large_image', title: dynamicConfig.name, description: dynamicConfig.description, images: [dynamicConfig.logo || dynamicConfig.ogImage] },
    manifest: '/manifest.json',
    appleWebApp: { capable: true, statusBarStyle: 'default', title: dynamicConfig.name },
  }
} — ${siteConfig.tagline}`, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  metadataBase: new URL(siteConfig.url),
  openGraph: { title: siteConfig.name, description: siteConfig.description, url: siteConfig.url, siteName: siteConfig.name, type: 'website' },
  twitter: { card: 'summary_large_image', title: siteConfig.name, description: siteConfig.description },
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: siteConfig.name },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FF8C21' },
    { media: '(prefers-color-scheme: dark)', color: '#1a0f08' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi" suppressHydrationWarning>
      <body className={`${poppins.className} ${poppins.variable} ${yatraOne.variable} font-sans bg-watermark overflow-x-hidden`} suppressHydrationWarning>
        <Providers>
          {children}
          <div id="__dvj_slot" />
          <Toaster position="top-right" richColors closeButton />
          <CustomInjector />
          <TranslationProvider />

        </Providers>
      </body>
    </html>
  )
}
