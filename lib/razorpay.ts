import Razorpay from 'razorpay'

let _instance: Razorpay | null = null

import { getSetting } from '@/lib/settings'

export async function getRazorpay(): Promise<Razorpay> {
  let key_id = (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '').replace(/^"|"$/g, '').trim()
  let key_secret = (process.env.RAZORPAY_KEY_SECRET || '').replace(/^"|"$/g, '').trim()

  if (!key_id) {
    key_id = (await getSetting('secret.razorpay_key_id', 'RAZORPAY_KEY_ID')).replace(/^"|"$/g, '').trim()
  }
  if (!key_id) {
    key_id = (await getSetting('secret.razorpay_key_id', 'NEXT_PUBLIC_RAZORPAY_KEY_ID')).replace(/^"|"$/g, '').trim()
  }

  if (!key_secret) {
    key_secret = (await getSetting('secret.razorpay_key_secret', 'RAZORPAY_KEY_SECRET')).replace(/^"|"$/g, '').trim()
  }

  if (!key_id || !key_secret) {
    throw new Error(`Razorpay key or secret is missing. KeyID: ${key_id ? 'Present' : 'Missing'}, KeySecret: ${key_secret ? 'Present' : 'Missing'}`)
  }
  return new Razorpay({ key_id, key_secret })
}


export const RAZORPAY_PUBLIC_KEY_ID =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || ''

export type PaymentIntentType = 'puja' | 'product' | 'donation' | 'bhaktiSeva' | 'astro'

export type CreateOrderInput = {
  amountInRupees: number
  paymentType: PaymentIntentType
  referenceId?: string
  description?: string
  customer?: {
    name?: string
    email?: string
    contact?: string
  }
  notes?: Record<string, string | number | boolean>
}
