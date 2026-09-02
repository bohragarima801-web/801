const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Updating Hero Slider ctaUrl links to original normal puja URLs...')

  const slides = await prisma.heroSlider.findMany()

  const slugMapping = {
    'maa-ashta-lakshmi-16-day-karz-mukti-mahayagya': '/pujas/maa-ashta-lakshmi-karz-mukti-puja',
    'maa-bagalamukhi-kavach-haldi-abhishek-puja': '/pujas/maa-bagalamukhi-kavach-puja',
    'maa-pratyangira-tantrok-hawan-bali-yagya': '/pujas/maa-pratyangira-hawan-yagya',
    'maa-varahi-land-property-dispute-yagya': '/pujas/maa-varahi-puja-yagya',
    'vastu-dosh-nivaran-puja-yagya': '/pujas/vastu-dosh-nivaran-puja',
    'durga-saptashati-108-samagri-mahayagya': '/pujas/durga-saptashati-hawan-puja',
    'vip-pitra-shanti-gita-path-shwet-til-hawan': '/pujas/pitra-gita-path-shwet-til-puja',
    'kalsarp-dosh-shanti-puja': '/pujas/kalsarp-dosh-nivaran-puja',
    '11000-mahamrityunjaya-jaap-maharudrabhishekam': '/pujas/mahamrityunjaya-jaap-rudrabhishekam',
    'shani-saadesati-dhaiya-dosh-nivaran-yagya': '/pujas/shani-saadesati-dhaiya-dosh-nivaran-yagya',
    'maa-bagalamukhi-mirchi-hawan': '/pujas/maa-bagalamukhi-mirchi-hawan',
    'navgrah-shanti-sarva-graha-dosh-nivaran-puja': '/pujas/navgrah-shanti-sarva-graha-dosh-nivaran-puja',
    'pitra-shanti-vishesh-sarva-pitra-tarpan-puja': '/pujas/pitra-shanti-vishesh-sarva-pitra-tarpan-puja',
    'premium-tantrik-hawan-108-vishesh-samagri-se': '/pujas/premium-tantrik-hawan-108-vishesh-samagri-se'
  }

  for (const slide of slides) {
    let cleanUrl = slide.ctaUrl || ''
    // Remove domain prefix if present
    cleanUrl = cleanUrl.replace(/^https?:\/\/[^\/]+/, '')

    // Check if URL matches any VIP slug to map to normal puja URL
    for (const [oldSlug, newUrl] of Object.entries(slugMapping)) {
      if (cleanUrl.includes(oldSlug)) {
        cleanUrl = newUrl
        break
      }
    }

    if (!cleanUrl.startsWith('/')) {
      cleanUrl = '/' + cleanUrl
    }

    await prisma.heroSlider.update({
      where: { id: slide.id },
      data: { ctaUrl: cleanUrl }
    })

    console.log(`✅ Slide "${slide.title.substring(0, 30)}..." -> ctaUrl: ${cleanUrl}`)
  }

  console.log('🎉 Hero slider links updated to normal puja URLs successfully!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
