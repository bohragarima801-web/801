const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// List of allowed real Puja slugs created/approved today
const validSlugs = new Set([
  'maa-bagalamukhi-mirchi-hawan',
  'durga-saptashati-108-samagri-mahayagya',
  'kalsarp-dosh-shanti-puja',
  '11000-mahamrityunjaya-jaap-maharudrabhishekam',
  'shani-saadesati-dhaiya-dosh-nivaran-yagya',
  'navgrah-shanti-sarva-graha-dosh-nivaran-puja',
  'maa-bagalamukhi-kavach-haldi-abhishek-puja',
  'maa-pratyangira-tantrok-hawan-bali-yagya',
  'maa-varahi-land-property-dispute-yagya',
  'maa-ashta-lakshmi-16-day-karz-mukti-mahayagya',
  'vastu-dosh-nivaran-puja-yagya',
  'premium-tantrik-hawan-108-vishesh-samagri-se'
])

async function main() {
  console.log('🗑️ Cleaning unwanted pujas from DB...')

  const allPujas = await prisma.puja.findMany()
  console.log('Total Pujas currently in DB:', allPujas.length)

  let deletedCount = 0
  for (const puja of allPujas) {
    if (!validSlugs.has(puja.slug)) {
      console.log(`Deleting unwanted puja: ${puja.name} (${puja.slug})`)
      
      // Delete child packages, reviews, bookings if any
      await prisma.pujaPackage.deleteMany({ where: { pujaId: puja.id } }).catch(() => {})
      await prisma.booking.deleteMany({ where: { pujaId: puja.id } }).catch(() => {})
      await prisma.review.deleteMany({ where: { pujaId: puja.id } }).catch(() => {})
      
      await prisma.puja.delete({ where: { id: puja.id } })
      deletedCount++
    }
  }

  const remaining = await prisma.puja.findMany({ where: { status: 'PUBLISHED' } })
  console.log(`🎉 Cleanup complete! Deleted ${deletedCount} unwanted pujas. Remaining REAL published pujas in DB: ${remaining.length}`)
  for (const r of remaining) {
    console.log(`- ✅ ${r.name} (Slug: ${r.slug}, Cover: ${r.coverImage}, VIP: ${r.isVip})`)
  }
}

main()
  .catch(err => {
    console.error('❌ Error cleaning DB pujas:', err)
  })
  .finally(() => prisma.$disconnect())
