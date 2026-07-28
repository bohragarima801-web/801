import { getSetting } from '@/lib/settings'

export type WhatsAppTriggerType = 
  | 'ORDER_SUCCESS' 
  | 'PUJA_CONFIRMED' 
  | 'VIP_PUJA_BOOKING'
  | 'PRODUCT_BOOKING'
  | 'SPECIAL_OFFER'
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
    productName?: string
    offerTitle?: string
    discountCode?: string
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
 * Implements Official AiSensy Approved Meta Templates for Products, Pujas, VIP Anusthan, Special Offers & Invoices
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

    // Prepare Template Name & Dynamic Parameters array as per AiSensy Meta Guide
    let templateName = ''
    let templateParams: string[] = []
    let fallbackMessage = ''

    switch (payload.type) {
      // 1. PRODUCT BOOKING / ORDER CONFIRMATION TEMPLATE
      case 'PRODUCT_BOOKING':
      case 'ORDER_SUCCESS':
        templateName = 'product_booking_confirmation'
        templateParams = [
          payload.name || 'Devotee',                                     // {{1}} Devotee Name
          payload.details.productName || payload.details.items || 'Sanatan Product', // {{2}} Product Name
          payload.details.orderNumber || 'N/A',                          // {{3}} Order Number
          `₹${payload.details.amount || 0}`,                             // {{4}} Paid Amount
          payload.details.link || 'https://divyayagyam.com/dashboard/orders' // {{5}} Track Order Link
        ]
        fallbackMessage = `🚩 *दिव्ययज्ञम् - उत्पाद बुकिंग पुष्टि (Product Order Confirmed)* 🚩\n\nनमस्ते *${payload.name}* जी,\n\nआपका सिद्ध *${payload.details.productName || payload.details.items}* ऑर्डर सफलतापूर्वक बुक हो गया है!\n\n📦 *ऑर्डर संख्या:* ${payload.details.orderNumber}\n💰 *कुल राशि:* ₹${payload.details.amount}\n\nअपने ऑर्डर की स्थिति ट्रैक करने के लिए नीचे दिए गए लिंक पर क्लिक करें:\n${payload.details.link || 'https://divyayagyam.com/dashboard/orders'}\n\nहरि ओम्! 🙏`
        break

      // 2. PUJA SANKALP BOOKING TEMPLATE
      case 'PUJA_CONFIRMED':
        templateName = 'puja_sankalp_confirmation'
        templateParams = [
          payload.name || 'Devotee',                                     // {{1}} Devotee Name
          payload.details.pujaName || 'Sacred Puja Ritual',              // {{2}} Puja Ritual Name
          payload.details.bookingNumber || 'N/A',                        // {{3}} Booking Number
          `₹${payload.details.amount || 0}`,                             // {{4}} Dakshina Amount
          payload.details.link || 'https://divyayagyam.com/dashboard/bookings' // {{5}} Dashboard Link
        ]
        fallbackMessage = `🕉️ *दिव्ययज्ञम् - संकल्प एवं पूजा बुकिंग पुष्टि* 🕉️\n\nप्रणाम *${payload.name}* जी,\n\nआपकी *${payload.details.pujaName}* का संकल्प एवं पूजा सेवा सफलतापूर्वक बुक हो गई है!\n\n📋 *बुकिंग संख्या:* ${payload.details.bookingNumber}\n💵 *दक्षिण/शुल्क:* ₹${payload.details.amount}\n\nपूजन पश्चात संकल्प वीडियो एवं प्रसाद अपडेट के लिए डैशबोर्ड देखें:\n${payload.details.link || 'https://divyayagyam.com/dashboard/bookings'}\n\nदिव्ययज्ञम् सनातन सेवा 🙏`
        break

      // 3. VIP PUJA ANUSTHAN BOOKING TEMPLATE
      case 'VIP_PUJA_BOOKING':
        templateName = 'vip_puja_anusthan_confirmation'
        templateParams = [
          payload.name || 'Devotee',                                     // {{1}} Devotee Name
          payload.details.pujaName || 'VIP Special Yagyam',              // {{2}} VIP Anusthan Name
          payload.details.bookingNumber || 'N/A',                        // {{3}} VIP Reference ID
          `₹${payload.details.amount || 0}`,                             // {{4}} Total Dakshina
          payload.details.date || 'As Scheduled'                         // {{5}} Live Stream Schedule
        ]
        fallbackMessage = `🚩 *दिव्ययज्ञम् - VIP विशेषाधिकार अनुष्ठान बुकिंग* 🚩\n\nप्रणाम श्रेष्ठ *${payload.name}* जी,\n\nआपके *${payload.details.pujaName}* VIP अनुष्ठान का मुख्य यजमान संकल्प स्वीकार कर लिया गया है!\n\n👑 *VIP संदर्भ संख्या:* ${payload.details.bookingNumber}\n💎 *विशेष दक्षिणा:* ₹${payload.details.amount}\n📅 *लाइव प्रसारण समय:* ${payload.details.date || 'नियत तिथि पर'}\n\nमुख्य आचार्य द्वारा आपसे व्यक्तिगत संपर्क किया जाएगा।\n\nहरि ओम्! 🙏`
        break

      // 4. SPECIAL PROMOTIONAL OFFER & FESTIVAL DISCOUNT TEMPLATE
      case 'SPECIAL_OFFER':
        templateName = 'special_sanatan_offer'
        templateParams = [
          payload.name || 'Devotee',                                     // {{1}} Devotee Name
          payload.details.offerTitle || 'विशेष सनातन पर्व छूट',           // {{2}} Offer Title
          payload.details.discountCode || 'SANATAN10',                  // {{3}} Coupon Code
          payload.details.link || 'https://divyayagyam.com/pujas'        // {{4}} Claim Offer Link
        ]
        fallbackMessage = `🌸 *दिव्ययज्ञम् - विशेष पावन अवसर उपहार* 🌸\n\nनमस्ते *${payload.name}* जी,\n\n${payload.details.offerTitle || 'विशेष सनातन पर्व अवसर'} पर आपके लिए एक पावन उपहार!\n\n🎁 *कूपन कोड:* *${payload.details.discountCode || 'SANATAN10'}*\n\nअपनी पसंदीदा पूजा या अभिमंत्रित सामग्री बुक करने के लिए नीचे दिए गए लिंक पर क्लिक करें:\n${payload.details.link || 'https://divyayagyam.com/pujas'}\n\nहरि ओम्! 🙏`
        break

      // 5. QUERY / HELP SUBMITTED TEMPLATE
      case 'QUERY_SUBMITTED':
        templateName = 'query_support_received'
        templateParams = [
          payload.name || 'Devotee',                                     // {{1}} Devotee Name
          payload.details.querySubject || 'General Consultation'         // {{2}} Subject
        ]
        fallbackMessage = `🚩 *दिव्ययज्ञम् - प्रश्न/सहायता प्राप्त हुई* 🚩\n\nनमस्ते *${payload.name}* जी,\n\nहमें आपका प्रश्न/परामर्श अनुरोध प्राप्त हुआ है:\n"${payload.details.querySubject || 'General Consultation'}"\n\nहमारे विद्वान आचार्य जल्द ही आपसे व्हाट्सएप पर संपर्क करेंगे।\n\nहरि ओम्! 🙏`
        break

      // 6. OFFICIAL INVOICE & BILL RECEIPT TEMPLATE
      case 'INVOICE_GENERATED':
        templateName = 'official_invoice_receipt'
        templateParams = [
          payload.name || 'Devotee',                                     // {{1}} Devotee Name
          payload.details.orderNumber || payload.details.bookingNumber || 'N/A', // {{2}} Invoice/Ref No
          `₹${payload.details.amount || 0}`,                             // {{3}} Total Amount Paid
          payload.details.link || 'https://divyayagyam.com/dashboard/invoices' // {{4}} Download Invoice Link
        ]
        fallbackMessage = `📄 *दिव्ययज्ञम् - आधिकारिक भुगतान रसीद (Invoice)* 📄\n\nनमस्ते *${payload.name}* जी,\n\nआपके ऑर्डर *${payload.details.orderNumber || payload.details.bookingNumber}* की डिजिटल रसीद जारी कर दी गई है।\n\n💵 *कुल भुगतान:* ₹${payload.details.amount}\n\nअपनी आधिकारिक रसीद डाउनलोड करने के लिए यहाँ क्लिक करें:\n${payload.details.link || 'https://divyayagyam.com/dashboard/invoices'}\n\nधन्यवाद! 🙏`
        break

      default:
        templateName = 'generic_divyayagyam_alert'
        templateParams = [payload.name || 'Devotee']
        fallbackMessage = `🚩 *दिव्ययज्ञम् सूचना:* नमस्ते *${payload.name}* जी, आपके अनुरोध के लिए धन्यवाद। हरि ओम्!`
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
