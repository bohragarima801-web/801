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
 * Send automated WhatsApp notification using WhatsAPI / Custom Gateway
 */
export async function sendWhatsAppNotification(payload: WhatsAppNotificationPayload): Promise<boolean> {
  try {
    const apiUrl = await getSetting('secret.whatsapp_api_url', 'WHATSAPP_API_URL')
    const apiKey = await getSetting('secret.whatsapp_api_key', 'WHATSAPP_API_KEY')
    const senderNumber = await getSetting('secret.whatsapp_sender_number', 'WHATSAPP_SENDER_NUMBER')
    const isEnabled = await getSetting('whatsapp.automation_enabled')

    if (isEnabled === 'false' || !apiUrl || !apiKey) {
      console.log('[WhatsApp Automation] Service skipped (Missing API URL or disabled).')
      return false
    }

    // Clean phone number format (ensure country code +91 for India)
    let cleanPhone = payload.phone.replace(/[^0-9]/g, '')
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`
    }

    // Craft automated message template based on trigger type
    let message = ''
    switch (payload.type) {
      case 'ORDER_SUCCESS':
        message = `🚩 *दिव्ययज्ञम् - ऑर्डर पुष्टि (Order Confirmed)* 🚩\n\nनमस्ते ${payload.name} जी,\nआपका ऑर्डर सफलतापूर्वक दर्ज हो गया है!\n\n📦 *ऑर्डर संख्या:* ${payload.details.orderNumber}\n💰 *कुल राशि:* ₹${payload.details.amount}\n🛍️ *सामग्री:* ${payload.details.items || 'Sanatan Samagri'}\n\nआप अपने ऑर्डर की स्थिति ट्रैक करने के लिए यहाँ क्लिक करें:\nhttps://divyayagyam.com/dashboard/orders\n\nहरि ओम्! 🙏`
        break

      case 'PUJA_CONFIRMED':
        message = `🕉️ *दिव्ययज्ञम् - संकल्प एवं पूजा पुष्टि* 🕉️\n\nप्रणाम ${payload.name} जी,\nआपकी पूजा सेवा का संकल्प पंजीकृत हो गया है!\n\n🛕 *पूजा अनुष्ठान:* ${payload.details.pujaName}\n📋 *बुक संख्या:* ${payload.details.bookingNumber}\n💵 *शुल्क/दक्षिणा:* ₹${payload.details.amount}\n\nपूजन पश्चात लाइव वीडियो और प्रसाद का विवरण आपके डैशबोर्ड में उपलब्ध होगा।\n\nशुभकामनाएं,\nदिव्ययज्ञम् सनातन सेवा 🙏`
        break

      case 'QUERY_SUBMITTED':
        message = `🚩 *दिव्ययज्ञम् - प्रश्न/सहायता प्राप्त हुई* 🚩\n\nनमस्ते ${payload.name} जी,\nहमें आपका प्रश्न प्राप्त हुआ है: "${payload.details.querySubject || 'General Query'}"\n\nहमारे आचार्य/विशेषज्ञ जल्द ही आपसे संपर्क करेंगे।\n\nहरि ओम्! 🙏`
        break

      case 'INVOICE_GENERATED':
        message = `📄 *दिव्यyagyam - रसीद / बिल (Invoice)* 📄\n\nनमस्ते ${payload.name} जी,\nआपके ऑर्डर ${payload.details.orderNumber || payload.details.bookingNumber} की आधिकारिक रसीद तैयार है।\n\nकुल भुगतान: ₹${payload.details.amount}\n\nरसीद देखें/डाउनलोड करें:\n${payload.details.link || 'https://divyayagyam.com/dashboard/invoices'}\n\nधन्यवाद! 🙏`
        break

      default:
        message = `🚩 *दिव्ययज्ञम् सूचना:* नमस्ते ${payload.name} जी, आपके अनुरोध के लिए धन्यवाद। हरि ओम्!`
    }

    // Call WhatsAPI provider endpoint
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        apiKey,
        sender: senderNumber,
        number: cleanPhone,
        message,
        msg: message,
        pdfUrl: payload.details.pdfUrl || undefined
      })
    })

    const result = await response.json().catch(() => ({}))
    console.log('[WhatsApp API Response]:', result)
    return true
  } catch (err: any) {
    console.error('[WhatsApp Automation Error]:', err?.message)
    return false
  }
}
