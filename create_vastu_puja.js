const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🏠 Creating Vastu Dosh Nivaran Puja in DB...')

  // Find or create Navagraha / Vastu Category
  let category = await prisma.pujaCategory.findFirst({
    where: { OR: [{ slug: 'navagraha-pujas' }, { slug: 'vastu-pujas' }, { name: { contains: 'Vastu' } }] }
  })

  if (!category) {
    category = await prisma.pujaCategory.create({
      data: {
        name: 'वास्तु व नवग्रह दोष निवारण पूजा',
        slug: 'vastu-pujas',
        description: 'वास्तु पुरुष पूजन, नवग्रह शांति व गृह दोष निवारण अनुष्ठान'
      }
    })
  }

  // Find or Create Veer Hanuman Temple Jodhpur
  let temple = await prisma.temple.findFirst({
    where: { OR: [{ slug: 'veer-hanuman-temple-jodhpur' }, { name: { contains: 'Veer Hanuman' } }] }
  })

  if (!temple) {
    temple = await prisma.temple.create({
      data: {
        name: 'Veer Hanuman Temple',
        slug: 'veer-hanuman-temple-jodhpur',
        deity: 'Veer Hanuman Ji & Vastu Purusha',
        city: 'Jodhpur',
        state: 'Rajasthan',
        country: 'India',
        description: 'सिद्ध प्राचीन वीर हनुमान जी मंदिर, जोधपुर (राजस्थान)',
        isFeatured: true
      }
    })
  }

  const pujaData = {
    name: 'वास्तु दोष निवारण महापूजा एवं वास्तु शांति यज्ञ (Vastu Dosh Nivaran Sacred Puja & Vastu Shanti Yagya)',
    slug: 'vastu-dosh-nivaran-puja-yagya',
    shortDescription: 'घर, दुकान, ऑफिस व फैक्ट्री के वास्तु दोष, ईशान/नैऋत्य कोण दोष, दिशा शूल व अकारण कलह-धन हानि के शमन हेतु वीर हनुमान मंदिर पर विशेष वास्तु पुरुष पूजन व शांति यज्ञ।',
    description: `
<h2>वास्तु दोष निवारण महापूजा एवं वास्तु शांति यज्ञ</h2>
<p>वास्तु शास्त्र के अनुसार जब किसी भवन (घर, दुकान, ऑफिस या फैक्ट्री) में <strong>ईशान कोण, नैऋत्य कोण, आग्नेय कोण या द्वार दोष</strong> होता है, तो वहाँ निवास करने वाले लोगों को अकारण गृह क्लेश, आर्थिक तंगी, अवसाद एवं शारीरिक बीमारियों का सामना करना पड़ता है। बिना किसी तोड़-फोड़ के वास्तु दोषों के शमन हेतु सिद्ध <strong>वीर हनुमान जी मंदिर, जोधपुर (राजस्थान)</strong> में मुख्य वेदाचार्य पं. मुकेश बोहरा जी के सानिध्य में वास्तु शांति महापूजा एवं यज्ञ संपन्न कराया जाता है।</p>

<h3>🌸 वास्तु पूजा व शांति यज्ञ के मुख्य लाभ (Key Sacred Benefits):</h3>
<ul>
  <li><strong>बिना तोड़-फोड़ वास्तु दोष शमन:</strong> भवन के सभी 16 कोणों व 9 दिशाओं के वास्तु दोषों का वैदिक रीति से शमन।</li>
  <li><strong>गृह क्लेश व तनाव से मुक्ति:</strong> घर में सुख, शांति, आपसी प्रेम व सकारात्मक ऊर्जा का वास।</li>
  <li><strong>व्यापारिक व व्यावसायिक उन्नति:</strong> दुकान, फैक्ट्री व ऑफिस में बिक्री वृद्धि, ग्राहकों का आकर्षण व आर्थिक रुकावटों का शमन।</li>
  <li><strong>स्वास्थ्य लाभ व दुर्घटना रक्षा:</strong> बार-बार बीमार पड़ने, वात-पित्त दोषों व अकारण भय से मुक्ति।</li>
  <li><strong>लाइव वीडियो संकल्प व सिद्ध वास्तु यंत्र प्रसाद:</strong> आपके नाम व गोत्र के साथ लाइव वीडियो संकल्प एवं सिद्ध तांबे का वास्तु यंत्र, पिरामिड भस्म व रक्षा सूत्र आपके घर पर।</li>
</ul>

<h3>📍 पूजा स्थल (Venue):</h3>
<p><strong>वीर हनुमान जी मंदिर, जोधपुर (राजस्थान)</strong></p>

<h3>👨‍⚖️ मुख्य वेदाचार्य (Assigned Priest):</h3>
<p><strong>पं. मुकेश बोहरा (Pt. Mukesh Bohra), जोधपुर</strong></p>

<h3>📅 पूजा तिथि (Date):</h3>
<p><em>(तिथि शीघ्र घोषित की जाएगी - आप अभी संकल्प बुक कर सकते हैं)</em></p>
    `,
    benefits: 'घर व ऑफिस के वास्तु दोषों का शमन, गृह क्लेश व मानसिक तनाव मुक्ति, व्यापार वृद्धि, स्वास्थ्य लाभ व सिद्ध तांबे का वास्तु यन्त्र प्रसाद',
    procedure: 'सस्वर संकल्प -> वास्तु पुरुष आवाहन -> दिक्पाल व नवग्रह पूजन -> वास्तु शांति महाहवन व महाआरती',
    categoryId: category.id,
    templeId: temple.id,
    price: 1501,
    vipPrice: 21000,
    location: 'Veer Hanuman Temple, Jodhpur, Rajasthan',
    status: 'PUBLISHED',
    isEvergreen: true,
    isFeatured: true,
    isOnline: true,
    isVip: true,
    coverImage: '/vastu_dosh_yagya.jpg',
    seoTitle: 'Vastu Dosh Nivaran Puja Online | Vastu Shanti Yagya Jodhpur',
    seoDescription: 'Book authentic Vastu Dosh Nivaran Puja & Vastu Shanti Yagya online at Veer Hanuman Temple Jodhpur by Pt. Mukesh Bohra. Remove home & office vastu dosh.',
    seoKeywords: 'vastu dosh nivaran puja online, vastu shanti yagya jodhpur, home vastu puja cost, veer hanuman temple vastu puja mukesh bohra, divyayagyam vastu puja'
  }

  const puja = await prisma.puja.upsert({
    where: { slug: pujaData.slug },
    create: pujaData,
    update: pujaData
  })

  // Add Member Packages (1 Member: 1501, 2 Members: 2501, 4 Members: 3501, 6 Members: 5100, VIP: 21000)
  const packageList = [
    {
      name: '1 भक्त व्यक्तिगत संकल्प (Single Member)',
      price: 1501,
      description: '1 व्यक्ति का नाम व गोत्र संकल्प, वास्तु पुरुष पूजन, शांति हवन आहुति व सिद्ध प्रसाद।'
    },
    {
      name: '2 भक्त दम्पति संकल्प (2 Members Couple)',
      price: 2501,
      description: 'पति-पत्नी या 2 सदस्यों का नाम-गोत्र संकल्प, वास्तु मंडल पूजन, शांति हवन व महाप्रसाद।'
    },
    {
      name: '4 भक्त परिवार संकल्प (4 Members Family)',
      price: 3501,
      description: 'परिवार के 4 सदस्यों का नाम व गोत्र संकल्प, सम्पूर्ण 16 कोण वास्तु शांति, रक्षा सूत्र व प्रसाद।'
    },
    {
      name: '6 भक्त महाकुल संकल्प (6 Members Family)',
      price: 5100,
      description: 'कुल 6 सदस्यों का महाकुल नाम-गोत्र संकल्प, सिद्ध तांबे का वास्तु यन्त्र, वास्तु पिरामिड भस्म व संपूर्ण प्रसाद।'
    },
    {
      name: '👑 VIP विशेष गृह व प्रतिष्ठान वास्तु शांति महा अनुष्ठान (VIP Personal)',
      price: 21000,
      description: 'पं. मुकेश बोहरा जी द्वारा व्यक्तिगत 100% लाइव संकल्प, वास्तु पुरुष महाहवन, तांबे का सिद्ध सर्व दोष नाशक वास्तु यन्त्र व प्रसाद।'
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

  console.log('🎉 SUCCESS! Created Vastu Dosh Nivaran Puja in DB:', puja.name, 'ID:', puja.id)
}

main()
  .catch(err => {
    console.error('❌ Error creating Vastu Puja:', err)
  })
  .finally(() => prisma.$disconnect())
