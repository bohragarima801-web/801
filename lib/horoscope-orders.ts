import fs from 'fs'
import path from 'path'
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
  dispatchStatus: 'PENDING' | 'PREPARING' | 'SENT_ON_WHATSAPP' | 'SENT_ON_EMAIL' | 'COMPLETED'
  createdAt: string
  updatedAt: string
}

// Local JSON store path
const DATA_DIR = path.join(process.cwd(), 'data')
const FILE_PATH = path.join(DATA_DIR, 'horoscope-orders.json')

// In-memory fallback cache
const globalForOrders = global as unknown as { horoscopeOrders: HoroscopeOrderData[] }
if (!globalForOrders.horoscopeOrders) {
  globalForOrders.horoscopeOrders = []
}

function readFromFile(): HoroscopeOrderData[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    if (fs.existsSync(FILE_PATH)) {
      const raw = fs.readFileSync(FILE_PATH, 'utf8')
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (e) {
    console.error('Error reading horoscope orders from file:', e)
  }
  return []
}

function writeToFile(orders: HoroscopeOrderData[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(orders, null, 2), 'utf8')
  } catch (e) {
    console.error('Error writing horoscope orders to file:', e)
  }
}

export async function saveHoroscopeOrder(
  order: Omit<HoroscopeOrderData, 'id' | 'createdAt' | 'updatedAt' | 'dispatchStatus'> & {
    id?: string
    dispatchStatus?: HoroscopeOrderData['dispatchStatus']
  }
) {
  const currentOrders = await getAllHoroscopeOrders()

  const newOrder: HoroscopeOrderData = {
    id: order.id || `hord_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    ...order,
    dispatchStatus: order.dispatchStatus || 'PENDING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Check if exists
  const existingIdx = currentOrders.findIndex(
    (o) =>
      o.id === newOrder.id ||
      (order.paymentId && o.paymentId === order.paymentId) ||
      (order.orderId && o.orderId === order.orderId)
  )

  let resultOrder: HoroscopeOrderData
  if (existingIdx >= 0) {
    resultOrder = {
      ...currentOrders[existingIdx],
      ...newOrder,
      updatedAt: new Date().toISOString(),
    }
    currentOrders[existingIdx] = resultOrder
  } else {
    currentOrders.unshift(newOrder)
    resultOrder = newOrder
  }

  globalForOrders.horoscopeOrders = currentOrders
  writeToFile(currentOrders)

  // DB Backup (best-effort into websiteSetting table)
  try {
    await prisma.websiteSetting.upsert({
      where: { key: 'horoscope_custom_orders' },
      update: { value: currentOrders as any },
      create: { key: 'horoscope_custom_orders', value: currentOrders as any },
    })
  } catch (dbErr) {
    // DB unreachable in dev/build, file already written
  }

  return resultOrder
}

export async function getAllHoroscopeOrders(): Promise<HoroscopeOrderData[]> {
  // 1. Read from persistent file
  const fileOrders = readFromFile()

  // 2. Fetch from DB WebsiteSetting backup if file empty
  let dbBackupOrders: HoroscopeOrderData[] = []
  if (fileOrders.length === 0) {
    try {
      const setting = await prisma.websiteSetting.findUnique({
        where: { key: 'horoscope_custom_orders' },
      })
      if (setting && Array.isArray(setting.value)) {
        dbBackupOrders = setting.value as unknown as HoroscopeOrderData[]
        writeToFile(dbBackupOrders)
      }
    } catch {}
  }

  // 3. Fetch from database payments table
  const dbPaymentOrders: HoroscopeOrderData[] = []
  try {
    const payments = await prisma.payment.findMany({
      where: {
        OR: [
          { metadata: { path: ['paymentType'], equals: 'astro' } },
          { metadata: { path: ['paymentType'], equals: 'horoscope' } },
          { metadata: { path: ['notes', 'reportTitle'], not: undefined } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    for (const p of payments) {
      const meta = p.metadata && typeof p.metadata === 'object' ? (p.metadata as any) : {}
      const notes = meta.notes || {}
      const customer = meta.customer || {}

      if (notes.reportTitle || meta.description?.includes('Horoscope') || meta.description?.includes('Kundali')) {
        dbPaymentOrders.push({
          id: p.id,
          devoteeName: notes.devoteeName || notes.name || customer.name || 'Devotee',
          gender: notes.gender || 'Not specified',
          dob: notes.dob || 'Not provided',
          birthTime: notes.birthTime || 'Unknown',
          birthPlace: notes.birthPlace || 'Not provided',
          whatsappPhone: notes.whatsappPhone || notes.contact || customer.contact || 'Not provided',
          email: notes.email || customer.email || undefined,
          language: notes.language || 'Hindi',
          specialConcern: notes.specialConcern || '',
          reportId: notes.reportSlug || notes.reportId || 'premium-kundali',
          reportTitle: notes.reportTitle || meta.description || 'Karam Kundali Report',
          amount: Number(p.amount) || 501,
          paymentId: p.gatewayRef || undefined,
          orderId: p.gatewayOrderId || undefined,
          paymentStatus: p.status === 'SUCCESS' ? 'PAID' : 'PENDING',
          dispatchStatus: 'PENDING',
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        })
      }
    }
  } catch (err) {
    // Database query skipped if unavailable
  }

  // Merge all sources without duplicates
  const map = new Map<string, HoroscopeOrderData>()

  // Priority: File orders > DB Backup orders > DB Payment orders > In-memory
  for (const o of dbPaymentOrders) {
    map.set(o.id, o)
  }
  for (const o of dbBackupOrders) {
    map.set(o.id, o)
  }
  for (const o of fileOrders) {
    map.set(o.id, o)
  }
  for (const o of globalForOrders.horoscopeOrders) {
    map.set(o.id, o)
  }

  const merged = Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  globalForOrders.horoscopeOrders = merged
  return merged
}

export async function updateHoroscopeDispatchStatus(
  id: string,
  status: HoroscopeOrderData['dispatchStatus']
) {
  const allOrders = await getAllHoroscopeOrders()
  const order = allOrders.find((o) => o.id === id)
  if (order) {
    order.dispatchStatus = status
    order.updatedAt = new Date().toISOString()
    writeToFile(allOrders)

    try {
      await prisma.websiteSetting.upsert({
        where: { key: 'horoscope_custom_orders' },
        update: { value: allOrders as any },
        create: { key: 'horoscope_custom_orders', value: allOrders as any },
      })
    } catch {}

    return order
  }
  return null
}
