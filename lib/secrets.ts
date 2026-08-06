import { prisma } from './prisma'

let secretsLoaded = false

/**
 * Loads all secrets from database settings and populates process.env dynamically at runtime.
 * This ensures any key saved in Admin Panel immediately takes effect live without server restart.
 */
export async function initSecrets(force = false) {
  if (secretsLoaded && !force) return

  try {
    const settings = await prisma.websiteSetting.findMany()

    settings.forEach(setting => {
      const key = setting.key
      const val = setting.value
      if (val === undefined || val === null) return

      let cleanVal = ''
      if (typeof val === 'string') {
        cleanVal = val.trim().replace(/^["']|["']$/g, '')
      } else {
        try {
          cleanVal = typeof val === 'object' ? (val as any).value ?? JSON.stringify(val) : String(val)
        } catch {
          cleanVal = String(val)
        }
      }

      if (!cleanVal) return

      // Real-time live runtime mapping to process.env
      if (key === 'secret.razorpay_key_id' || key === 'secret_razorpay_key_id' || key === 'payments.razorpayKeyId') {
        process.env.RAZORPAY_KEY_ID = cleanVal
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID = cleanVal
      } else if (key === 'secret.razorpay_key_secret' || key === 'secret_razorpay_key_secret' || key === 'payments.razorpayKeySecret') {
        process.env.RAZORPAY_KEY_SECRET = cleanVal
      } else if (key === 'secret.razorpay_webhook_secret' || key === 'secret_razorpay_webhook_secret' || key === 'payments.razorpayWebhookSecret') {
        process.env.RAZORPAY_WEBHOOK_SECRET = cleanVal
      } else if (key === 'pixel.facebook_id' || key === 'marketing.metaPixelId') {
        process.env.FB_PIXEL_ID = cleanVal
        process.env.NEXT_PUBLIC_FB_PIXEL_ID = cleanVal
      } else if (key === 'pixel.meta_capi_token' || key === 'marketing.metaCapiToken') {
        process.env.META_CAPI_ACCESS_TOKEN = cleanVal
        process.env.META_CAPI_TOKEN = cleanVal
      } else if (key === 'pixel.meta_test_event_code' || key === 'marketing.metaTestEventCode') {
        process.env.META_TEST_EVENT_CODE = cleanVal
      } else if (key === 'secret.supabase_url' || key === 'secret_supabase_url') {
        if (cleanVal.startsWith('http://') || cleanVal.startsWith('https://')) {
          process.env.NEXT_PUBLIC_SUPABASE_URL = cleanVal
        }
      } else if (key === 'secret.supabase_anon_key' || key === 'secret_supabase_anon_key') {
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = cleanVal
      } else if (key === 'secret.supabase_service_role_key' || key === 'secret_supabase_service_role_key') {
        process.env.SUPABASE_SERVICE_ROLE_KEY = cleanVal
      } else if (key === 'secret.gemini_api_key' || key === 'secret_gemini_api_key') {
        process.env.GEMINI_API_KEY = cleanVal
      } else if (key === 'secret.admin_email' || key === 'secret_admin_email') {
        process.env.ADMIN_EMAIL = cleanVal
      }
    })

    secretsLoaded = true
  } catch (err) {}
}

