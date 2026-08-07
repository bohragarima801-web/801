const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Auditing Pujas in DB...')

  const allPujas = await prisma.puja.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      coverImage: true,
      status: true,
      isVip: true
    }
  })

  console.log('Total Pujas found in DB:', allPujas.length)
  for (const p of allPujas) {
    console.log(`- [${p.status}] ${p.name} (Slug: ${p.slug}) | Cover: ${p.coverImage} | VIP: ${p.isVip}`)
  }

  // Soft-delete or unpublish pujas that don't have valid cover images or are placeholders
  const dummyPujas = allPujas.filter(p => !p.coverImage || p.coverImage.includes('unsplash') || p.coverImage === '' || p.coverImage === '/placeholder.jpg')

  if (dummyPujas.length > 0) {
    console.log('Hiding', dummyPujas.length, 'dummy/incomplete pujas...')
    for (const dp of dummyPujas) {
      await prisma.puja.update({
        where: { id: dp.id },
        data: { status: 'DRAFT' }
      })
    }
    console.log('✅ Updated dummy pujas to DRAFT status.')
  } else {
    console.log('✅ All DB Pujas have valid cover images!')
  }
}

main()
  .catch(err => {
    console.error('❌ Error auditing Pujas:', err)
  })
  .finally(() => prisma.$disconnect())
