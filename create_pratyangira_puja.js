const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🦁 Creating VIP Pratyangira Tantrokt Hawan & Bali Yagya in DB...')

  // Find or create Devi Pujas Category
  let category = await prisma.pujaCategory.findFirst({
    where: { OR: [{ slug: 'devi-pujas' }, { slug: 'vip-pujas' }, { name: { contains: 'Devi' } }] }
  })

  if (!category) {
    category = await prisma.pujaCategory.create({
      data: {
        name: 'माँ दुर्गा व महाविद्या पूजा',
        slug: 'devi-pujas',
        description: 'शक्ति पीठ एवं महाविद्या अनुष्ठान'
      }
    })
  }

  // Find Jodhpur Shakti Peeth Temple
  let temple = await prisma.temple.findFirst({
    where: { OR: [{ slug: 'jodhpur-katyayani-shakti-peeth' }, { name: { contains: 'Katyayani' } }] }
  })

  if (!temple) {
    temple = await prisma.temple.create({
      data: {
        name: 'Maa Katyayani Durga Shakti Peeth',
        slug: 'jodhpur-katyayani-shakti-peeth',
        deity: 'Maa Pratyangira & Durga Devi',
        city: 'Jodhpur',
        state: 'Rajasthan',
        country: 'India',
        description: 'सिद्ध माँ कात्यायनी व महाविद्या प्रत्यंगिरा पीठ, जोधपुर (राजस्थान)',
        isFeatured: true
      }
    })
  }

  const pujaData = {
    name: 'माँ प्रत्यंगिरा तंत्रोक्त महायज्ञ, सात्विक नींबू-नारियल बलि एवं सर्व शत्रुनाश अनुष्ठान (VIP Pratyangira Tantrokt Hawan)',
    slug: 'maa-pratyangira-tantrok-hawan-bali-yagya',
    shortDescription: 'भयानक तंत्र बाधा, मुकदमों में पराजय, गुप्त शत्रुओं के षड्यंत्र व असाध्य नजर दोष के तत्काल सर्वनाश हेतु सिद्ध शक्ति पीठ पर अमोघ प्रत्यंगिरा तंत्रोक्त महायज्ञ, 108 नींबू व श्रीफल (नारियल) बलि।',
    description: `
<h2>👑 VIP माँ प्रत्यंगिरा तंत्रोक्त महायज्ञ, सात्विक नींबू-नारियल बलि एवं सर्व शत्रुनाश अनुष्ठान</h2>
<p>महाविद्या माँ प्रत्यंगिरा देवी सनातन तंत्र में शत्रुओं की कृत्याओं (तांत्रिक षड्यंत्रों) को नष्ट कर पलटने वाली सर्वोच्च उग्र महाविद्या हैं। <strong>माँ कात्यायनी दुर्गा शक्ति पीठ, जोधपुर (राजस्थान)</strong> में मुख्य पीठाधीश्वर पं. मुकेश बोहरा जी के सानिध्य में <strong>अमोघ प्रत्यंगिरा तंत्रोक्त महायज्ञ, 108 सात्विक नींबू बलि एवं 11 सिद्ध श्रीफल (नारियल) बलि</strong> का विशेष VIP अनुष्ठान संपन्न कराया जाता है।</p>

<h3>🌸 VIP महाअनुष्ठान के अमोघ पावन लाभ (Key Sacred Benefits):</h3>
<ul>
  <li><strong>प्रत्यंगिरा तंत्रोक्त सम्पुट महायज्ञ (Tantrokt Hawan):</strong> महाविद्या प्रत्यंगिरा देवी के अमोघ मूल मंत्रों द्वारा 108 लाल मिर्चियों, पीत सरसों व जड़ी-बूटियों का उग्र स्वाहाकार होम।</li>
  <li><strong>108 सात्विक नींबू एवं 11 श्रीफल (नारियल) बलि:</strong> शत्रुओं के कुमंत्रण, ईर्ष्या, तांत्रिक उच्चाटन व भयानक नजर दोष का तत्काल शमन एवं रीबाउंड।</li>
  <li><strong>गुप्त शत्रु व असाध्य मुकदमेबाज़ी नाश (Shatru & Legal Victory):</strong> विरोधियों व व्यावसायिक शत्रुओं के षड्यंत्रों का स्तंभन कर मुकदमों में अभूतपूर्व विजयश्री।</li>
  <li><strong>असाध्य तंत्र बाधा व अकाल भय मुक्ति:</strong> पुरानी तांत्रिक क्रियाओं, मारण-उच्चाटन दोषों व भयानक नकारात्मक ऊर्जा का समूल विनाश।</li>
  <li><strong>100% व्यक्तिगत लाइव वीडियो व प्रत्यंगिरा भस्म प्रसाद:</strong> आपके नाम व गोत्र के साथ लाइव वीडियो संकल्प एवं सिद्ध प्रत्यंगिरा महाभस्म, रक्षा सूत्र व तांत्रिक यंत्र प्रसाद आपके घर पर।</li>
</ul>

<h3>📍 पूजा स्थल (Venue):</h3>
<p><strong>माँ कात्यायनी दुर्गा शक्ति पीठ, जोधपुर (राजस्थान)</strong></p>

<h3>👨‍⚖️ मुख्य वेदाचार्य (Assigned Priest):</h3>
<p><strong>पं. मुकेश बोहरा (Pt. Mukesh Bohra), जोधपुर</strong></p>

<h3>📅 पूजा तिथि (Date):</h3>
<p><em>(तिथि शीघ्र घोषित की जाएगी - आप अभी संकल्प बुक कर सकते हैं)</em></p>
    `,
    benefits: 'माँ प्रत्यंगिरा तंत्रोक्त सम्पुट महायज्ञ, 108 सात्विक नींबू व 11 श्रीफल बलि, असाध्य तंत्र बाधा शमन, शत्रु स्तंभन व मुकदमों में विजयश्री',
    procedure: 'सस्वर सम्पुट संकल्प -> प्रत्यंगिरा मूल मंत्र जाप -> 108 सात्विक नींबू व 11 श्रीफल बलि -> 108 मिर्ची तंत्रोक्त महाहवन व महाआरती',
    categoryId: category.id,
    templeId: temple.id,
    price: 21000,
    vipPrice: 21000,
    location: 'Maa Katyayani Durga Shakti Peeth, Jodhpur, Rajasthan',
    status: 'PUBLISHED',
    isEvergreen: true,
    isFeatured: true,
    isOnline: true,
    isVip: true,
    coverImage: '/pratyangira_tantrok_hawan.jpg',
    seoTitle: 'VIP Maa Pratyangira Tantrokt Hawan Booking Online | Jodhpur Yagya',
    seoDescription: 'Book VIP Maa Pratyangira Tantrokt Hawan, Nimbu & Nariyal Bali Yagya at Katyayani Shakti Peeth Jodhpur by Pt. Mukesh Bohra. Remove black magic & enemy curses.',
    seoKeywords: 'maa pratyangira puja online, pratyangira tantrok hawan jodhpur, pratyangira shatru stambhan yagya, nimbu nariyal bali puja, divyayagyam pratyangira vip puja'
  }

  const puja = await prisma.puja.upsert({
    where: { slug: pujaData.slug },
    create: pujaData,
    update: pujaData
  })

  // VIP Package
  await prisma.pujaPackage.deleteMany({ where: { pujaId: puja.id } })

  await prisma.pujaPackage.create({
    data: {
      pujaId: puja.id,
      name: '👑 VIP विशेष प्रत्यंगिरा तंत्रोक्त महायज्ञ, नींबू-नारियल बलि एवं शत्रु स्तंभन अनुष्ठान',
      price: 21000,
      description: 'पं. मुकेश बोहरा जी द्वारा व्यक्तिगत नाम-गोत्र संकल्प, 108 सात्विक नींबू बलि, 11 श्रीफल बलि, 108 मिर्ची तंत्रोक्त महाहवन, लाइव वीडियो व सिद्ध प्रत्यंगिरा भस्म प्रसाद।'
    }
  })

  console.log('🎉 SUCCESS! Created VIP Pratyangira Puja in DB:', puja.name, 'ID:', puja.id)
}

main()
  .catch(err => {
    console.error('❌ Error creating Pratyangira Puja:', err)
  })
  .finally(() => prisma.$disconnect())
