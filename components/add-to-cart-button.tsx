'use client'

import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useRouter } from 'next/navigation'

export function AddToCartButton({ 
  product, 
  hasStock 
}: { 
  product: { id: string, name: string, price: number, coverImage?: string | null }, 
  hasStock: boolean 
}) {
  const { addToCart } = useCart()
  const router = useRouter()

  return (
    <Button 
      size="sm" 
      variant={hasStock ? 'default' : 'secondary'} 
      disabled={!hasStock} 
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        addToCart({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image: product.coverImage || undefined
        })
        setTimeout(() => router.push('/cart'), 50)
      }}
      className="bg-[#7A1F2B] hover:bg-[#52131D] text-white font-bold h-9 px-3.5 text-xs gap-1.5 rounded-lg border border-[#C89B3C]/30 shadow-2xs transition-colors"
    >
      <ShoppingCart className="h-3.5 w-3.5" /> खरीदे (Buy)
    </Button>
  )
}

