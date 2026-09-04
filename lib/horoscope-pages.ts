import fs from 'fs'
import path from 'path'
import prisma from '@/lib/prisma'
import { ALL_ASTRO_REPORTS, type AstroReportDetail } from '@/lib/astro-data'

export interface HoroscopeMediaItem {
  id: string
  url: string
  title?: string
  type?: 'image' | 'video'
}

export interface HoroscopeRazorpayConfig {
  enabled: boolean
  amount?: number
  paymentLink?: string
  buttonText?: string
}

export interface HoroscopeCustomPage {
  id: string
  title: string
  slug: string
  subtitle?: string
  description?: string
  tagline?: string
  categories?: string[]
  price?: number
  originalPrice?: number
  pages?: number
  rating?: number
  reviewCount?: number
  badge?: string
  badgeColor?: string
  coverArtwork?: string
  customCode: string
  layout: 'container' | 'fullwidth' | 'clean'
  headerBanner: boolean
  showBookingBar: boolean
  whatsappNumber?: string
  images?: HoroscopeMediaItem[]
  videos?: HoroscopeMediaItem[]
  razorpay?: HoroscopeRazorpayConfig
  status: 'PUBLISHED' | 'DRAFT'
  createdAt: string
  updatedAt: string
  highlights?: string[]
  chapters?: { number: string; title: string; desc: string }[]
  samplePages?: { title: string; desc: string }[]
  faqs?: { q: string; a: string }[]
}

// Memory cache
const globalForPages = global as unknown as { horoscopeCustomPages?: HoroscopeCustomPage[] }
if (!globalForPages.horoscopeCustomPages) {
  globalForPages.horoscopeCustomPages = []
}

// Local JSON store path
const DATA_DIR = path.join(process.cwd(), 'data')
const FILE_PATH = path.join(DATA_DIR, 'horoscope-pages.json')

function getSeedFromBuiltInReports(): HoroscopeCustomPage[] {
  const now = new Date().toISOString()
  return ALL_ASTRO_REPORTS.map((r: AstroReportDetail) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    subtitle: r.subtitle,
    description: r.description,
    tagline: r.tagline,
    categories: r.categories || ['All', 'Life'],
    price: r.price,
    originalPrice: r.originalPrice,
    pages: r.pages,
    rating: r.rating || 4.9,
    reviewCount: r.reviewCount || 1200,
    badge: r.badge || '',
    badgeColor: r.badgeColor || '',
    coverArtwork: r.coverArtwork || 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
    customCode: '',
    layout: 'container' as const,
    headerBanner: true,
    showBookingBar: true,
    whatsappNumber: '919530401984',
    images: [],
    videos: [],
    razorpay: {
      enabled: true,
      amount: r.price,
      buttonText: `Get ${r.title} (₹${r.price})`
    },
    status: 'PUBLISHED' as const,
    createdAt: now,
    updatedAt: now,
    highlights: r.highlights || [],
    chapters: r.chapters || [],
    samplePages: r.samplePages || [],
    faqs: r.faqs || []
  }))
}

function readFromFile(): HoroscopeCustomPage[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    if (fs.existsSync(FILE_PATH)) {
      const raw = fs.readFileSync(FILE_PATH, 'utf8')
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.error('Error reading horoscope pages from file:', e)
  }
  return []
}

function writeToFile(pages: HoroscopeCustomPage[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(pages, null, 2), 'utf8')
  } catch (e) {
    console.error('Error writing horoscope pages to file:', e)
  }
}

export async function getAllHoroscopePages(): Promise<HoroscopeCustomPage[]> {
  // 1. Try file
  let filePages = readFromFile()
  if (filePages.length > 0) {
    globalForPages.horoscopeCustomPages = filePages
    return filePages
  }

  // 2. Try DB fallback (website_settings table)
  try {
    const setting = await prisma.websiteSetting.findUnique({
      where: { key: 'horoscope_custom_pages' }
    })
    if (setting && Array.isArray(setting.value) && (setting.value as any).length > 0) {
      const dbPages = setting.value as unknown as HoroscopeCustomPage[]
      globalForPages.horoscopeCustomPages = dbPages
      writeToFile(dbPages)
      return dbPages
    }
  } catch (e) {
    // Database might not be connected in dev/build
  }

  // 3. Auto-seed from built-in reports if empty
  const seeded = getSeedFromBuiltInReports()
  globalForPages.horoscopeCustomPages = seeded
  writeToFile(seeded)
  return seeded
}

export async function getHoroscopePageBySlug(slug: string): Promise<HoroscopeCustomPage | null> {
  const all = await getAllHoroscopePages()
  const normalized = slug.trim().toLowerCase()
  return all.find(p => p.slug.trim().toLowerCase() === normalized && p.status === 'PUBLISHED') || null
}

export async function getHoroscopePageById(id: string): Promise<HoroscopeCustomPage | null> {
  const all = await getAllHoroscopePages()
  return all.find(p => p.id === id) || null
}

export async function saveHoroscopePage(data: Partial<HoroscopeCustomPage> & { title: string }): Promise<HoroscopeCustomPage> {
  const all = await getAllHoroscopePages()
  const now = new Date().toISOString()
  
  // Format slug
  let slug = (data.slug || data.title)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  if (!slug) slug = `page-${Date.now()}`

  let page: HoroscopeCustomPage

  if (data.id) {
    const existingIndex = all.findIndex(p => p.id === data.id)
    if (existingIndex >= 0) {
      page = {
        ...all[existingIndex],
        ...data,
        slug,
        title: data.title,
        subtitle: data.subtitle !== undefined ? data.subtitle : all[existingIndex].subtitle,
        description: data.description !== undefined ? data.description : (data.subtitle || all[existingIndex].description),
        price: data.price !== undefined ? Number(data.price) : all[existingIndex].price,
        originalPrice: data.originalPrice !== undefined ? Number(data.originalPrice) : all[existingIndex].originalPrice,
        pages: data.pages !== undefined ? Number(data.pages) : all[existingIndex].pages,
        categories: data.categories || all[existingIndex].categories || ['All', 'Life'],
        badge: data.badge !== undefined ? data.badge : all[existingIndex].badge,
        badgeColor: data.badgeColor !== undefined ? data.badgeColor : all[existingIndex].badgeColor,
        customCode: data.customCode !== undefined ? data.customCode : all[existingIndex].customCode,
        layout: data.layout || all[existingIndex].layout || 'container',
        headerBanner: data.headerBanner ?? all[existingIndex].headerBanner ?? true,
        showBookingBar: data.showBookingBar ?? all[existingIndex].showBookingBar ?? true,
        whatsappNumber: data.whatsappNumber || all[existingIndex].whatsappNumber || '919530401984',
        images: data.images || all[existingIndex].images || [],
        videos: data.videos || all[existingIndex].videos || [],
        razorpay: data.razorpay || all[existingIndex].razorpay || { enabled: false },
        status: data.status || all[existingIndex].status || 'PUBLISHED',
        updatedAt: now
      }
      all[existingIndex] = page
    } else {
      page = {
        id: data.id,
        title: data.title,
        slug,
        subtitle: data.subtitle || '',
        description: data.description || data.subtitle || '',
        tagline: data.tagline || data.subtitle || '',
        price: data.price !== undefined ? Number(data.price) : 199,
        originalPrice: data.originalPrice !== undefined ? Number(data.originalPrice) : 499,
        pages: data.pages !== undefined ? Number(data.pages) : 24,
        rating: data.rating || 4.9,
        reviewCount: data.reviewCount || 1200,
        categories: data.categories || ['All', 'Life'],
        badge: data.badge || '',
        badgeColor: data.badgeColor || '',
        coverArtwork: data.coverArtwork || 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
        customCode: data.customCode || '',
        layout: data.layout || 'container',
        headerBanner: data.headerBanner ?? true,
        showBookingBar: data.showBookingBar ?? true,
        whatsappNumber: data.whatsappNumber || '919530401984',
        images: data.images || [],
        videos: data.videos || [],
        razorpay: data.razorpay || { enabled: false },
        status: data.status || 'PUBLISHED',
        createdAt: now,
        updatedAt: now
      }
      all.unshift(page)
    }
  } else {
    // Ensure slug uniqueness for new pages
    let finalSlug = slug
    let counter = 1
    while (all.some(p => p.slug === finalSlug)) {
      finalSlug = `${slug}-${counter++}`
    }

    page = {
      id: `hpage_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      title: data.title,
      slug: finalSlug,
      subtitle: data.subtitle || '',
      description: data.description || data.subtitle || '',
      tagline: data.tagline || data.subtitle || '',
      price: data.price !== undefined ? Number(data.price) : 199,
      originalPrice: data.originalPrice !== undefined ? Number(data.originalPrice) : 499,
      pages: data.pages !== undefined ? Number(data.pages) : 24,
      rating: data.rating || 4.9,
      reviewCount: data.reviewCount || 1200,
      categories: data.categories || ['All', 'Life'],
      badge: data.badge || '',
      badgeColor: data.badgeColor || '',
      coverArtwork: data.coverArtwork || 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
      customCode: data.customCode || '',
      layout: data.layout || 'container',
      headerBanner: data.headerBanner ?? true,
      showBookingBar: data.showBookingBar ?? true,
      whatsappNumber: data.whatsappNumber || '919530401984',
      images: data.images || [],
      videos: data.videos || [],
      razorpay: data.razorpay || { enabled: false },
      status: data.status || 'PUBLISHED',
      createdAt: now,
      updatedAt: now
    }
    all.unshift(page)
  }

  // Update memory & file
  globalForPages.horoscopeCustomPages = all
  writeToFile(all)

  // Sync to database asynchronously
  try {
    await prisma.websiteSetting.upsert({
      where: { key: 'horoscope_custom_pages' },
      create: {
        key: 'horoscope_custom_pages',
        value: all as any,
        group: 'cms'
      },
      update: {
        value: all as any
      }
    })
  } catch (e) {
    // Silent fallback
  }

  return page
}

export async function deleteHoroscopePage(id: string): Promise<boolean> {
  const all = await getAllHoroscopePages()
  const filtered = all.filter(p => p.id !== id)
  if (filtered.length !== all.length) {
    globalForPages.horoscopeCustomPages = filtered
    writeToFile(filtered)
    try {
      await prisma.websiteSetting.upsert({
        where: { key: 'horoscope_custom_pages' },
        create: { key: 'horoscope_custom_pages', value: filtered as any, group: 'cms' },
        update: { value: filtered as any }
      })
    } catch (e) {}
    return true
  }
  return false
}
