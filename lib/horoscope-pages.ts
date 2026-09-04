import fs from 'fs'
import path from 'path'
import prisma from '@/lib/prisma'

export interface HoroscopeCustomPage {
  id: string
  title: string
  slug: string
  subtitle?: string
  customCode: string
  layout: 'container' | 'fullwidth' | 'clean'
  headerBanner: boolean
  showBookingBar: boolean
  whatsappNumber?: string
  status: 'PUBLISHED' | 'DRAFT'
  createdAt: string
  updatedAt: string
}

// Memory cache
const globalForPages = global as unknown as { horoscopeCustomPages?: HoroscopeCustomPage[] }
if (!globalForPages.horoscopeCustomPages) {
  globalForPages.horoscopeCustomPages = []
}

// Local JSON store path
const DATA_DIR = path.join(process.cwd(), 'data')
const FILE_PATH = path.join(DATA_DIR, 'horoscope-pages.json')

function readFromFile(): HoroscopeCustomPage[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    if (fs.existsSync(FILE_PATH)) {
      const raw = fs.readFileSync(FILE_PATH, 'utf8')
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
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
  const filePages = readFromFile()
  if (filePages.length > 0) {
    globalForPages.horoscopeCustomPages = filePages
    return filePages
  }

  // 2. Try DB fallback (website_settings table)
  try {
    const setting = await prisma.websiteSetting.findUnique({
      where: { key: 'horoscope_custom_pages' }
    })
    if (setting && Array.isArray(setting.value)) {
      const dbPages = setting.value as unknown as HoroscopeCustomPage[]
      globalForPages.horoscopeCustomPages = dbPages
      writeToFile(dbPages)
      return dbPages
    }
  } catch (e) {
    // Database might not be connected in dev/build
  }

  return globalForPages.horoscopeCustomPages || []
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

export async function saveHoroscopePage(data: Partial<HoroscopeCustomPage> & { title: string; customCode: string }): Promise<HoroscopeCustomPage> {
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
        updatedAt: now
      }
      all[existingIndex] = page
    } else {
      page = {
        id: data.id,
        title: data.title,
        slug,
        subtitle: data.subtitle || '',
        customCode: data.customCode || '',
        layout: data.layout || 'container',
        headerBanner: data.headerBanner ?? true,
        showBookingBar: data.showBookingBar ?? true,
        whatsappNumber: data.whatsappNumber || '919530401984',
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
      customCode: data.customCode || '',
      layout: data.layout || 'container',
      headerBanner: data.headerBanner ?? true,
      showBookingBar: data.showBookingBar ?? true,
      whatsappNumber: data.whatsappNumber || '919530401984',
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
