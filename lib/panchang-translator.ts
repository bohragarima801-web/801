// Panchang English to Hindi Translation Dictionary & Utility

const DAYS_MAP: Record<string, string> = {
  sunday: "रविवार",
  monday: "सोमवार",
  tuesday: "मंगलवार",
  wednesday: "बुधवार",
  thursday: "गुरुवार",
  friday: "शुक्रवार",
  saturday: "शनिवार",
}

const MONTHS_MAP: Record<string, string> = {
  shravana: "श्रावण",
  sravana: "श्रावण",
  bhadrapada: "भाद्रपद",
  bhadra: "भाद्रपद",
  ashvina: "आश्विन",
  ashwin: "आश्विन",
  kartika: "कार्तिक",
  karthika: "कार्तिक",
  margashirsha: "मार्गशीर्ष",
  pausha: "पौष",
  pousha: "पौष",
  magha: "माघ",
  phalguna: "फाल्गुन",
  chaitra: "चैत्र",
  vaishakha: "वैशाख",
  vaisakha: "वैशाख",
  jyeshtha: "ज्येष्ठ",
  jyestha: "ज्येष्ठ",
  ashadha: "आषाढ़",
  asadha: "आषाढ़",
}

const PAKSHA_MAP: Record<string, string> = {
  "shukla paksha": "शुक्ल पक्ष",
  shukla: "शुक्ल पक्ष",
  "krishna paksha": "कृष्ण पक्ष",
  krishna: "कृष्ण पक्ष",
}

const TITHI_KEYWORDS: Record<string, string> = {
  pratipada: "प्रतिपदा",
  dwitiya: "द्वितीया",
  tritiya: "तृतीया",
  chaturthi: "चतुर्थी",
  panchami: "पंचमी",
  shasthi: "षष्ठी",
  shashti: "षष्ठी",
  saptami: "सप्तमी",
  ashtami: "अष्टमी",
  navami: "नवमी",
  dashami: "दशमी",
  ekadashi: "एकादशी",
  dwadashi: "द्वादशी",
  trayodashi: "त्रयोदशी",
  chaturdashi: "चतुर्दशी",
  purnima: "पूर्णिमा",
  amavasya: "अमावस्या",
  "up to": "तक",
}

const NAKSHATRA_MAP: Record<string, string> = {
  ashwini: "अश्विनी",
  bharani: "भरणी",
  krittika: "कृत्तिका",
  rohini: "रोहिणी",
  mrigashira: "मृगशिरा",
  ardra: "आर्द्रा",
  punarvasu: "पुनर्वसु",
  pushya: "पुष्य",
  ashlesha: "अश्लेषा",
  magha: "मघा",
  "purva phalguni": "पूर्वाफाल्गुनी",
  "uttara phalguni": "उत्तराफाल्गुनी",
  hasta: "हस्त",
  chitra: "चित्रा",
  swati: "स्वाति",
  vishakha: "विशाखा",
  anuradha: "अनुराधा",
  jyeshtha: "ज्येष्ठा",
  mula: "मूल",
  "purva ashadha": "पूर्वाषाढा",
  "uttara ashadha": "उत्तराषाढा",
  shravana: "श्रवण",
  dhanishta: "धनिष्ठा",
  shatabhisha: "शतभिषा",
  "purva bhadrapada": "पूर्वाभाद्रपद",
  "uttara bhadrapada": "उत्तराभाद्रपद",
  revati: "रेवती",
}

const YOG_MAP: Record<string, string> = {
  vishkambha: "विष्कुम्भ",
  priti: "प्रीति",
  ayushman: "आयुष्मान",
  saubhagya: "सौभाग्य",
  sobhana: "शोभन",
  atiganda: "अतिगण्ड",
  sukarma: "सुकर्मा",
  dhriti: "धृति",
  shool: "शूल",
  ganda: "गण्ड",
  vriddhi: "वृद्धि",
  dhruva: "ध्रुव",
  vyaghat: "व्याघात",
  harshan: "हर्षण",
  vajra: "वज्र",
  siddhi: "सिद्धि",
  vyatipat: "व्यतीपात",
  variyan: "वरीयान्",
  parigha: "परिघ",
  shiva: "शिव",
  siddha: "सिद्ध",
  sadhya: "साध्य",
  shubha: "शुभ",
  shukla: "शुक्ल",
  brahma: "ब्रह्म",
  indra: "इन्द्र",
  vaidhriti: "वैधृति",
}

const KARAN_MAP: Record<string, string> = {
  bava: "बव",
  balava: "बालव",
  kaulava: "कौलव",
  taitila: "तैतिल",
  garaja: "गरज",
  vanija: "वणिज",
  vishti: "विष्टि (भद्रा)",
  shakuni: "शकुनि",
  chatushpada: "चतुष्पाद",
  naga: "नाग",
  kintughna: "किंस्तुघ्न",
}

export function translateDay(val?: string | null): string {
  if (!val) return ''
  const key = val.trim().toLowerCase()
  return DAYS_MAP[key] || val
}

export function translateMonth(val?: string | null): string {
  if (!val) return ''
  const key = val.trim().toLowerCase()
  return MONTHS_MAP[key] || val
}

export function translatePaksha(val?: string | null): string {
  if (!val) return ''
  const key = val.trim().toLowerCase()
  return PAKSHA_MAP[key] || val
}

export function translateTithi(val?: string | null): string {
  if (!val) return ''
  let result = val
  Object.entries(TITHI_KEYWORDS).forEach(([en, hi]) => {
    const reg = new RegExp(`\\b${en}\\b`, 'gi')
    result = result.replace(reg, hi)
  })
  return result
}

export function translateNakshatra(val?: string | null): string {
  if (!val) return ''
  let result = val
  Object.entries(NAKSHATRA_MAP).forEach(([en, hi]) => {
    const reg = new RegExp(`\\b${en}\\b`, 'gi')
    result = result.replace(reg, hi)
  })
  return result
}

export function translateYog(val?: string | null): string {
  if (!val) return ''
  const key = val.trim().toLowerCase()
  return YOG_MAP[key] || val
}

export function translateKaran(val?: string | null): string {
  if (!val) return ''
  const key = val.trim().toLowerCase()
  return KARAN_MAP[key] || val
}

export function translateFestival(val?: string | null): string {
  if (!val) return ''
  if (val.trim().toLowerCase() === 'normal day') return 'सामान्य दिन'
  return val
}

const CATEGORY_MAP: Record<string, string> = {
  "major festival": "मुख्य त्योहार",
  festival: "त्योहार",
  vrat: "व्रत",
  jayanti: "जयंती",
  ekadashi: "एकादशी",
  purnima: "पूर्णिमा",
  amavasya: "अमावस्या",
  pradosh: "प्रदोष व्रत",
  sankashti: "संकष्टी चतुर्थी",
  grahan: "ग्रहण",
  eclipse: "सूर्य / चंद्र ग्रहण",
}

export function translateCategory(val?: string | null): string {
  if (!val) return ''
  const key = val.trim().toLowerCase()
  return CATEGORY_MAP[key] || val
}

