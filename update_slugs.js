const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateSlugs() {
  console.log("Updating Puja and Product Slugs...");

  // Update Puja Slugs
  const pujas = await prisma.puja.findMany();
  for (const p of pujas) {
    let newSlug = p.slug;
    if (p.slug.includes('11000-maha-mrityunjay')) {
      newSlug = 'maha-mrityunjay-jaap';
    } else if (p.slug.length > 35) {
      newSlug = p.slug.split('-').slice(0, 4).join('-');
    }
    if (newSlug !== p.slug) {
      await prisma.puja.update({
        where: { id: p.id },
        data: { slug: newSlug }
      });
      console.log(`Updated Puja [${p.name}] slug: ${p.slug} -> ${newSlug}`);
    }
  }

  // Update Product Slugs
  const products = await prisma.product.findMany();
  for (const p of products) {
    let newSlug = p.slug;
    if (p.slug.includes('bagla-mukhi')) {
      newSlug = 'baglamukhi-kawach-potli';
    } else if (p.slug.includes('divya-dhan')) {
      newSlug = 'divya-dhan-potli';
    } else if (p.slug.includes('divya-navgrah')) {
      newSlug = 'navgrah-shanti-dhoop';
    } else if (p.slug.length > 35) {
      newSlug = p.slug.split('-').slice(0, 4).join('-');
    }

    if (newSlug !== p.slug) {
      await prisma.product.update({
        where: { id: p.id },
        data: { slug: newSlug }
      });
      console.log(`Updated Product [${p.name}] slug: ${p.slug} -> ${newSlug}`);
    }
  }
}

updateSlugs()
  .then(() => console.log("Slug updates complete!"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
