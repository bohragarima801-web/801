const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function backfillSeo() {
  console.log("Starting SEO Backfill for Pujas and Products...");

  // 1. Pujas
  const pujas = await prisma.puja.findMany({
    include: { category: true }
  });

  let pujaCount = 0;
  for (const p of pujas) {
    const cleanDesc = (p.shortDescription || p.description || '').replace(/<[^>]*>?/gm, '').trim();
    
    const targetTitle = p.seoTitle && p.seoTitle.length > 5
      ? p.seoTitle
      : `${p.name} — ऑनलाइन पूजा बुकिंग (लाइव संकल्प व प्रसाद) | DivyaYagyam`;

    const targetDesc = p.seoDescription && p.seoDescription.length > 10
      ? p.seoDescription
      : (cleanDesc.length > 20
          ? `${cleanDesc.slice(0, 110)}... विद्वान आचार्यों द्वारा नाम व गोत्र संकल्प, व्हाट्सएप पर लाइव वीडियो रिकॉर्डिंग व घर पर प्रसाद डिलीवरी।`
          : `भाग लें ${p.name} अनुष्ठान में। ${p.location ? `${p.location} से ` : ''}विद्वान आचार्यों द्वारा नाम-गोत्र संकल्प, लाइव वीडियो व सिद्ध प्रसाद डिलीवरी।`
        ).slice(0, 160);

    const targetKeywords = p.seoKeywords && p.seoKeywords.length > 5
      ? p.seoKeywords
      : [
          p.name,
          `${p.name} online puja`,
          'ऑनलाइन पूजा बुकिंग',
          'divyayagyam',
          p.location ? `${p.location} puja` : 'kashi vishwanath puja online',
          'mahakaleshwar puja online',
          'vedic anusthan',
          'prasad delivery'
        ].join(', ');

    await prisma.puja.update({
      where: { id: p.id },
      data: {
        seoTitle: targetTitle,
        seoDescription: targetDesc,
        seoKeywords: targetKeywords,
      }
    });
    pujaCount++;
  }
  console.log(`✅ Backfilled SEO for ${pujaCount} Pujas.`);

  // 2. Products
  const products = await prisma.product.findMany({
    include: { category: true }
  });

  let prodCount = 0;
  for (const p of products) {
    const cleanDesc = (p.shortDescription || p.description || '').replace(/<[^>]*>?/gm, '').trim();

    const targetTitle = p.seoTitle && p.seoTitle.length > 5
      ? p.seoTitle
      : `${p.name} — 100% अभिमंत्रित वैदिक सामग्री खरीदें | DivyaYagyam`;

    const targetDesc = p.seoDescription && p.seoDescription.length > 10
      ? p.seoDescription
      : (cleanDesc.length > 20
          ? `${cleanDesc.slice(0, 110)}... 100% प्रामाणिक सिद्ध सामग्री घर बैठे प्राप्त करें।`
          : `खरीदें 100% अभिमंत्रित ${p.name} ऑनलाइन। वैदिक मंत्रों से सिद्ध, 100% शुद्धता की गारंटी व फ़ास्ट होम डिलीवरी।`
        ).slice(0, 160);

    const targetKeywords = p.seoKeywords && p.seoKeywords.length > 5
      ? p.seoKeywords
      : [
          p.name,
          `Buy ${p.name} online`,
          `Abhimantrit ${p.name}`,
          'वैदिक पूजा सामग्री',
          'divyayagyam store',
          p.category?.name || 'Spiritual Store'
        ].join(', ');

    await prisma.puja.update
    await prisma.product.update({
      where: { id: p.id },
      data: {
        seoTitle: targetTitle,
        seoDescription: targetDesc,
        seoKeywords: targetKeywords,
      }
    });
    prodCount++;
  }
  console.log(`✅ Backfilled SEO for ${prodCount} Products.`);
}

backfillSeo()
  .then(() => console.log("🎉 SEO Backfill Finished Successfully!"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
