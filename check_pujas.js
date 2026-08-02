const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('⚡ Running DB SEO Cleanup...');

  // 1. Update Tool slug from Kunadali-milan to kundali-milan
  const updatedTool = await prisma.spiritualTool.updateMany({
    where: { slug: { equals: 'Kunadali-milan', mode: 'insensitive' } },
    data: { slug: 'kundali-milan', name: 'Kundali Milan' }
  });
  console.log('✓ Tool Slug Update:', updatedTool.count);

  // 2. Clean Puja seoTitle length
  const updatedPuja = await prisma.puja.updateMany({
    where: { id: 'f25767cc-c40a-46f8-b3ef-bf6e876e5935' },
    data: { seoTitle: 'Maa Baglamukhi Puja & Mirchi Havan in Jodhpur' }
  });
  console.log('✓ Puja SEO Title Update:', updatedPuja.count);

  // 3. Strip duplicate brand names from Product seoTitles
  const products = await prisma.product.findMany({ select: { id: true, seoTitle: true } });
  for (const p of products) {
    if (p.seoTitle && /\|/i.test(p.seoTitle)) {
      const clean = p.seoTitle.replace(/\s*\|\s*DivyaYagyam/gi, '').trim();
      await prisma.product.update({
        where: { id: p.id },
        data: { seoTitle: clean }
      });
    }
  }
  console.log('✓ Products SEO Titles Cleaned');
}

main().catch(console.error).finally(() => prisma.$disconnect());

