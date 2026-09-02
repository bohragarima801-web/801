const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const slides = await prisma.heroSlider.findMany()
  console.log('SLIDES IN DB:', slides.length)
  console.log(JSON.stringify(slides, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
