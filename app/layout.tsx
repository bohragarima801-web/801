import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { siteConfig } from '@/lib/site-config'
import { Toaster } from 'sonner'
import { CustomInjector } from '@/components/custom-injector'
import { TranslationProvider } from '@/components/translation-provider'


const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-inter' })

import { getDynamicSiteConfig, getSetting } from '@/lib/settings'

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
    icons: {
      icon: '/logo.jpg',
      apple: '/apple-touch-icon.png'
    },
    appleWebApp: { capable: true, statusBarStyle: 'default', title: dynamicConfig.name },
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
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [gaId, metaId, customHeaderScripts] = await Promise.all([
    getSetting('marketing.googleAnalyticsId'),
    getSetting('marketing.metaPixelId'),
    getSetting('marketing.customHeaderScripts'),
  ])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', { page_path: window.location.pathname });
                `,
              }}
            />
          </>
        )}
        {metaId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${metaId}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
        {customHeaderScripts && (
          <div dangerouslySetInnerHTML={{ __html: customHeaderScripts }} />
        )}
      </head>
      <body className={`${inter.className} ${inter.variable} font-sans bg-watermark overflow-x-hidden`} suppressHydrationWarning>
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

