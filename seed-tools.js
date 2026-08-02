const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STATIC_TOOLS = [
  {
    name: 'Free Kundali (जन्म कुंडली)',
    slug: 'kundali',
    description: 'Generate your detailed Vedic birth chart with planetary positions, doshas, and predictions.',
    isActive: true,
    isFree: true,
    price: 0,
    trialDays: 0,
  },
  {
    name: 'Today\'s Panchang (दैनिक पंचांग)',
    slug: 'panchang',
    description: 'Check daily Hindu calendar with Tithi, Nakshatra, Yoga, Karana, and auspicious timings.',
    isActive: true,
    isFree: true,
    price: 0,
    trialDays: 0,
  },
  {
    name: 'Kundali Milan (गुण मिलान)',
    slug: 'milan',
    description: 'Check compatibility for marriage with detailed Ashtakoot Guna Milan analysis.',
    isActive: true,
    isFree: false,
    price: 199,
    trialDays: 1,
  },
  {
    name: 'Auspicious Muhurat (शुभ मुहूर्त)',
    slug: 'muhurat',
    description: 'Find the most auspicious time (Shubh Muhurat) for marriage, vehicle purchase, and events.',
    isActive: true,
    isFree: false,
    price: 99,
    trialDays: 1,
  },
  {
    name: 'Numerology Calculator (अंक ज्योतिष)',
    slug: 'numerology',
    description: 'Calculate your life path number, destiny number, and lucky numbers.',
    isActive: true,
    isFree: true,
    price: 0,
    trialDays: 0,
  },
  {
    name: 'Gemstone Suggestion (रत्न परामर्श)',
    slug: 'ratna',
    description: 'Find the suitable Vedic gemstones based on your birth chart and planetary positions.',
    isActive: true,
    isFree: true,
    price: 0,
    trialDays: 0,
  },
  {
    name: 'Japa Mala Counter (जाप माला)',
    slug: 'mala',
    description: 'Digital 108 mantra chanting counter with sound effects and progress tracking.',
    isActive: true,
    isFree: true,
    price: 0,
    trialDays: 0,
  }
];

async function main() {
  for (const tool of STATIC_TOOLS) {
    await prisma.spiritualTool.upsert({
      where: { slug: tool.slug },
      update: {
        name: tool.name,
        description: tool.description,
        isActive: true,
        isFree: tool.isFree,
        price: tool.price,
      },
      create: tool,
    });
    console.log(`Synced tool: ${tool.name}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
