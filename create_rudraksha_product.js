const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('📿 Creating Siddha Abhimantrit Rudraksha Mala in Product DB...')

  // Find or create Rudraksha Category
  let category = await prisma.productCategory.findFirst({
    where: { OR: [{ slug: 'rudraksha-mala' }, { slug: 'rudraksha' }, { name: { contains: 'Rudraksha' } }] }
  })

  if (!category) {
    category = await prisma.productCategory.create({
      data: {
        name: 'सिद्ध रुद्राक्ष व पावन मालाएँ',
        slug: 'rudraksha-mala',
        description: 'प्राण-प्रतिष्ठित 5 मुखी रुद्राक्ष माला, स्फटिक व तुलसी मालाएँ'
      }
    })
  }

  const productData = {
    categoryId: category.id,
    name: 'सिद्ध प्राण-प्रतिष्ठित चैतन्य रुद्राक्ष माला (Siddha Abhimantrit Rudraksha Mala)',
    slug: 'siddha-abhimantrit-rudraksha-mala',
    sku: 'DY-RUD-MALA-108',
    shortDescription: 'DivyaYagyam के वेदाचार्यों द्वारा विशेष मन्त्रों व चैतन्य प्राण-प्रतिष्ठा से अभिमंत्रित। नित्य शिव/गायत्री मंत्र जाप एवं गले/हृदय में धारण (पहनने) हेतु सर्वथा सिद्ध।',
    description: `
<h2>📿 सिद्ध प्राण-प्रतिष्ठित चैतन्य रुद्राक्ष माला (DivyaYagyam Certified)</h2>
<p>सनातन संस्कृति में रुद्राक्ष को भगवान रुद्र (शिव) के अश्रु से उत्पन्न प्रत्यक्ष महाप्रसाद माना गया है। <strong>DivyaYagyam संस्थान के सिद्ध पीठ पर आचार्य पं. मुकेश बोहरा जी व शिवोपासक आचार्यों द्वारा यह रुद्राक्ष माला 108 रुद्र सम्पुट मंत्रों, महामृत्युंजय जाप व पवित्र गंगाजल से विशेष मन्त्र-चैतन्य प्राण-प्रतिष्ठित (अभिमंत्रित) की गई है।</strong></p>

<h3>🌸 मुख्य विशेषताएँ व पावन लाभ (Key Sacred Benefits):</h3>
<ul>
  <li><strong>DivyaYagyam द्वारा विशेष मंत्र-चैतन्य अभिमंत्रित:</strong> प्राण-प्रतिष्ठा सिद्ध होने से यह माला तुरंत दिव्य सकारात्मक ऊर्जा एवं सुरक्षा चक्र प्रदान करती है।</li>
  <li><strong>जाप एवं धारण (पहनने) हेतु परम उपयुक्त:</strong> 108+1 (गुरु मनका) शुद्ध रुद्राक्ष दानों से निर्मित, जिसे आप नित्य मन्त्र जाप तथा गले/हृदय में धारण करने (पहनने) हेतु प्रयोग कर सकते हैं।</li>
  <li><strong>मानसिक शांति व एकाग्रता:</strong> तनाव, अनिद्रा, अकारण भय, रक्तचाप असंतुलन व तंत्र बाधाओं से अभेद्य सुरक्षा।</li>
  <li><strong>भगवान शिव का अमोघ आशीर्वाद:</strong> धारणकर्ता पर निरंतर महादेव की कृपा, भक्ति एवं आत्मिक बल बना रहता है।</li>
  <li><strong>100% शुद्धता व प्रामाणिकता गारंटी:</strong> प्रत्येक माला के साथ DivyaYagyam का सिद्ध गंगाजल व अकाल मृत्यु निवारक रक्षा सूत्र भेजा जाता है।</li>
</ul>

<h3>📦 उत्पाद विनिर्देश (Product Specifications):</h3>
<ul>
  <li><strong>रुद्राक्ष प्रकार:</strong> 5 मुखी प्राकृतिक नेपाली रुद्राक्ष मनके (108+1 दाने)</li>
  <li><strong>उपयोग:</strong> नित्य शिव/गायत्री मंत्र जाप एवं धारण (पहनने) योग्य</li>
  <li><strong>उपलब्ध स्टॉक (Stock):</strong> 500 यूनिट्स (तत्काल डिलीवरी हेतु उपलब्ध)</li>
  <li><strong>मूल्य (Price):</strong> ₹901 मात्र</li>
</ul>
    `,
    price: 901,
    salePrice: 901,
    isAbhimantrit: true,
    isFeatured: true,
    coverImage: '/rudraksha_mala_product.jpg',
    seoTitle: 'Buy Siddha Abhimantrit Rudraksha Mala Online ₹901 | DivyaYagyam',
    seoDescription: 'Buy original Siddha Abhimantrit Rudraksha Mala at ₹901 online by DivyaYagyam. Certified 108 beads for Jaap & wearing with Chaitanya Prana-Pratishtha.',
    seoKeywords: 'rudraksha mala online 901, abhimantrit rudraksha mala divyayagyam, japne or pahanne yogya rudraksha mala, 5 mukhi rudraksha mala buy online',
    status: 'ACTIVE'
  }

  const product = await prisma.product.upsert({
    where: { slug: productData.slug },
    create: productData,
    update: productData
  })

  // Set or update Inventory quantity to 500
  await prisma.inventory.upsert({
    where: { productId: product.id },
    create: {
      productId: product.id,
      quantity: 500,
      reserved: 0
    },
    update: {
      quantity: 500
    }
  })

  console.log('🎉 SUCCESS! Created Siddha Abhimantrit Rudraksha Mala Product in DB:', product.name, 'Price: ₹901', 'Stock: 500', 'ID:', product.id)
}

main()
  .catch(err => {
    console.error('❌ Error creating Rudraksha product:', err)
  })
  .finally(() => prisma.$disconnect())
