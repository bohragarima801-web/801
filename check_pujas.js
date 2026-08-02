const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.websiteSetting.findMany();
  for (const s of settings) {
    if (typeof s.value === 'string' && s.value.includes('ReligiousOrganization')) {
      console.log('FOUND IN KEY:', s.key);
      console.log('VALUE:', s.value);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());


