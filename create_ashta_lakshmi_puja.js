const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('💰 Creating VIP 16-Day Ashta Lakshmi Anusthan in DB...')

  // Find or create Lakshmi / Wealth Category
  let category = await prisma.pujaCategory.findFirst({
    where: { OR: [{ slug: 'lakshmi-pujas' }, { slug: 'vip-pujas' }, { name: { contains: 'Lakshmi' } }] }
  })

  if (!category) {
    category = await prisma.pujaCategory.create({
      data: {
        name: 'लक्ष्मी व श्री समृद्धि पूजा',
        slug: 'lakshmi-pujas',
        description: 'अष्टलक्ष्मी अनुष्ठान, कनकधारा पाठ व कर्ज मुक्ति महायज्ञ'
      }
    })
  }

  // Find or Create Chamunda Temple Jodhpur
  let temple = await prisma.temple.findFirst({
    where: { OR: [{ slug: 'chamunda-mata-temple-jodhpur' }, { name: { contains: 'Chamunda' } }] }
  })

  if (!temple) {
    temple = await prisma.temple.create({
      data: {
        name: 'Chamunda Mata Temple',
        slug: 'chamunda-mata-temple-jodhpur',
        deity: 'Chamunda Mata & Ashta Lakshmi Devi',
        city: 'Jodhpur',
        state: 'Rajasthan',
        country: 'India',
        description: 'प्राचीन सिद्ध चामुंडा माता मंदिर, जोधपुर दुर्ग (राजस्थान)',
        isFeatured: true
      }
    })
  }

  const pujaData = {
    name: 'माँ अष्टलक्ष्मी 16 दिवसीय महा अनुष्ठान एवं सर्व कर्ज मुक्ति लक्ष्मी महायज्ञ (VIP 16-Day Ashta Lakshmi Anusthan & Karz Mukti Yagya)',
    slug: 'maa-ashta-lakshmi-16-day-karz-mukti-mahayagya',
    shortDescription: 'राधाष्टमी से पितृ पक्ष अष्टमी तक 16 दिनों का अखंड अष्टलक्ष्मी जाप, कनकधारा-श्रीसूक्त पाठ, सर्व कर्ज मुक्ति अनुष्ठान एवं 16वें दिन सिद्ध स्वाहाकार लक्ष्मी महायज्ञ।',
    description: `
<h2>👑 VIP माँ अष्टलक्ष्मी 16 दिवसीय महा अनुष्ठान एवं सर्व कर्ज मुक्ति महायज्ञ</h2>
<p>सनातन शास्त्रोक्त परंपरा में <strong>राधाष्टमी (भाद्रपद शुक्ल अष्टमी) से प्रारंभ होकर पितृ पक्ष की अष्टमी (16वें दिन)</strong> का काल माँ महालक्ष्मी की प्रसन्नता का सबसे महान सिद्ध काल माना गया है। <strong>प्राचीन सिद्ध चामुंडा माता मंदिर, जोधपुर (राजस्थान)</strong> में मुख्य पीठाधीश्वर आचार्य मुकेश बोहरा जी के सानिध्य में <strong>16 दिनों का अखंड अष्टलक्ष्मी जाप, कनकधारा पाठ, श्रीसूक्त होम एवं 16वें दिन महापूर्णाहुति यज्ञाहुति</strong> का अति-विशिष्ट VIP महा अनुष्ठान संपन्न कराया जाता है।</p>

<h3>🌸 16 दिवसीय VIP अनुष्ठान के अमोघ पावन लाभ (Key Sacred Benefits):</h3>
<ul>
  <li><strong>16 दिनों की अखंड साधना (16-Day Sacred Rituals):</strong> राधाष्टमी से पितृ पक्ष अष्टमी तक प्रतिदिन सस्वर कनकधारा स्तोत्र, श्रीसूक्त, अष्टलक्ष्मी कल्प व महालक्ष्मी गायत्री मंत्र जाप।</li>
  <li><strong>सर्व कर्ज व ऋण मुक्ति (Complete Freedom from Debts):</strong> वर्षों पुराने भारी कर्जों, बैंक लोन, व्यापारिक घाटे व ब्याज के दुष्चक्र का समूल विनाश।</li>
  <li><strong>अष्टलक्ष्मी सिद्ध आशीर्वाद (All 8 Lakshmi Blessings):</strong> आदिलक्ष्मी (आरोग्य), धनलक्ष्मी (अखंड धन), धान्यलक्ष्मी (समृद्धि), गजलक्ष्मी (पद-प्रतिष्ठा), संतानलक्ष्मी (वंश वृद्धि), धैर्यलक्ष्मी (साहस), विजयलक्ष्मी (सफलता) व विद्यालक्ष्मी का वरदान।</li>
  <li><strong>16वें दिन सिद्ध स्वाहाकार महापूर्णाहुति (Grand 16th Day Hawan):</strong> 16वें दिन (पितृ पक्ष अष्टमी) पर कमल गट्टे, शुद्ध घी, शहद, मखाना, पीत सरसों व 108 दुर्लभ द्रव्यों द्वारा महायज्ञ।</li>
  <li><strong>100% व्यक्तिगत दैनिक अपडेट व महाप्रसाद डिलीवरी:</strong> 16 दिनों तक आपके नाम-गोत्र का दैनिक संकल्प, लाइव वीडियो एवं सिद्ध कनकधारा यंत्र, अष्टलक्ष्मी कौड़ी, कुबेर चाबी व महाप्रसाद आपके घर पर।</li>
</ul>

<h3>📍 पूजा स्थल (Venue):</h3>
<p><strong>चामुंडा माता मंदिर, जोधपुर (राजस्थान)</strong></p>

<h3>👨‍⚖️ मुख्य वेदाचार्य (Assigned Priest):</h3>
<p><strong>आचार्य मुकेश बोहरा (Acharya Mukesh Bohra), जोधपुर</strong></p>

<h3>📅 पूजा अवधि व तिथि (Time Window):</h3>
<p><strong>16 दिन</strong> (राधाष्टमी से पितृ पक्ष अष्टमी - <em>आप अभी अपना नाम-गोत्र संकल्प बुक कर सकते हैं</em>)</p>
    `,
    benefits: '16 दिनों का अखंड अष्टलक्ष्मी साधना, सालों पुराने कर्जों व ऋण से स्थायी मुक्ति, कनकधारा-श्रीसूक्त पाठ, 16वें दिन स्वाहाकार महाहवन, धन-धान्य व आरोग्य लाभ',
    procedure: 'राधाष्टमी को 16 दिवसीय संकल्प -> प्रतिदिन 16 दिन कनकधारा व अष्टलक्ष्मी पाठ -> 16वें दिन (पितृ पक्ष अष्टमी) कमल गट्टा महाहवन व महापूर्णाहुति आरती',
    categoryId: category.id,
    templeId: temple.id,
    price: 31000,
    vipPrice: 31000,
    location: 'Chamunda Mata Temple, Jodhpur, Rajasthan',
    status: 'PUBLISHED',
    isEvergreen: true,
    isFeatured: true,
    isOnline: true,
    isVip: true,
    coverImage: '/ashta_lakshmi_16days.jpg',
    seoTitle: '16-Day Ashta Lakshmi Anusthan Booking | Karz Mukti Hawan Jodhpur',
    seoDescription: 'Book VIP 16-Day Ashta Lakshmi Anusthan & Karz Mukti Mahayagya at Chamunda Temple Jodhpur by Acharya Mukesh Bohra. Freedom from debts & financial prosperity.',
    seoKeywords: 'ashta lakshmi 16 days puja online, karz mukti puja chamunda temple jodhpur, radhashtami to pitru paksha ashtami lakshmi puja, mukesh bohra lakshmi yagya, divyayagyam 16 day lakshmi anusthan'
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
      name: '👑 VIP 16 दिवसीय अष्टलक्ष्मी महा अनुष्ठान एवं स्वाहाकार महायज्ञ (16 Days Royal VIP)',
      price: 31000,
      description: 'आचार्य मुकेश बोहरा जी द्वारा 16 दिनों तक लगातार नाम-गोत्र संकल्प, कनकधारा-श्रीसूक्त पाठ, 16वें दिन स्वाहाकार महाहवन, सिद्ध कनकधारा यंत्र, अष्टलक्ष्मी कौड़ी व महाप्रसाद।'
    }
  })

  console.log('🎉 SUCCESS! Created VIP 16-Day Ashta Lakshmi Anusthan in DB:', puja.name, 'ID:', puja.id)
}

main()
  .catch(err => {
    console.error('❌ Error creating Ashta Lakshmi Puja:', err)
  })
  .finally(() => prisma.$disconnect())
