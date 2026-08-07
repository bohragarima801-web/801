const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌾 Creating VIP Pitra Shanti Gita Path Puja in DB...')

  // Find or create Pitra Category
  let category = await prisma.pujaCategory.findFirst({
    where: { OR: [{ slug: 'pitra-pujas' }, { slug: 'vip-pujas' }, { name: { contains: 'Pitra' } }] }
  })

  if (!category) {
    category = await prisma.pujaCategory.create({
      data: {
        name: 'पितृ दोष व मोक्ष पूजा',
        slug: 'pitra-pujas',
        description: 'गीता पाठ, सर्व पितृ तर्पण व स्वाहाकार महायज्ञ'
      }
    })
  }

  // Find Chandikeshwar Mahadev Temple Jodhpur
  let temple = await prisma.temple.findFirst({
    where: { OR: [{ slug: 'chandikeshwar-mahadev-jodhpur' }, { name: { contains: 'Chandikeshwar' } }] }
  })

  if (!temple) {
    temple = await prisma.temple.create({
      data: {
        name: 'Chandikeshwar Mahadev Temple',
        slug: 'chandikeshwar-mahadev-jodhpur',
        deity: 'Lord Shiva & Pitra Devtas',
        city: 'Jodhpur',
        state: 'Rajasthan',
        country: 'India',
        description: 'प्राचीन सिद्ध चंडिकेश्वर महादेव मंदिर, जोधपुर (राजस्थान)',
        isFeatured: true
      }
    })
  }

  const pujaData = {
    name: 'VIP पितृ शांति, श्रीमद्भागवत-गीता संपूर्ण पाठ एवं श्वेत तिल-जौ महायज्ञ (VIP Pitra Shanti Gita Path & Shwet Til Hawan)',
    slug: 'vip-pitra-shanti-gita-path-shwet-til-hawan',
    shortDescription: '21 पीढ़ियों के पूर्वजों के मोक्ष, अकाल मृत्यु शमन व पितृ दोष निवारण हेतु संपूर्ण 18 अध्याय गीता पाठ, श्वेत पुष्प, श्वेत खीर भोग व श्वेत तिल-जौ महायज्ञ।',
    description: `
<h2>👑 VIP पितृ शांति, श्रीमद्भागवत-गीता संपूर्ण पाठ एवं श्वेत तिल-जौ महायज्ञ</h2>
<p>सनातन धर्म में श्रीमद्भागवत गीता के 18 अध्यायों का सस्वर पाठ एवं तर्पण पितरों को मोक्ष प्रदान करने का सबसे सामर्थ्यवान उपाय माना गया है। सिद्ध <strong>चंडिकेश्वर महादेव मंदिर, जोधपुर (राजस्थान)</strong> में मुख्य वेदाचार्य पं. मुकेश बोहरा जी के सानिध्य में <strong>21 पीढ़ियों के पूर्वजों की अक्षय तृप्ति हेतु विशेष श्रीमद्भागवत गीता 18 अध्याय पाठ, श्वेत कमल-कुंद पुष्प अर्पण, श्वेत खीर भोग एवं श्वेत तिल, जौ व शुद्ध गाय के घी द्वारा भव्य महायज्ञ</strong> संपन्न कराया जाता है।</p>

<h3>🌸 VIP पितृ शांति महायज्ञ के पावन महा लाभ (Key Sacred Benefits):</h3>
<ul>
  <li><strong>21 पीढ़ियों के पितरों का मोक्ष (Ultimate Lineage Liberation):</strong> श्रीमद्भागवत गीता के संपूर्ण 18 अध्यायों का सस्वर पाठ, जिससे पूर्वजों को सीधे वैकुण्ठ लोक व विष्णु पद की प्राप्ति होती है।</li>
  <li><strong>श्वेत सामग्री व तिल-जौ महायज्ञ:</strong> श्वेत पुष्पों (कुंद, तगर व चमेली), श्वेत भोग (गाय के दूध की खीर, मक्खन व मिश्री) तथा विशेष श्वेत तिल, जौ व 108 जड़ी-बूटियों द्वारा महापूर्णाहुति यज्ञ।</li>
  <li><strong>अकाल मृत्यु व अधोगति से मुक्ति:</strong> जिन पूर्वजों की अनजाने में अकाल मृत्यु हुई हो या जिनकी आत्मिक शांति न हुई हो, उनके प्रेतत्व का सर्वथा अंत।</li>
  <li><strong>वंश वृद्धि व संतान सुख प्राप्ति:</strong> पितृ दोष के कारण संतान उत्पत्ति में आ रही बाधाओं, पैतृक विवादों व अकारण गृह क्लेश का समूल नाश।</li>
  <li><strong>100% व्यक्तिगत लाइव वीडियो संकल्प व सिद्ध प्रसाद:</strong> आपके नाम-गोत्र के साथ पं. मुकेश बोहरा जी द्वारा लाइव वीडियो संकल्प, सिद्ध गीता महाभस्म, गंगाजल, रक्षा सूत्र व महाप्रसाद आपके घर पर।</li>
</ul>

<h3>📍 पूजा स्थल (Venue):</h3>
<p><strong>चंडिकेश्वर महादेव मंदिर, जोधपुर (राजस्थान)</strong></p>

<h3>👨‍⚖️ मुख्य वेदाचार्य (Assigned Priest):</h3>
<p><strong>पं. मुकेश बोहरा (Pt. Mukesh Bohra), जोधपुर</strong></p>

<h3>📅 पूजा तिथि (Date):</h3>
<p><em>(तिथि शीघ्र घोषित की जाएगी - आप अभी अपना नाम-गोत्र संकल्प बुक कर सकते हैं)</em></p>
    `,
    benefits: '21 पीढ़ियों के पूर्वजों को बैकुंठ लोक व मोक्ष, 18 अध्याय श्रीमद्भागवत गीता पाठ, श्वेत तिल व जौ महायज्ञ, अकाल मृत्यु दोष शमन, संतान व वंश वृद्धि, 100% लाइव संकल्प व प्रसाद',
    procedure: 'सस्वर नाम-गोत्र संकल्प -> 18 अध्याय श्रीमद्भागवत गीता पाठ -> सर्व पितृ तर्पण -> श्वेत तिल-जौ महाहवन व महाआरती',
    categoryId: category.id,
    templeId: temple.id,
    price: 15001,
    vipPrice: 15001,
    location: 'Chandikeshwar Mahadev Temple, Jodhpur, Rajasthan',
    status: 'PUBLISHED',
    isEvergreen: true,
    isFeatured: true,
    isOnline: true,
    isVip: true,
    coverImage: '/pitra_gita_hawan.jpg',
    seoTitle: 'VIP Pitra Shanti Gita Path Online | Shwet Til Hawan Jodhpur',
    seoDescription: 'Book VIP Pitra Shanti, Bhagavad Gita 18 Adhyay Path & Shwet Til Yagya online at Chandikeshwar Mahadev Jodhpur by Pt. Mukesh Bohra. Ancestral liberation & Pitra Dosh removal.',
    seoKeywords: 'vip pitra shanti gita path online, shwet til jau hawan jodhpur, gita 18 adhyay pitra moksha puja, chandikeshwar mahadev pitra yagya mukesh bohra, divyayagyam vip pitra puja'
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
      name: '👑 VIP 21 पीढ़ी पितृ मोक्ष महा अनुष्ठान (VIP Royal Pitra Shanti)',
      price: 15001,
      description: 'पं. मुकेश बोहरा जी द्वारा 100% व्यक्तिगत नाम-गोत्र संकल्प, 18 अध्याय गीता पाठ, श्वेत पुष्प व खीर भोग अर्पण, श्वेत तिल-जौ महाहवन व सिद्ध महाप्रसाद।'
    }
  })

  console.log('🎉 SUCCESS! Created VIP Pitra Shanti Gita Path Puja in DB:', puja.name, 'ID:', puja.id)
}

main()
  .catch(err => {
    console.error('❌ Error creating VIP Pitra Gita Puja:', err)
  })
  .finally(() => prisma.$disconnect())
