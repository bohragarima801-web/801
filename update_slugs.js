const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateShortSlug(str, maxLen = 45) {
  if (!str) return '';
  const cleanStr = str
    .toLowerCase()
    .replace(/\b(ultimate|protection|victory|success|best|guaranteed|power|powerful|supreme|top|exclusive|special|complete|full|live|online|for|and|with|the|in|at|of|to|by|a|an|or|is|are|divyayagyam)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const fullSlug = slugify(cleanStr.length > 0 ? cleanStr : str);
  if (fullSlug.length <= maxLen) return fullSlug;
  
  const parts = fullSlug.split('-');
  let shortSlug = '';
  for (const part of parts) {
    if ((shortSlug ? shortSlug + '-' + part : part).length <= maxLen) {
      shortSlug = shortSlug ? shortSlug + '-' + part : part;
    } else {
      break;
    }
  }
  return shortSlug || fullSlug.slice(0, maxLen);
}

async function updateSlugs() {
  console.log("Updating Puja and Product Slugs...");

  const pujas = await prisma.puja.findMany();
  for (const p of pujas) {
    let newSlug = generateShortSlug(p.name);
    if (p.slug.includes('baglamukhi')) {
      newSlug = 'maa-baglamukhi-mahayagya-mirchi-havan-ujjain';
    }
    
    if (newSlug !== p.slug) {
      // Check if newSlug already exists
      const existing = await prisma.puja.findUnique({ where: { slug: newSlug } });
      if (!existing || existing.id === p.id) {
        await prisma.puja.update({
          where: { id: p.id },
          data: { slug: newSlug }
        });
        console.log(`Updated Puja [${p.name}] slug: ${p.slug} -> ${newSlug}`);
      }
    }
  }
}

updateSlugs()
  .then(() => console.log("Slug updates complete!"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
