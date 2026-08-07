const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🛍️ Adding Divya Chandan and Divya Dhoop Special to Store DB...')

  // 1. PRODUCT CATEGORIES
  let categoryPujaSamagri = await prisma.productCategory.findFirst({
    where: { OR: [{ slug: 'puja-samagri' }, { name: { contains: 'Puja' } }] }
  })

  if (!categoryPujaSamagri) {
    categoryPujaSamagri = await prisma.productCategory.create({
      data: {
        name: 'पावन पूजा सामग्री व धूप-चन्दन',
        slug: 'puja-samagri',
        description: 'शुद्ध श्रीखण्ड चन्दन, सिद्ध ३२ जड़ी-बूटी धूप एवं पूजा द्रव्य'
      }
    })
  }

  // ============================================================
  // 2. PRODUCT 1: DIVYA CHANDAN (100g - ₹200 - Stock 300)
  // ============================================================
  const chandanData = {
    categoryId: categoryPujaSamagri.id,
    name: 'दिव्य शुद्ध श्रीखण्ड मलयगिरि चन्दन (Divya Chandan for Puja & Tilak - 100g)',
    slug: 'divya-shrikhand-chandan-puja-100g',
    sku: 'DY-CHANDAN-100G',
    shortDescription: '100% शुद्ध मलयगिरि श्रीखण्ड चन्दन। भगवान शिव रुद्राभिषेक, देव पूजन व माथे पर मस्तक तिलक लगाने हेतु सुगन्धित व शीतल।',
    description: `
<h2>🪷 दिव्य शुद्ध श्रीखण्ड मलयगिरि चन्दन (100 ग्राम)</h2>
<p>सनातन पूजा पद्धति में चन्दन को शील, शांति एवं पवित्रता का सर्वोच्च प्रतीक माना गया है। <strong>DivyaYagyam का यह दिव्य श्रीखण्ड चन्दन 100% शुद्ध मलयगिरि की प्राकृतिक चन्दन लकड़ी से निर्मित है</strong>, जो देव पूजन, शिवलिंग रुद्राभिषेक एवं दैनिक मस्तक तिलक हेतु सर्वथा उपयुक्त है।</p>

<h3>🌸 पावन लाभ व विशेषताएँ (Key Sacred Benefits):</h3>
<ul>
  <li><strong>100% शुद्ध मलयगिरि चन्दन:</strong> बिना किसी कृत्रिम रसायनों के निर्मित प्राकृतिक एवं दिव्य सुगन्धयुक्त चन्दन पाउडर व लेप।</li>
  <li><strong>भगवान शिव व विष्णु प्रिय:</strong> शिवलिंग पर लेपन, रुद्राभिषेक, शालिग्राम पूजन एवं माँ भगवती के अर्चन हेतु श्रेष्ठतम।</li>
  <li><strong>मस्तक तिलक से मन-मस्तिष्क शीतलता:</strong> आज्ञा चक्र पर नित्य चन्दन तिलक लगाने से गुस्सा, तनाव, सिरदर्द व अनिद्रा शांत होती है।</li>
  <li><strong>दिव्य सकारात्मक ऊर्जा का प्रवाह:</strong> घर के पूजा स्थल पर चन्दन की सुगन्ध से वातावरण पवित्र, सुगंधित व वास्तु दोष रहित होता है।</li>
</ul>

<h3>📦 उत्पाद विवरण (Specifications):</h3>
<ul>
  <li><strong>मात्रा (Quantity/Weight):</strong> 100 ग्राम (100g)</li>
  <li><strong>उपलब्ध स्टॉक (Stock):</strong> 300 पैकेट्स (उपलब्ध)</li>
  <li><strong>मूल्य (Price):</strong> ₹200 मात्र</li>
</ul>
    `,
    price: 200,
    salePrice: 200,
    isAbhimantrit: true,
    isFeatured: true,
    weight: 0.1,
    coverImage: '/divya_chandan_product.jpg',
    seoTitle: 'Buy Pure Shrikhand Chandan Powder 100g Online ₹200 | DivyaYagyam',
    seoDescription: 'Buy 100% Pure Shrikhand Malayagiri Chandan Powder (100g) online at ₹200 by DivyaYagyam. Perfect for Puja, Shiv Abhishekam & Tilak.',
    seoKeywords: 'divya chandan puja 100g, pure shrikhand chandan online 200, malayagiri chandan powder buy online, tilak chandan divyayagyam',
    status: 'ACTIVE'
  }

  const chandanProduct = await prisma.product.upsert({
    where: { slug: chandanData.slug },
    create: chandanData,
    update: chandanData
  })

  await prisma.inventory.upsert({
    where: { productId: chandanProduct.id },
    create: { productId: chandanProduct.id, quantity: 300, reserved: 0 },
    update: { quantity: 300 }
  })

  console.log('✅ Created Product 1: Divya Chandan (Price: ₹200, Stock: 300)')

  // ============================================================
  // 3. PRODUCT 2: DIVYA DHOOP SPECIAL (125g - ₹599 - Stock 600 + Urgency)
  // ============================================================
  const dhoopData = {
    categoryId: categoryPujaSamagri.id,
    name: 'दिव्य धूप स्पेशल - ३२ जड़ी-बूटी अभिमंत्रित सर्व दोष व नकारात्मक ऊर्जा नाशक (Divya Dhoop Special - 125g)',
    slug: 'divya-dhoop-special-negativity-remover-125g',
    sku: 'DY-DHOOP-SPECIAL-125G',
    shortDescription: '⚡ ३२ दुर्लभ जड़ी-बूटियों एवं अमोघ वैदिक मन्त्रों से अभिमंत्रित। घर, दुकान व फैक्ट्री से नजर दोष, तंत्र बाधा व नकारात्मक ऊर्जा का तत्काल शमन।',
    description: `
<h2>🔥 दिव्य धूप स्पेशल - ३२ दुर्लभ जड़ी-बूटी अभिमंत्रित सर्व बाधा नाशक (125 ग्राम)</h2>
<p><strong>क्या आपके घर में अकारण अशांति, व्यापार में अचानक मंदी, सदस्यों का चिड़चिड़ापन या नकारात्मक ऊर्जा का आभास होता है?</strong> DivyaYagyam संस्थान द्वारा निर्मित <strong>दिव्य धूप स्पेशल</strong> सनातन शास्त्रों में वर्णित ३२ अति-दुर्लभ औषधियों, गुग्गुल, जटामांसी, लोबान, भीमसेनी कपूर व पीत सरसों का दिव्य वैदिक सम्मिश्रण है। इसे आचार्य पं. मुकेश बोहरा जी के सानिध्य में 108 गायत्री व बगलामुखी मन्त्रों से अभिमंत्रित किया गया है।</p>

<div style="background-color: #FFF3D6; border: 1.5px solid #D49B00; padding: 12px 16px; border-radius: 12px; margin: 15px 0;">
  <strong style="color: #8B1A21; font-size: 15px;">⚡ सीमित सिद्ध वैदिक बैच स्टॉक (High Demand Urgency):</strong>
  <p style="color: #4A2D1B; margin-top: 4px; font-size: 13px; font-weight: bold;">वैदिक मुहूर्त में अभिमंत्रित होने के कारण इसका स्टॉक सीमित रहता है। अभी केवल 600 पैकेट्स में से तेजी से ऑर्डर बुक हो रहे हैं। अपना पैकेट तुरंत ऑर्डर करें!</p>
</div>

<h3>🌸 अमोघ पावन लाभ (Key Sacred Benefits):</h3>
<ul>
  <li><strong>३२ दुर्लभ जड़ी-बूटियों का सम्मिश्रण:</strong> गुग्गुल, जटामांसी, नागर्मोथा, पीत सरसों, लोबान, कपूर, अगर-तगर व 108 यज्ञ द्रव्यों से निर्मित।</li>
  <li><strong>सर्व नकारात्मक ऊर्जा व नजर दोष नाश:</strong> घर, दुकान, शोरूम या फैक्ट्री में इसका नित्य धूप देने से भूत-प्रेत बाधा, बुरी नजर, ईर्ष्या व नकारात्मक तरंगें 10 मिनट में नष्ट होती हैं।</li>
  <li><strong>व्यापार वृद्धि व ग्राहक आकर्षण:</strong> प्रतिष्ठान में नित्य सुबह-शाम धूप देने से व्यापारिक रुकावटें दूर होती हैं और धन का आगमन सुचारू होता है।</li>
  <li><strong>वास्तु दोष शमन व पवित्र सुगन्ध:</strong> वायुमंडल के विषाक्त कीटाणुओं व नकारात्मक ऊर्जा का सर्वथा शोधन कर सात्विक शांति फैलाता है।</li>
</ul>

<h3>📦 उत्पाद विवरण (Specifications):</h3>
<ul>
  <li><strong>नेट वजन (Net Weight):</strong> 125 ग्राम (125g)</li>
  <li><strong>अभिमंत्रण:</strong> 32 जड़ी-बूटी व 108 मंत्र सिद्ध</li>
  <li><strong>उपलब्ध स्टॉक (Stock):</strong> 600 पैकेट्स <em>(सीमित सिद्ध बैच - तेजी से सेलिंग!)</em></li>
  <li><strong>विशेष मूल्य (Price):</strong> ₹599 मात्र</li>
</ul>
    `,
    price: 599,
    salePrice: 599,
    isAbhimantrit: true,
    isFeatured: true,
    weight: 0.125,
    tags: 'LIMITED_STOCK, FAST_SELLING, NEGATIVITY_REMOVER, ABHIMANTRIT_DHOOP',
    customHtml: '<div className="bg-amber-100 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-300">⚡ High Demand - Only 600 Sacred Vedic Batch Units Left!</div>',
    coverImage: '/divya_dhoop_product.jpg',
    seoTitle: 'Buy Divya Dhoop Special 125g Online ₹599 | Negativity Remover Dhoop',
    seoDescription: 'Buy 32 Herbs Energized Divya Dhoop Special 125g online at ₹599 by DivyaYagyam. Removes negativity, nazar dosh & brings prosperity.',
    seoKeywords: 'divya dhoop special 599, negativity remover dhoop buy online, 32 jadi booti abhimantrit dhoop, divyayagyam dhoop 125g, nazar dosh nivaran dhoop',
    status: 'ACTIVE'
  }

  const dhoopProduct = await prisma.product.upsert({
    where: { slug: dhoopData.slug },
    create: dhoopData,
    update: dhoopData
  })

  await prisma.inventory.upsert({
    where: { productId: dhoopProduct.id },
    create: { productId: dhoopProduct.id, quantity: 600, reserved: 0 },
    update: { quantity: 600 }
  })

  console.log('✅ Created Product 2: Divya Dhoop Special (Price: ₹599, Stock: 600, Limited Batch)')

  console.log('🎉 SUCCESS! All Store Products successfully updated in Prisma DB!')
}

main()
  .catch(err => {
    console.error('❌ Error creating store products:', err)
  })
  .finally(() => prisma.$disconnect())
