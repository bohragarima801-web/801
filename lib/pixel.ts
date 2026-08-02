/**
 * Client-Side and Server-Side Pixel & Event Analytics Tracker
 */

export interface PixelEventPayload {
  eventName: 'PageView' | 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase' | 'Lead' | string
  pageUrl?: string
  metadata?: Record<string, any>
}

/**
 * Track an event on Meta Pixel, GA4, GTM, and log to real-time analytics database.
 */
export function trackPixelEvent({ eventName, pageUrl, metadata }: PixelEventPayload) {
  if (typeof window === 'undefined') return

  const currentUrl = pageUrl || window.location.href

  // 1. Meta / Facebook Pixel (fbq)
  if (typeof (window as any).fbq === 'function') {
    try {
      if (['PageView', 'ViewContent', 'AddToCart', 'InitiateCheckout', 'Purchase', 'Lead'].includes(eventName)) {
        ;(window as any).fbq('track', eventName, metadata || {})
      } else {
        ;(window as any).fbq('trackCustom', eventName, metadata || {})
      }
    } catch (err) {
      console.warn('[PixelTracker] FB Pixel error:', err)
    }
  }

  // 2. Google Analytics 4 (gtag)
  if (typeof (window as any).gtag === 'function') {
    try {
      ;(window as any).gtag('event', eventName, {
        page_location: currentUrl,
        ...metadata,
      })
    } catch (err) {
      console.warn('[PixelTracker] GA4 error:', err)
    }
  }

  // 3. Google Tag Manager (dataLayer)
  if (Array.isArray((window as any).dataLayer)) {
    try {
      ;(window as any).dataLayer.push({
        event: eventName,
        pageUrl: currentUrl,
        ...metadata,
      })
    } catch (err) {
      console.warn('[PixelTracker] GTM error:', err)
    }
  }

  // 4. Dispatch to Real-time Backend Analytics Event API
  try {
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        pageUrl: currentUrl,
        metadata: metadata || {},
      }),
    }).catch(() => {}) // Silent error handling
  } catch (err) {
    // Ignore network error
  }
}
