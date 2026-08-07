const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🪐 Creating Shani Saadesati & Dhaiya Dosh Nivaran Yagya in DB...')

  // Find or create Navagraha Category
  let category = await prisma.pujaCategory.findFirst({
    where: { OR: [{ slug: 'navagraha-pujas' }, { name: { contains: 'Navagraha' } }] }
  })

  if (!category) {
    category = await prisma.pujaCategory.create({
      data: {
        name: 'नवग्रह व दोष निवारण पूजा',
        slug: 'navagraha-pujas',
        description: 'कालसर्प, राहु-केतु व शनि दोष शांत्यनुष्ठान'
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
        deity: 'Maa Katyayani & Shani Dev',
        city: 'Jodhpur',
        state: 'Rajasthan',
        country: 'India',
        description: 'सिद्ध माँ कात्यायनी व नवग्रह पीठ, जोधपुर (राजस्थान)',
        isFeatured: true
      }
    })
  }

  const pujaData = {
    name: 'शनि साढ़ेसाती, ढैय्या व शनि दोष निवारण महापूजा एवं शांति यज्ञ (Shani Saadesati & Dhaiya Dosh Nivaran Yagya)',
    slug: 'shani-saadesati-dhaiya-dosh-nivaran-yagya',
    shortDescription: 'शनि साढ़ेसाती, अष्टम ढैय्या, शनि महादशा, व्यापारिक घाटा, शारीरिक कष्ट व अकारण अपमान के सर्वथा निवारण हेतु शक्ति पीठ पर विशेष तैलभिषेक, शमी पत्र अर्पण व शनि महामंत्र शांति यज्ञ।',
    description: `
<h2>शनि साढ़ेसाती, ढैय्या व शनि दोष निवारण महापूजा एवं शांति यज्ञ</h2>
<p>शनिदेव सनातन धर्म में न्याय एवं कर्मफल के अधिष्ठात्री देव हैं। जब कुंडली में <strong>शनि की साढ़ेसाती (प्रथम, द्वितीय या तृतीय ढैय्या), अष्टम/चतुर्थ ढैय्या या शनि की अंतरदशा</strong> चलती है, तो व्यक्ति को अकारण व्यापारिक घाटा, नौकरी छूटने का भय, गंभीर शारीरिक कष्ट (वात रोग, जोड़ों का दर्द), कानूनी अड़चनें व अकारण अपमान सहन करना पड़ता है। सिद्ध <strong>माँ कात्यायनी दुर्गा शक्ति पीठ, जोधपुर (राजस्थान)</strong> में मुख्य वेदाचार्य पं. मुकेश बोहरा जी के मार्गदर्शन में शनि शांति महायज्ञ संपन्न किया जाता है।</p>

<h3>🌸 महापूजा व शांति यज्ञ के मुख्य लाभ (Key Divine Benefits):</h3>
<ul>
  <li><strong>शनि साढ़ेसाती व ढैय्या शांति (Saadesati & Dhaiya Relief):</strong> साढ़ेसाती के तीनों चरणों व ढैय्या के दुष्प्रभावों का सर्वथा शमन एवं मानसिक शांति।</li>
  <li><strong>विशेष तैलभिषेक व शमी पत्र अर्पण:</strong> सरसों के तेल, काले तिल, उड़द, नीले पुष्प व शमी पत्र द्वारा भगवान शनिदेव का शास्त्रीय तैलभिषेक।</li>
  <li><strong>करियर, नौकरी व व्यापार में प्रगति:</strong> व्यापारिक घाटे का शमन, पदोन्नति के मार्ग खोलना एवं आर्थिक संकट से मुक्ति।</li>
  <li><strong>शारीरिक व्याधि व दुर्घटना रक्षा:</strong> वात रोग, जोड़ों के दर्द, असाध्य शारीरिक कष्ट व अकाल दुर्घटनाओं से सुरक्षा।</li>
  <li><strong>लाइव वीडियो संकल्प व सिद्ध शनि प्रसाद:</strong> आपके नाम व गोत्र के साथ लाइव वीडियो संकल्प एवं सिद्ध शनि भस्म व रक्षा सूत्र आपके घर पर।</li>
</ul>

<h3>📍 पूजा स्थल (Venue):</h3>
<p><strong>माँ कात्यायनी दुर्गा शक्ति पीठ, जोधपुर (राजस्थान)</strong></p>

<h3>👨‍⚖️ मुख्य वेदाचार्य (Assigned Priest):</h3>
<p><strong>पं. मुकेश बोहरा (Pt. Mukesh Bohra), जोधपुर</strong></p>

<h3>📅 पूजा तिथि (Date):</h3>
<p><em>(तिथि शीघ्र घोषित की जाएगी - आप अभी संकल्प बुक कर सकते हैं)</em></p>
    `,
    benefits: 'शनि साढ़ेसाती व ढैय्या शांति, सरसों तेल व शमी तैलभिषेक, करियर व व्यापारिक रुकावट मुक्ति, शारीरिक स्वास्थ्य लाभ',
    procedure: 'सस्वर संकल्प -> शनिदेव तैलभिषेक -> काले तिल व शमी पत्र अर्पण -> 23,000 शनि महामंत्र जाप -> शांति हवन व आरती',
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
    coverImage: '/shani_dosh_yagya.jpg',
    seoTitle: 'Shani Saadesati & Dhaiya Dosh Nivaran Puja Online | Shani Yagya Jodhpur',
    seoDescription: 'Book Shani Saadesati & Dhaiya Dosh Nivaran Puja online at Katyayani Shakti Peeth Jodhpur by Pt. Mukesh Bohra. Remove Shani dosh, career obstacles & health troubles.',
    seoKeywords: 'shani sadhe sati puja online, shani dhaiya dosh nivaran, shani shanti yagya booking, shani puja jodhpur mukesh bohra, divyayagyam shani puja'
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
      description: '1 व्यक्ति का नाम व गोत्र संकल्प, शनि तैलभिषेक, शनि महामंत्र जाप आहुति व सिद्ध प्रसाद।'
    },
    {
      name: '2 भक्त दम्पति संकल्प (2 Members Couple)',
      price: 1501,
      description: 'पति-पत्नी या 2 सदस्यों का नाम-गोत्र संकल्प, शमी पत्र तैलभिषेक, शनि शांति हवन व महाप्रसाद।'
    },
    {
      name: '4 भक्त परिवार संकल्प (4 Members Family)',
      price: 2501,
      description: 'परिवार के 4 सदस्यों का नाम व गोत्र संकल्प, सम्पूर्ण नवग्रह तैलभिषेक, शनि रक्षा सूत्र व प्रसाद।'
    },
    {
      name: '6 भक्त महाकुल संकल्प (6 Members Family)',
      price: 3501,
      description: 'कुल 6 सदस्यों का महाकुल नाम-गोत्र संकल्प, सिद्ध शनि भस्म, काले घोड़े की नाल का छल्ला व संपूर्ण प्रसाद।'
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

  console.log('🎉 SUCCESS! Created Shani Dosh Nivaran Yagya in DB:', puja.name, 'ID:', puja.id)
}

main()
  .catch(err => {
    console.error('❌ Error creating Shani Puja:', err)
  })
  .finally(() => prisma.$disconnect())
