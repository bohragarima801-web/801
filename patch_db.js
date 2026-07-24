const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Running automatic database schema patches...");
  try {
    console.log("Patching authorId...");
    await prisma.$executeRawUnsafe('ALTER TABLE "blogs" ALTER COLUMN "authorId" DROP NOT NULL;');
  } catch (e) {
    console.log("authorId already optional or error:", e.message);
  }

  try {
    console.log("Patching seoKeywords for blogs, pujas, products...");
    await prisma.$executeRawUnsafe('ALTER TABLE "blogs" ADD COLUMN IF NOT EXISTS "seoKeywords" TEXT;');
    await prisma.$executeRawUnsafe('ALTER TABLE "pujas" ADD COLUMN IF NOT EXISTS "seoKeywords" TEXT;');
    await prisma.$executeRawUnsafe('ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "seoKeywords" TEXT;');
  } catch (e) {
    console.log("seoKeywords already exists or error:", e.message);
  }

  console.log("✅ Database patches applied successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
