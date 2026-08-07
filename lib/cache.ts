import { unstable_cache } from 'next/cache'
import { prisma } from './prisma'

// Fetch public pujas list with caching
export const getCachedPujas = unstable_cache(
  async () => {
    try {
      const pujas = await prisma.puja.findMany({
        where: { 
          status: 'PUBLISHED'
        },
        select: {
          id: true,
          name: true,
          slug: true,
          coverImage: true,
          price: true,
          vipPrice: true,
          isVip: true,
          isOnline: true,
          isEvergreen: true,
          isFestival: true,
          pujaDate: true,
          location: true,
          shortDescription: true,
          category: {
            select: {
              id: true,
              name: true
            }
          },
          temple: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
      
      return JSON.parse(JSON.stringify(pujas.map(p => ({
        ...p,
        price: Number(p.price),
        vipPrice: p.vipPrice ? Number(p.vipPrice) : null
      }))))
    } catch (err) {
      return []
    }
  },
  ['pujas-list-v2'],
  {
    revalidate: 60,
    tags: ['pujas']
  }
)


export const getCachedNormalPujas = async () => {
  const allPujas = await getCachedPujas()
  return allPujas.filter((p: any) => !p.isVip)
}



export const getCachedVipPujas = async () => {
  const allPujas = await getCachedPujas()
  return allPujas.filter((p: any) => !!p.isVip)
}

// Cache home page products list
export const getCachedProducts = unstable_cache(
  async () => {
    try {
      const products = await prisma.product.findMany({
        where: { status: 'ACTIVE' },
        take: 8,
        select: {
          id: true,
          name: true,
          slug: true,
          coverImage: true,
          images: true,
          price: true,
          salePrice: true,
          shortDescription: true,
          category: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
      return products.map(p => ({
        ...p,
        price: Number(p.price),
        salePrice: p.salePrice ? Number(p.salePrice) : null
      }))
    } catch (err) {
      return []
    }
  },
  ['home-products-list-v2'],
  {
    revalidate: 300,
    tags: ['products']
  }
)

// Cache home page testimonials
export const getCachedTestimonials = unstable_cache(
  async () => {
    try {
      return await prisma.testimonial.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          location: true,
          rating: true,
          message: true,
          avatar: true
        },
        orderBy: { createdAt: 'desc' },
        take: 6
      })
    } catch (err) {
      return []
    }
  },
  ['home-testimonials-list-v2'],
  {
    revalidate: 300,
    tags: ['testimonials']
  }
)

// Cache hero sliders (real-time revalidation)
export const getCachedHeroSlides = unstable_cache(
  async () => {
    try {
      const slides = await prisma.heroSlider.findMany({
        where: { isActive: true },
        select: {
          id: true,
          image: true,
          title: true,
          subtitle: true,
          ctaUrl: true,
          ctaText: true,
          order: true,
          isActive: true
        },
        orderBy: { order: 'asc' }
      })
      return slides.map(s => ({
        ...s,
        link: s.ctaUrl,
        buttonText: s.ctaText
      }))
    } catch (err) {
      return []
    }
  },
  ['home-hero-slides-v2'],
  {
    revalidate: false,
    tags: ['hero-slides']
  }
)

// Cache home page media libraries
export const getCachedHomePageMedia = unstable_cache(
  async () => {
    try {
      const [pastPujas, customerReviews, festivalEvents, dbVideosRaw, dbGalleries] = await Promise.all([
        prisma.mediaLibrary.findMany({
          where: { folder: 'Past Puja' },
          select: { id: true, url: true, filename: true, type: true },
          orderBy: { createdAt: 'desc' },
          take: 10
        }).catch(() => []),
        prisma.mediaLibrary.findMany({
          where: { folder: 'Customer Review' },
          select: { id: true, url: true, filename: true },
          orderBy: { createdAt: 'desc' },
          take: 12
        }).catch(() => []),
        prisma.mediaLibrary.findMany({
          where: { folder: 'Festival Event' },
          select: { id: true, url: true, filename: true },
          orderBy: { createdAt: 'desc' },
          take: 5
        }).catch(() => []),
        prisma.mediaLibrary.findMany({
          where: {
            OR: [
              { type: 'VIDEO' },
              { folder: { in: ['Home Video', 'Live Darshan', 'Past Puja', 'Aarti & Bhajan', 'Customer Review', 'Video Gallery'] } }
            ]
          },
          select: { id: true, url: true, filename: true, folder: true, type: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 5
        }).catch(() => []),
        prisma.gallery.findMany({
          where: { isActive: true },
          select: { id: true, coverImage: true, title: true, type: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 20
        }).catch(() => [])
      ])
      return { pastPujas, customerReviews, festivalEvents, dbVideosRaw, dbGalleries }
    } catch (err) {
      return { pastPujas: [], customerReviews: [], festivalEvents: [], dbVideosRaw: [], dbGalleries: [] }
    }
  },
  ['home-page-media-v2'],
  {
    revalidate: 300,
    tags: ['media']
  }
)
