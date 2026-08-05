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

export function sanitizeSlug(input: string): string {
  if (!input || typeof input !== 'string') return ''
  let str = input.trim()
  // Remove protocol e.g. http:// or https://
  str = str.replace(/^https?:\/\//i, '')
  // Remove domain names e.g. divyayagyam.com, www.divyayagyam.com, localhost:3000, etc.
  str = str.replace(/^(?:[a-z0-9-]+\.)+[a-z]{2,}(?::\d+)?\/?/i, '')
  // Remove leading blog/ or /blog/
  str = str.replace(/^\/?blog\//i, '')
  // Perform standard slugify
  return slugify(str)
}


export function generateShortSlug(str: string, maxLen = 45) {
  if (!str) return '';
  // Remove filler words and marketing slogan fluff to create concise, clean, SEO-friendly URLs
  const cleanStr = str
    .toLowerCase()
    .replace(/\b(ultimate|protection|victory|success|best|guaranteed|power|powerful|supreme|top|exclusive|special|complete|full|live|online|for|and|with|the|in|at|of|to|by|a|an|or|is|are|divyayagyam)\b/gi, ' ')
    .replace(/\s+/g, ' ')
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

/**
 * Converts a Google Drive share/view link to a PRIVATE proxy-safe preview URL.
 * - Does NOT expose the user's Google Drive to visitors.
 * - Opens the file in Google's embedded PDF viewer (no Drive UI shown).
 * - Works for PDFs, Docs, etc.
 */
export function convertGoogleDrivePdfUrl(url: string): string {
  if (!url || typeof url !== 'string') return url

  // Already a direct download or embed link — return as-is
  if (url.includes('uc?export=download') || url.includes('export=view') || url.includes('drive.google.com/uc')) {
    return url
  }

  let id = ''
  // Match: /file/d/FILE_ID/view or /file/d/FILE_ID
  const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (fileDMatch?.[1]) {
    id = fileDMatch[1]
  } else {
    // Match: ?id=FILE_ID or &id=FILE_ID
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (idMatch?.[1]) id = idMatch[1]
  }

  if (id) {
    // Use Google's embedded preview — shows PDF inside browser without opening Drive
    // Privacy-safe: visitor cannot see your Drive folder/account
    return `https://drive.google.com/file/d/${id}/preview`
  }
  return url
}

export function getSafeImageUrl(url?: string | null, fallback = DEFAULT_PLACEHOLDER_IMAGE): string {
  if (!url || typeof url !== 'string' || !url.trim()) return fallback
  const trimmed = url.trim()
  if (trimmed.includes('/drive/folders/')) {
    return fallback
  }
  const converted = convertGoogleDriveUrl(trimmed)
  return converted || fallback
}

export async function compressImage(file: File, options?: any): Promise<File> {
  if (!file.type.startsWith('image/')) return file
  
  // High-performance client-side WebP compression & box-fitting canvas pipeline
  try {
    const maxWidthOrHeight = options?.maxWidthOrHeight || 1400
    const quality = options?.quality || 0.80
    const outputType = 'image/webp'

    return await new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new window.Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          // Fit dimensions proportionally within box limits
          if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
            if (width > height) {
              height = Math.round((height * maxWidthOrHeight) / width)
              width = maxWidthOrHeight
            } else {
              width = Math.round((width * maxWidthOrHeight) / height)
              height = maxWidthOrHeight
            }
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            resolve(file)
            return
          }

          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, width, height)
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp"
                const compressedFile = new File([blob], newName, {
                  type: outputType,
                  lastModified: Date.now(),
                })
                resolve(compressedFile)
              } else {
                resolve(file)
              }
            },
            outputType,
            quality
          )
        }
        img.onerror = () => resolve(file)
      }
      reader.onerror = () => resolve(file)
    })
  } catch (err) {
    console.warn('Native canvas WebP compression failed:', err)
    return file
  }
}


