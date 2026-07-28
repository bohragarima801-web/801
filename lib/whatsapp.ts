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
  lang?: 'hi' | 'en' | 'hinglish'
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
 * Meta Approved WhatsApp Templates Library (Hindi, English, Hinglish)
 */
export const META_TEMPLATES = {
  hi: [
    {
      category: 'PRODUCT BOOKING',
      name: 'product_booking_confirmation_hi',
      metaCategory: 'UTILITY',
      body: `🚩 *दिव्ययज्ञम् - उत्पाद बुकिंग पुष्टि (Product Order Confirmed)* 🚩\n\nनमस्ते *{{1}}* जी,\n\nआपका सिद्ध *{{2}}* ऑर्डर सफलतापूर्वक बुक हो गया है!\n\n📦 *ऑर्डर संख्या:* {{3}}\n💰 *कुल राशि:* {{4}}\n\nअपने ऑर्डर की स्थिति ट्रैक करने के लिए नीचे दिए गए लिंक पर क्लिक करें:\n{{5}}\n\nहरि ओम्! 🙏`,
      params: ['Devotee Name', 'Product Name', 'Order Number', 'Total Paid Amount', 'Tracking Link']
    },
    {
      category: 'PUJA SANKALP BOOKING',
      name: 'puja_sankalp_confirmation_hi',
      metaCategory: 'UTILITY',
      body: `🕉️ *दिव्ययज्ञम् - संकल्प एवं पूजा बुकिंग पुष्टि* 🕉️\n\nप्रणाम *{{1}}* जी,\n\nआपकी *{{2}}* का संकल्प एवं पूजा सेवा सफलतापूर्वक बुक हो गई है!\n\n📋 *बुकिंग संख्या:* {{3}}\n💵 *दक्षिण/शुल्क:* {{4}}\n\nपूजन पश्चात संकल्प वीडियो एवं प्रसाद अपडेट के लिए डैशबोर्ड देखें:\n{{5}}\n\nदिव्ययज्ञम् सनातन सेवा 🙏`,
      params: ['Devotee Name', 'Puja Ritual Name', 'Booking Number', 'Dakshina Amount', 'Dashboard Link']
    },
    {
      category: 'VIP ANUSTHAN PRIVILEGE',
      name: 'vip_puja_anusthan_confirmation_hi',
      metaCategory: 'UTILITY',
      body: `🚩 *दिव्ययज्ञम् - VIP विशेषाधिकार अनुष्ठान बुकिंग* 🚩\n\nप्रणाम श्रेष्ठ *{{1}}* जी,\n\nआपके *{{2}}* VIP अनुष्ठान का मुख्य यजमान संकल्प स्वीकार कर लिया गया है!\n\n👑 *VIP संदर्भ संख्या:* {{3}}\n💎 *विशेष दक्षिणा:* {{4}}\n📅 *लाइव प्रसारण समय:* {{5}}\n\nमुख्य आचार्य द्वारा आपसे व्यक्तिगत संपर्क किया जाएगा।\n\nहरि ओम्! 🙏`,
      params: ['Devotee Name', 'VIP Anusthan Name', 'VIP Reference ID', 'Total Dakshina', 'Live Stream Schedule']
    },
    {
      category: 'FESTIVAL DISCOUNT OFFER',
      name: 'special_sanatan_offer_hi',
      metaCategory: 'MARKETING',
      body: `🌸 *दिव्ययज्ञम् - विशेष पावन अवसर उपहार* 🌸\n\nनमस्ते *{{1}}* जी,\n\n{{2}} पर आपके लिए एक पावन उपहार!\n\n🎁 *कूपन कोड:* *{{3}}*\n\nअपनी पसंदीदा पूजा या अभिमंत्रित सामग्री बुक करने के लिए नीचे दिए गए लिंक पर क्लिक करें:\n{{4}}\n\nहरि ओम्! 🙏`,
      params: ['Devotee Name', 'Offer Title', 'Coupon Code', 'Claim Offer Link']
    },
    {
      category: 'SUPPORT QUERY RECEIVED',
      name: 'query_support_received_hi',
      metaCategory: 'UTILITY',
      body: `🚩 *दिव्ययज्ञम् - प्रश्न/सहायता प्राप्त हुई* 🚩\n\nनमस्ते *{{1}}* जी,\n\nहमें आपका प्रश्न/परामर्श अनुरोध प्राप्त हुआ है:\n"{{2}}"\n\nहमारे विद्वान आचार्य जल्द ही आपसे व्हाट्सएप पर संपर्क करेंगे।\n\nहरि ओम्! 🙏`,
      params: ['Devotee Name', 'Query Subject']
    },
    {
      category: 'DIGITAL INVOICE RECEIPT',
      name: 'official_invoice_receipt_hi',
      metaCategory: 'UTILITY',
      body: `📄 *दिव्ययज्ञम् - आधिकारिक भुगतान रसीद (Invoice)* 📄\n\nनमस्ते *{{1}}* जी,\n\nआपके ऑर्डर *{{2}}* की डिजिटल रसीद जारी कर दी गई है।\n\n💵 *कुल भुगतान:* {{3}}\n\nअपनी आधिकारिक रसीद डाउनलोड करने के लिए यहाँ क्लिक करें:\n{{4}}\n\nधन्यवाद! 🙏`,
      params: ['Devotee Name', 'Invoice Ref Number', 'Total Amount Paid', 'Download Invoice Link']
    }
  ],
  en: [
    {
      category: 'PRODUCT BOOKING',
      name: 'product_booking_confirmation_en',
      metaCategory: 'UTILITY',
      body: `🚩 *DivyaYagyam - Product Booking Confirmed* 🚩\n\nHello *{{1}}*,\n\nYour order for consecrated *{{2}}* has been successfully booked!\n\n📦 *Order Number:* {{3}}\n💰 *Total Paid:* {{4}}\n\nTrack your order status here:\n{{5}}\n\nHari Om! 🙏`,
      params: ['Devotee Name', 'Product Name', 'Order Number', 'Total Paid Amount', 'Tracking Link']
    },
    {
      category: 'PUJA SANKALP BOOKING',
      name: 'puja_sankalp_confirmation_en',
      metaCategory: 'UTILITY',
      body: `🕉️ *DivyaYagyam - Puja & Sankalp Confirmed* 🕉️\n\nNamaste *{{1}}*,\n\nYour Sankalp for *{{2}}* has been registered successfully!\n\n📋 *Booking Number:* {{3}}\n💵 *Dakshina/Fee:* {{4}}\n\nView Sankalp Video and Prasad updates on your dashboard:\n{{5}}\n\nDivyaYagyam Sanatan Seva 🙏`,
      params: ['Devotee Name', 'Puja Ritual Name', 'Booking Number', 'Dakshina Amount', 'Dashboard Link']
    },
    {
      category: 'VIP ANUSTHAN PRIVILEGE',
      name: 'vip_puja_anusthan_confirmation_en',
      metaCategory: 'UTILITY',
      body: `🚩 *DivyaYagyam - VIP Anusthan Privilege Booking* 🚩\n\nGreetings *{{1}}*,\n\nYour Yajaman Sankalp for *{{2}}* VIP Anusthan has been accepted!\n\n👑 *VIP Ref ID:* {{3}}\n💎 *Special Dakshina:* {{4}}\n📅 *Live Broadcast:* {{5}}\n\nOur Head Priest will connect with you personally.\n\nHari Om! 🙏`,
      params: ['Devotee Name', 'VIP Anusthan Name', 'VIP Reference ID', 'Total Dakshina', 'Live Stream Schedule']
    },
    {
      category: 'FESTIVAL DISCOUNT OFFER',
      name: 'special_sanatan_offer_en',
      metaCategory: 'MARKETING',
      body: `🌸 *DivyaYagyam - Special Festive Blessing Offer* 🌸\n\nNamaste *{{1}}*,\n\nA special festive gift for you on *{{2}}*!\n\n🎁 *Coupon Code:* *{{3}}*\n\nBook your puja or consecrated samagri here:\n{{4}}\n\nHari Om! 🙏`,
      params: ['Devotee Name', 'Offer Title', 'Coupon Code', 'Claim Offer Link']
    },
    {
      category: 'SUPPORT QUERY RECEIVED',
      name: 'query_support_received_en',
      metaCategory: 'UTILITY',
      body: `🚩 *DivyaYagyam - Support Inquiry Received* 🚩\n\nHello *{{1}}*,\n\nWe have received your query/consultation request:\n"{{2}}"\n\nOur Vedic priests & support team will contact you on WhatsApp shortly.\n\nHari Om! 🙏`,
      params: ['Devotee Name', 'Query Subject']
    },
    {
      category: 'DIGITAL INVOICE RECEIPT',
      name: 'official_invoice_receipt_en',
      metaCategory: 'UTILITY',
      body: `📄 *DivyaYagyam - Official Invoice Receipt* 📄\n\nHello *{{1}}*,\n\nThe digital invoice for your order *{{2}}* has been issued.\n\n💵 *Total Paid:* {{3}}\n\nDownload your official tax invoice here:\n{{4}}\n\nThank you! 🙏`,
      params: ['Devotee Name', 'Invoice Ref Number', 'Total Amount Paid', 'Download Invoice Link']
    }
  ],
  hinglish: [
    {
      category: 'PRODUCT BOOKING',
      name: 'product_booking_confirmation_hinglish',
      metaCategory: 'UTILITY',
      body: `🚩 *DivyaYagyam - Product Booking Confirmed* 🚩\n\nNamaste *{{1}}* ji,\n\nAapka abhimantrit *{{2}}* order successfully book ho gaya hai!\n\n📦 *Order Number:* {{3}}\n💰 *Total Amount:* {{4}}\n\nAapne order ki status track karne ke liye niche link par click karein:\n{{5}}\n\nHari Om! 🙏`,
      params: ['Devotee Name', 'Product Name', 'Order Number', 'Total Paid Amount', 'Tracking Link']
    },
    {
      category: 'PUJA SANKALP BOOKING',
      name: 'puja_sankalp_confirmation_hinglish',
      metaCategory: 'UTILITY',
      body: `🕉️ *DivyaYagyam - Puja & Sankalp Confirmed* 🕉️\n\nPranam *{{1}}* ji,\n\nAapki *{{2}}* ka Sankalp and Puja service successfully confirm ho gaya hai!\n\n📋 *Booking Number:* {{3}}\n💵 *Dakshina:* {{4}}\n\nPuja ke baad Sankalp video and Prasad updates dashboard par dekhein:\n{{5}}\n\nDivyaYagyam Sanatan Seva 🙏`,
      params: ['Devotee Name', 'Puja Ritual Name', 'Booking Number', 'Dakshina Amount', 'Dashboard Link']
    },
    {
      category: 'VIP ANUSTHAN PRIVILEGE',
      name: 'vip_puja_anusthan_confirmation_hinglish',
      metaCategory: 'UTILITY',
      body: `🚩 *DivyaYagyam - VIP Privilege Anusthan Booking* 🚩\n\nPranam Shreshth *{{1}}* ji,\n\nAapke *{{2}}* VIP Anusthan ka Mukhya Yajaman Sankalp accept kar liya gaya hai!\n\n👑 *VIP Ref ID:* {{3}}\n💎 *Special Dakshina:* {{4}}\n📅 *Live Stream Timing:* {{5}}\n\nMukhya Acharya ji aapse personal contact karenge.\n\nHari Om! 🙏`,
      params: ['Devotee Name', 'VIP Anusthan Name', 'VIP Reference ID', 'Total Dakshina', 'Live Stream Schedule']
    },
    {
      category: 'FESTIVAL DISCOUNT OFFER',
      name: 'special_sanatan_offer_hinglish',
      metaCategory: 'MARKETING',
      body: `🌸 *DivyaYagyam - Special Festive Gift Offer* 🌸\n\nNamaste *{{1}}* ji,\n\n*{{2}}* ke pavitra avsar par aapke liye special gift!\n\n🎁 *Coupon Code:* *{{3}}*\n\nAapni pasandida Puja ya Abhimantrit Samagri book karne ke liye click karein:\n{{4}}\n\nHari Om! 🙏`,
      params: ['Devotee Name', 'Offer Title', 'Coupon Code', 'Claim Offer Link']
    },
    {
      category: 'SUPPORT QUERY RECEIVED',
      name: 'query_support_received_hinglish',
      metaCategory: 'UTILITY',
      body: `🚩 *DivyaYagyam - Help & Query Received* 🚩\n\nNamaste *{{1}}* ji,\n\nHamein aapka query/consultation request mil gaya hai:\n"{{2}}"\n\nHamare acharya ji va support team jaldi hi aapse WhatsApp par contact karegi.\n\nHari Om! 🙏`,
      params: ['Devotee Name', 'Query Subject']
    },
    {
      category: 'DIGITAL INVOICE RECEIPT',
      name: 'official_invoice_receipt_hinglish',
      metaCategory: 'UTILITY',
      body: `📄 *DivyaYagyam - Official Payment Invoice* 📄\n\nNamaste *{{1}}* ji,\n\nAapke order *{{2}}* ki official digital receipt issue kar di gayi hai.\n\n💵 *Total Amount:* {{3}}\n\nAapni digital invoice receipt download karne ke liye yahan click karein:\n{{4}}\n\nDhanyawad! 🙏`,
      params: ['Devotee Name', 'Invoice Ref Number', 'Total Amount Paid', 'Download Invoice Link']
    }
  ]
}

/**
 * Send automated WhatsApp notification using WhatsAPI / AiSensy Gateway
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

    const lang = payload.lang || 'hi'
    const templateList = META_TEMPLATES[lang] || META_TEMPLATES.hi

    let selectedTemplate = templateList[0]
    let templateParams: string[] = []

    switch (payload.type) {
      case 'PRODUCT_BOOKING':
      case 'ORDER_SUCCESS':
        selectedTemplate = templateList.find(t => t.name.startsWith('product_booking')) || templateList[0]
        templateParams = [
          payload.name || 'Devotee',
          payload.details.productName || payload.details.items || 'Sanatan Product',
          payload.details.orderNumber || 'N/A',
          `₹${payload.details.amount || 0}`,
          payload.details.link || 'https://divyayagyam.com/dashboard/orders'
        ]
        break

      case 'PUJA_CONFIRMED':
        selectedTemplate = templateList.find(t => t.name.startsWith('puja_sankalp')) || templateList[1]
        templateParams = [
          payload.name || 'Devotee',
          payload.details.pujaName || 'Sacred Puja Ritual',
          payload.details.bookingNumber || 'N/A',
          `₹${payload.details.amount || 0}`,
          payload.details.link || 'https://divyayagyam.com/dashboard/bookings'
        ]
        break

      case 'VIP_PUJA_BOOKING':
        selectedTemplate = templateList.find(t => t.name.startsWith('vip_puja')) || templateList[2]
        templateParams = [
          payload.name || 'Devotee',
          payload.details.pujaName || 'VIP Special Yagyam',
          payload.details.bookingNumber || 'N/A',
          `₹${payload.details.amount || 0}`,
          payload.details.date || 'As Scheduled'
        ]
        break

      case 'SPECIAL_OFFER':
        selectedTemplate = templateList.find(t => t.name.startsWith('special_sanatan')) || templateList[3]
        templateParams = [
          payload.name || 'Devotee',
          payload.details.offerTitle || 'Special Offer',
          payload.details.discountCode || 'SANATAN10',
          payload.details.link || 'https://divyayagyam.com/pujas'
        ]
        break

      case 'QUERY_SUBMITTED':
        selectedTemplate = templateList.find(t => t.name.startsWith('query_support')) || templateList[4]
        templateParams = [
          payload.name || 'Devotee',
          payload.details.querySubject || 'General Consultation'
        ]
        break

      case 'INVOICE_GENERATED':
        selectedTemplate = templateList.find(t => t.name.startsWith('official_invoice')) || templateList[5]
        templateParams = [
          payload.name || 'Devotee',
          payload.details.orderNumber || payload.details.bookingNumber || 'N/A',
          `₹${payload.details.amount || 0}`,
          payload.details.link || 'https://divyayagyam.com/dashboard/invoices'
        ]
        break
    }

    let fallbackMessage = selectedTemplate.body
    templateParams.forEach((param, idx) => {
      fallbackMessage = fallbackMessage.replace(new RegExp(`\\{\\{${idx + 1}\\}\\}`, 'g'), param)
    })

    const requestBody: Record<string, any> = {
      apiKey,
      campaignName: campaignName || selectedTemplate.name,
      destination: cleanPhone,
      userName: payload.name || 'Devotee',
      templateName: selectedTemplate.name,
      templateParams: templateParams,
      sender: senderNumber,
      number: cleanPhone,
      message: fallbackMessage,
      msg: fallbackMessage,
      pdfUrl: payload.details.pdfUrl || undefined
    }

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
