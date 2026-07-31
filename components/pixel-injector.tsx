'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackPixelEvent } from '@/lib/pixel'

export function PixelInjector() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const configRef = useRef<Record<string, any>>({})
  const scriptsLoadedRef = useRef(false)

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings')
        const data = await res.json()
        if (data.ok) {
          const s = data.data.settings || {}
          configRef.current = s

          // Check master toggle — if disabled, do not inject any pixels
          if (s['pixel.events_enabled'] === 'false') {
            return
          }

          // Inject FB Pixel if present and not loaded
          const fbId = s['pixel.facebook_id']
          if (fbId && !(window as any)._fb_pixel_injected) {
            ;(window as any)._fb_pixel_injected = true
            const fbScript = document.createElement('script')
            fbScript.innerHTML = `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${fbId}');
              fbq('track', 'PageView');
            `
            document.head.appendChild(fbScript)
          }

          // Inject GA4 if present
          const gaId = s['pixel.google_analytics_id']
          if (gaId && !(window as any)._ga_injected) {
            ;(window as any)._ga_injected = true
            const gaScript = document.createElement('script')
            gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
            gaScript.async = true
            document.head.appendChild(gaScript)

            const gaConfig = document.createElement('script')
            gaConfig.innerHTML = `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `
            document.head.appendChild(gaConfig)
          }

          // Inject GTM if present
          const gtmId = s['pixel.google_tag_manager_id']
          if (gtmId && !(window as any)._gtm_injected) {
            ;(window as any)._gtm_injected = true
            const gtmScript = document.createElement('script')
            gtmScript.innerHTML = `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `
            document.head.appendChild(gtmScript)
          }

          // Inject TikTok Pixel if present
          const tiktokId = s['pixel.tiktok_id']
          if (tiktokId && !(window as any)._tiktok_pixel_injected) {
            ;(window as any)._tiktok_pixel_injected = true
            const ttScript = document.createElement('script')
            ttScript.innerHTML = `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                ttq.load('${tiktokId}');
                ttq.page();
              }(window, document, 'ttq');
            `
            document.head.appendChild(ttScript)
          }

          // Inject Custom Head Scripts (properly handle <script> tags)
          const customHead = s['pixel.custom_head_scripts']
          if (customHead && !(window as any)._custom_head_injected) {
            ;(window as any)._custom_head_injected = true
            injectCustomScripts(customHead, document.head)
          }

          // Inject Custom Body Scripts (properly handle <script> tags)
          const customBody = s['pixel.custom_body_scripts']
          if (customBody && !(window as any)._custom_body_injected) {
            ;(window as any)._custom_body_injected = true
            injectCustomScripts(customBody, document.body)
          }

          scriptsLoadedRef.current = true

          // Fire initial PageView after scripts are loaded
          if (pathname && !pathname.startsWith('/admin')) {
            const url = `${pathname}${searchParams?.toString() ? '?' + searchParams.toString() : ''}`
            trackPixelEvent({ eventName: 'PageView', pageUrl: url })
          }
        }
      } catch (err) {
        console.warn('[PixelInjector] Settings load failed:', err)
      }
    }

    loadSettings()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Track PageView on subsequent route changes (after initial load)
  useEffect(() => {
    if (!scriptsLoadedRef.current) return // Don't fire before scripts are loaded
    if (pathname && !pathname.startsWith('/admin')) {
      const url = `${pathname}${searchParams?.toString() ? '?' + searchParams.toString() : ''}`
      trackPixelEvent({ eventName: 'PageView', pageUrl: url })
    }
  }, [pathname, searchParams])

  return null
}

/**
 * Properly inject custom HTML that may contain <script> tags.
 * innerHTML does NOT execute <script> tags per HTML5 spec,
 * so we must recreate them explicitly.
 */
function injectCustomScripts(html: string, target: HTMLElement) {
  const div = document.createElement('div')
  div.innerHTML = html

  Array.from(div.childNodes).forEach((node) => {
    if (node.nodeName === 'SCRIPT') {
      const oldScript = node as HTMLScriptElement
      const newScript = document.createElement('script')
      // Copy all attributes
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value)
      })
      // Copy inline script content
      newScript.textContent = oldScript.textContent
      target.appendChild(newScript)
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      target.appendChild((node as Element).cloneNode(true))
    }
  })
}
