const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🎠 Seeding Home Hero Sliders with all real Pujas...')

  // Fetch all published pujas from DB
  const pujas = await prisma.puja.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' }
  })

  console.log(`Found ${pujas.length} published pujas to populate Hero Slider.`)

  // Delete old hero sliders if any
  await prisma.heroSlider.deleteMany({})

  let orderIndex = 1
  for (const p of pujas) {
    const slideData = {
      title: p.name,
      subtitle: p.location || 'Maa Katyayani Durga Shakti Peeth, Jodhpur',
      image: p.coverImage || '/placeholder.jpg',
      ctaText: 'विशेष संकल्प लें (Book Now)',
      ctaUrl: `/pujas/${p.slug}`,
      order: orderIndex++,
      isActive: true
    }

    await prisma.heroSlider.create({ data: slideData })
    console.log(`- 🌟 Slide ${slideData.order}: ${slideData.title} -> ${slideData.ctaUrl}`)
  }

  console.log('🎉 SUCCESS! Home Hero Sliders populated with all real Pujas and direct clickable links!')
}

main()
  .catch(err => {
    console.error('❌ Error seeding Hero Sliders:', err)
  })
  .finally(() => prisma.$disconnect())
