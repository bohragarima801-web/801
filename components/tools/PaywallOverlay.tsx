'use client'

import React from 'react'
import { Lock, ArrowRight, ShieldCheck, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { toast } from 'sonner'

export function PaywallOverlay({ tool }: { tool: any }) {
  const router = useRouter()
  const { addToCart } = useCart()

  const handleUnlock = () => {
    // Add the tool to cart and go to checkout
    addToCart({
      id: `tool-${tool.id}`,
      name: `Premium Tool: ${tool.name}`,
      price: Number(tool.price),
    })
    toast.success(`${tool.name} added to cart!`)
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
        
        <Button 
          onClick={handleUnlock}
          size="lg" 
          className="w-full h-14 text-lg font-bold bg-gradient-primary hover:opacity-90 text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] rounded-full"
        >
          Unlock for Rs. {Number(tool.price)}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
