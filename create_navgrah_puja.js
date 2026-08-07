const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🪐 Creating Navagraha Shanti Puja in DB...')

  // Find or create Navagraha Category
  let category = await prisma.pujaCategory.findFirst({
    where: { OR: [{ slug: 'navagraha-pujas' }, { name: { contains: 'Navagraha' } }] }
  })

  if (!category) {
    category = await prisma.pujaCategory.create({
      data: {
        name: 'नवग्रह व दोष निवारण पूजा',
        slug: 'navagraha-pujas',
        description: 'नवग्रह शांति, कालसर्प व राहु-केतु दोष शांत्यनुष्ठान'
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
        deity: 'Maa Katyayani & Navagraha Devas',
        city: 'Jodhpur',
        state: 'Rajasthan',
        country: 'India',
        description: 'सिद्ध माँ कात्यायनी व नवग्रह पीठ, जोधपुर (राजस्थान)',
        isFeatured: true
      }
    })
  }

  const pujaData = {
    name: 'नवग्रह शांति व सर्व ग्रह दोष निवारण महापूजा (Navagraha Shanti & Sarva Graha Dosh Nivaran Puja)',
    slug: 'navgrah-shanti-sarva-graha-dosh-nivaran-puja',
    shortDescription: 'सूर्य, चंद्र, मंगल, बुध, गुरु, शुक्र, शनि, राहु एवं केतु की अशुभ दशा, महादशा, अंतर्दशा व ग्रह पीड़ा के सर्वथा शमन हेतु शक्ति पीठ पर विशेष नवग्रह सम्पुट पाठ, 9 समिधा हवन व शांति अनुष्ठान।',
    description: `
<h2>नवग्रह शांति व सर्व ग्रह दोष निवारण महापूजा</h2>
<p>मानव जीवन की प्रत्येक घटना, स्वास्थ्य, करियर, विवाह, धन एवं भाग्य का सीधा संबंध <strong>नवग्रहों (सूर्य, चंद्र, मंगल, बुध, गुरु, शुक्र, शनि, राहु व केतु)</strong> की स्थिति से होता है। जब कुंडली में कोई ग्रह नीच का, पीड़ित या मारक महादशा में होता है, तो कार्य में असफलता, स्वास्थ्य कष्ट, पारिवारिक कलह व मानसिक तनाव का सामना करना पड़ता है। सिद्ध <strong>माँ कात्यायनी दुर्गा शक्ति पीठ, जोधपुर (राजस्थान)</strong> में मुख्य वेदाचार्य पं. मुकेश बोहरा जी के सानिध्य में सर्व ग्रह शांति महापूजा संपन्न की जाती है।</p>

<h3>🌸 नवग्रह पूजा के मुख्य पावन लाभ (Key Divine Benefits):</h3>
<ul>
  <li><strong>9 नवग्रहों की अनुकूलता (Balance of All 9 Planets):</strong> सूर्य (मान-सम्मान), चंद्र (मानसिक शांति), मंगल (पराक्रम व भूमि), बुध (बुद्धि व व्यापार), गुरु (ज्ञान व भाग्य), शुक्र (वैवाहिक सुख), शनि (न्याय व स्थायित्व), राहु-केतु (अज्ञात भय मुक्ति)।</li>
  <li><strong>भाग्य वृद्धि व अकारण रुकावटों का शमन:</strong> जीवन में आ रहे अकारण अवरोधों, भाग्यदोष, धन हानि व करियर की अनिश्चितता का अंत।</li>
  <li><strong>9 समिधा व जड़ी-बूटी नवग्रह हवन:</strong> अर्क, पलाश, खदिर, अपामार्ग, पीपल, गूलर, शमी, दूर्वा व कुशा समिधा द्वारा विशेष हवन।</li>
  <li><strong>शारीरिक आरोग्यता व मानसिक प्रसन्नता:</strong> ग्रह पीड़ा जनित असाध्य शारीरिक कष्टों, अवसाद व पारिवारिक कलह से स्थायी शांति।</li>
  <li><strong>लाइव वीडियो संकल्प व सिद्ध नवग्रह भस्म प्रसाद:</strong> आपके नाम व गोत्र के साथ लाइव वीडियो संकल्प एवं सिद्ध नवग्रह भस्म व यन्त्र प्रसाद आपके घर पर।</li>
</ul>

<h3>📍 पूजा स्थल (Venue):</h3>
<p><strong>माँ कात्यायनी दुर्गा शक्ति पीठ, जोधपुर (राजस्थान)</strong></p>

<h3>👨‍⚖️ मुख्य वेदाचार्य (Assigned Priest):</h3>
<p><strong>पं. मुकेश बोहरा (Pt. Mukesh Bohra), जोधपुर</strong></p>

<h3>📅 पूजा तिथि (Date):</h3>
<p><em>(तिथि शीघ्र घोषित की जाएगी - आप अभी संकल्प बुक कर सकते हैं)</em></p>
    `,
    benefits: 'सभी 9 ग्रहों की अनुकूलता, भाग्य वृद्धि व करियर तरक्की, 9 समिधा व जड़ी-बूटी नवग्रह शांति हवन, मानसिक शांति व शारीरिक स्वास्थ्य',
    procedure: 'सस्वर संकल्प -> नवग्रह मंडल आवाहन -> 9 ग्रहों के वेद मंत्र जाप -> 9 समिधा विशेष शांति हवन -> महाआरती व नवग्रह भस्म प्रसाद वितरण',
    categoryId: category.id,
    templeId: temple.id,
    price: 901,
    vipPrice: 5101,
    location: 'Maa Katyayani Durga Shakti Peeth, Jodhpur, Rajasthan',
    status: 'PUBLISHED',
    isEvergreen: true,
    isFeatured: true,
    isOnline: true,
    isVip: false,
    coverImage: '/navgrah_shanti_yagya.jpg',
    seoTitle: 'Navagraha Shanti Puja Online Booking | Sarva Graha Dosh Nivaran Jodhpur',
    seoDescription: 'Book authentic Navagraha Shanti Puja online at Katyayani Shakti Peeth Jodhpur by Pt. Mukesh Bohra. Balance 9 planets, remove malefic graha dosha & gain prosperity.',
    seoKeywords: 'navagraha shanti puja online, navgrah puja booking, sarva graha dosh nivaran, navagraha hawan jodhpur mukesh bohra, divyayagyam navgrah puja'
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
      description: '1 व्यक्ति का नाम व गोत्र संकल्प, 9 ग्रहों के मंत्र जाप, शांति हवन आहुति व सिद्ध प्रसाद।'
    },
    {
      name: '2 भक्त दम्पति संकल्प (2 Members Couple)',
      price: 1501,
      description: 'पति-पत्नी या 2 सदस्यों का नाम-गोत्र संकल्प, नवग्रह मंडल पूजन, शांति हवन व महाप्रसाद।'
    },
    {
      name: '4 भक्त परिवार संकल्प (4 Members Family)',
      price: 2501,
      description: 'परिवार के 4 सदस्यों का नाम व गोत्र संकल्प, सम्पूर्ण 9 समिधा हवन, नवग्रह रक्षा सूत्र व प्रसाद।'
    },
    {
      name: '6 भक्त महाकुल संकल्प (6 Members Family)',
      price: 3501,
      description: 'कुल 6 सदस्यों का महाकुल नाम-गोत्र संकल्प, सिद्ध नवग्रह भस्म, ताबीज रक्षा कवच व संपूर्ण प्रसाद।'
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

  console.log('🎉 SUCCESS! Created Navagraha Shanti Puja in DB:', puja.name, 'ID:', puja.id)
}

main()
  .catch(err => {
    console.error('❌ Error creating Navgrah Puja:', err)
  })
  .finally(() => prisma.$disconnect())
