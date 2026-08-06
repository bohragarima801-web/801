import { prisma } from '@/lib/prisma'
import { PujaClientView } from '@/components/puja-client-view'
import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'
import { generatePageMeta } from '@/lib/seo'
import { PujaSchema } from '@/components/seo/PujaSchema'

export const revalidate = 3600; // ISR: Revalidate every 3600s

const defaultFaqs = [
  { question: 'क्या मैं पूजा का वीडियो देख सकूँगा/सकूँगी?', answer: 'हाँ, पूजा सम्पन्न होने के पश्चात 24 से 48 घंटे के भीतर आपके नाम एवं गोत्र उच्चारण का मुख्य संकल्प वीडियो आपके दिए गए WhatsApp एवं Email पर प्रेषित कर दिया जाएगा।' },
  { question: 'प्रसाद घर पहुँचने में कितना समय लगता है?', answer: 'पूजा सम्पन्न होने के अगले कार्यदिवस पर प्रसाद कूरियर द्वारा प्रेषित किया जाता है। भारत में आमतौर पर 4 से 6 दिनों में प्रसाद आपके पते पर सुरक्षित पहुँच जाता है।' },
  { question: 'क्या पूजा के समय मेरा व्यक्तिगत रूप से उपस्थित होना आवश्यक है?', answer: 'नहीं, शास्त्रानुसार संकल्प यजमान के नाम व गोत्र से लिया जाता है। आपकी अनुपस्थिति में भी आचार्यगण पूर्ण विधि-विधान से अनुष्ठान सम्पादित करते हैं।' },
  { question: 'क्या बुकिंग राशि सुरक्षित है और रसीद मिलेगी?', answer: 'जी हाँ, आपकी बुकिंग 100% सुरक्षित है। भुगतान के तुरंत पश्चात आपको डिजिटल रसीद एवं बुकिंग कन्फर्मेशन WhatsApp व Email द्वारा प्राप्त हो जाएगी।' }
]

async function getPujaBySlugOrFallback(slug: string) {
  try {
    // 1. Try exact slug match
    let puja = await prisma.puja.findUnique({
      where: { slug },
      include: {
        category: true,
        temple: true,
        packages: {
          orderBy: { price: 'asc' }
        },
        images: {
          orderBy: { order: 'asc' }
        },
        videos: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    // 2. Fallback: Check if slug is partial or old long slug
    if (!puja) {
      puja = await prisma.puja.findFirst({
        where: {
          OR: [
            { id: slug },
            { slug: { contains: slug.slice(0, 15) } },
            { name: { contains: slug.replace(/-/g, ' '), mode: 'insensitive' } }
          ]
        },
        include: {
          category: true,
          temple: true,
          packages: {
            orderBy: { price: 'asc' }
          },
          images: {
            orderBy: { order: 'asc' }
          },
          videos: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    }

    if (!puja) return null;

    // Deep serialize to plain JSON to prevent Decimal/Date RSC serialization crashes
    return JSON.parse(JSON.stringify(puja));
  } catch (err) {
    console.error("Error fetching puja by slug:", err);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const puja = await getPujaBySlugOrFallback(slug);

  if (!puja) return generatePageMeta({ title: 'Puja Not Found | DivyaYagyam', description: 'The requested puja service is unavailable.', path: `/pujas/${slug}` });

  const title = puja.seoTitle || `${puja.name} — Book Online Puja | DivyaYagyam`
  const description = (puja.seoDescription || puja.shortDescription || puja.description || 'Participate in authentic online puja ritual at sacred temples with video proof on WhatsApp and prasad home delivery.').replace(/<[^>]*>?/gm, '')
  const keywords = puja.seoKeywords ? puja.seoKeywords.split(',').map((k: string) => k.trim()) : undefined

  return generatePageMeta({
    title,
    description,
    path: `/pujas/${puja.slug}`,
    image: puja.coverImage || undefined,
    keywords,
  })
}

export default async function PujaDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const puja = await getPujaBySlugOrFallback(slug);

  if (!puja || puja.status === 'ARCHIVED') {
    notFound()
  }

  // Redirect to canonical short slug if accessed via old long URL or ID
  if (slug !== puja.slug) {
    redirect(`/pujas/${puja.slug}`);
  }

  const faqs = puja.faqs && Array.isArray(puja.faqs) && puja.faqs.length > 0 ? puja.faqs : defaultFaqs;

  return (
    <>
      <PujaSchema puja={puja} faqs={faqs} />
      <PujaClientView puja={{ ...puja, faqs }} />
    </>
  )
}

