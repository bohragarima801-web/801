'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// Safe localStorage access
const safeLocalStorage = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null;
    try { return window.localStorage.getItem(key); } catch { return null; }
  },
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return;
    try { window.localStorage.setItem(key, value); } catch { /* ignore */ }
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return;
    try { window.localStorage.removeItem(key); } catch { /* ignore */ }
  }
};

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

type CartContextType = {
  items: CartItem[]
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  cartTotal: number
  productSubtotal: number
  appliedCoupon: { id: string, code: string, discountAmount: number } | null
  applyCoupon: (coupon: { id: string, code: string, discountAmount: number }) => void
  removeCoupon: () => void
  discountAmount: number
  deliveryEnabled: boolean
  deliveryFee: number
  freeShippingThreshold: number
  shippingFee: number
  finalTotal: number
  hasProducts: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [appliedCoupon, setAppliedCoupon] = useState<{ id: string, code: string, discountAmount: number } | null>(null)
  const [deliveryConfig, setDeliveryConfig] = useState<{ enabled: boolean, fee: number, freeThreshold: number }>({ enabled: true, fee: 99, freeThreshold: 999 })
  const [mounted, setMounted] = useState(false)

  // Fetch delivery settings on mount
  useEffect(() => {
    const fetchDeliveryConfig = async () => {
      try {
        const res = await fetch('/api/delivery-config')
        const data = await res.json()
        if (data.ok && typeof data.fee === 'number') {
          setDeliveryConfig({ enabled: data.enabled !== false, fee: data.fee, freeThreshold: data.freeThreshold })
        }
      } catch (err) {
        console.warn('Failed to load delivery config:', err)
      }
    }
    fetchDeliveryConfig()
  }, [])

  // Safe localStorage access - ONLY on client
  useEffect(() => {
    try {
      const stored = safeLocalStorage.getItem('dy_cart')
      if (stored) setItems(JSON.parse(stored))
      
      const storedCoupon = safeLocalStorage.getItem('dy_coupon')
      if (storedCoupon) setAppliedCoupon(JSON.parse(storedCoupon))
    } catch (error) {
      console.warn('Failed to load cart from localStorage:', error)
    } finally {
      setMounted(true)
    }
  }, [])

  // Save to localStorage - ONLY when mounted
  useEffect(() => {
    if (mounted) {
      try {
        safeLocalStorage.setItem('dy_cart', JSON.stringify(items))
        if (appliedCoupon) {
          safeLocalStorage.setItem('dy_coupon', JSON.stringify(appliedCoupon))
        } else {
          safeLocalStorage.removeItem('dy_coupon')
        }
      } catch (error) {
        console.warn('Failed to save cart to localStorage:', error)
      }
    }
  }, [items, appliedCoupon, mounted])

  const addToCart = (product: Omit<CartItem, 'quantity'>, quantityToAdd = 1) => {
    setItems((current) => {
      const existing = current.find(item => item.id === product.id)
      if (existing) {
        return current.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
        )
      }
      return [...current, { ...product, quantity: quantityToAdd }]
    })
  }

  const removeFromCart = (id: string) => {
    setItems(current => current.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id)
      return
    }
    setItems(current => 
      current.map(item => item.id === id ? { ...item, quantity } : item)
    )
  }

  const clearCart = () => {
    setItems([])
    setAppliedCoupon(null)
    safeLocalStorage.removeItem('dy_cart')
    safeLocalStorage.removeItem('dy_coupon')
  }

  const applyCoupon = (coupon: { id: string, code: string, discountAmount: number }) => {
    setAppliedCoupon(coupon)
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = Math.round(items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 100) / 100
  
  // Product-only subtotal (excludes pujas, addons, tools)
  const productSubtotal = Math.round(items
    .filter(item => !item.id.startsWith('puja-') && !item.id.startsWith('addon-') && !item.id.startsWith('tool-'))
    .reduce((sum, item) => sum + (item.price * item.quantity), 0) * 100) / 100

  const hasProducts = productSubtotal > 0
  const discountAmount = appliedCoupon ? Math.round(appliedCoupon.discountAmount * 100) / 100 : 0
  
  // Delivery Fee calculation (Applies ONLY to physical products! Pujas have 0 delivery fee):
  // If deliveryEnabled == false -> 0
  // If productSubtotal == 0 -> no products in cart -> 0
  // If productSubtotal > freeThreshold -> FREE SHIPPING (0)
  // If productSubtotal <= freeThreshold -> deliveryFee (default 99)
  const deliveryEnabled = deliveryConfig.enabled
  const deliveryFee = deliveryConfig.fee
  const freeShippingThreshold = deliveryConfig.freeThreshold
  
  const shippingFee = (!deliveryEnabled || !hasProducts || productSubtotal > freeShippingThreshold) ? 0 : deliveryFee
  
  const finalTotal = Math.max(0, Math.round((cartTotal - discountAmount + shippingFee) * 100) / 100)

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart, 
      totalItems, cartTotal, productSubtotal, appliedCoupon, applyCoupon, removeCoupon, discountAmount,
      deliveryEnabled, deliveryFee, freeShippingThreshold, shippingFee, finalTotal, hasProducts
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
