const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.puja.updateMany({
  where: { publishedAt: { gt: new Date() } },
  data: { publishedAt: new Date() }
}).then(console.log).finally(() => prisma.$disconnect());
