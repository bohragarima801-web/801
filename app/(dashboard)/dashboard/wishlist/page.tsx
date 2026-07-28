import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'
import { Heart, ShoppingCart } from 'lucide-react'
import { WishlistActions } from './actions'
export const dynamic = 'force-dynamic'

export default async function WishlistPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const wishlist = await prisma.wishlist.findMany({
    where: { userId: user.id },
    include: {
      product: {
        select: {
          id: true, name: true, slug: true, price: true, salePrice: true,
          images: { take: 1, select: { url: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        {wishlist.length > 0 && (
          <Link href="/products" className="text-sm font-semibold text-orange-600 hover:underline">
            Browse More →
          </Link>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <Heart className="h-12 w-12 text-pink-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 text-lg">Your Wishlist is Empty</h3>
          <p className="text-slate-500 text-sm mt-1 mb-6">
            Save products you love and buy them later.
          </p>
          <Link href="/products"
            className="inline-flex items-center gap-2 bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-orange-700 transition-colors">
            <ShoppingCart className="h-4 w-4" /> Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map(({ id, product }) => {
            const price = product.salePrice || product.price
            const originalPrice = product.salePrice ? product.price : null
            const image = product.images[0]?.url || '/placeholder-product.jpg'
            return (
              <div key={id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                {/* Product Image */}
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="aspect-square bg-slate-50 overflow-hidden">
                    <img
                      src={image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e: any) => { e.target.src = 'https://placehold.co/300x300?text=Product' }}
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-bold text-slate-800 text-sm leading-tight hover:text-orange-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-orange-600">₹{Number(price).toLocaleString('en-IN')}</span>
                    {originalPrice && (
                      <span className="text-sm text-slate-400 line-through">₹{Number(originalPrice).toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  <WishlistActions wishlistId={id} productSlug={product.slug} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
