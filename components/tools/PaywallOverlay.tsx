'use client'

import React, { useState } from 'react'
import { Lock, ArrowRight, ShieldCheck, Zap, Loader2, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { processToolPurchase } from '@/lib/tool-purchase'

export function PaywallOverlay({ tool }: { tool: any }) {
  const router = useRouter()
  const { addToCart } = useCart()
  const [loading, setLoading] = useState(false)

  const handleInstantUnlock = async () => {
    setLoading(true)
    await processToolPurchase({
      toolId: tool.id,
      toolSlug: tool.slug,
      toolName: tool.name,
      onSuccess: () => {
        setLoading(false)
        window.location.reload()
      },
      onError: () => {
        setLoading(false)
      }
    })
  }

  const handleAddToCart = () => {
    addToCart({
      id: `tool-${tool.id}`,
      name: `Premium Tool: ${tool.name}`,
      price: Number(tool.price),
    })
    router.push('/checkout')
  }

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      
      <div className="relative z-20 card-sacred max-w-md mx-auto transform translate-y-10">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/15 text-primary rounded-full flex items-center justify-center mb-6 shadow-inner border border-primary/20">
          <Lock className="h-8 w-8" />
        </div>
        
        <h2 className="text-2xl font-black text-foreground mb-2">Premium Tool</h2>
        <p className="text-muted-foreground mb-6 font-medium">
          Unlock full access to <strong className="text-foreground">{tool.name}</strong> to continue exploring.
        </p>

        <div className="space-y-3 mb-8 text-sm text-muted-foreground text-left bg-card p-4 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <Zap className="h-4 w-4 text-secondary" />
            <span>Instant full access upon payment</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Lifetime updates and support</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={handleInstantUnlock}
            disabled={loading}
            size="lg" 
            className="w-full h-14 text-lg font-bold bg-gradient-primary hover:opacity-90 text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] rounded-full"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <>
                Unlock Instant Access — ₹{Number(tool.price)}
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

          <button
            onClick={handleAddToCart}
            className="text-xs text-muted-foreground hover:text-foreground font-medium underline flex items-center justify-center gap-1 mx-auto pt-1"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add to cart & checkout with other items
          </button>
        </div>
      </div>
    </div>
  )
}
