const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const standardPackages = [
  {
    name: 'व्यक्तिगत नाम व गोत्र संकल्प (1 यजमान)',
    price: 901,
    description: '1 यजमान का नाम व गोत्र संकल्प, विशेष हवन आहुति, व्हाट्सएप वीडियो एवं घर द्वार प्रसाद डिलीवरी।'
  },
  {
    name: 'दंपति नाम व गोत्र संकल्प (पति-पत्नी)',
    price: 1501,
    description: 'पति-पत्नी हेतु विशेष नाम व गोत्र संकल्प, सुख-समृद्धि हवन आहुति, व्हाट्सएप वीडियो एवं प्रसाद डिलीवरी।'
  },
  {
    name: 'संपूर्ण परिवार नाम व गोत्र संकल्प (4 सदस्य)',
    price: 2501,
    description: 'परिवार के 4 सदस्यों का नाम व गोत्र संकल्प, महायज्ञ आहुति, व्हाट्सएप वीडियो एवं प्रसाद डिलीवरी।'
  },
  {
    name: 'विशेष महायज्ञ व सर्व समृद्धि संकल्प (6 सदस्य)',
    price: 3501,
    description: '6 सदस्यों का विशेष नाम-गोत्र संकल्प, 108 विशेष आहुति महायज्ञ, व्हाट्सएप लाइव वीडियो एवं सिद्ध प्रसाद।'
  }
]

async function main() {
  console.log('🔄 Updating all pujas with standard price tiers (₹901, ₹1501, ₹2501, ₹3501)...')

  const allPujas = await prisma.puja.findMany()

  for (const puja of allPujas) {
    const isVipPuja = puja.isVip || (puja.vipPrice && Number(puja.vipPrice) >= 5000)

    // Update starting price on Puja table
    await prisma.puja.update({
      where: { id: puja.id },
      data: {
        price: 901, // Starting price set to 901
        vipPrice: puja.vipPrice && Number(puja.vipPrice) > 5000 ? puja.vipPrice : 15001
      }
    })

    // Delete existing packages
    await prisma.pujaPackage.deleteMany({
      where: { pujaId: puja.id }
    })

    // Prepare package list
    const packagesToInsert = [
      ...standardPackages.map(p => ({
        pujaId: puja.id,
        name: p.name,
        price: p.price,
        description: p.description
      })),
      ...(isVipPuja ? [{
        pujaId: puja.id,
        name: '👑 VIP विशेष व्यक्तिगत अनुष्ठान संकल्प',
        price: Number(puja.vipPrice || 15001),
        description: 'वरिष्ठ वेदाचार्यों द्वारा व्यक्तिगत 1-on-1 संकल्प, 1,25,000 जाप/हवन, 100% लाइव वीडियो प्रमाण एवं विशेष सिद्ध प्रसाद डिब्बा।'
      }] : [])
    ]

    await prisma.pujaPackage.createMany({
      data: packagesToInsert
    })

    console.log(`✅ Updated ${puja.name} -> Starting Price: ₹901 | Packages: ₹901, ₹1501, ₹2501, ₹3501${isVipPuja ? ` + VIP ₹${puja.vipPrice || 15001}` : ''}`)
  }

  console.log('🎉 All Pujas updated successfully with requested price tiers (₹901, ₹1501, ₹2501, ₹3501)!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
