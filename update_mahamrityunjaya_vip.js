const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🕉️ Updating Mahamrityunjaya Jaap to VIP section in DB...')

  // Find or create Chandikeshwar Mahadev Temple
  let temple = await prisma.temple.findFirst({
    where: { OR: [{ slug: 'chandikeshwar-mahadev-jodhpur' }, { name: { contains: 'Chandikeshwar' } }] }
  })

  if (!temple) {
    temple = await prisma.temple.create({
      data: {
        name: 'Chandikeshwar Mahadev Temple',
        slug: 'chandikeshwar-mahadev-jodhpur',
        deity: 'Lord Shiva Chandikeshwar Mahadev',
        city: 'Jodhpur',
        state: 'Rajasthan',
        country: 'India',
        description: 'सिद्ध प्राचीन चंडिकेश्वर महादेव मंदिर, जोधपुर (राजस्थान)',
        isFeatured: true
      }
    })
  }

  const puja = await prisma.puja.update({
    where: { slug: '11000-mahamrityunjaya-jaap-maharudrabhishekam' },
    data: {
      isVip: true,
      vipPrice: 21000,
      templeId: temple.id,
      location: 'Chandikeshwar Mahadev, Jodhpur, Rajasthan',
      procedure: 'मुख्य पीठाधीश्वर आचार्य मुकेश बोहरा एवं 5 सिद्ध वेदपाठी ब्राह्मणों द्वारा 11,000 महामृत्युंजय सम्पुट जाप, 108 द्रव्य महारुद्राभिषेक व 100% व्यक्तिगत लाइव वीडियो संकल्प।'
    }
  })

  // Add VIP Package tier of ₹21,000
  await prisma.pujaPackage.create({
    data: {
      pujaId: puja.id,
      name: '👑 VIP महामृत्युंजय महा अनुष्ठान (आचार्य मुकेश बोहरा व 5 वेदपाठी ब्राह्मण)',
      price: 21000,
      description: 'आचार्य मुकेश बोहरा जी व 5 सिद्ध ब्राह्मणों द्वारा व्यक्तिगत नाम-गोत्र सम्पुट जाप, 108 द्रव्य महारुद्राभिषेक, 100% लाइव वीडियो संकल्प व सिद्ध मृत्युंजय भस्म व रुद्राक्ष प्रसाद।'
    }
  })

  console.log('🎉 SUCCESS! Updated Mahamrityunjaya Puja (ID:', puja.id, ') to VIP section with vipPrice 21000 at Chandikeshwar Mahadev Jodhpur!')
}

main()
  .catch(err => {
    console.error('❌ Error updating Puja to VIP:', err)
  })
  .finally(() => prisma.$disconnect())
