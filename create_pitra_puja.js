const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌾 Creating Pitra Shanti Vishesh Puja in DB...')

  // Find or create Pitra / Dosh Nivaran Category
  let category = await prisma.pujaCategory.findFirst({
    where: { OR: [{ slug: 'pitra-pujas' }, { slug: 'dosh-nivaran' }, { name: { contains: 'Pitra' } }] }
  })

  if (!category) {
    category = await prisma.pujaCategory.create({
      data: {
        name: 'पितृ दोष व शांति पूजा',
        slug: 'pitra-pujas',
        description: 'सर्व पितृ तर्पण, पिंड दान व पितृ दोष शांति अनुष्ठान'
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
        deity: 'Maa Katyayani & Pitra Devtas',
        city: 'Jodhpur',
        state: 'Rajasthan',
        country: 'India',
        description: 'सिद्ध माँ कात्यायनी व नवग्रह शक्ति पीठ, जोधपुर (राजस्थान)',
        isFeatured: true
      }
    })
  }

  const pujaData = {
    name: 'पितृ शांति विशेष एवं सर्व पितृ तर्पण महापूजा (Pitra Shanti Vishesh & Sarva Pitra Tarpan Sacred Puja)',
    slug: 'pitra-shanti-vishesh-sarva-pitra-tarpan-puja',
    shortDescription: 'पितृ दोष शांति, पूर्वजों की तृप्ति, वंश वृद्धि व पारिवारिक सुख-शांति हेतु कुशा जल, काले तिल व जौ द्वारा सर्व पितृ तर्पण, पिंड दान एवं ब्राह्मण भोजन संकल्प।',
    description: `
<h2>पितृ शांति विशेष एवं सर्व पितृ तर्पण महापूजा</h2>
<p>सनातन संस्कृति में <strong>पितृगण देवतुल्य पूज्य</strong> माने गए हैं। जब कुंडली में पितृ दोष होता है या पूर्वजों की तृप्ति हेतु तर्पण न हुआ हो, तो घर में अकारण गृह क्लेश, संतान उत्पत्ति में बाधा, विवाह में विलंब व धन की तंगी बनी रहती है। सिद्ध <strong>माँ कात्यायनी दुर्गा शक्ति पीठ, जोधपुर (राजस्थान)</strong> में मुख्य वेदाचार्य पं. मुकेश बोहरा जी के सानिध्य में सर्व पितृ तर्पण एवं शांति महापूजा संपन्न कराई जाती है।</p>

<h3>🌸 सर्व पितृ तर्पण व शांति महापूजा के मुख्य लाभ (Key Sacred Benefits):</h3>
<ul>
  <li><strong>सर्व पितृ तर्पण व पिंड दान (Sacred Tarpan & Pinda Daan):</strong> कुशा जल, काले तिल, जौ, दूध व अक्षत द्वारा पूर्वजों की अक्षय तृप्ति एवं परम गति हेतु शास्त्रीय तर्पण।</li>
  <li><strong>पितृ दोष शांति व वंश वृद्धि (Pitra Dosh Removal):</strong> पूर्वजों के आशीर्वाद से संतान बाधा, विवाह में विलंब व अकारण गृह क्लेश का सर्वथा शमन।</li>
  <li><strong>पारिवारिक सुख व लक्ष्मी कृपा:</strong> पितरों के प्रसन्न होने पर घर में सुख, शांति, आरोग्यता व अचल संपत्ति की प्राप्ति।</li>
  <li><strong>ब्राह्मण भोजन व तिल दान संकल्प:</strong> तर्पण के पश्चात ससम्मान वेदपाठी ब्राह्मणों को भोजन अर्पण व तिल-कम्बल दान संकल्प।</li>
  <li><strong>लाइव वीडियो संकल्प व सिद्ध पितृ भस्म प्रसाद:</strong> आपके नाम व गोत्र के साथ लाइव वीडियो संकल्प एवं सिद्ध तर्पण भस्म व पावन प्रसाद आपके घर पर।</li>
</ul>

<h3>📍 पूजा स्थल (Venue):</h3>
<p><strong>माँ कात्यायनी दुर्गा शक्ति पीठ, जोधपुर (राजस्थान)</strong></p>

<h3>👨‍⚖️ मुख्य वेदाचार्य (Assigned Priest):</h3>
<p><strong>पं. मुकेश बोहरा (Pt. Mukesh Bohra), जोधपुर</strong></p>

<h3>📅 पूजा तिथि (Date):</h3>
<p><em>(तिथि शीघ्र घोषित की जाएगी - आप अभी संकल्प बुक कर सकते हैं)</em></p>
    `,
    benefits: 'सर्व पितृ तर्पण व पिंड दान, पितृ दोष शमन, संतान व वंश वृद्धि, घर में सुख-शांति व लक्ष्मी कृपा, ब्राह्मण भोजन व सिद्ध प्रसाद',
    procedure: 'सस्वर संकल्प -> सर्व पितृ आवाहन -> कुशा जल व तिल तर्पण -> पिंड दान -> ब्राह्मण भोजन संकल्प व महाआरती',
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
    coverImage: '/pitra_shanti_tarpan.jpg',
    seoTitle: 'Pitra Shanti Puja Online | Sarva Pitra Tarpan & Pinda Daan Jodhpur',
    seoDescription: 'Book authentic Pitra Shanti Vishesh Puja & Sarva Pitra Tarpan online at Katyayani Shakti Peeth Jodhpur by Pt. Mukesh Bohra. Remove Pitra Dosh & gain ancestral blessings.',
    seoKeywords: 'pitra shanti puja online, sarva pitra tarpan online booking, pinda daan jodhpur mukesh bohra, pitra dosh nivaran puja, divyayagyam pitra puja'
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
      description: '1 व्यक्ति का नाम व गोत्र संकल्प, सर्व पितृ तर्पण आहुति व सिद्ध प्रसाद।'
    },
    {
      name: '2 भक्त दम्पति संकल्प (2 Members Couple)',
      price: 1501,
      description: 'पति-पत्नी या 2 सदस्यों का नाम-गोत्र संकल्प, तिल व कुशा जल तर्पण, पिंड दान व महाप्रसाद।'
    },
    {
      name: '4 भक्त परिवार संकल्प (4 Members Family)',
      price: 2501,
      description: 'परिवार के 4 सदस्यों का नाम व गोत्र संकल्प, सम्पूर्ण सर्व पितृ तर्पण, ब्राह्मण भोजन संकल्प व प्रसाद।'
    },
    {
      name: '6 भक्त महाकुल संकल्प (6 Members Family)',
      price: 3501,
      description: 'कुल 6 सदस्यों का महाकुल नाम-गोत्र संकल्प, सिद्ध तर्पण भस्म, विशेष पितृ रक्षा सूत्र व संपूर्ण प्रसाद।'
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

  console.log('🎉 SUCCESS! Created Pitra Shanti Vishesh Puja in DB:', puja.name, 'ID:', puja.id)
}

main()
  .catch(err => {
    console.error('❌ Error creating Pitra Puja:', err)
  })
  .finally(() => prisma.$disconnect())
