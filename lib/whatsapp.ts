import { getSetting } from '@/lib/settings'

export type WhatsAppTriggerType = 
  | 'ORDER_SUCCESS' 
  | 'PUJA_CONFIRMED' 
  | 'QUERY_SUBMITTED' 
  | 'INVOICE_GENERATED' 
  | 'CUSTOM_ALERT'

export interface WhatsAppNotificationPayload {
  type: WhatsAppTriggerType
  phone: string
  name: string
  details: {
    orderNumber?: string
    bookingNumber?: string
    pujaName?: string
    amount?: number | string
    items?: string
    date?: string
    link?: string
    pdfUrl?: string
    querySubject?: string
  }
}

/**
 * Send automated WhatsApp notification using WhatsAPI / AiSensy Gateway
 * Supports Official AiSensy API Template Parameters & Generic API Endpoints
 */
export async function sendWhatsAppNotification(payload: WhatsAppNotificationPayload): Promise<boolean> {
  try {
    const apiUrl = await getSetting('secret.whatsapp_api_url', 'WHATSAPP_API_URL')
    const apiKey = await getSetting('secret.whatsapp_api_key', 'WHATSAPP_API_KEY')
    const senderNumber = await getSetting('secret.whatsapp_sender_number', 'WHATSAPP_SENDER_NUMBER')
    const campaignName = await getSetting('secret.whatsapp_campaign_name', 'WHATSAPP_CAMPAIGN_NAME')
    const isEnabled = await getSetting('whatsapp.automation_enabled')

    if (isEnabled === 'false' || !apiUrl || !apiKey) {
      console.log('[WhatsApp Automation] Service skipped (Missing API URL or disabled).')
      return false
    }

    // Clean phone number format (ensure country code 91 for India without +)
    let cleanPhone = payload.phone.replace(/[^0-9]/g, '')
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`
    }

    // Prepare Template Name & Dynamic Parameters array as per AiSensy Guide
    let templateName = ''
    let templateParams: string[] = []
    let fallbackMessage = ''

    switch (payload.type) {
      case 'ORDER_SUCCESS':
        templateName = 'order_confirmation'
        templateParams = [
          payload.name || 'Devotee',
          payload.details.orderNumber || 'N/A',
          `₹${payload.details.amount || 0}`,
          payload.details.items || 'Sanatan Samagri'
        ]
        fallbackMessage = `🚩 *दिव्ययज्ञम् - ऑर्डर पुष्टि (Order Confirmed)* 🚩\n\nनमस्ते ${payload.name} जी,\nआपका ऑर्डर सफलतापूर्वक दर्ज हो गया है!\n\n📦 *ऑर्डर संख्या:* ${payload.details.orderNumber}\n💰 *कुल राशि:* ₹${payload.details.amount}\n🛍️ *सामग्री:* ${payload.details.items || 'Sanatan Samagri'}\n\nhttps://divyayagyam.com/dashboard/orders\n\nहरि ओम्! 🙏`
        break

      case 'PUJA_CONFIRMED':
        templateName = 'puja_sankalp_confirmation'
        templateParams = [
          payload.name || 'Devotee',
          payload.details.pujaName || 'Puja Ritual',
          payload.details.bookingNumber || 'N/A',
          `₹${payload.details.amount || 0}`
        ]
        fallbackMessage = `🕉️ *दिव्ययज्ञम् - संकल्प एवं पूजा पुष्टि* 🕉️\n\nप्रणाम ${payload.name} जी,\nआपकी पूजा सेवा का संकल्प पंजीकृत हो गया है!\n\n🛕 *पूजा अनुष्ठान:* ${payload.details.pujaName}\n📋 *बुक संख्या:* ${payload.details.bookingNumber}\n💵 *शुल्क/दक्षिणा:* ₹${payload.details.amount}\n\nदिव्ययज्ञम् सनातन सेवा 🙏`
        break

      case 'QUERY_SUBMITTED':
        templateName = 'query_received'
        templateParams = [
          payload.name || 'Devotee',
          payload.details.querySubject || 'General Query'
        ]
        fallbackMessage = `🚩 *दिव्ययज्ञम् - प्रश्न/सहायता प्राप्त हुई* 🚩\n\nनमस्ते ${payload.name} जी,\nहमें आपका प्रश्न प्राप्त हुआ है: "${payload.details.querySubject || 'General Query'}"\n\nहमारे आचार्य जल्द संपर्क करेंगे। हरि ओम्! 🙏`
        break

      case 'INVOICE_GENERATED':
        templateName = 'invoice_receipt'
        templateParams = [
          payload.name || 'Devotee',
          payload.details.orderNumber || payload.details.bookingNumber || 'N/A',
          `₹${payload.details.amount || 0}`,
          payload.details.link || 'https://divyayagyam.com/dashboard/invoices'
        ]
        fallbackMessage = `📄 *दिव्ययज्ञम् - रसीद / बिल (Invoice)* 📄\n\nनमस्ते ${payload.name} जी,\nआपके ऑर्डर ${payload.details.orderNumber || payload.details.bookingNumber} की रसीद तैयार है।\nकुल: ₹${payload.details.amount}\n\nधन्यवाद! 🙏`
        break

      default:
        templateName = 'generic_notification'
        templateParams = [payload.name || 'Devotee']
        fallbackMessage = `🚩 *दिव्ययज्ञम् सूचना:* नमस्ते ${payload.name} जी, आपके अनुरोध के लिए धन्यवाद। हरि ओम्!`
    }

    // Construct Payload compatible with AiSensy + WhatsAPI Standard
    const requestBody: Record<string, any> = {
      apiKey,
      campaignName: campaignName || templateName,
      destination: cleanPhone,
      userName: payload.name || 'Devotee',
      templateName: templateName,
      templateParams: templateParams,
      // Generic WhatsAPI compatibility fields
      sender: senderNumber,
      number: cleanPhone,
      message: fallbackMessage,
      msg: fallbackMessage,
      pdfUrl: payload.details.pdfUrl || undefined
    }

    // Call API Endpoint
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'x-api-key': apiKey
      },
      body: JSON.stringify(requestBody)
    })

    const result = await response.json().catch(() => ({}))
    console.log('[WhatsApp API Response]:', result)
    return true
  } catch (err: any) {
    console.error('[WhatsApp Automation Error]:', err?.message)
    return false
  }
}
