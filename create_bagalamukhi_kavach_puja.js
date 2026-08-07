const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌺 Creating VIP Bagalamukhi Kavach & Haldi Abhishek Puja in DB...')

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
        deity: 'Maa Bagalamukhi & Durga Devi',
        city: 'Jodhpur',
        state: 'Rajasthan',
        country: 'India',
        description: 'सिद्ध माँ कात्यायनी व मां पीतांबरा बगलामुखी महापीठ, जोधपुर (राजस्थान)',
        isFeatured: true
      }
    })
  }

  const pujaData = {
    name: 'माँ बगलामुखी अमोघ कवच पाठ, हल्दी अभिषेक, नींबू बलि एवं पीतांबरा महाहवन (VIP Bagalamukhi Kavach & Haldi Abhishek)',
    slug: 'maa-bagalamukhi-kavach-haldi-abhishek-puja',
    shortDescription: 'मुकदमों में विजय, शत्रु स्तंभन, तंत्र बाधा निवारण व नजर दोष सर्वनाश हेतु सिद्ध हल्दी अभिषेक, अमोघ कवच पाठ, सात्विक नींबू बलि व पीतांबरा महाहवन।',
    description: `
<h2>👑 VIP माँ बगलामुखी अमोघ कवच पाठ, हल्दी अभिषेक, नींबू बलि एवं महाहवन</h2>
<p>माँ पीतांबरा बगलामुखी दश महाविद्याओं में शत्रु स्तंभन एवं वाक्सिद्धि की सर्वोच्च देवी हैं। <strong>माँ कात्यायनी दुर्गा शक्ति पीठ, जोधपुर (राजस्थान)</strong> में मुख्य पीठाधीश्वर पं. मुकेश बोहरा जी के सानिध्य में <strong>अमोघ बगलामुखी कवच पाठ, हल्दी अभिषेक, सात्विक नींबू बलि एवं पीतांबरा महाहवन</strong> का विशेष VIP अनुष्ठान संपन्न कराया जाता है।</p>

<h3>🌸 VIP महाअनुष्ठान के अमोघ पावन लाभ (Key Sacred Benefits):</h3>
<ul>
  <li><strong>बगलामुखी अमोघ कवच पाठ (Maa Bagalamukhi Kavach):</strong> वेदपाठी आचार्यों द्वारा अमोघ कवच एवं पीतांबरा स्तोत्र पाठ से यजमान के चारों ओर अभेद्य सुरक्षा चक्र।</li>
  <li><strong>सिद्ध हरिद्रा हल्दी अभिषेक (Sacred Turmeric Abhishekam):</strong> शुद्ध कुमकुम, पीत चंदन, हल्दी व केसर द्रव्यों द्वारा भगवती का शास्त्रोक्त हल्दी स्नान।</li>
  <li><strong>सात्विक नींबू बलि अनुष्ठान (Satvik Nimbu Bali):</strong> 108 नींबुओं की सात्विक बलि द्वारा शत्रुओं के कुमंत्रण, ईर्ष्या, मुकदमेबाजी व नजर दोष का तत्काल स्तंभन।</li>
  <li><strong>पीतांबरा तीक्ष्ण महाहवन (Tantrokt Hawan):</strong> पीत सरसों, हल्दी गांठ, 108 आहुति एवं जड़ी-बूटियों द्वारा महायज्ञ।</li>
  <li><strong>100% व्यक्तिगत लाइव वीडियो व पीतांबरा भस्म प्रसाद:</strong> आपके नाम व गोत्र के साथ लाइव वीडियो संकल्प एवं सिद्ध पीतांबरा हल्दी भस्म, रक्षा सूत्र व यंत्र प्रसाद आपके घर पर।</li>
</ul>

<h3>📍 पूजा स्थल (Venue):</h3>
<p><strong>माँ कात्यायनी दुर्गा शक्ति पीठ, जोधपुर (राजस्थान)</strong></p>

<h3>👨‍⚖️ मुख्य वेदाचार्य (Assigned Priest):</h3>
<p><strong>पं. मुकेश बोहरा (Pt. Mukesh Bohra), जोधपुर</strong></p>

<h3>📅 पूजा तिथि (Date):</h3>
<p><em>(तिथि शीघ्र घोषित की जाएगी - आप अभी संकल्प बुक कर सकते हैं)</em></p>
    `,
    benefits: 'माँ बगलामुखी अमोघ कवच पाठ, सिद्ध हल्दी अभिषेक, 108 सात्विक नींबू बलि, शत्रु स्तंभन व कोर्ट मुकदमों में विजयश्री',
    procedure: 'सस्वर संकल्प -> हरिद्रा हल्दी अभिषेक -> बगलामुखी अमोघ कवच पाठ -> 108 सात्विक नींबू बलि -> पीतांबरा महाहवन व आरती',
    categoryId: category.id,
    templeId: temple.id,
    price: 15001,
    vipPrice: 15001,
    location: 'Maa Katyayani Durga Shakti Peeth, Jodhpur, Rajasthan',
    status: 'PUBLISHED',
    isEvergreen: true,
    isFeatured: true,
    isOnline: true,
    isVip: true,
    coverImage: '/bagalamukhi_kavach_yagya.jpg',
    seoTitle: 'VIP Maa Bagalamukhi Kavach Path & Haldi Abhishek | Jodhpur Puja',
    seoDescription: 'Book VIP Maa Bagalamukhi Kavach Path, Haldi Abhishekam, Nimbu Bali & Mahayagya at Katyayani Shakti Peeth Jodhpur by Pt. Mukesh Bohra. Legal victory & enemy stambhan.',
    seoKeywords: 'bagalamukhi kavach path online, bagalamukhi haldi abhishek jodhpur, nimbu bali puja online, mukesh bohra bagalamukhi puja, divyayagyam bagalamukhi vip puja'
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
      name: '👑 VIP विशेष बगलामुखी अमोघ कवच, हल्दी अभिषेक व नींबू बलि अनुष्ठान',
      price: 15001,
      description: 'पं. मुकेश बोहरा जी द्वारा व्यक्तिगत नाम-गोत्र संकल्प, 108 हल्दी अभिषेक, 108 सात्विक नींबू बलि, लाइव वीडियो संकल्प व सिद्ध पीतांबरा भस्म प्रसाद।'
    }
  })

  console.log('🎉 SUCCESS! Created VIP Bagalamukhi Kavach Puja in DB:', puja.name, 'ID:', puja.id)
}

main()
  .catch(err => {
    console.error('❌ Error creating Bagalamukhi Kavach Puja:', err)
  })
  .finally(() => prisma.$disconnect())
