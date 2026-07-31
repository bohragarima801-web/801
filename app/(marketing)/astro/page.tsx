import { PublicPageShell } from '@/components/public-page-shell'
import { generatePageMeta } from '@/lib/seo'

export function generateMetadata() {
  return generatePageMeta({
    title: 'ज्योतिष परामर्श — Vedic Astrology Consultation | DivyaYagyam',
    description: 'वैदिक ज्योतिष परामर्श — कुंडली विश्लेषण, ग्रह दोष निवारण, शुभ मुहूर्त। विद्वान ज्योतिषियों से ऑनलाइन परामर्श।',
    path: '/astro',
  })
}

export const revalidate = 3600; // ISR: Revalidate every 3600s
export default function Page() { return <PublicPageShell badge="🔮 Astrology" title="Astro Reports" subtitle="Kundali • Milan • Numerology • Panchang" cta={{ label: 'Explore Tools', href: '/tools' }} /> }
