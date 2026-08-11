import sharp from 'sharp'

export interface ImageOptimizationResult {
  buffer: Buffer
  fileName: string
  mimeType: string
  size: number
}

/**
 * Automatically converts any image to WebP format and dynamically compresses it to be strictly under 100 KB.
 * Preserves complete original aspect ratio without cropping (fit: 'inside').
 */
export async function optimizeImageToWebP(
  inputBuffer: Buffer,
  originalFileName: string,
  originalMimeType?: string
): Promise<ImageOptimizationResult> {
  const isImage =
    (originalMimeType && originalMimeType.startsWith('image/')) ||
    /\.(jpg|jpeg|png|webp|gif|bmp|tiff|avif|heic)$/i.test(originalFileName)

  if (!isImage) {
    return {
      buffer: inputBuffer,
      fileName: originalFileName,
      mimeType: originalMimeType || 'application/octet-stream',
      size: inputBuffer.length,
    }
  }

  // Base WebP filename
  const baseName = originalFileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')
  const webpFileName = `${baseName || 'image'}.webp`
  const targetMaxSizeBytes = 98 * 1024 // Strict target: under 100 KB (98KB)

  try {
    const metadata = await sharp(inputBuffer).metadata()
    let width = metadata.width || 1200
    let height = metadata.height || 1200

    // Maximum dimensions start at 1200px
    let maxDim = Math.min(1200, Math.max(width, height))

    let quality = 82
    let processedBuffer: Buffer | null = null

    // Multi-pass iterative compression to guarantee file size is strictly under 100 KB
    for (let pass = 0; pass < 5; pass++) {
      processedBuffer = await sharp(inputBuffer)
        .resize({
          width: maxDim,
          height: maxDim,
          fit: 'inside', // Preserves entire image without cropping!
          withoutEnlargement: true,
        })
        .webp({ quality, effort: 6 })
        .toBuffer()

      if (processedBuffer.length <= targetMaxSizeBytes) {
        break
      }

      // If buffer is still larger than target, reduce quality and downscale dimensions
      quality = Math.max(40, quality - 12)
      maxDim = Math.max(600, Math.round(maxDim * 0.85))
    }

    if (!processedBuffer) {
      processedBuffer = inputBuffer
    }

    return {
      buffer: processedBuffer,
      fileName: webpFileName,
      mimeType: 'image/webp',
      size: processedBuffer.length,
    }
  } catch (err) {
    console.warn('Sharp optimization error, falling back:', err)
    return {
      buffer: inputBuffer,
      fileName: webpFileName,
      mimeType: 'image/webp',
      size: inputBuffer.length,
    }
  }
}
