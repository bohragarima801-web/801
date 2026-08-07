const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🐍 Creating Kaal Sarp Dosh Nivaran Puja in DB...')

  // Find or create Navagraha / Dosh Nivaran Category
  let category = await prisma.pujaCategory.findFirst({
    where: { OR: [{ slug: 'navagraha-pujas' }, { slug: 'dosh-nivaran' }, { name: { contains: 'Navagraha' } }] }
  })

  if (!category) {
    category = await prisma.pujaCategory.create({
      data: {
        name: 'नवग्रह व दोष निवारण पूजा',
        slug: 'navagraha-pujas',
        description: 'कालसर्प, राहु-केतु व नवग्रह शांत्यनुष्ठान'
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
        deity: 'Maa Katyayani & Nag Devta',
        city: 'Jodhpur',
        state: 'Rajasthan',
        country: 'India',
        description: 'सिद्ध माँ कात्यायनी व नवग्रह शक्ति पीठ, जोधपुर (राजस्थान)',
        isFeatured: true
      }
    })
  }

  const pujaData = {
    name: 'कालसर्प दोष शांति व राहु-केतु निवारण महापूजा (Kaal Sarp Dosh Nivaran Sacred Ritual)',
    slug: 'kalsarp-dosh-shanti-puja',
    shortDescription: 'जन्मकुंडली के सभी 12 प्रकार के कालसर्प दोष, राहु-केतु पीड़ा, व्यापारिक रुकावट व मानसिक अशान्ति के सर्वथा शमन हेतु विशेष नाग पूजन एवं शांति हवन।',
    description: `
<h2>कालसर्प दोष शांति व राहु-केतु निवारण महापूजा</h2>
<p>जब जन्मकुंडली में राहु और केतु के बीच सभी 7 ग्रह आ जाते हैं, तब <strong>कालसर्प दोष</strong> का निर्माण होता है। इसके कारण जीवन में अकारण रुकावटें, विवाह में विलंब, संतान बाधा, व्यापारिक घाटा, भयानक स्वप्न एवं मानसिक तनाव बना रहता है। सिद्ध <strong>माँ कात्यायनी दुर्गा शक्ति पीठ, जोधपुर (राजस्थान)</strong> में मुख्य वेदाचार्य पं. मुकेश बोहरा जी के मार्गदर्शन में इस दोष का पूर्ण वैदिक शांति पूजन संपन्न कराया जाता है।</p>

<h3>🌸 महापूजा के मुख्य पावन लाभ (Key Sacred Benefits):</h3>
<ul>
  <li><strong>12 प्रकार के कालसर्प दोषों का शमन:</strong> अनन्त, वासुकि, तक्षक, कर्कोटक, पद्म, महापद्म, शंखपाल, घातक, विषधर, शंखचूड़ आदि सर्व दोषों से मुक्ति।</li>
  <li><strong>राहु-केतु पीड़ा व मानसिक अशान्ति निवारण:</strong> अचानक आने वाली बाधाओं, अज्ञात भय, अवसाद एवं मानसिक अशांति से तत्काल राहत।</li>
  <li><strong>नौकरी व व्यापार में तरक्की:</strong> करियर में अकारण रुकने वाली पदोन्नति एवं व्यापारिक घाटे का निवारण कर स्थायित्व प्रदान करना।</li>
  <li><strong>विवाह व संतान बाधा मुक्ति:</strong> विवाह में आ रहे विलंब व दांपत्य जीवन के क्लेशों का शमन।</li>
  <li><strong>लाइव वीडियो संकल्प व नाग भस्म प्रसाद:</strong> आपके नाम व गोत्र के साथ लाइव वीडियो संकल्प एवं सिद्ध नागबली भस्म व प्रसाद आपके घर पर।</li>
</ul>

<h3>📍 पूजा स्थल (Venue):</h3>
<p><strong>माँ कात्यायनी दुर्गा शक्ति पीठ, जोधपुर (राजस्थान)</strong></p>

<h3>👨‍⚖️ मुख्य वेदाचार्य (Assigned Priest):</h3>
<p><strong>पं. मुकेश बोहरा (Pt. Mukesh Bohra), जोधपुर</strong></p>

<h3>📅 पूजा तिथि (Date):</h3>
<p><em>(तिथि शीघ्र घोषित की जाएगी - आप अभी संकल्प बुक कर सकते हैं)</em></p>
    `,
    benefits: 'सभी 12 कालसर्प दोषों का शमन, राहु-केतु पीड़ा निवारण, करियर व व्यापार में तरक्की, मानसिक शांति व पारिवारिक सुख',
    procedure: 'संकल्प -> नाग-नागिन प्रतिमा पूजन -> नवग्रह मंडल आवाहन -> राहु-केतु मंत्र जाप -> शांति हवन व महाआरती',
    categoryId: category.id,
    templeId: temple.id,
    price: 901,
    vipPrice: 3501,
    location: 'Maa Katyayani Durga Shakti Peeth, Jodhpur, Rajasthan',
    status: 'PUBLISHED',
    isEvergreen: true,
    isFeatured: true,
    isOnline: true,
    isVip: false,
    coverImage: '/kalsarp_dosh_nivaran_banner.jpg',
    seoTitle: 'Kaal Sarp Dosh Nivaran Puja Online | Rahu Ketu Shanti Jodhpur',
    seoDescription: 'Book authentic Kaal Sarp Dosh Shanti Puja at Katyayani Shakti Peeth Jodhpur by Pt. Mukesh Bohra. Remove career obstacles, marriage delays & negative energy.',
    seoKeywords: 'kaal sarp dosh nivaran puja, kalsarp shanti jodhpur, rahu ketu puja online, mukesh bohra pandit jodhpur, divyayagyam kalsarp puja'
  }

  const puja = await prisma.puja.upsert({
    where: { slug: pujaData.slug },
    create: pujaData,
    update: pujaData
  })

  // Add Member Packages (1 Member: 901, 2 Members: 1501, 4 Members: 2501, 6 Members: 3501)
  const packageList = [
    {
      name: '1 भक्त व्यक्तिगत संकल्प (Single Member)',
      price: 901,
      description: '1 व्यक्ति का नाम व गोत्र संकल्प, राहु-केतु मंत्र जाप, शांति हवन आहुति व प्रसाद।'
    },
    {
      name: '2 भक्त दम्पति संकल्प (2 Members Couple)',
      price: 1501,
      description: 'पति-पत्नी या 2 सदस्यों का नाम-गोत्र संकल्प, नाग पूजन, शांति हवन व महाप्रसाद।'
    },
    {
      name: '4 भक्त परिवार संकल्प (4 Members Family)',
      price: 2501,
      description: 'परिवार के 4 सदस्यों का नाम व गोत्र संकल्प, नवग्रह मंडल पूजन, शांति हवन व प्रसाद।'
    },
    {
      name: '6 भक्त महाकुल संकल्प (6 Members Family)',
      price: 3501,
      description: 'कुल 6 सदस्यों का महाकुल नाम-गोत्र संकल्प, नागबली भस्म, विशेष ताबीज व संपूर्ण प्रसाद।'
    }
  ]

  // Delete existing packages for this puja if any and create new ones
  await prisma.pujaPackage.deleteMany({ where: { pujaId: puja.id } })

  for (const pkg of packageList) {
    await prisma.pujaPackage.create({
      data: {
        pujaId: puja.id,
        name: pkg.name,
        price: pkg.price,
        description: pkg.description
      }
    })
  }

  console.log('🎉 SUCCESS! Created Kaal Sarp Dosh Puja in DB:', puja.name, 'ID:', puja.id)
}

main()
  .catch(err => {
    console.error('❌ Error creating Kaal Sarp Puja:', err)
  })
  .finally(() => prisma.$disconnect())
