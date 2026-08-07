const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🐍 Creating Siddha Pure Copper Naag Naagin Pair in Product DB...')

  // Find or create Category
  let category = await prisma.productCategory.findFirst({
    where: { OR: [{ slug: 'rahu-kalsarp-items' }, { slug: 'yantra-puja-items' }, { name: { contains: 'Rahu' } }] }
  })

  if (!category) {
    category = await prisma.productCategory.create({
      data: {
        name: 'राहु-केतु व दोष शांति सामग्री',
        slug: 'rahu-kalsarp-items',
        description: 'ताँबा नाग-नागिन जोड़ा, राहु-केतु यंत्र व दोष शमन द्रव्य'
      }
    })
  }

  const productData = {
    categoryId: category.id,
    name: 'सिद्ध शुद्ध ताँबा नाग-नागिन जोड़ा - राहु-केतु व कालसर्प दोष शांति (Siddha Pure Copper Naag Naagin Pair - Small)',
    slug: 'siddha-pure-copper-naag-naagin-pair-rahu-shanti',
    sku: 'DY-COPPER-NAAG-SM',
    shortDescription: '100% शुद्ध ताँबे का सिद्ध नाग-नागिन जोड़ा (Small Size)। राहु-केतु महादशा, कालसर्प दोष, व्यापारिक मंदी व सर्प स्वप्न निवारण हेतु बहते जल में प्रवाह या शिवलिंग पर अर्पण योग्य।',
    description: `
<h2>🐍 सिद्ध शुद्ध ताँबा नाग-नागिन जोड़ा (राहु-केतु व कालसर्प शांति)</h2>
<p>ज्योतिष शास्त्र के अनुसार जन्मकुंडली में <strong>राहु-केतु की अशुभ महादशा, अष्टम ढैय्या, सर्प दोष या कालसर्प योग</strong> होने पर जातक को अकारण मानसिक भय, व्यापारिक अचानक नुकसान, वैवाहिक तनाव व बुरे स्वप्न आते हैं। ऐसे दोषों के सर्वथा शमन हेतु <strong>DivyaYagyam संस्थान द्वारा राहु-केतु व नाग गायत्री मन्त्रों से प्राण-प्रतिष्ठित सिद्ध ताँबा नाग-नागिन जोड़ा</strong> प्रवाहित करने की सर्वथा अचूक विधि है।</p>

<div style="background-color: #FFF3D6; border: 1.5px solid #D49B00; padding: 12px 16px; border-radius: 12px; margin: 15px 0;">
  <strong style="color: #8B1A21; font-size: 15px;">⚡ सीमित सिद्ध राहु शांति बैच स्टॉक (Limited Sacred Stock):</strong>
  <p style="color: #4A2D1B; margin-top: 4px; font-size: 13px; font-weight: bold;">वैदिक शुभ मुहूर्त में अभिमंत्रित होने के कारण इसका स्टॉक सीमित रहता है। अभी केवल 360 सिद्ध जोड़े उपलब्ध हैं। अपना जोड़ा तुरंत ऑर्डर करें!</p>
</div>

<h3>🌸 पावन लाभ व विशेषताएँ (Key Sacred Benefits):</h3>
<ul>
  <li><strong>100% शुद्ध ताँबा (Pure Copper Metal):</strong> विशुद्ध ताँबे से निर्मित लघु (Small) आकार का नाग-नागिन जोड़ा जो जल में आसानी से प्रवाहित होता है।</li>
  <li><strong>राहु-केतु व कालसर्प दोष शांति:</strong> राहु की महादशा, अनहोनी का भय, कोर्ट केस व व्यापारिक रुकावटों का समूल शमन।</li>
  <li><strong>प्राण-प्रतिष्ठित व सिद्ध:</strong> आचार्य पं. मुकेश बोहरा जी द्वारा नाग देव आवाहन व राहु गायत्री मन्त्रों से सिद्ध किया हुआ।</li>
  <li><strong>जल प्रवाह व शिवलिंग अर्पण योग्य:</strong> नाम-गोत्र संकल्प लेकर बहती नदी/नहर में जल प्रवाह करें या सोमवार/नागपंचमी को शिवलिंग पर अर्पित करें।</li>
</ul>

<h3>📦 उत्पाद विवरण (Specifications):</h3>
<ul>
  <li><strong>सामग्री (Material):</strong> 100% शुद्ध ताँबा (Pure Copper)</li>
  <li><strong>आकार (Size):</strong> लघु आकार (Small Size - जल प्रवाह हेतु उत्तम)</li>
  <li><strong>अभिमंत्रण:</strong> राहु-केतु व नाग मंत्र सिद्ध प्राण-प्रतिष्ठित</li>
  <li><strong>उपलब्ध स्टॉक (Stock):</strong> 360 जोड़े <em>(सीमित सिद्ध बैच)</em></li>
  <li><strong>मूल्य (Price):</strong> ₹599 मात्र</li>
</ul>
    `,
    price: 599,
    salePrice: 599,
    isAbhimantrit: true,
    isFeatured: true,
    weight: 0.05,
    tags: 'LIMITED_STOCK, RAHU_SHANTI, KALSARP_DOSH, PURE_COPPER',
    customHtml: '<div className="bg-amber-100 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-300">⚡ Limited Rahu Shanti Batch - Only 360 Pairs Available!</div>',
    coverImage: '/naag_naagin_copper_product.jpg',
    seoTitle: 'Buy Pure Copper Naag Naagin Joda Online ₹599 | Rahu Shanti & Kalsarp',
    seoDescription: 'Buy Abhimantrit Pure Copper Naag Naagin Joda (Small) online at ₹599 by DivyaYagyam. Energized for Rahu Ketu Shanti & Kalsarp Dosh removal.',
    seoKeywords: 'pure copper naag naagin joda 599, rahu shanti copper naag naagin buy online, kalsarp dosh naag naagin pair, divyayagyam copper naag naagin',
    status: 'ACTIVE'
  }

  const product = await prisma.product.upsert({
    where: { slug: productData.slug },
    create: productData,
    update: productData
  })

  await prisma.inventory.upsert({
    where: { productId: product.id },
    create: { productId: product.id, quantity: 360, reserved: 0 },
    update: { quantity: 360 }
  })

  console.log('🎉 SUCCESS! Created Pure Copper Naag Naagin Joda Product in DB:', product.name, 'Price: ₹599', 'Stock: 360', 'ID:', product.id)
}

main()
  .catch(err => {
    console.error('❌ Error creating Naag Naagin product:', err)
  })
  .finally(() => prisma.$disconnect())
