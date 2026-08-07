'use client'

import { useCart } from '@/lib/cart-context'
import Image from 'next/image';
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, Truck, Sparkles, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { PaymentTrustBadge } from '@/components/payment-trust-badge'
import { Badge } from '@/components/ui/badge'

export default function CartPage() {
  const { 
    items, removeFromCart, updateQuantity, cartTotal, totalItems, 
    deliveryFee, freeShippingThreshold, shippingFee, finalTotal, discountAmount,
    productSubtotal, hasProducts, deliveryEnabled 
  } = useCart()

  if (items.length === 0) {
    return (
      <div className="container py-20 flex flex-col items-center justify-center space-y-5">
        <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center">
          <ShoppingCart className="h-10 w-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-700">Your Cart is Empty</h2>
        <p className="text-slate-500">Explore our sacred store and add divine items to your cart.</p>
        <Button asChild className="bg-[var(--primary-color)] hover:bg-orange-700 font-bold rounded-xl h-12 px-8">
          <Link href="/products">Browse Store</Link>
        </Button>
      </div>
    )
  }

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - productSubtotal)
  const isFreeShippingUnlocked = !deliveryEnabled || deliveryFee === 0 || !hasProducts || productSubtotal >= freeShippingThreshold

  return (
    <div className="container py-10 max-w-5xl">
      <h1 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-3">
        <ShoppingCart className="h-8 w-8 text-[var(--primary-color)]" /> Your Cart
      </h1>

      {/* Free Shipping Progress Banner */}
      {hasProducts && (
        <div className="mb-8 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
          <Truck className="h-6 w-6 text-orange-600 shrink-0 animate-bounce" />
          {isFreeShippingUnlocked ? (
            <div className="flex-1">
              <p className="font-extrabold text-sm text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 🎉 बधाई हो! आपको मुफ़्त डिलीवरी मिली है (FREE Delivery Unlocked!)
              </p>
              <p className="text-xs text-emerald-700">
                {!deliveryEnabled || deliveryFee === 0 
                  ? 'एडमिन द्वारा सभी प्रोडक्ट्स पर मुफ़्त डिलीवरी चालू है।'
                  : `₹${freeShippingThreshold} या उससे अधिक की खरीदारी पर कोई डिलीवरी शुल्क नहीं लिया जाएगा।`}
              </p>
            </div>
          ) : (
            <div className="flex-1">
              <p className="font-bold text-sm text-slate-800">
                ₹{freeShippingThreshold} या उससे अधिक की खरीदारी पर <span className="text-orange-600 font-black">मुफ़्त डिलीवरी (FREE Delivery)</span>! (अन्यथा ₹{deliveryFee} शुल्क)
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                मुफ़्त डिलीवरी के लिए <span className="font-black text-orange-700">₹{remainingForFreeShipping}</span> की सामग्री और जोड़ें।
              </p>
              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-orange-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.round((productSubtotal / freeShippingThreshold) * 100))}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden shadow-xs border-slate-200 rounded-2xl">
              <CardContent className="p-4 flex gap-4 items-center">
                <div className="h-20 w-20 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-[var(--secondary-color)]/10 text-orange-300">
                      <ShoppingCart className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-bold text-slate-800 line-clamp-2">{item.name}</h3>
                  <p className="text-[var(--primary-color)] font-extrabold text-base">₹{item.price}</p>
                </div>
                
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2 text-xs"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-4">
          <Card className="shadow-sm border-orange-100 bg-white sticky top-24 rounded-2xl">
            <CardContent className="p-6 space-y-5">
              <h3 className="font-bold text-lg text-slate-800 border-b pb-3">Order Summary</h3>
              
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Items Total ({totalItems})</span>
                  <span className="font-bold text-slate-800">₹{cartTotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>Discount Applied</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span>Delivery Charge</span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs">
                      FREE (मुफ़्त)
                    </span>
                  ) : (
                    <span className="font-bold text-slate-800">₹{shippingFee}</span>
                  )}
                </div>

                <div className="pt-3 border-t flex justify-between font-black text-xl text-slate-900">
                  <span>Total to Pay</span>
                  <span className="text-[var(--primary-color)]">₹{finalTotal}</span>
                </div>
              </div>

              <Button asChild className="w-full h-12 bg-[var(--primary-color)] hover:bg-orange-700 text-white font-black rounded-xl shadow-md uppercase tracking-wider">
                <Link href="/checkout">
                  Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <PaymentTrustBadge className="mt-4" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
