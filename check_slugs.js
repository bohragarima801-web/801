const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pujas = await prisma.puja.findMany({ select: { id: true, name: true, slug: true } });
  const products = await prisma.product.findMany({ select: { id: true, name: true, slug: true } });
  console.log("=== PUJAS (" + pujas.length + ") ===");
  console.log(pujas);
  console.log("=== PRODUCTS (" + products.length + ") ===");
  console.log(products);
}

main().catch(console.error).finally(() => prisma.$disconnect());
