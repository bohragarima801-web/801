const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const pujas = await prisma.puja.findMany({
    where: { status: 'PUBLISHED' },
    select: {
      id: true,
      name: true,
      slug: true,
      coverImage: true,
      seoTitle: true,
      seoDescription: true,
      isVip: true
    }
  })

  console.log('🎉 TOTAL PUBLISHED REAL PUJAS IN DB:', pujas.length)
  pujas.forEach((p, i) => {
    console.log(`${i+1}. [${p.isVip ? '👑 VIP' : '🌸 REGULAR'}] ${p.name}`)
    console.log(`   Slug: ${p.slug} | Cover: ${p.coverImage} | Has SEO: ${!!p.seoTitle}`)
  })
}

main().finally(() => prisma.$disconnect())
