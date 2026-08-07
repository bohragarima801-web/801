const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('💰 Creating Siddha 9 Lakshmi Kaudi Set in Product DB...')

  // Find or create Category
  let category = await prisma.productCategory.findFirst({
    where: { OR: [{ slug: 'lakshmi-wealth-items' }, { slug: 'puja-samagri' }, { name: { contains: 'Lakshmi' } }] }
  })

  if (!category) {
    category = await prisma.productCategory.create({
      data: {
        name: 'लक्ष्मी व धन समृद्धि सिद्ध सामग्री',
        slug: 'lakshmi-wealth-items',
        description: 'अभिमंत्रित लक्ष्मी कौड़ी, कनकधारा यंत्र, काली हल्दी व व्यापार वृद्धि द्रव्य'
      }
    })
  }

  const productData = {
    categoryId: category.id,
    name: 'सिद्ध अभिमंत्रित 9 महालक्ष्मी कौड़ी सेट - कर्ज मुक्ति व व्यापार बरकत (Siddha 9 Lakshmi Kaudi Set + FREE Gifts)',
    slug: 'siddha-9-abhimantrit-lakshmi-kaudi-set-free-gifts',
    sku: 'DY-LAXMI-KAUDI-9',
    shortDescription: 'श्रीसूक्त व कनकधारा मंत्रों से चैतन्य अभिमंत्रित 9 पीली लक्ष्मी कौड़ियाँ। मुफ़्त साथ में सिद्ध दिव्य चिरमी, दुर्लभ काली हल्दी, अभिमंत्रित कुमकुम व हल्दी। कर्ज मुक्ति, व्यापार वृद्धि व तिजोरी में बरकत हेतु अचूक।',
    description: `
<h2>💰 सिद्ध अभिमंत्रित 9 महालक्ष्मी कौड़ी सेट (मुफ़्त काली हल्दी व दिव्य चिरमी संग)</h2>
<p>सनातन तंत्र व शास्त्र परंपरा में <strong>पीली कौड़ी माँ महालक्ष्मी की प्रत्यक्ष भगीनी व समुद्र मंथन का पावन रत्न</strong> मानी गई है। जब घर की तिजोरी या दुकान के गल्ले में 9 अभिमंत्रित पीली कौड़ियाँ स्थापित की जाती हैं, तो वहाँ दरिद्रता, कर्ज व धन की बर्बादी का सर्वथा नाश होकर अखंड लक्ष्मी का वास होता है।</p>

<div style="background-color: #FFF3D6; border: 1.5px solid #D49B00; padding: 12px 16px; border-radius: 12px; margin: 15px 0;">
  <strong style="color: #8B1A21; font-size: 15px;">🎁 4 दुर्लभ सिद्ध सामग्रियाँ मुफ़्त (FREE Divine Bonus Included):</strong>
  <ul style="color: #4A2D1B; margin-top: 6px; font-size: 13px; font-weight: bold; list-style-type: square; padding-left: 20px;">
    <li>सिद्ध दिव्य चिरमी के दाने (Divya Chirmi Beads - वशीकरण व धन आकर्षण)</li>
    <li>दुर्लभ सिद्ध काली हल्दी की गांठ (Siddha Kali Haldi - धन रक्षा व तंत्र बाधा शमन)</li>
    <li>अभिमंत्रित रोली कुमकुम (Abhimantrit Kumkum)</li>
    <li>सिद्ध पीत हल्दी पाउडर (Abhimantrit Haldi)</li>
  </ul>
</div>

<h3>🌸 पावन लाभ व विशेषताएँ (Key Sacred Benefits):</h3>
<ul>
  <li><strong>श्रीसूक्त व कनकधारा मंत्रों से चैतन्य:</strong> DivyaYagyam के लक्ष्मी महायज्ञ में 108 श्रीसूक्त स्वाहाकार आहुतियों से 100% प्राण-प्रतिष्ठित।</li>
  <li><strong>सर्व कर्ज व ऋण मुक्ति:</strong> सालों पुराने व्यापारिक घाटों, बैंक लोन व ब्याज के दुष्चक्र का समूल विनाश।</li>
  <li><strong>व्यापार वृद्धि व तिजोरी में बरकत:</strong> दुकान के कैश काउंटर, पर्स व तिजोरी में स्थापित करने से अटका हुआ धन प्राप्त होता है।</li>
  <li><strong>अखंड धन-धान्य आकर्षण:</strong> माँ महालक्ष्मी, कुबेर देव व रिद्धि-सिद्धि का स्थाई निवास।</li>
</ul>

<h3>📦 उत्पाद विवरण (Specifications):</h3>
<ul>
  <li><strong>मुख्य सामग्री:</strong> 9 सिद्ध पीली महालक्ष्मी कौड़ियाँ</li>
  <li><strong>मुफ़्त उपहार:</strong> सिद्ध दिव्य चिरमी + दुर्लभ काली हल्दी + अभिमंत्रित कुमकुम व हल्दी</li>
  <li><strong>स्थान:</strong> तिजोरी, दुकान का गल्ला, पर्स या पूजा स्थल</li>
  <li><strong>उपलब्ध स्टॉक (Stock):</strong> 500 सेट <em>(सीमित सिद्ध महालक्ष्मी कल्प बैच)</em></li>
  <li><strong>मूल्य (Price):</strong> ₹899 मात्र</li>
</ul>
    `,
    price: 899,
    salePrice: 899,
    isAbhimantrit: true,
    isFeatured: true,
    weight: 0.15,
    tags: 'LIMITED_STOCK, FREE_GIFTS, LAXMI_KAUDI, KARZ_MUKTI, KALI_HALDI',
    customHtml: '<div className="bg-amber-100 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-300">🎁 FREE Bonus: Kali Haldi + Divya Chirmi + Kumkum Included!</div>',
    coverImage: '/laxmi_kaudi_set_product.jpg',
    seoTitle: 'Buy 9 Abhimantrit Lakshmi Kaudi Set Online ₹899 | Karz Mukti & Wealth',
    seoDescription: 'Buy Energized 9 Mahalakshmi Kaudi Set at ₹899 with FREE Kali Haldi & Chirmi by DivyaYagyam. Energized with Sri Suktam for Karz Mukti & Vyapar Vriddhi.',
    seoKeywords: '9 lakshmi kaudi set online 899, abhimantrit lakshmi kaudi free kali haldi, karz mukti vyapar vriddhi kaudi, divyayagyam lakshmi kaudi set',
    status: 'ACTIVE'
  }

  const product = await prisma.product.upsert({
    where: { slug: productData.slug },
    create: productData,
    update: productData
  })

  await prisma.inventory.upsert({
    where: { productId: product.id },
    create: { productId: product.id, quantity: 500, reserved: 0 },
    update: { quantity: 500 }
  })

  console.log('🎉 SUCCESS! Created 9 Lakshmi Kaudi Set Product in DB:', product.name, 'Price: ₹899', 'Stock: 500', 'ID:', product.id)
}

main()
  .catch(err => {
    console.error('❌ Error creating Lakshmi Kaudi product:', err)
  })
  .finally(() => prisma.$disconnect())
