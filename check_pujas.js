const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.puja.findMany({ select: { id: true, name: true, status: true, publishedAt: true, isEvergreen: true, pujaDate: true } }).then(console.log).finally(() => prisma.$disconnect());
