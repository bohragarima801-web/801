import { InvoiceData } from '@/types/invoice'

export const mockAllInOneInvoice: InvoiceData = {
  invoiceNumber: 'INV-DY-2026-89421',
  orderNumber: 'ORD-89421',
  bookingNumber: 'BKG-89421',
  invoiceDate: '07 Aug 2026',
  paymentDate: '07 Aug 2026, 07:18 AM',

  customer: {
    fullName: 'राकेश शर्मा (Rakesh Sharma)',
    phone: '+91 98765 43210',
    email: 'rakesh.sharma@example.com',
    address: '108, वैकुण्ठ धाम, तिलक नगर, एम. जी. रोड',
    city: 'जयपुर (Jaipur)',
    state: 'राजस्थान (Rajasthan)',
    pincode: '302004',
    country: 'भारत (India)'
  },

  spiritualDetails: {
    sankalpName: 'श्रीमती अनीता शर्मा व समस्त शर्मा परिवार',
    gotra: 'शांडिल्य (Shandilya)',
    nakshatra: 'रोहिणी (Rohini)',
    rashi: 'वृषभ (Taurus)',
    purposeOfPuja: 'परिवार में दीर्घायु, उत्तम आरोग्य, व्यापार वृद्धि व महाकाल कृपा प्राप्ति हेतु।'
  },

  pujaBookings: [
    {
      id: 'p-101',
      name: 'काशी विश्वनाथ महादेव महा रुद्राभिषेक (Kashi Vishwanath Rudrabhishekam)',
      temple: 'काशी विश्वनाथ मंदिर, वाराणसी (Kashi Vishwanath Temple, Varanasi)',
      pandit: 'वेदाचार्य पं. शिवानंद शास्त्री',
      quantity: 1,
      price: 2100,
      discount: 300,
      amount: 1800
    },
    {
      id: 'p-102',
      name: 'महाकालेश्वर कालसर्प व राहु-केतु दोष निवारण यज्ञ',
      temple: 'महाकालेश्वर ज्योतिर्लिंग, उज्जैन (Mahakaleshwar Temple, Ujjain)',
      pandit: 'वेदाचार्य पं. रमाशंकर दीक्षित',
      quantity: 1,
      price: 3500,
      discount: 500,
      amount: 3000
    }
  ],

  vipPujas: [
    {
      id: 'vip-201',
      packageName: 'माँ बगलामुखी राजराजेश्वरी महा अनुष्ठान (VIP Personal Homa)',
      benefits: '100% व्यक्तिगत लाइव वीडियो संकल्प, सिद्ध पीतांबरा पीठ जल अर्पण एवं विशेष राजयोग सिद्ध माला प्रसाद।',
      quantity: 1,
      amount: 11000
    }
  ],

  bhaktiSeva: [
    {
      id: 'bs-301',
      sevaName: 'गौ सेवा व अन्नदान संकल्प (Gau Seva & Annadan)',
      description: 'काशी धाम में 108 साधु-संतों को अन्नदान एवं 11 कामधेनु गायों को हरा चारा अर्पण।',
      quantity: 1,
      donation: 2500
    }
  ],

  products: [
    {
      id: 'prd-401',
      image: '/package-1.jpg',
      name: 'सिद्ध सिद्धेश्वर 5 मुखी रुद्राक्ष माला (Siddha 5-Mukhi Rudraksha Mala)',
      sku: 'DY-RUD-5M-108',
      quantity: 1,
      price: 1500,
      discount: 300,
      amount: 1200
    },
    {
      id: 'prd-402',
      image: '/package-2.jpg',
      name: 'श्री महालक्ष्मी अष्टलक्ष्मी कुबेर पोटली व श्रीयंत्र',
      sku: 'DY-KUBER-POTLI',
      quantity: 2,
      price: 1100,
      discount: 200,
      amount: 1800
    }
  ],

  digitalTools: [
    {
      id: 'dt-501',
      name: 'संपूर्ण जीवन कुंडली व वर्षफल रिपोर्ट 2026-2031 (Kundali & Predictions)',
      validity: 'आजीवन डिजिटल एक्सेस (Lifetime Access)',
      license: 'DY-LIC-KUNDALI-9921',
      amount: 999
    }
  ],

  summary: {
    subtotal: 23700,
    itemsDiscount: 1300,
    couponCode: 'DIVYA108',
    couponDiscount: 1080,
    bhaktiDonation: 2500,
    shippingCharges: 0,
    platformFee: 0,
    taxAmount: 0,
    grandTotal: 22619,
    paidAmount: 22619,
    pendingAmount: 0,
    currencySymbol: '₹',
    currencyCode: 'INR'
  },

  paymentDetails: {
    status: 'PAID',
    method: 'Razorpay UPI (Google Pay)',
    transactionId: 'txn_984128941029',
    razorpayPaymentId: 'pay_Px89a2K1984',
    gateway: 'Razorpay Secure Payment System',
    paymentTime: '07 Aug 2026, 07:18 AM'
  },

  bookingDetails: {
    status: 'CONFIRMED',
    templeName: 'काशी विश्वनाथ धाम व बगलामुखी पीठ',
    scheduledDate: '12 अगस्त 2026 (सावन सोमवार)',
    scheduledTime: 'प्रातः 06:30 AM (शुभ ब्रह्म मुहूर्त)',
    assignedPandit: 'मुख्य धर्माचार्य पं. शिवानंद शास्त्री',
    meetingLink: 'https://divyayagyam.com/live/bkg-89421'
  },

  deliveryDetails: {
    courierPartner: 'BlueDart Express Speed Post',
    trackingNumber: 'BD-DY-9941201IN',
    shippingStatus: 'DISPATCHED',
    expectedDelivery: '10 अगस्त 2026'
  }
}

export const mockPujaOnlyInvoice: InvoiceData = {
  invoiceNumber: 'INV-DY-2026-31048',
  orderNumber: 'ORD-31048',
  bookingNumber: 'BKG-31048',
  invoiceDate: '07 Aug 2026',
  paymentDate: '07 Aug 2026, 06:45 AM',

  customer: {
    fullName: 'श्रीमती सरोज देवी (Saroj Devi)',
    phone: '+91 94123 78901',
    email: 'saroj.devi@example.com',
    address: '45, आनंद नगर, सिविल लाइन्स',
    city: 'वाराणसी (Varanasi)',
    state: 'उत्तर प्रदेश (Uttar Pradesh)',
    pincode: '221002',
    country: 'भारत (India)'
  },

  spiritualDetails: {
    sankalpName: 'सरोज देवी व परिजन',
    gotra: 'काश्यप (Kashyap)',
    purposeOfPuja: 'सुख-शांति, गृहक्लेश निवारण एवं स्वास्थ्य लाभ।'
  },

  pujaBookings: [
    {
      id: 'p-103',
      name: 'काशी विश्वनाथ महादेव रुद्राभिषेक (Kashi Vishwanath Rudrabhishekam)',
      temple: 'काशी विश्वनाथ मंदिर, वाराणसी',
      pandit: 'पं. रामेश्वर त्रिपाठी',
      quantity: 1,
      price: 1100,
      discount: 0,
      amount: 1100
    }
  ],

  summary: {
    subtotal: 1100,
    itemsDiscount: 0,
    couponDiscount: 0,
    bhaktiDonation: 0,
    shippingCharges: 0,
    platformFee: 0,
    taxAmount: 0,
    grandTotal: 1100,
    paidAmount: 1100,
    pendingAmount: 0,
    currencySymbol: '₹',
    currencyCode: 'INR'
  },

  paymentDetails: {
    status: 'PAID',
    method: 'Razorpay NetBanking (HDFC Bank)',
    transactionId: 'txn_3104899120',
    razorpayPaymentId: 'pay_Qz771x99201',
    gateway: 'Razorpay Secure System',
    paymentTime: '07 Aug 2026, 06:45 AM'
  },

  bookingDetails: {
    status: 'SCHEDULED',
    templeName: 'काशी विश्वनाथ मंदिर, वाराणसी',
    scheduledDate: '15 अगस्त 2026',
    scheduledTime: 'प्रातः 07:00 AM',
    assignedPandit: 'पं. रामेश्वर त्रिपाठी'
  }
}

export const mockProductsOnlyInvoice: InvoiceData = {
  invoiceNumber: 'INV-DY-2026-77890',
  orderNumber: 'ORD-77890',
  invoiceDate: '07 Aug 2026',
  paymentDate: '07 Aug 2026, 05:30 AM',

  customer: {
    fullName: 'अमित वर्मा (Amit Verma)',
    phone: '+91 97110 54321',
    email: 'amit.verma@example.com',
    address: 'B-402, स्काईलाइन हाइट्स, सेक्टर 62',
    city: 'नोएडा (Noida)',
    state: 'उत्तर प्रदेश (Uttar Pradesh)',
    pincode: '201309',
    country: 'भारत (India)'
  },

  products: [
    {
      id: 'prd-403',
      image: '/package-4.jpg',
      name: 'सिद्ध पारद शिवलिंग (Authentic Siddha Parad Shivlinga)',
      sku: 'DY-PARAD-SHIV-100G',
      quantity: 1,
      price: 2500,
      discount: 400,
      amount: 2100
    },
    {
      id: 'prd-404',
      image: '/package-6.jpg',
      name: 'प्राकृतिक कमलगट्टा माला 108 मनके',
      sku: 'DY-MALA-KAMAL-108',
      quantity: 2,
      price: 600,
      discount: 100,
      amount: 1000
    }
  ],

  summary: {
    subtotal: 3700,
    itemsDiscount: 600,
    couponCode: 'Bhakti50',
    couponDiscount: 50,
    bhaktiDonation: 0,
    shippingCharges: 99,
    platformFee: 0,
    taxAmount: 0,
    grandTotal: 3149,
    paidAmount: 3149,
    pendingAmount: 0,
    currencySymbol: '₹',
    currencyCode: 'INR'
  },

  paymentDetails: {
    status: 'PAID',
    method: 'Credit Card (Visa)',
    transactionId: 'txn_778902148',
    razorpayPaymentId: 'pay_Rx1092471',
    gateway: 'Razorpay Secure Payment System',
    paymentTime: '07 Aug 2026, 05:30 AM'
  },

  deliveryDetails: {
    courierPartner: 'Delhivery Express',
    trackingNumber: 'DEL-DY-77890IN',
    shippingStatus: 'IN_TRANSIT',
    expectedDelivery: '09 अगस्त 2026'
  }
}
