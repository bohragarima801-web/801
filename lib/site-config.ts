export const siteConfig = {
  name: 'DivyaYagyam',
  tagline: 'Sanatan Seva & Online Puja Booking',
  description:
    'Experience divine blessings with DivyaYagyam — India\'s most trusted portal for authentic online pujas, VIP temple darshan, Kashi Vishwanath Rudrabhishek, Mahakaleshwar Bhasma Aarti, Kalsarp Dosh Nivaran, sacred prasad home delivery, and verified pandit ji services.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://divyayagyam.com',
  ogImage: '/og.jpg',
  keywords: [
    'Divyayagyam', 'Divya Yagyam', 'Online Puja', 'Online Puja Booking', 'VIP Puja Booking',
    'Temple Booking', 'Sanatan Seva', 'Kashi Vishwanath Puja', 'Mahakaleshwar Bhasma Aarti',
    'Somnath Puja', 'Kalsarp Dosh Nivaran', 'Rudrabhishek Puja', 'Online Prasad Delivery',
    'Bhakti Seva', 'Pandit Ji Online', 'Astrology', 'Kundali Milan', 'Panchang',
    'ऑनलाइन पूजा बुकिंग', 'दिव्य यज्ञम्', 'काशी विश्वनाथ पूजा', 'महाकालेश्वर भस्म आरती', 'प्रसाद होम डिलीवरी'
  ],
  contact: {
    email: 'seva@divyayagyam.com',
    phone: '+91-95871-71984, +91-95320-11984',
    whatsapp: '+91-95871-71984, +91-95320-11984',
  },
  socials: {
    facebook: 'https://www.facebook.com/divyayagyam',
    instagram: 'https://www.instagram.com/divyayagyam',
    youtube: 'https://www.youtube.com/@divyayagyam',
    twitter: 'https://twitter.com/divyayagyam',
  },
}

export type SiteConfig = typeof siteConfig