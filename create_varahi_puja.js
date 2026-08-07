const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌾 Creating Maa Varahi Land Dispute Puja in DB...')

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

  // Find Jodhpur Shakti Peeth Temple
  let temple = await prisma.temple.findFirst({
    where: { OR: [{ slug: 'jodhpur-katyayani-shakti-peeth' }, { name: { contains: 'Katyayani' } }] }
  })

  if (!temple) {
    temple = await prisma.temple.create({
      data: {
        name: 'Maa Katyayani Durga Shakti Peeth',
        slug: 'jodhpur-katyayani-shakti-peeth',
        deity: 'Maa Varahi Devi & Durga Devi',
        city: 'Jodhpur',
        state: 'Rajasthan',
        country: 'India',
        description: 'सिद्ध माँ कात्यायनी व वाराही महापीठ, जोधपुर (राजस्थान)',
        isFeatured: true
      }
    })
  }

  const pujaData = {
    name: 'माँ वाराही देवी तंत्रोक्त महायज्ञ एवं भू-संपत्ति विवाद निवारण अनुष्ठान (Maa Varahi Land & Property Dispute Removal Yagya)',
    slug: 'maa-varahi-land-property-dispute-yagya',
    shortDescription: 'भूमि विवाद, पैतृक संपत्ति, अवैध कब्जे, प्लॉट/मकान मुकदमों एवं रियल एस्टेट अड़चनों के सर्वथा निवारण हेतु सिद्ध शक्ति पीठ पर वाराही अनुष्ठान, भूमि सुदर्शन चक्र पूजन व महायज्ञ।',
    description: `
<h2>माँ वाराही देवी तंत्रोक्त महायज्ञ एवं भू-संपत्ति विवाद निवारण अनुष्ठान</h2>
<p>माँ वाराही देवी (सप्तमातृका एवं महाविद्या) सनातन संस्कृति में पृथ्वी तत्व, अचल संपत्ति, भूमि एवं कृषि की अधिष्ठात्री महाशक्ति हैं। जब <strong>भूमि विवाद, पैतृक संपत्ति में हिस्सा न मिलना, भू-माफियाओं का अवैध कब्जा, प्लॉट/मकान का कोर्ट केस या क्रय-विक्रय में रुकावट</strong> आ रही हो, तो वाराही देवी का अनुष्ठान अचूक माना जाता है। सिद्ध <strong>माँ कात्यायनी दुर्गा शक्ति पीठ, जोधपुर (राजस्थान)</strong> में मुख्य वेदाचार्य पं. मुकेश बोहरा जी के सानिध्य में वाराही महायज्ञ संपन्न किया जाता है।</p>

<h3>🌸 महापूजा व वाराही अनुष्ठान के मुख्य लाभ (Key Sacred Benefits):</h3>
<ul>
  <li><strong>भूमि व पैतृक संपत्ति विवाद में विजय:</strong> भू-माफियाओं के षड्यंत्रों, अवैध कब्जों व पैतृक जमीन के बंटवारे में आ रही अड़चनों का शमन।</li>
  <li><strong>कोर्ट-कचहरी मुकदमों में सफलता:</strong> संपत्ति संबंधी न्यायालयी विवादों में विरोधियों का स्तंभन एवं आपके पक्ष में निर्णय।</li>
  <li><strong>वाराही अमोघ कवच व भूमि सुदर्शन चक्र पाठ:</strong> वाराही मूल मंत्र, वाराही अनुग्रह स्तोत्र व भूमि सुरक्षा चक्र पाठ द्वारा संपत्ति पर अभेद्य सुरक्षा।</li>
  <li><strong>नया मकान, प्लॉट व अचल संपत्ति प्राप्ति योग:</strong> रियल एस्टेट, बिल्डर विवाद व गृह निर्माण में आ रहे अवरोधों का अंत।</li>
  <li><strong>लाइव वीडियो संकल्प व सिद्ध वाराही प्रसाद:</strong> आपके नाम व गोत्र के साथ लाइव वीडियो संकल्प एवं सिद्ध वाराही महाभस्म व मृत्तिका प्रसाद आपके घर पर।</li>
</ul>

<h3>📍 पूजा स्थल (Venue):</h3>
<p><strong>माँ कात्यायनी दुर्गा शक्ति पीठ, जोधपुर (राजस्थान)</strong></p>

<h3>👨‍⚖️ मुख्य वेदाचार्य (Assigned Priest):</h3>
<p><strong>पं. मुकेश बोहरा (Pt. Mukesh Bohra), जोधपुर</strong></p>

<h3>📅 पूजा तिथि (Date):</h3>
<p><em>(तिथि शीघ्र घोषित की जाएगी - आप अभी संकल्प बुक कर सकते हैं)</em></p>
    `,
    benefits: 'भूमि व पैतृक संपत्ति विवाद में विजय, भू-माफिया व अवैध कब्जा शमन, संपत्ति कोर्ट केस विजय, अचल संपत्ति व गृह निर्माण योग',
    procedure: 'सस्वर संकल्प -> भूमि सुदर्शन चक्र पूजन -> वाराही अमोघ कवच पाठ -> वाराही तंत्रोक्त महाहवन व महाआरती',
    categoryId: category.id,
    templeId: temple.id,
    price: 901,
    vipPrice: 15001,
    location: 'Maa Katyayani Durga Shakti Peeth, Jodhpur, Rajasthan',
    status: 'PUBLISHED',
    isEvergreen: true,
    isFeatured: true,
    isOnline: true,
    isVip: true,
    coverImage: '/varahi_land_yagya.jpg',
    seoTitle: 'Maa Varahi Puja Online | Land & Property Dispute Removal Jodhpur',
    seoDescription: 'Book authentic Maa Varahi Devi Puja & Land Dispute Removal Yagya online at Katyayani Shakti Peeth Jodhpur by Pt. Mukesh Bohra. Win property lawsuits & land disputes.',
    seoKeywords: 'maa varahi puja online, property dispute puja varahi, land dispute victory hawan, varahi devi jodhpur mukesh bohra, divyayagyam varahi puja'
  }

  const puja = await prisma.puja.upsert({
    where: { slug: pujaData.slug },
    create: pujaData,
    update: pujaData
  })

  // Add Member Packages (1 Member: 901, 2 Members: 1501, 4 Members: 2501, 6 Members: 3501, VIP: 15001)
  const packageList = [
    {
      name: '1 भक्त व्यक्तिगत संकल्प (Single Member)',
      price: 901,
      description: '1 व्यक्ति का नाम व गोत्र संकल्प, वाराही मंत्र जाप, शांति हवन आहुति व सिद्ध प्रसाद।'
    },
    {
      name: '2 भक्त दम्पति संकल्प (2 Members Couple)',
      price: 1501,
      description: 'पति-पत्नी या 2 सदस्यों का नाम-गोत्र संकल्प, वाराही अमोघ कवच पाठ, शांति हवन व महाप्रसाद।'
    },
    {
      name: '4 भक्त परिवार संकल्प (4 Members Family)',
      price: 2501,
      description: 'परिवार के 4 सदस्यों का नाम व गोत्र संकल्प, सम्पूर्ण भूमि सुदर्शन चक्र पूजन, रक्षा सूत्र व प्रसाद।'
    },
    {
      name: '6 भक्त महाकुल संकल्प (6 Members Family)',
      price: 3501,
      description: 'कुल 6 सदस्यों का महाकुल नाम-गोत्र संकल्प, सिद्ध वाराही भस्म, विशेष भूमि ताबीज व संपूर्ण प्रसाद।'
    },
    {
      name: '👑 VIP विशेष भू-संपत्ति विवाद निवारण महा अनुष्ठान (VIP Personal)',
      price: 15001,
      description: 'पं. मुकेश बोहरा जी द्वारा व्यक्तिगत 100% लाइव संकल्प, वाराही तंत्रोक्त महाहवन, विशेष भूमि सुदर्शन यंत्र पूजन व सिद्ध प्रसाद।'
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

  console.log('🎉 SUCCESS! Created Maa Varahi Land Dispute Puja in DB:', puja.name, 'ID:', puja.id)
}

main()
  .catch(err => {
    console.error('❌ Error creating Varahi Puja:', err)
  })
  .finally(() => prisma.$disconnect())
