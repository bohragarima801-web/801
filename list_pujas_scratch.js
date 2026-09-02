const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pujas = await prisma.puja.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      isVip: true,
      price: true,
      vipPrice: true,
      status: true
    }
  });
  console.log('TOTAL PUJAS:', pujas.length);
  console.log(JSON.stringify(pujas, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
