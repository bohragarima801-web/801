import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import imageCompression from 'browser-image-compression'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string, currency = 'INR') {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(isNaN(num) ? 0 : num)
}

export function formatDate(date: Date | string, opts?: Intl.DateTimeFormatOptions) {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...opts,
  }).format(d)
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateShortSlug(str: string, maxLen = 35) {
  if (!str) return '';
  // Remove filler words to create concise, clean URLs
  const cleanStr = str
    .toLowerCase()
    .replace(/\b(for|and|with|the|in|at|of|to|by|a|an|or|is|are|live|online|full|complete|special|divyayagyam)\b/gi, ' ')
    .trim();
  
  const fullSlug = slugify(cleanStr.length > 0 ? cleanStr : str);
  if (fullSlug.length <= maxLen) return fullSlug;
  
  // Truncate slug cleanly at word boundary hyphen
  const parts = fullSlug.split('-');
  let shortSlug = '';
  for (const part of parts) {
    if ((shortSlug ? shortSlug + '-' + part : part).length <= maxLen) {
      shortSlug = shortSlug ? shortSlug + '-' + part : part;
    } else {
      break;
    }
  }
  return shortSlug || fullSlug.slice(0, maxLen);
}


export function truncate(str: string, len = 100) {
  if (!str) return ''
  return str.length > len ? str.slice(0, len).trimEnd() + '…' : str
}

export const DEFAULT_PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=800'

export function convertGoogleDriveUrl(url: string) {
  if (!url || typeof url !== 'string') return url
  let id = ''
  const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (fileDMatch && fileDMatch[1]) {
    id = fileDMatch[1]
  } else {
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (idMatch && idMatch[1]) {
      id = idMatch[1]
    }
  }

  if (id) {
    return `https://lh3.googleusercontent.com/d/${id}`
  }
  return url
}

export function getSafeImageUrl(url?: string | null, fallback = DEFAULT_PLACEHOLDER_IMAGE): string {
  if (!url || typeof url !== 'string' || !url.trim()) return fallback
  const converted = convertGoogleDriveUrl(url.trim())
  return converted || fallback
}

export async function compressImage(file: File, options?: any): Promise<File> {
  if (!file.type.startsWith('image/')) return file
  try {
    const defaultOptions = {
      maxSizeMB: 0.3, // Compress to ~300KB
      maxWidthOrHeight: 1200,
      useWebWorker: false, // Disabled because it frequently fails in some environments
      fileType: 'image/webp', // Force WebP conversion
      ...options,
    }
    const compressedBlob = await imageCompression(file, defaultOptions)
    
    // Ensure the filename has a .webp extension
    const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp"
    
    return new File([compressedBlob], newName, {
      type: 'image/webp',
      lastModified: Date.now(),
    })
  } catch (error) {
    console.warn('Image compression failed', error)
    if (file.size > 4 * 1024 * 1024) {
      throw new Error('Image is too large and compression failed. Please choose a smaller image (under 4MB).')
    }
    return file // Fallback to original
  }
}
