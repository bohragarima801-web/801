const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// List of allowed real Product slugs created today
const validProductSlugs = new Set([
  'siddha-abhimantrit-rudraksha-mala',
  'divya-shrikhand-chandan-puja-100g',
  'divya-dhoop-special-negativity-remover-125g',
  'siddha-pure-copper-naag-naagin-pair-rahu-shanti',
  'siddha-9-abhimantrit-lakshmi-kaudi-set-free-gifts'
])

async function main() {
  console.log('🗑️ Cleaning fake/dummy products from Store DB...')

  const allProducts = await prisma.product.findMany()
  console.log('Total Products currently in DB:', allProducts.length)

  let deletedCount = 0
  for (const product of allProducts) {
    if (!validProductSlugs.has(product.slug)) {
      console.log(`Deleting fake product: ${product.name} (${product.slug})`)

      // Delete child relations
      await prisma.productImage.deleteMany({ where: { productId: product.id } }).catch(() => {})
      await prisma.inventory.deleteMany({ where: { productId: product.id } }).catch(() => {})
      await prisma.cartItem.deleteMany({ where: { productId: product.id } }).catch(() => {})
      await prisma.orderItem.deleteMany({ where: { productId: product.id } }).catch(() => {})
      await prisma.review.deleteMany({ where: { productId: product.id } }).catch(() => {})
      await prisma.wishlist.deleteMany({ where: { productId: product.id } }).catch(() => {})

      await prisma.product.delete({ where: { id: product.id } })
      deletedCount++
    }
  }

  const remaining = await prisma.product.findMany({ where: { status: 'ACTIVE' } })
  console.log(`🎉 Store Cleanup complete! Deleted ${deletedCount} fake products. Remaining REAL active products in DB: ${remaining.length}`)
  for (const r of remaining) {
    console.log(`- ✅ ${r.name} (Slug: ${r.slug}, Price: ₹${r.price}, Cover: ${r.coverImage})`)
  }
}

main()
  .catch(err => {
    console.error('❌ Error cleaning Store products:', err)
  })
  .finally(() => prisma.$disconnect())
