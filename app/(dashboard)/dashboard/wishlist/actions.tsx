'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Trash2, Loader2 } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export function WishlistActions({ wishlistId, productSlug }: { wishlistId: string; productSlug: string }) {
  const [removing, setRemoving] = useState(false)
  const router = useRouter()

  async function removeFromWishlist() {
    setRemoving(true)
    try {
      const res = await fetch(`/api/wishlist?id=${wishlistId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to remove')
      toast.success('Removed from wishlist')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setRemoving(false)
    }
  }

  return (
    <div className="flex gap-2 mt-3">
      <a
        href={`/products/${productSlug}`}
        className="flex-1 flex items-center justify-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded-lg text-xs transition-colors"
      >
        <ShoppingCart className="h-3.5 w-3.5" /> Buy Now
      </a>
      <button
        onClick={removeFromWishlist}
        disabled={removing}
        className="flex items-center gap-1 text-xs font-bold text-red-500 border border-red-200 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
      >
        {removing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      </button>
    </div>
  )
}
