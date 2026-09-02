export const siteConfig = {
  name: 'DivyaYagyam',
  tagline: 'Aastha Ki Nai Pehchan',
  description:
    'Experience divine blessings with DivyaYagyam — India\'s most trusted portal for authentic online pujas, VIP temple darshan, Kashi Vishwanath Rudrabhishek, Mahakaleshwar Bhasma Aarti, Kalsarp Dosh Nivaran, sacred prasad home delivery, and verified pandit ji services.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://divyayagyam.com',
  ogImage: '/logo.jpg',
  keywords: [
    'Divyayagyam', 'Divya Yagyam', 'Online Puja', 'Online Puja Booking', 'VIP Puja Booking',
    'Temple Booking', 'Sanatan Seva', 'Kashi Vishwanath Puja', 'Mahakaleshwar Bhasma Aarti',
    'Somnath Puja', 'Kalsarp Dosh Nivaran', 'Rudrabhishek Puja', 'Online Prasad Delivery',
    'Bhakti Seva', 'Pandit Ji Online', 'Astrology', 'Kundali Milan', 'Panchang',
    'Online Puja Booking', 'Divya Yagyam', 'Kashi Vishwanath Puja', 'Mahakaleshwar Bhasma Aarti', 'Prasad Home Delivery'
  ],
  contact: {
    email: 'seva@divyayagyam.com',
    phone: '+91-95304-01984',
    whatsapp: '+91-95304-01984',
  },
  socials: {
    facebook: '#',
    instagram: '#',
    youtube: '#',
    twitter: '#',
  },
}

export type SiteConfig = typeof siteConfig