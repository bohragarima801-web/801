const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const blogs = await prisma.blog.findMany({ select: { id: true, title: true, seoTitle: true, slug: true } });
  for (const b of blogs) {
    console.log(`Blog [${b.slug}]: titleLen=${b.title?.length}, seoTitleLen=${b.seoTitle?.length}`);
    if (b.slug.includes('baglamukhi') || (b.title && b.title.length > 60)) {
      const clean = 'Maa Baglamukhi Mirchi Havan Mahayagya Guide';
      await prisma.blog.update({
        where: { id: b.id },
        data: { seoTitle: clean }
      });
      console.log('✓ Updated seoTitle for blog:', b.slug, 'to:', clean);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());




