const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌺 Creating Maa Bagalamukhi Mirchi Hawan Puja in DB...')

  // Find or create Devi Pujas Category
  let category = await prisma.pujaCategory.findFirst({
    where: { OR: [{ slug: 'devi-pujas' }, { name: { contains: 'Devi' } }] }
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

  // Find or create Jodhpur Shakti Peeth Temple
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
    name: 'माँ बगलामुखी मिर्ची हवन व विशेष शत्रुनिवारण अनुष्ठान (Maa Bagalamukhi Mirchi Hawan)',
    slug: 'maa-bagalamukhi-mirchi-hawan',
    shortDescription: 'कोर्ट-कचहरी मुकदमों में विजय, शत्रु स्तंभन, तंत्र बाधा एवं व्यापारिक रुकावटों के सर्वनाश हेतु जोधपुर शक्ति पीठ पर विशेष तीक्ष्ण मिर्ची महायज्ञ।',
    description: `
<h2>माँ बगलामुखी मिर्ची हवन व विजय अनुष्ठान</h2>
<p>माँ पीतांबरा बगलामुखी तंत्र की अधिष्ठात्री देवी हैं। जोधपुर (राजस्थान) स्थित सिद्ध माँ कात्यायनी दुर्गा शक्ति पीठ में आयोजित यह विशेष <strong>मिर्ची महायज्ञ व शत्रुनिवारण अनुष्ठान</strong> विरोधियों की कुमंत्रणा, मुकदमों एवं असाध्य बाधाओं का तत्काल शमन करता है।</p>

<h3>🌸 मुख्य पावन लाभ (Key Divine Benefits):</h3>
<ul>
  <li><strong>कोर्ट-कचहरी व कानूनी मुकदमों में विजय:</strong> मुकदमों, भूमि विवादों व विरोधियों के षड्यंत्रों का स्तंभन कर विजयश्री की प्राप्ति।</li>
  <li><strong>108 लाल मिर्चियों की विशेष आहुति:</strong> तांत्रिक मिर्ची हवन कुंड में आहुति द्वारा तंत्र बाधा, नजर दोष, गृहक्लेश व ऋणात्मक ऊर्जा का संपूर्ण नाश।</li>
  <li><strong>व्यापार व राजनीति में सफलता:</strong> व्यापारिक प्रतिस्पर्धा में शत्रुओं का पराभव एवं पद-प्रतिष्ठा में वृद्धि।</li>
  <li><strong>व्यक्तिगत नाम-गोत्र संकल्प:</strong> वेदपाठी आचार्यों द्वारा आपके नाम और गोत्र के साथ लाइव वीडियो संकल्प।</li>
</ul>

<h3>📍 पूजा स्थल (Venue):</h3>
<p><strong>माँ कात्यायनी दुर्गा शक्ति पीठ, जोधपुर (राजस्थान)</strong></p>

<h3>📅 पूजा तिथि (Date):</h3>
<p><em>(तिथि शीघ्र घोषित की जाएगी - आप अभी संकल्प बुक कर सकते हैं)</em></p>
    `,
    benefits: 'कोर्ट-कचहरी मुकदमों में विजय, शत्रु स्तंभन, 108 लाल मिर्ची आहुति द्वारा तंत्र बाधा निवारण, व्यापार वृद्धि',
    procedure: 'वैदिक संकल्प -> 108 मिर्ची आहुति महायज्ञ -> पीतांबरा मंत्र जाप -> आरती व भस्म प्रसाद वितरण',
    categoryId: category.id,
    templeId: temple.id,
    price: 1100,
    vipPrice: 5100,
    location: 'Maa Katyayani Durga Shakti Peeth, Jodhpur, Rajasthan',
    status: 'PUBLISHED',
    isEvergreen: true,
    isFeatured: true,
    isOnline: true,
    isVip: false,
    coverImage: '/bagalamukhi_mirchi_hawan_2.jpg',
    seoTitle: 'Maa Bagalamukhi Mirchi Hawan Online Booking | Legal Victory Puja Jodhpur',
    seoDescription: 'Book Maa Bagalamukhi Mirchi Hawan at Katyayani Durga Shakti Peeth Jodhpur. Live WhatsApp Video Sankalp for court victory, obstacle removal & enemy protection.',
    seoKeywords: 'bagalamukhi mirchi hawan, maa bagalamukhi puja jodhpur, legal victory puja online, shatru dosh nivaran hawan, divyayagyam bagalamukhi'
  }

  const puja = await prisma.puja.upsert({
    where: { slug: pujaData.slug },
    create: pujaData,
    update: pujaData
  })

  console.log('🎉 SUCCESS! Created Puja in DB:', puja.name, 'ID:', puja.id)
}

main()
  .catch(err => {
    console.error('❌ Error creating Puja:', err)
  })
  .finally(() => prisma.$disconnect())
