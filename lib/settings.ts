import prisma from '@/lib/prisma'

const cache: Record<string, { value: string; expiry: number }> = {}
const CACHE_TTL_MS = 60000 // 1 minute cache

export async function getSetting(key: string, envFallback?: string): Promise<string> {
  const now = Date.now()
  if (cache[key] && cache[key].expiry > now) {
    return cache[key].value
  }

  try {
    const setting = await prisma.websiteSetting.findUnique({
      where: { key }
    })
    if (setting && setting.value) {
      const val = typeof setting.value === 'string' ? setting.value : JSON.stringify(setting.value)
      const cleaned = val.replace(/^"|"$/g, '')
      cache[key] = { value: cleaned, expiry: now + CACHE_TTL_MS }
      return cleaned
    }
  } catch (e) {
    // DB unreachable or table doesn't exist
  }

  if (envFallback) {
    const val = (process.env[envFallback] || '').replace(/^"|"$/g, '')
    cache[key] = { value: val, expiry: now + CACHE_TTL_MS }
    return val
  }
  return ''
}


import { siteConfig as staticSiteConfig } from './site-config'

export async function getDynamicSiteConfig() {
  const name = await getSetting('site.name') || staticSiteConfig.name
  const tagline = await getSetting('site.tagline') || staticSiteConfig.tagline
  const logo = await getSetting('site.logo') || staticSiteConfig.ogImage
  const copyright = await getSetting('site.copyright') || '© 2026 DivyaYagyam. All rights reserved. • हरि ओम् 🙏'
  
  const email = await getSetting('contact.email') || staticSiteConfig.contact.email
  const phone = await getSetting('contact.phone') || staticSiteConfig.contact.phone
  const whatsapp = await getSetting('contact.whatsapp') || staticSiteConfig.contact.whatsapp
  const address = await getSetting('contact.address') || ''
  const googleMap = await getSetting('contact.google_map_url') || ''

  const facebook = await getSetting('socials.facebook') || staticSiteConfig.socials.facebook || ''
  const instagram = await getSetting('socials.instagram') || staticSiteConfig.socials.instagram || ''
  const youtube = await getSetting('socials.youtube') || staticSiteConfig.socials.youtube || ''
  const twitter = await getSetting('socials.twitter') || staticSiteConfig.socials.twitter || ''

  return {
    name,
    tagline,
    logo,
    copyright,
    contact: {
      email,
      phone,
      whatsapp,
      address,
      googleMap
    },
    socials: {
      facebook,
      instagram,
      youtube,
      twitter
    },
    ...staticSiteConfig
  }
}
