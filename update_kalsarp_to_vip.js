const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🐍 Updating Kaal Sarp Dosh Puja to VIP section in DB...')

  const puja = await prisma.puja.update({
    where: { slug: 'kalsarp-dosh-shanti-puja' },
    data: {
      isVip: true,
      vipPrice: 15001,
      procedure: 'मुख्य पीठाधीश्वर पं. मुकेश बोहरा (जोधपुर) द्वारा सस्वर सम्पुट पाठ, नागबली भस्म, 108 सामग्री हवन व 100% व्यक्तिगत लाइव वीडियो संकल्प।'
    }
  })

  // Add VIP Package tier of ₹15,001
  await prisma.pujaPackage.create({
    data: {
      pujaId: puja.id,
      name: 'विशेष वीआईपी व्यक्तिगत कालसर्प महा अनुष्ठान (VIP Personal Hawan)',
      price: 15001,
      description: 'पं. मुकेश बोहरा जी द्वारा व्यक्तिगत नाम-गोत्र संकल्प, 100% लाइव वीडियो संकल्प, सिद्ध तांबे के नाग-नागिन जोड़ा पूजन व नाग भस्म प्रसाद।'
    }
  })

  console.log('🎉 SUCCESS! Updated Kaal Sarp Dosh Puja (ID:', puja.id, ') to VIP section with vipPrice 15001!')
}

main()
  .catch(err => {
    console.error('❌ Error updating Puja to VIP:', err)
  })
  .finally(() => prisma.$disconnect())
