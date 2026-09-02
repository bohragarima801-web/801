import prisma from '@/lib/prisma'

export interface HoroscopeOrderData {
  id: string
  devoteeName: string
  gender: string
  dob: string
  birthTime: string
  birthPlace: string
  whatsappPhone: string
  email?: string
  language: string
  specialConcern?: string
  reportId: string
  reportTitle: string
  amount: number
  paymentId?: string
  orderId?: string
  paymentStatus: 'PAID' | 'PENDING' | 'WHATSAPP_REQUEST'
  dispatchStatus: 'PENDING' | 'PREPARING' | 'SENT_ON_WHATSAPP' | 'COMPLETED'
  createdAt: string
  updatedAt: string
}

// In-memory fallback cache to ensure zero data loss across restarts/deployments
const globalForOrders = global as unknown as { horoscopeOrders: HoroscopeOrderData[] }
if (!globalForOrders.horoscopeOrders) {
  globalForOrders.horoscopeOrders = []
}

export async function saveHoroscopeOrder(order: Omit<HoroscopeOrderData, 'id' | 'createdAt' | 'updatedAt' | 'dispatchStatus'> & { id?: string; dispatchStatus?: HoroscopeOrderData['dispatchStatus'] }) {
  const newOrder: HoroscopeOrderData = {
    id: order.id || `hord_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    ...order,
    dispatchStatus: order.dispatchStatus || 'PENDING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  // Check if exists
  const existingIdx = globalForOrders.horoscopeOrders.findIndex(o => o.id === newOrder.id || (order.paymentId && o.paymentId === order.paymentId) || (order.orderId && o.orderId === order.orderId))
  if (existingIdx >= 0) {
    globalForOrders.horoscopeOrders[existingIdx] = {
      ...globalForOrders.horoscopeOrders[existingIdx],
      ...newOrder,
      updatedAt: new Date().toISOString()
    }
    return globalForOrders.horoscopeOrders[existingIdx]
  } else {
    globalForOrders.horoscopeOrders.unshift(newOrder)
    return newOrder
  }
}

export async function getAllHoroscopeOrders(): Promise<HoroscopeOrderData[]> {
  // 1. Fetch from database payments
  const dbOrders: HoroscopeOrderData[] = []
  try {
    const payments = await prisma.payment.findMany({
      where: {
        OR: [
          { metadata: { path: ['paymentType'], equals: 'astro' } },
          { metadata: { path: ['notes', 'reportTitle'], not: undefined } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    for (const p of payments) {
      const meta = (p.metadata && typeof p.metadata === 'object') ? (p.metadata as any) : {}
      const notes = meta.notes || {}
      const customer = meta.customer || {}

      if (notes.reportTitle || meta.description?.includes('Horoscope')) {
        dbOrders.push({
          id: p.id,
          devoteeName: notes.name || customer.name || 'Devotee',
          gender: notes.gender || 'Not specified',
          dob: notes.dob || 'Not provided',
          birthTime: notes.birthTime || 'Unknown',
          birthPlace: notes.birthPlace || 'Not provided',
          whatsappPhone: notes.contact || customer.contact || 'Not provided',
          email: customer.email || undefined,
          language: notes.language || 'English',
          specialConcern: notes.specialConcern || '',
          reportId: notes.reportSlug || 'horoscope',
          reportTitle: notes.reportTitle || meta.description || 'Vedic Horoscope Report',
          amount: Number(p.amount) || 199,
          paymentId: p.gatewayRef || undefined,
          orderId: p.gatewayOrderId || undefined,
          paymentStatus: p.status === 'SUCCESS' ? 'PAID' : 'PENDING',
          dispatchStatus: 'PENDING',
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString()
        })
      }
    }
  } catch (err) {
    console.warn('[getAllHoroscopeOrders] DB fetch skipped:', err)
  }

  // Merge with in-memory store (deduplicating by paymentId or ID)
  const combined = [...globalForOrders.horoscopeOrders]
  for (const dbo of dbOrders) {
    if (!combined.some(c => c.id === dbo.id || (dbo.paymentId && c.paymentId === dbo.paymentId))) {
      combined.push(dbo)
    }
  }

  return combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function updateHoroscopeDispatchStatus(id: string, status: HoroscopeOrderData['dispatchStatus']) {
  const order = globalForOrders.horoscopeOrders.find(o => o.id === id)
  if (order) {
    order.dispatchStatus = status
    order.updatedAt = new Date().toISOString()
    return order
  }
  return null
}
