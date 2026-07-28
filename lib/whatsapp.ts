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
    mediaUrl?: string
    querySubject?: string
  }
}

export interface MetaTemplateDefinition {
  category: string
  name: string
  metaCategory: 'UTILITY' | 'MARKETING' | 'AUTHENTICATION'
  headerType: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'TEXT' | 'NONE'
  headerSampleUrl?: string
  body: string
  footer?: string
  params: string[]
  actions: Array<{
    type: 'URL' | 'PHONE_NUMBER' | 'QUICK_REPLY'
    title: string
    value: string
  }>
}

/**
 * Meta Approved WhatsApp Rich Media Templates Library (Image, Video, Document + Buttons)
 * Exactly matches AiSensy Meta Approved Submission Format (Section 4 & Section 9 of PDF)
 */
export const META_TEMPLATES: Record<string, MetaTemplateDefinition[]> = {
  hi: [
    {
      category: 'PRODUCT BOOKING',
      name: 'product_booking_confirmation_hi',
      metaCategory: 'UTILITY',
      headerType: 'IMAGE',
      headerSampleUrl: 'https://divyayagyam.com/images/product-banner.jpg',
      body: `🚩 *दिव्ययज्ञम् - उत्पाद बुकिंग पुष्टि (Product Order Confirmed)* 🚩\n\nनमस्ते *{{1}}* जी,\n\nआपका सिद्ध *{{2}}* ऑर्डर सफलतापूर्वक बुक हो गया है!\n\n📦 *ऑर्डर संख्या:* {{3}}\n💰 *कुल राशि:* {{4}}\n\nअपने ऑर्डर की स्थिति ट्रैक करने के लिए नीचे दिए गए बटन पर क्लिक करें।\n\nहरि ओम्! 🙏`,
      footer: 'दिव्ययज्ञम् - सनातन सेवा संस्थान',
      params: ['Devotee Name', 'Product Name', 'Order Number', 'Total Paid Amount'],
      actions: [
        { type: 'URL', title: 'Track Order Now 📦', value: 'https://divyayagyam.com/dashboard/orders' },
        { type: 'PHONE_NUMBER', title: 'Support Helpline 📞', value: '919587171984' }
      ]
    },
    {
      category: 'PUJA SANKALP BOOKING',
      name: 'puja_sankalp_confirmation_hi',
      metaCategory: 'UTILITY',
      headerType: 'VIDEO',
      headerSampleUrl: 'https://divyayagyam.com/videos/sankalp-intro.mp4',
      body: `🕉️ *दिव्ययज्ञम् - संकल्प एवं पूजा बुकिंग पुष्टि* 🕉️\n\nप्रणाम *{{1}}* जी,\n\nआपकी *{{2}}* का संकल्प एवं पूजा सेवा सफलतापूर्वक बुक हो गई है!\n\n📋 *बुकिंग संख्या:* {{3}}\n💵 *दक्षिण/शुल्क:* {{4}}\n\nपूजन पश्चात संकल्प वीडियो एवं प्रसाद अपडेट के लिए नीचे दिए गए बटन पर क्लिक करें।\n\nदिव्ययज्ञम् सनातन सेवा 🙏`,
      footer: 'हरि ओम् तत्सत् 🙏',
      params: ['Devotee Name', 'Puja Ritual Name', 'Booking Number', 'Dakshina Amount'],
      actions: [
        { type: 'URL', title: 'View Sankalp Video 🎬', value: 'https://divyayagyam.com/dashboard/bookings' },
        { type: 'QUICK_REPLY', title: 'Talk to Pandit 🛕', value: 'talk_to_pandit' }
      ]
    },
    {
      category: 'VIP ANUSTHAN PRIVILEGE',
      name: 'vip_puja_anusthan_confirmation_hi',
      metaCategory: 'UTILITY',
      headerType: 'IMAGE',
      headerSampleUrl: 'https://divyayagyam.com/images/vip-yagyam.jpg',
      body: `🚩 *दिव्ययज्ञम् - VIP विशेषाधिकार अनुष्ठान बुकिंग* 🚩\n\nप्रणाम श्रेष्ठ *{{1}}* जी,\n\nआपके *{{2}}* VIP अनुष्ठान का मुख्य यजमान संकल्प स्वीकार कर लिया गया है!\n\n👑 *VIP संदर्भ संख्या:* {{3}}\n💎 *विशेष दक्षिणा:* {{4}}\n📅 *लाइव प्रसारण समय:* {{5}}\n\nमुख्य आचार्य द्वारा आपसे व्यक्तिगत संपर्क किया जाएगा।`,
      footer: 'विशेष यजमान आमंत्रण',
      params: ['Devotee Name', 'VIP Anusthan Name', 'VIP Reference ID', 'Total Dakshina', 'Live Stream Schedule'],
      actions: [
        { type: 'URL', title: 'Live Stream Link 🎥', value: 'https://divyayagyam.com/live' },
        { type: 'PHONE_NUMBER', title: 'Acharya Contact 📞', value: '919587171984' }
      ]
    },
    {
      category: 'FESTIVAL DISCOUNT OFFER',
      name: 'special_sanatan_offer_hi',
      metaCategory: 'MARKETING',
      headerType: 'IMAGE',
      headerSampleUrl: 'https://divyayagyam.com/images/festive-offer.jpg',
      body: `🌸 *दिव्ययज्ञम् - विशेष पावन अवसर उपहार* 🌸\n\nनमस्ते *{{1}}* जी,\n\n{{2}} पर आपके लिए एक पावन अवसर उपहार!\n\n🎁 *विशेष कूपन कोड:* *{{3}}*\n\nअपनी पसंदीदा पूजा या अभिमंत्रित सामग्री तुरंत बुक करें।`,
      footer: 'सीमित समय सनातन ऑफर',
      params: ['Devotee Name', 'Offer Title', 'Coupon Code'],
      actions: [
        { type: 'URL', title: 'Claim Offer Now 🎁', value: 'https://divyayagyam.com/pujas' },
        { type: 'QUICK_REPLY', title: 'Get Guidance 💬', value: 'get_guidance' }
      ]
    },
    {
      category: 'SUPPORT QUERY RECEIVED',
      name: 'query_support_received_hi',
      metaCategory: 'UTILITY',
      headerType: 'NONE',
      body: `🚩 *दिव्ययज्ञम् - प्रश्न/सहायता प्राप्त हुई* 🚩\n\nनमस्ते *{{1}}* जी,\n\nहमें आपका प्रश्न/परामर्श अनुरोध प्राप्त हुआ है:\n"{{2}}"\n\nहमारे विद्वान आचार्य जल्द ही आपसे संपर्क करेंगे।\n\nहरि ओम्! 🙏`,
      footer: 'दिव्ययज्ञम् सहायता टीम',
      params: ['Devotee Name', 'Query Subject'],
      actions: [
        { type: 'QUICK_REPLY', title: 'Talk to Human 💬', value: 'talk_to_human' }
      ]
    },
    {
      category: 'DIGITAL INVOICE RECEIPT',
      name: 'official_invoice_receipt_hi',
      metaCategory: 'UTILITY',
      headerType: 'DOCUMENT',
      headerSampleUrl: 'https://divyayagyam.com/docs/invoice-sample.pdf',
      body: `📄 *दिव्ययज्ञम् - आधिकारिक भुगतान रसीद (Invoice)* 📄\n\nनमस्ते *{{1}}* जी,\n\nआपके ऑर्डर *{{2}}* की डिजिटल रसीद जारी कर दी गई है।\n\n💵 *कुल भुगतान:* {{3}}\n\nअपनी आधिकारिक रसीद देखने के लिए बटन दबाएं।`,
      footer: 'कर रसीद प्रमाणिक दस्तावेज',
      params: ['Devotee Name', 'Invoice Ref Number', 'Total Amount Paid'],
      actions: [
        { type: 'URL', title: 'Download PDF Invoice 📄', value: 'https://divyayagyam.com/dashboard/invoices' }
      ]
    }
  ],

  en: [
    {
      category: 'PRODUCT BOOKING',
      name: 'product_booking_confirmation_en',
      metaCategory: 'UTILITY',
      headerType: 'IMAGE',
      headerSampleUrl: 'https://divyayagyam.com/images/product-banner.jpg',
      body: `🚩 *DivyaYagyam - Product Booking Confirmed* 🚩\n\nHello *{{1}}*,\n\nYour order for consecrated *{{2}}* has been successfully booked!\n\n📦 *Order Number:* {{3}}\n💰 *Total Paid:* {{4}}\n\nClick the button below to track your shipment.`,
      footer: 'DivyaYagyam Sanatan Seva',
      params: ['Devotee Name', 'Product Name', 'Order Number', 'Total Paid Amount'],
      actions: [
        { type: 'URL', title: 'Track Order Now 📦', value: 'https://divyayagyam.com/dashboard/orders' },
        { type: 'PHONE_NUMBER', title: 'Support Helpline 📞', value: '919587171984' }
      ]
    },
    {
      category: 'PUJA SANKALP BOOKING',
      name: 'puja_sankalp_confirmation_en',
      metaCategory: 'UTILITY',
      headerType: 'VIDEO',
      headerSampleUrl: 'https://divyayagyam.com/videos/sankalp-intro.mp4',
      body: `🕉️ *DivyaYagyam - Puja & Sankalp Confirmed* 🕉️\n\nNamaste *{{1}}*,\n\nYour Sankalp for *{{2}}* has been registered successfully!\n\n📋 *Booking Number:* {{3}}\n💵 *Dakshina/Fee:* {{4}}\n\nClick the button below to view Sankalp video & Prasad updates.`,
      footer: 'Hari Om Tat Sat 🙏',
      params: ['Devotee Name', 'Puja Ritual Name', 'Booking Number', 'Dakshina Amount'],
      actions: [
        { type: 'URL', title: 'View Sankalp Video 🎬', value: 'https://divyayagyam.com/dashboard/bookings' },
        { type: 'QUICK_REPLY', title: 'Talk to Pandit 🛕', value: 'talk_to_pandit' }
      ]
    },
    {
      category: 'VIP ANUSTHAN PRIVILEGE',
      name: 'vip_puja_anusthan_confirmation_en',
      metaCategory: 'UTILITY',
      headerType: 'IMAGE',
      headerSampleUrl: 'https://divyayagyam.com/images/vip-yagyam.jpg',
      body: `🚩 *DivyaYagyam - VIP Anusthan Privilege Booking* 🚩\n\nGreetings *{{1}}*,\n\nYour Yajaman Sankalp for *{{2}}* VIP Anusthan has been accepted!\n\n👑 *VIP Ref ID:* {{3}}\n💎 *Special Dakshina:* {{4}}\n📅 *Live Broadcast:* {{5}}\n\nOur Head Priest will connect with you personally.`,
      footer: 'Exclusive Devotee Privilege',
      params: ['Devotee Name', 'VIP Anusthan Name', 'VIP Reference ID', 'Total Dakshina', 'Live Stream Schedule'],
      actions: [
        { type: 'URL', title: 'Live Stream Link 🎥', value: 'https://divyayagyam.com/live' },
        { type: 'PHONE_NUMBER', title: 'Acharya Contact 📞', value: '919587171984' }
      ]
    },
    {
      category: 'FESTIVAL DISCOUNT OFFER',
      name: 'special_sanatan_offer_en',
      metaCategory: 'MARKETING',
      headerType: 'IMAGE',
      headerSampleUrl: 'https://divyayagyam.com/images/festive-offer.jpg',
      body: `🌸 *DivyaYagyam - Special Festive Blessing Offer* 🌸\n\nNamaste *{{1}}*,\n\nA special festive gift for you on *{{2}}*!\n\n🎁 *Coupon Code:* *{{3}}*\n\nBook your sacred puja or consecrated items now.`,
      footer: 'Limited Time Offer',
      params: ['Devotee Name', 'Offer Title', 'Coupon Code'],
      actions: [
        { type: 'URL', title: 'Claim Offer Now 🎁', value: 'https://divyayagyam.com/pujas' },
        { type: 'QUICK_REPLY', title: 'Get Guidance 💬', value: 'get_guidance' }
      ]
    },
    {
      category: 'SUPPORT QUERY RECEIVED',
      name: 'query_support_received_en',
      metaCategory: 'UTILITY',
      headerType: 'NONE',
      body: `🚩 *DivyaYagyam - Support Inquiry Received* 🚩\n\nHello *{{1}}*,\n\nWe have received your query/consultation request:\n"{{2}}"\n\nOur Vedic priests & support team will contact you shortly.`,
      footer: 'DivyaYagyam Help Desk',
      params: ['Devotee Name', 'Query Subject'],
      actions: [
        { type: 'QUICK_REPLY', title: 'Talk to Human 💬', value: 'talk_to_human' }
      ]
    },
    {
      category: 'DIGITAL INVOICE RECEIPT',
      name: 'official_invoice_receipt_en',
      metaCategory: 'UTILITY',
      headerType: 'DOCUMENT',
      headerSampleUrl: 'https://divyayagyam.com/docs/invoice-sample.pdf',
      body: `📄 *DivyaYagyam - Official Invoice Receipt* 📄\n\nHello *{{1}}*,\n\nThe digital invoice for your order *{{2}}* has been issued.\n\n💵 *Total Paid:* {{3}}\n\nClick the button below to download your tax invoice.`,
      footer: 'Verified Official Invoice',
      params: ['Devotee Name', 'Invoice Ref Number', 'Total Amount Paid'],
      actions: [
        { type: 'URL', title: 'Download PDF Invoice 📄', value: 'https://divyayagyam.com/dashboard/invoices' }
      ]
    }
  ],

  hinglish: [
    {
      category: 'PRODUCT BOOKING',
      name: 'product_booking_confirmation_hinglish',
      metaCategory: 'UTILITY',
      headerType: 'IMAGE',
      headerSampleUrl: 'https://divyayagyam.com/images/product-banner.jpg',
      body: `🚩 *DivyaYagyam - Product Booking Confirmed* 🚩\n\nNamaste *{{1}}* ji,\n\nAapka abhimantrit *{{2}}* order successfully book ho gaya hai!\n\n📦 *Order Number:* {{3}}\n💰 *Total Amount:* {{4}}\n\nAapne order ki status track karne ke liye niche button par click karein.`,
      footer: 'DivyaYagyam Sanatan Seva',
      params: ['Devotee Name', 'Product Name', 'Order Number', 'Total Paid Amount'],
      actions: [
        { type: 'URL', title: 'Track Order Now 📦', value: 'https://divyayagyam.com/dashboard/orders' },
        { type: 'PHONE_NUMBER', title: 'Support Helpline 📞', value: '919587171984' }
      ]
    },
    {
      category: 'PUJA SANKALP BOOKING',
      name: 'puja_sankalp_confirmation_hinglish',
      metaCategory: 'UTILITY',
      headerType: 'VIDEO',
      headerSampleUrl: 'https://divyayagyam.com/videos/sankalp-intro.mp4',
      body: `🕉️ *DivyaYagyam - Puja & Sankalp Confirmed* 🕉️\n\nPranam *{{1}}* ji,\n\nAapki *{{2}}* ka Sankalp and Puja service successfully confirm ho gaya hai!\n\n📋 *Booking Number:* {{3}}\n💵 *Dakshina:* {{4}}\n\nPuja ke baad Sankalp video and Prasad updates ke liye niche button par click karein.`,
      footer: 'Hari Om Tat Sat 🙏',
      params: ['Devotee Name', 'Puja Ritual Name', 'Booking Number', 'Dakshina Amount'],
      actions: [
        { type: 'URL', title: 'View Sankalp Video 🎬', value: 'https://divyayagyam.com/dashboard/bookings' },
        { type: 'QUICK_REPLY', title: 'Talk to Pandit 🛕', value: 'talk_to_pandit' }
      ]
    },
    {
      category: 'VIP ANUSTHAN PRIVILEGE',
      name: 'vip_puja_anusthan_confirmation_hinglish',
      metaCategory: 'UTILITY',
      headerType: 'IMAGE',
      headerSampleUrl: 'https://divyayagyam.com/images/vip-yagyam.jpg',
      body: `🚩 *DivyaYagyam - VIP Privilege Anusthan Booking* 🚩\n\nPranam Shreshth *{{1}}* ji,\n\nAapke *{{2}}* VIP Anusthan ka Mukhya Yajaman Sankalp accept kar liya gaya hai!\n\n👑 *VIP Ref ID:* {{3}}\n💎 *Special Dakshina:* {{4}}\n📅 *Live Stream Timing:* {{5}}\n\nMukhya Acharya ji aapse personal contact karenge.`,
      footer: 'Exclusive Devotee Privilege',
      params: ['Devotee Name', 'VIP Anusthan Name', 'VIP Reference ID', 'Total Dakshina', 'Live Stream Schedule'],
      actions: [
        { type: 'URL', title: 'Live Stream Link 🎥', value: 'https://divyayagyam.com/live' },
        { type: 'PHONE_NUMBER', title: 'Acharya Contact 📞', value: '919587171984' }
      ]
    },
    {
      category: 'FESTIVAL DISCOUNT OFFER',
      name: 'special_sanatan_offer_hinglish',
      metaCategory: 'MARKETING',
      headerType: 'IMAGE',
      headerSampleUrl: 'https://divyayagyam.com/images/festive-offer.jpg',
      body: `🌸 *DivyaYagyam - Special Festive Gift Offer* 🌸\n\nNamaste *{{1}}* ji,\n\n*{{2}}* ke pavitra avsar par aapke liye special gift!\n\n🎁 *Coupon Code:* *{{3}}*\n\nAapni pasandida Puja ya Abhimantrit Samagri तुरंत book karne ke liye click karein.`,
      footer: 'Limited Time Offer',
      params: ['Devotee Name', 'Offer Title', 'Coupon Code'],
      actions: [
        { type: 'URL', title: 'Claim Offer Now 🎁', value: 'https://divyayagyam.com/pujas' },
        { type: 'QUICK_REPLY', title: 'Get Guidance 💬', value: 'get_guidance' }
      ]
    },
    {
      category: 'SUPPORT QUERY RECEIVED',
      name: 'query_support_received_hinglish',
      metaCategory: 'UTILITY',
      headerType: 'NONE',
      body: `🚩 *DivyaYagyam - Help & Query Received* 🚩\n\nNamaste *{{1}}* ji,\n\nHamein aapka query/consultation request mil gaya hai:\n"{{2}}"\n\nHamare acharya ji va support team jaldi hi aapse contact karegi.`,
      footer: 'DivyaYagyam Help Desk',
      params: ['Devotee Name', 'Query Subject'],
      actions: [
        { type: 'QUICK_REPLY', title: 'Talk to Human 💬', value: 'talk_to_human' }
      ]
    },
    {
      category: 'DIGITAL INVOICE RECEIPT',
      name: 'official_invoice_receipt_hinglish',
      metaCategory: 'UTILITY',
      headerType: 'DOCUMENT',
      headerSampleUrl: 'https://divyayagyam.com/docs/invoice-sample.pdf',
      body: `📄 *DivyaYagyam - Official Payment Invoice* 📄\n\nNamaste *{{1}}* ji,\n\nAapke order *{{2}}* ki official digital receipt issue kar di gayi hai.\n\n💵 *Total Amount:* {{3}}\n\nAapni digital invoice receipt download karne ke liye niche button par click karein.`,
      footer: 'Verified Official Invoice',
      params: ['Devotee Name', 'Invoice Ref Number', 'Total Amount Paid'],
      actions: [
        { type: 'URL', title: 'Download PDF Invoice 📄', value: 'https://divyayagyam.com/dashboard/invoices' }
      ]
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
          `₹${payload.details.amount || 0}`
        ]
        break

      case 'PUJA_CONFIRMED':
        selectedTemplate = templateList.find(t => t.name.startsWith('puja_sankalp')) || templateList[1]
        templateParams = [
          payload.name || 'Devotee',
          payload.details.pujaName || 'Sacred Puja Ritual',
          payload.details.bookingNumber || 'N/A',
          `₹${payload.details.amount || 0}`
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
          payload.details.discountCode || 'SANATAN10'
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
          `₹${payload.details.amount || 0}`
        ]
        break
    }

    let fallbackMessage = selectedTemplate.body
    templateParams.forEach((param, idx) => {
      fallbackMessage = fallbackMessage.replace(new RegExp(`\\{\\{${idx + 1}\\}\\}`, 'g'), param)
    })

    const mediaUrl = payload.details.mediaUrl || payload.details.pdfUrl || selectedTemplate.headerSampleUrl

    const requestBody: Record<string, any> = {
      apiKey,
      campaignName: campaignName || selectedTemplate.name,
      destination: cleanPhone,
      userName: payload.name || 'Devotee',
      templateName: selectedTemplate.name,
      templateParams: templateParams,
      media: mediaUrl ? { url: mediaUrl, filename: 'document.pdf' } : undefined,
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
