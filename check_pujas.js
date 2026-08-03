const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Searching DB for ReligiousOrganization...');

  // Search websiteSetting
  const settings = await prisma.websiteSetting.findMany();
  for (const s of settings) {
    const val = JSON.stringify(s.value || '');
    if (val.includes('ReligiousOrganization')) {
      console.log('🔥 FOUND IN websiteSetting key:', s.key, 'value:', val);
    }
  }

  // Search pujas
  const pujas = await prisma.puja.findMany();
  for (const p of pujas) {
    if (JSON.stringify(p).includes('ReligiousOrganization')) {
      console.log('🔥 FOUND IN Puja:', p.name);
    }
  }

  // Filesystem search
  console.log('🔍 Searching filesystem for ReligiousOrganization...');
  function searchDir(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      if (f === 'node_modules' || f === '.next' || f === '.git') continue;
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        searchDir(full);
      } else if (stat.isFile() && (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.json') || f.endsWith('.html'))) {
        const content = fs.readFileSync(full, 'utf8');
        if (content.includes('ReligiousOrganization')) {
          console.log('🔥 FOUND IN FILE:', full);
        }
      }
    }
  }

  searchDir(__dirname);
}

main().catch(console.error).finally(() => prisma.$disconnect());





