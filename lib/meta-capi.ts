import crypto from 'crypto'
import { getSetting } from '@/lib/settings'

export interface MetaCapiUserData {
  email?: string | null
  phone?: string | null
  firstName?: string | null
  lastName?: string | null
  fullName?: string | null
  clientIp?: string | null
  userAgent?: string | null
}

export interface MetaCapiCustomData {
  currency?: string
  value?: number
  content_name?: string
  content_category?: string
  content_type?: string
  content_ids?: string[]
  order_id?: string
  booking_number?: string
  [key: string]: any
}

export interface MetaCapiEventPayload {
  eventName: 'PageView' | 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase' | 'Lead' | 'Contact' | string
  eventId?: string
  eventSourceUrl?: string
  userData?: MetaCapiUserData
  customData?: MetaCapiCustomData
}

/**
 * Hash data using SHA-256 for Meta CAPI compliance (required for email, phone, etc.)
 */
function hashMetaUserData(value?: string | null): string | undefined {
  if (!value || typeof value !== 'string') return undefined
  const cleaned = value.trim().toLowerCase()
  if (!cleaned) return undefined
  return crypto.createHash('sha256').update(cleaned).digest('hex')
}

/**
 * Send server-side event to Meta Conversions API (CAPI)
 */
export async function sendMetaCapiEvent(payload: MetaCapiEventPayload): Promise<{ success: boolean; result?: any; error?: string }> {
  try {
    // 1. Fetch Pixel ID and CAPI Access Token from DB Settings or Env
    let pixelId = (await getSetting('pixel.facebook_id', 'FB_PIXEL_ID')).replace(/^["']|["']$/g, '').trim()
    if (!pixelId) {
      pixelId = (await getSetting('marketing.metaPixelId', 'FB_PIXEL_ID')).replace(/^["']|["']$/g, '').trim()
    }
    if (!pixelId) {
      pixelId = (process.env.NEXT_PUBLIC_FB_PIXEL_ID || process.env.FB_PIXEL_ID || '').replace(/^["']|["']$/g, '').trim()
    }

    let accessToken = (await getSetting('pixel.meta_capi_token', 'META_CAPI_TOKEN')).replace(/^["']|["']$/g, '').trim()
    if (!accessToken) {
      accessToken = (await getSetting('marketing.metaCapiToken', 'META_CAPI_TOKEN')).replace(/^["']|["']$/g, '').trim()
    }
    if (!accessToken) {
      accessToken = (process.env.META_CAPI_ACCESS_TOKEN || process.env.META_CAPI_TOKEN || '').replace(/^["']|["']$/g, '').trim()
    }

    if (!pixelId || !accessToken) {
      return { success: false, error: 'Meta Pixel ID or CAPI Access Token missing in settings' }
    }

    // 2. Fetch Optional Test Event Code
    let testEventCode = (await getSetting('pixel.meta_test_event_code', 'META_TEST_EVENT_CODE')).replace(/^["']|["']$/g, '').trim()
    if (!testEventCode) {
      testEventCode = (await getSetting('marketing.metaTestEventCode', 'META_TEST_EVENT_CODE')).replace(/^["']|["']$/g, '').trim()
    }
    if (!testEventCode) {
      testEventCode = (process.env.META_TEST_EVENT_CODE || '').replace(/^["']|["']$/g, '').trim()
    }

    // 3. Format Hashed User Data
    const { email, phone, firstName, lastName, fullName, clientIp, userAgent } = payload.userData || {}

    let fn = firstName ? hashMetaUserData(firstName) : undefined
    let ln = lastName ? hashMetaUserData(lastName) : undefined
    if (!fn && fullName) {
      const parts = fullName.trim().split(' ')
      fn = hashMetaUserData(parts[0])
      if (parts.length > 1) ln = hashMetaUserData(parts.slice(1).join(' '))
    }

    const formattedUserData: Record<string, any> = {
      em: email ? [hashMetaUserData(email)] : undefined,
      ph: phone ? [hashMetaUserData(phone)] : undefined,
      fn: fn ? [fn] : undefined,
      ln: ln ? [ln] : undefined,
      client_ip_address: clientIp || undefined,
      client_user_agent: userAgent || undefined,
    }

    // Remove undefined fields
    Object.keys(formattedUserData).forEach((key) => {
      if (formattedUserData[key] === undefined) delete formattedUserData[key]
    })

    // 4. Construct Event Item
    const eventTime = Math.floor(Date.now() / 1000)
    const eventId = payload.eventId || `evt_${eventTime}_${Math.random().toString(36).substring(2, 9)}`

    const eventData: Record<string, any> = {
      event_name: payload.eventName,
      event_time: eventTime,
      event_id: eventId,
      event_source_url: payload.eventSourceUrl || 'https://divyayagyam.com',
      action_source: 'website',
      user_data: formattedUserData,
      custom_data: payload.customData || {},
    }

    // 5. Construct CAPI Payload
    const capiPayload: Record<string, any> = {
      data: [eventData],
    }

    if (testEventCode) {
      capiPayload.test_event_code = testEventCode
    }

    // 6. Post to Meta Graph API
    const metaGraphUrl = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`
    const res = await fetch(metaGraphUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(capiPayload),
    })

    const result = await res.json()

    if (!res.ok || result.error) {
      return {
        success: false,
        error: result.error?.message || 'Meta CAPI request failed',
        result,
      }
    }

    return {
      success: true,
      result,
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Meta CAPI execution error',
    }
  }
}
