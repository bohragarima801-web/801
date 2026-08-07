const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking VIP Pujas in DB...')

  const vipPujas = await prisma.puja.findMany({
    where: { isVip: true, status: 'PUBLISHED' },
    select: {
      id: true,
      name: true,
      slug: true,
      coverImage: true,
      vipPrice: true,
      location: true
    }
  })

  console.log('Total Published VIP Pujas in DB:', vipPujas.length)
  for (const vp of vipPujas) {
    console.log(`- 👑 ${vp.name} (Slug: ${vp.slug}) | Cover: ${vp.coverImage} | VIP Price: ₹${vp.vipPrice}`)
  }
}

main()
  .catch(err => {
    console.error('❌ Error checking VIP Pujas:', err)
  })
  .finally(() => prisma.$disconnect())
