const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌺 Creating Durga Saptashati 108 Samagri Mahayagya in DB...')

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

  // Find or create Jodhpur Shakti Peeth Temple
  let temple = await prisma.temple.findFirst({
    where: { OR: [{ slug: 'jodhpur-katyayani-shakti-peeth' }, { name: { contains: 'Katyayani' } }] }
  })

  if (!temple) {
    temple = await prisma.temple.create({
      data: {
        name: 'Maa Katyayani Durga Shakti Peeth',
        slug: 'jodhpur-katyayani-shakti-peeth',
        deity: 'Maa Katyayani & Durga Devi',
        city: 'Jodhpur',
        state: 'Rajasthan',
        country: 'India',
        description: 'सिद्ध माँ कात्यायनी व नवदुर्गा महापीठ, जोधपुर (राजस्थान)',
        isFeatured: true
      }
    })
  }

  const pujaData = {
    name: 'दुर्गा सप्तशती संपूर्ण पाठ व 108 सामग्री विशेष तंत्रोक्त महायज्ञ (Durga Saptashati 108 Samagri Hawan)',
    slug: 'durga-saptashati-108-samagri-mahayagya',
    shortDescription: '108 दुर्लभ औषधीय व तंत्रोक्त सामग्रियों द्वारा संपूर्ण दुर्गा सप्तशती पाठ, नवार्ण हवन, दिक्पाल/भैरव सात्विक बलि एवं सर्व बाधा निवारण महायज्ञ।',
    description: `
<h2>दुर्गा सप्तशती संपूर्ण पाठ व 108 सामग्री विशेष तंत्रोक्त महायज्ञ</h2>
<p>सिद्ध <strong>माँ कात्यायनी दुर्गा शक्ति पीठ, जोधपुर (राजस्थान)</strong> में वेदपाठी प्रकांड आचार्यों द्वारा 108 दुर्लभ पावन सामग्रियों के साथ महायज्ञ संपन्न किया जाता है। यह महायज्ञ सर्वविपत्ति नाश, शत्रु स्तंभन एवं अमोघ भगवती कृपा हेतु सनातन धर्म का सर्वोच्च अनुष्ठान है।</p>

<h3>🔥 महायज्ञ की 10 पवित्र विधियां (Signature Mahayagya Ceremonies):</h3>
<ul>
  <li><strong>दुर्गा सप्तशती पाठ (Durga Saptashati 13 Chapters):</strong> संपूर्ण 700 मंत्रों का सस्वर सम्पुट पाठ।</li>
  <li><strong>नवार्ण हवन (Navarna Hawan):</strong> ऐं ह्रीं क्लीं चामुण्डायै विच्चे मंत्र द्वारा महा आहुति।</li>
  <li><strong>रुद्र सूक्त व पुरुष सूक्त हवन (Rudra & Purusha Sukta):</strong> आरोग्य व ब्रह्मांडीय ऊर्जा आह्वान।</li>
  <li><strong>लक्ष्मी हवन व वसोधरा (Lakshmi Hawan & Vasodhara):</strong> अखंड श्री, समृद्धि व धन वृद्धि धारा।</li>
  <li><strong>दिक्पाल व भैरव सात्विक बलि (Satvik Bali):</strong> सर्व दिशा सुरक्षा व भैरव देव कृपा।</li>
  <li><strong>108 सामग्री पूर्णाहुति (Maha Purnahuti):</strong> दुर्लभ जड़ी-बूटियों व नवग्रह समिधा द्वारा महायज्ञ पूर्ति।</li>
  <li><strong>महाआरती व प्रसाद (Maha Aarti & Prasad):</strong> सिद्ध महाभस्म व महाप्रसाद घर पर।</li>
</ul>

<h3>🌸 अमोघ दिव्य फल (Key Divine Benefits):</h3>
<ul>
  <li><strong>सर्व बाधा व शत्रु नाश (Destroy Negativity & Enemies):</strong> असाध्य तंत्र बाधा, नजर दोष, शत्रु बाधा व गृहक्लेश का संपूर्ण नाश।</li>
  <li><strong>दिव्य शक्ति व रक्षा कवच (Divine Protection):</strong> माँ जगदम्बा की कृपा से आपके व आपके परिवार पर अभेद्य सुरक्षा कवच।</li>
  <li><strong>विजय, पद-प्रतिष्ठा व समृद्धि (Prosperity & Abundance):</strong> मुकदमों में विजय, व्यापार वृद्धि व सर्वमनोकामना सिद्धि।</li>
</ul>

<h3>📍 पूजा स्थल (Venue):</h3>
<p><strong>माँ कात्यायनी दुर्गा शक्ति पीठ, जोधपुर (राजस्थान)</strong></p>

<h3>📅 पूजा तिथि (Date):</h3>
<p><em>(तिथि शीघ्र घोषित की जाएगी - आप अभी संकल्प बुक कर सकते हैं)</em></p>
    `,
    benefits: 'सर्व बाधा व शत्रु नाश, 108 दुर्लभ सामग्री महायज्ञ आहुति, दिव्य रक्षा कवच, व्यापार वृद्धि व सर्व मनोकामना पूर्ति',
    procedure: 'दुर्गा सप्तशती सम्पुट पाठ -> 108 सामग्री नवार्ण हवन -> रुद्र सूक्त व लक्ष्मी हवन -> दिक्पाल/भैरव सात्विक बलि -> महापूर्णाहुति व महाआरती',
    categoryId: category.id,
    templeId: temple.id,
    price: 5101,
    vipPrice: 21001,
    location: 'Maa Katyayani Durga Shakti Peeth, Jodhpur, Rajasthan',
    status: 'PUBLISHED',
    isEvergreen: true,
    isFeatured: true,
    isOnline: true,
    isVip: true,
    coverImage: '/durga_saptashati_yagya_2.jpg',
    seoTitle: 'Durga Saptashati 108 Samagri Mahayagya Booking | Shakti Peeth Jodhpur',
    seoDescription: 'Book Durga Saptashati Sampurna Path & 108 Samagri Tantrokt Mahayagya at Katyayani Durga Shakti Peeth Jodhpur. Live Video Sankalp for protection & prosperity.',
    seoKeywords: 'durga saptashati path online, 108 samagri mahayagya, durga hawan jodhpur, vip durga puja divyayagyam, shakti peeth jodhpur puja'
  }

  const puja = await prisma.puja.upsert({
    where: { slug: pujaData.slug },
    create: pujaData,
    update: pujaData
  })

  // Add Packages (1 Member: 5101, 2 Members: 9901, 4 Members: 15001, 6 Members: 21001)
  const packageList = [
    {
      name: '1 भक्त व्यक्तिगत संकल्प (Single Member VIP)',
      price: 5101,
      description: '1 व्यक्ति का नाम व गोत्र संकल्प, 108 सामग्री हवन में आहुति, लाइव वीडियो व सिद्ध प्रसाद।'
    },
    {
      name: '2 भक्त दम्पति संकल्प (2 Members Couple VIP)',
      price: 9901,
      description: 'पति-पत्नी या 2 सदस्यों का विशेष नाम-गोत्र संकल्प, 108 सामग्री हवन आहुति व सिद्ध महाप्रसाद।'
    },
    {
      name: '4 भक्त परिवार संकल्प (4 Members Family VIP)',
      price: 15001,
      description: 'समस्त परिवार (4 सदस्य) का नाम व गोत्र संकल्प, नवार्ण हवन आहुति, रक्षा सूत्र व महाप्रसाद।'
    },
    {
      name: '6 भक्त महाकुल संकल्प (6 Members Royal VIP)',
      price: 21001,
      description: '6 सदस्यों का महाकुल संकल्प, विशेष वसोधरा धारा अर्पण, व्यक्तिगत वीडियो संकल्प व तांत्रिक रक्षा कवच।'
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

  console.log('🎉 SUCCESS! Created Durga Saptashati VIP Mahayagya in DB:', puja.name, 'ID:', puja.id)
}

main()
  .catch(err => {
    console.error('❌ Error creating Durga Saptashati Puja:', err)
  })
  .finally(() => prisma.$disconnect())
