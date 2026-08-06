import { prisma } from '@/lib/prisma'

// Module-level flag to avoid running on every request (only once per cold start)
let _defaultsEnsured = false

export async function ensureDefaultCategoriesAndTemples() {
  if (_defaultsEnsured) return
  _defaultsEnsured = true

  try {
    const defaultPujaCats = [
      { id: 'shiva', name: 'Shiva Pujas', slug: 'shiva', description: 'Sacred rituals dedicated to Lord Shiva' },
      { id: 'devi', name: 'Devi Pujas', slug: 'devi', description: 'Shakti and Durga Puja rituals' },
      { id: 'vishnu', name: 'Vishnu Pujas', slug: 'vishnu', description: 'Rituals dedicated to Lord Vishnu, Laxmi, and Krishna' },
      { id: 'ganesh', name: 'Ganesh Pujas', slug: 'ganesh', description: 'Obstacle-removing pujas for Lord Ganesha' },
      { id: 'navagraha', name: 'Navagraha', slug: 'navagraha', description: 'Planetary peace and dosha shanti pujas' }
    ]

    const defaultProductCats = [
      { id: 'prasad', name: 'Prasad', slug: 'prasad', description: 'Holy offerings and dry fruits prasad' },
      { id: 'rudraksha', name: 'Rudraksha', slug: 'rudraksha', description: 'Authentic Himalayan rudraksha beads and malas' },
      { id: 'idols', name: 'Idols', slug: 'idols', description: 'Beautiful brass and marble deities' },
      { id: 'books', name: 'Spiritual Books', slug: 'books', description: 'Bhagavad Gita, Puranas, and chalisa books' }
    ]

    const defaultTemples = [
      { id: 'kashi', name: 'Kashi Vishwanath', slug: 'kashi', deity: 'Shiva', city: 'Varanasi', state: 'Uttar Pradesh', address: 'Lahori Tola, Varanasi', isFeatured: true },
      { id: 'somnath', name: 'Somnath Temple', slug: 'somnath', deity: 'Shiva', city: 'Veraval', state: 'Gujarat', address: 'Prabhas Patan, Somnath', isFeatured: true },
      { id: 'baidyanath', name: 'Baidyanath Dham', slug: 'baidyanath', deity: 'Shiva', city: 'Deoghar', state: 'Jharkhand', address: 'Deoghar Sadar, Deoghar', isFeatured: false },
      { id: 'mahakal', name: 'Ujjain Mahakal', slug: 'mahakal', deity: 'Shiva', city: 'Ujjain', state: 'Madhya Pradesh', address: 'Jaisinghpura, Ujjain', isFeatured: true }
    ]

    const defaultPujas = [
      // Normal Pujas
      {
        id: 'fp-1',
        slug: 'kashi-vishwanath-rudrabhishekam',
        name: 'काशी विश्वनाथ महादेव रुद्राभिषेक (Kashi Vishwanath Rudrabhishekam)',
        shortDescription: 'भगवान शिव के पावन ज्योतिर्लिंग काशी में सुख-शांति, समृद्धि एवं आरोग्यता हेतु विशेष रुद्राभिषेक।',
        description: 'काशी विश्वनाथ धाम में विद्वान ब्राह्मणों द्वारा शिव संकल्प, रुद्राष्टाध्यायी पाठ एवं पंचामृत अभिषेक।',
        location: 'Kashi Vishwanath Temple, Varanasi',
        price: 1100,
        isVip: false,
        categoryId: 'shiva',
        templeId: 'kashi',
        isEvergreen: true,
        status: 'PUBLISHED' as const,
        coverImage: 'https://images.unsplash.com/photo-1609345635867-03f565b9dfd1?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'fp-2',
        slug: 'mahakaleshwar-kalsarp-dosh-shanti',
        name: 'महाकालेश्वर कालसर्प दोष शांति पूजा (Mahakaleshwar Kalsarp Shanti)',
        shortDescription: 'उज्जैन महाकाल धाम में वैदिक विधि द्वारा कालसर्प एवं राहु-केतु दोष निवारण महापूजा।',
        description: 'महाकालेश्वर शक्तिपीठ में नवग्रह शांति, नागबली एवं कालसर्प दोष निवारण विशेष पूजा।',
        location: 'Mahakaleshwar Temple, Ujjain',
        price: 2100,
        isVip: false,
        categoryId: 'navagraha',
        templeId: 'mahakal',
        isEvergreen: true,
        status: 'PUBLISHED' as const,
        coverImage: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'fp-3',
        slug: 'trimbakeshwar-pitra-dosh-nivaran',
        name: 'त्र्यंबकेश्वर नारायण नागबली व पितृदोष (Pitra Dosh Nivaran Homa)',
        shortDescription: 'पितृ शांति एवं वंश वृद्धि हेतु नासिक त्र्यंबकेश्वर में सर्व दोष शांति यज्ञ एवं पूजा।',
        description: 'ज्योतिर्लिंग त्र्यंबकेश्वर धाम में पितृ तर्पण एवं नारायण नागबली महायज्ञ।',
        location: 'Trimbakeshwar Temple, Nashik',
        price: 2500,
        isVip: false,
        categoryId: 'shiva',
        isEvergreen: true,
        status: 'PUBLISHED' as const,
        coverImage: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'fp-4',
        slug: 'maa-baglamukhi-shatru-badha-homa',
        name: 'माँ बगलामुखी शत्रु बाधा एवं तंत्र निवारण अनुष्ठान',
        shortDescription: 'कोर्ट-कचहरी मुकदमों में विजय, शत्रु शांति एवं व्यापार वृद्धि हेतु सिद्ध पीठ बगलामुखी महायज्ञ।',
        description: 'पीतांबरा पीठ दतिया/नलखेड़ा में पीत वस्त्र धारण कर बगलामुखी हवन एवं महाविद्या पाठ।',
        location: 'Baglamukhi Peeth, Datia / Nalkheda',
        price: 3100,
        isVip: false,
        categoryId: 'devi',
        isEvergreen: true,
        status: 'PUBLISHED' as const,
        coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'fp-5',
        slug: 'maha-mrityunjaya-jaap-yagya',
        name: 'महामृत्युंजय मंत्र जाप एवं दीर्घायु होम',
        shortDescription: 'असाध्य रोगों से मुक्ति, दुर्घटना सुरक्षा एवं उत्तम स्वास्थ्य हेतु 1,25,000 मंत्र जाप अनुष्ठान।',
        description: 'हरिद्वार गंगा तट पर विद्वान आचार्यों द्वारा महामृत्युंजय जाप एवं पूर्णाहूति यज्ञ।',
        location: 'Haridwar / Rishikesh Holy Ghats',
        price: 5100,
        isVip: false,
        categoryId: 'shiva',
        isEvergreen: true,
        status: 'PUBLISHED' as const,
        coverImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'fp-6',
        slug: 'siddhivinayak-ganpati-puja',
        name: 'सिद्धिविनायक गणपति पूजन एवं मोदक अर्पण',
        shortDescription: 'कार्य सिद्धि, बुद्धि, नया व्यापार प्रारंभ एवं विघ्न विनाश हेतु प्रथम पूज्य श्री गणेश पूजा।',
        description: 'सिद्धिविनायक मंदिर मुंबई में दूर्वा, मोदक एवं अथर्वशीर्ष पाठ सहित विशेष गणेश पूजन।',
        location: 'Siddhivinayak Temple, Mumbai',
        price: 1500,
        isVip: false,
        categoryId: 'ganesh',
        isEvergreen: true,
        status: 'PUBLISHED' as const,
        coverImage: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80'
      },
      // VIP Pujas
      {
        id: 'vip-1',
        slug: 'mata-baglamukhi-mirchi-havan',
        name: 'Mata Baglamukhi Mirchi Havan & Sarva Karya Siddhi Mahayagya (VIP)',
        shortDescription: 'Exclusive 5-priest full-day tantra & victory homa for legal triumph and protection.',
        description: 'Personalized 1-on-1 Sankalp, 1008 Ahuti, dedicated mandap and video proof.',
        location: 'Mata Baglamukhi Dham, Nalkheda / Datia',
        price: 15100,
        vipPrice: 15100,
        isVip: true,
        categoryId: 'devi',
        isEvergreen: true,
        status: 'PUBLISHED' as const,
        coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'vip-2',
        slug: 'kashi-vishwanath-mahamrityunjaya',
        name: 'Kashi Vishwanath Mahadev 1,25,000 Mahamrityunjaya Jaap (VIP)',
        shortDescription: 'Intensive 5-day Veda-chanted Mahamrityunjaya jaap for longevity and health.',
        description: '5 senior Pandits chanting सवा लाख महामृत्युंजय मंत्र with exclusive Sankalp.',
        location: 'Kashi Vishwanath Temple, Varanasi',
        price: 21000,
        vipPrice: 21000,
        isVip: true,
        categoryId: 'shiva',
        templeId: 'kashi',
        isEvergreen: true,
        status: 'PUBLISHED' as const,
        coverImage: 'https://images.unsplash.com/photo-1609345635867-03f565b9dfd1?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'vip-3',
        slug: 'mahakaleshwar-kalsarp-shanti',
        name: 'Mahakaleshwar Ujjain Kalsarp & Rahu-Ketu Dosh Nivaran (VIP)',
        shortDescription: 'Full-day special 9-planet astrological remediation at Bhasma Aarti Dham.',
        description: '4 Acharyas conducting deep dosha shanti with personalized live video stream.',
        location: 'Mahakaleshwar Temple, Ujjain',
        price: 12500,
        vipPrice: 12500,
        isVip: true,
        categoryId: 'navagraha',
        templeId: 'mahakal',
        isEvergreen: true,
        status: 'PUBLISHED' as const,
        coverImage: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80'
      }
    ]

    // Run all upserts in parallel — no more sequential loops!
    await Promise.all([
      // Puja categories
      ...defaultPujaCats.map(cat =>
        prisma.pujaCategory.upsert({
          where: { slug: cat.slug },
          create: { id: cat.id, name: cat.name, slug: cat.slug, description: cat.description, isActive: true },
          update: {}
        })
      ),
      // Product categories
      ...defaultProductCats.map(cat =>
        prisma.productCategory.upsert({
          where: { slug: cat.slug },
          create: { id: cat.id, name: cat.name, slug: cat.slug, description: cat.description, isActive: true },
          update: {}
        })
      ),
      // Temples
      ...defaultTemples.map(t =>
        prisma.temple.upsert({
          where: { slug: t.slug },
          create: { id: t.id, name: t.name, slug: t.slug, deity: t.deity, city: t.city, state: t.state, address: t.address, isFeatured: t.isFeatured, isActive: true },
          update: {}
        })
      ),
      // Seed default Pujas (Normal & VIP)
      ...defaultPujas.map(p =>
        prisma.puja.upsert({
          where: { slug: p.slug },
          create: p,
          update: {
            status: 'PUBLISHED',
            isVip: p.isVip,
            price: p.price,
            vipPrice: p.vipPrice || null,
          }
        })
      )
    ])
  } catch (error) {
// console.error('[DataDefaults] Error initializing defaults:', error) (removed for production)
    // Reset flag so it retries next time if it failed
    _defaultsEnsured = false
  }
}
