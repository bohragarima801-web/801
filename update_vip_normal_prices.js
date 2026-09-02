const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Updating VIP pujas with accessible normal prices...')

  const priceUpdates = [
    { slug: 'maa-bagalamukhi-kavach-haldi-abhishek-puja', normalPrice: 1100, vipPrice: 15001 },
    { slug: 'maa-pratyangira-tantrok-hawan-bali-yagya', normalPrice: 1501, vipPrice: 21000 },
    { slug: 'maa-varahi-land-property-dispute-yagya', normalPrice: 901, vipPrice: 15001 },
    { slug: 'maa-ashta-lakshmi-16-day-karz-mukti-mahayagya', normalPrice: 2100, vipPrice: 31000 },
    { slug: 'vastu-dosh-nivaran-puja-yagya', normalPrice: 1501, vipPrice: 21000 },
    { slug: 'durga-saptashati-108-samagri-mahayagya', normalPrice: 1100, vipPrice: 21001 },
    { slug: 'vip-pitra-shanti-gita-path-shwet-til-hawan', normalPrice: 1501, vipPrice: 15001 },
    { slug: 'kalsarp-dosh-shanti-puja', normalPrice: 901, vipPrice: 15001 },
    { slug: '11000-mahamrityunjaya-jaap-maharudrabhishekam', normalPrice: 901, vipPrice: 21000 }
  ]

  for (const item of priceUpdates) {
    const existing = await prisma.puja.findUnique({ where: { slug: item.slug } })
    if (existing) {
      await prisma.puja.update({
        where: { slug: item.slug },
        data: {
          price: item.normalPrice,
          vipPrice: item.vipPrice
        }
      })
      console.log(`✅ Updated ${item.slug} -> Normal: ₹${item.normalPrice}, VIP: ₹${item.vipPrice}`)
    } else {
      console.log(`⚠️ Puja slug not found: ${item.slug}`)
    }
  }

  console.log('🎉 All VIP pujas now have accessible normal pricing!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
