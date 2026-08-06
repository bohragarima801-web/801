/**
 * Client-Side and Server-Side Pixel & Event Analytics Tracker
 */

export interface PixelEventUserData {
  email?: string
  phone?: string
  fullName?: string
  firstName?: string
  lastName?: string
}

export interface PixelEventPayload {
  eventName: 'PageView' | 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase' | 'Lead' | string
  pageUrl?: string
  metadata?: Record<string, any>
  userData?: PixelEventUserData
  eventId?: string
}

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'))
  return match ? decodeURIComponent(match[2]) : null
}

/**
 * Track an event on Meta Pixel, GA4, GTM, and dispatch to Meta CAPI Server-Side.
 */
export function trackPixelEvent({ eventName, pageUrl, metadata, userData, eventId: customEventId }: PixelEventPayload) {
  if (typeof window === 'undefined') return

  const currentUrl = pageUrl || window.location.href

  // Generate or use consistent eventId for Browser + Server CAPI Deduplication
  const eventId = customEventId || metadata?.eventId || metadata?.event_id || metadata?.eventID || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  // Read Meta cookies for max match rate
  const fbp = getCookieValue('_fbp')
  const fbc = getCookieValue('_fbc')

  // Clean metadata (remove eventId keys so we pass explicit eventID parameter)
  const cleanMetadata = { ...(metadata || {}) }
  delete cleanMetadata.eventId
  delete cleanMetadata.event_id
  delete cleanMetadata.eventID

  // 1. Meta / Facebook Pixel (fbq) with explicit eventID for CAPI Deduplication
  if (typeof (window as any).fbq === 'function') {
    try {
      if (['PageView', 'ViewContent', 'AddToCart', 'InitiateCheckout', 'Purchase', 'Lead', 'Contact'].includes(eventName)) {
        ;(window as any).fbq('track', eventName, cleanMetadata, { eventID: eventId })
      } else {
        ;(window as any).fbq('trackCustom', eventName, cleanMetadata, { eventID: eventId })
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
        ...cleanMetadata,
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
        eventId,
        pageUrl: currentUrl,
        ...cleanMetadata,
      })
    } catch (err) {
      console.warn('[PixelTracker] GTM error:', err)
    }
  }

  // 4. Dispatch to Server-Side Meta CAPI & Real-time Backend Analytics Event API
  try {
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        eventId,
        pageUrl: currentUrl,
        fbp,
        fbc,
        userData: userData || {},
        metadata: cleanMetadata,
      }),
    }).catch(() => {}) // Silent error handling
  } catch (err) {
    // Ignore network error
  }
}

