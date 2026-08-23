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
  console.log('🔄 Cleaning up VIP pujas & creating corresponding Normal Puja versions...')

  // Get all current VIP pujas
  const vipPujas = await prisma.puja.findMany({
    where: { isVip: true }
  })

  for (const vip of vipPujas) {
    // 1. Ensure VIP Puja itself has price = vipPrice, no package choices
    const vipPriceVal = Number(vip.vipPrice || vip.price || 15001)
    await prisma.puja.update({
      where: { id: vip.id },
      data: {
        price: vipPriceVal,
        vipPrice: vipPriceVal,
        isVip: true
      }
    })
    // Remove packages from VIP puja
    await prisma.pujaPackage.deleteMany({ where: { pujaId: vip.id } })

    // 2. Create or Update corresponding Normal Puja slug
    let normalSlug = vip.slug.replace(/^vip-/, '').concat('-normal')
    if (vip.slug === 'maa-bagalamukhi-kavach-haldi-abhishek-puja') normalSlug = 'maa-bagalamukhi-kavach-puja'
    else if (vip.slug === 'maa-pratyangira-tantrok-hawan-bali-yagya') normalSlug = 'maa-pratyangira-hawan-yagya'
    else if (vip.slug === 'maa-varahi-land-property-dispute-yagya') normalSlug = 'maa-varahi-puja-yagya'
    else if (vip.slug === 'maa-ashta-lakshmi-16-day-karz-mukti-mahayagya') normalSlug = 'maa-ashta-lakshmi-karz-mukti-puja'
    else if (vip.slug === 'vastu-dosh-nivaran-puja-yagya') normalSlug = 'vastu-dosh-nivaran-puja'
    else if (vip.slug === 'durga-saptashati-108-samagri-mahayagya') normalSlug = 'durga-saptashati-hawan-puja'
    else if (vip.slug === 'vip-pitra-shanti-gita-path-shwet-til-hawan') normalSlug = 'pitra-gita-path-shwet-til-puja'
    else if (vip.slug === 'kalsarp-dosh-shanti-puja') normalSlug = 'kalsarp-dosh-nivaran-puja'
    else if (vip.slug === '11000-mahamrityunjaya-jaap-maharudrabhishekam') normalSlug = 'mahamrityunjaya-jaap-rudrabhishekam'

    const normalName = vip.name.replace(/VIP\s*/i, '').concat(' (सामान्य संकल्प)')

    let normalPuja = await prisma.puja.findUnique({ where: { slug: normalSlug } })
    if (!normalPuja) {
      normalPuja = await prisma.puja.create({
        data: {
          categoryId: vip.categoryId,
          templeId: vip.templeId,
          name: normalName,
          slug: normalSlug,
          shortDescription: vip.shortDescription,
          description: vip.description,
          benefits: vip.benefits,
          procedure: vip.procedure,
          duration: vip.duration || 60,
          price: 901,
          vipPrice: null,
          maxMembers: 1,
          isVip: false,
          isOnline: true,
          isFeatured: true,
          coverImage: vip.coverImage,
          status: 'PUBLISHED',
          isEvergreen: true,
          location: vip.location,
          customHtml: vip.customHtml
        }
      })
      console.log(`✨ Created Normal Puja: ${normalName} (slug: ${normalSlug})`)
    } else {
      await prisma.puja.update({
        where: { id: normalPuja.id },
        data: {
          price: 901,
          isVip: false,
          status: 'PUBLISHED'
        }
      })
      console.log(`✅ Updated existing Normal Puja: ${normalName}`)
    }

    // Attach standard packages (901, 1501, 2501, 3501) to the normal puja
    await prisma.pujaPackage.deleteMany({ where: { pujaId: normalPuja.id } })
    await prisma.pujaPackage.createMany({
      data: standardPackages.map(p => ({
        pujaId: normalPuja.id,
        name: p.name,
        price: p.price,
        description: p.description
      }))
    })
  }

  // Also ensure existing non-VIP pujas have packages
  const nonVipPujas = await prisma.puja.findMany({ where: { isVip: false } })
  for (const p of nonVipPujas) {
    const pkgCount = await prisma.pujaPackage.count({ where: { pujaId: p.id } })
    if (pkgCount === 0) {
      await prisma.pujaPackage.createMany({
        data: standardPackages.map(sp => ({
          pujaId: p.id,
          name: sp.name,
          price: sp.price,
          description: sp.description
        }))
      })
    }
  }

  console.log('🎉 Successfully separated VIP Pujas (no packages) & Normal Pujas (packages: ₹901, ₹1501, ₹2501, ₹3501)!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
