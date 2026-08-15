// Vedic & Multilingual Slug Generator
// Converts Hindi (Devanagari) & English titles into clean, URL-safe SEO slugs

const HINDI_TO_ROMAN_MAP: Record<string, string> = {
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ri',
  'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'an', 'अः': 'ah',
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
  'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
  'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
  'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
  'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
  'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
  'क्ष': 'ksh', 'त्र': 'tr', 'ज्ञ': 'gya',
  'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'ृ': 'ri', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
  'ं': 'n', 'ँ': 'n', 'ः': 'h', '्': '', '़': '',
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
}

// Common Vedic and astrological keywords mapping for clean English URLs
const VEDIC_KEYWORD_MAP: Record<string, string> = {
  'गणेश': 'ganesh',
  'प्रश्नावली': 'prashnavali',
  'कुंडली': 'kundali',
  'मिलान': 'milan',
  'पंचांग': 'panchang',
  'मुहूर्त': 'muhurat',
  'राहुकाल': 'rahu-kaal',
  'चौघड़िया': 'choghadiya',
  'होरा': 'hora',
  'दैनिक': 'dainik',
  'शुभ': 'shubh',
  'समय': 'samay',
  'कैलकुलेटर': 'calculator',
  'जाप': 'japa',
  'माला': 'mala',
  'रत्न': 'ratna',
  'परामर्श': 'suggestion',
  'अंक': 'ank',
  'ज्योतिष': 'jyotish',
  'सिद्ध': 'siddha',
  'वैदिक': 'vedic',
  'महा': 'maha',
  'ग्रह': 'graha',
  'दोष': 'dosha',
  'राशि': 'rashi',
  'नक्षत्र': 'nakshatra',
  'व्रत': 'vrat',
  'त्योहार': 'festivals'
}

export function slugify(input: string): string {
  if (!input) return ''

  let text = input.trim().toLowerCase()

  // 1. Replace known keywords first for cleaner English URLs
  Object.keys(VEDIC_KEYWORD_MAP).forEach((key) => {
    const regex = new RegExp(key, 'g')
    text = text.replace(regex, `-${VEDIC_KEYWORD_MAP[key]}-`)
  })

  // 2. Transliterate remaining Devanagari characters
  let transliterated = ''
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (HINDI_TO_ROMAN_MAP[char] !== undefined) {
      transliterated += HINDI_TO_ROMAN_MAP[char]
    } else {
      transliterated += char
    }
  }

  // 3. Clean up standard alphanumeric characters and hyphens
  let slug = transliterated
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // remove non-word chars
    .replace(/[\s_-]+/g, '-') // collapse whitespace and underscores to single hyphen
    .replace(/^-+|-+$/g, '') // trim leading/trailing hyphens

  // 4. Ensure we never return an empty slug
  if (!slug || slug.length === 0) {
    slug = `tool-${Math.floor(100000 + Math.random() * 900000)}`
  }

  return slug
}
