export interface AstroReportDetail {
  id: string
  numericId: string
  slug: string
  title: string
  subtitle: string
  tagline: string
  categories: string[]
  badge?: string
  badgeColor?: string
  price: number
  originalPrice: number
  pages: number
  rating: number
  reviewCount: number
  description: string
  coverArtwork: string
  samplePages: { title: string; desc: string }[]
  chapters: { number: string; title: string; desc: string }[]
  highlights: string[]
  faqs: { q: string; a: string }[]
}

export const ALL_ASTRO_REPORTS: AstroReportDetail[] = [
  {
    id: 'love-chart',
    numericId: '1',
    slug: 'love-chart',
    title: 'Love chart',
    subtitle: 'Your 7th house read in full — who you attract, when marriage is indicated, and what makes it last.',
    tagline: 'Deep Vedic Relationship & 7th House Compatibility Blueprint',
    categories: ['All', 'Life', 'Marriage'],
    price: 199,
    originalPrice: 499,
    pages: 24,
    rating: 4.9,
    reviewCount: 1420,
    description: 'Your 7th house read in full — who you attract, when marriage is indicated, and what makes it last.',
    coverArtwork: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
    highlights: [
      '7th House & Venus (Shukra) detailed disposition',
      'Spouse characteristics, personality & profession indications',
      'Timing of marriage through Vimshottari Dasha & Jupiter transit',
      'Manglik Dosha analysis and classical cancellation rules',
      'Personalized Vedic relationship remedies and harmony mantras'
    ],
    chapters: [
      { number: '01', title: 'The 7th House & Planetary Rulers', desc: 'Detailed assessment of your 7th house, lord of the 7th house, and aspects on the house of union.' },
      { number: '02', title: 'Spouse Profile & Nature of Attraction', desc: 'Who you attract, intellectual chemistry, physical characteristics, and domestic harmony.' },
      { number: '03', title: 'Timing of Marriage & Significant Milestones', desc: 'Dasha periods and transits that activate marriage and deep partnership commitments.' },
      { number: '04', title: 'Afflictions & Manglik Verification', desc: 'Manglik dosha check in Lagna, Moon, and Venus charts along with neutralising factors.' },
      { number: '05', title: 'Vedic Remedies for Marital Harmony', desc: 'Specific gemstones, fasting days, and mantras to dissolve conflict and strengthen love.' }
    ],
    samplePages: [
      { title: 'Page 4: 7th House Planetary Influences', desc: 'Detailed breakdown of planets posited in the 7th house and their direct relationship effects.' },
      { title: 'Page 8: Spouse Nature & Qualities', desc: 'Behavioral analysis of future spouse derived from Navamsha (D-9) ascendant.' },
      { title: 'Page 15: Marriage Timing Windows', desc: 'Upcoming 3-year timeline indicating the most auspicious months for marriage.' },
      { title: 'Page 22: Scriptural Remedies', desc: 'Daily and weekly rituals to strengthen Venus and remove relationship obstacles.' }
    ],
    faqs: [
      { q: 'Can this report tell me when I will get married?', a: 'Yes. By analyzing your 7th lord, Venus/Jupiter placements, running Mahadasha and Jupiter/Saturn transits, the report highlights the most auspicious windows for marriage.' },
      { q: 'Does this report check for Manglik Dosha?', a: 'Yes, it checks Manglik Dosha from Lagna, Moon, and Venus, and details whether any cancellation rules (Bhanga) apply in your chart.' },
      { q: 'Is this report useful if I am already married?', a: 'Absolutely. It provides profound insight into communication styles, emotional needs, and planetary remedies to deepen marital harmony.' }
    ]
  },
  {
    id: 'health-chart',
    numericId: '2',
    slug: 'health-chart',
    title: 'Health chart',
    subtitle: 'The 6th, 8th and 12th houses read together — your constitution, your vulnerabilities, and when to watch them.',
    tagline: 'Vedic Medical Astrology & Ayurvedic Constitutional Analysis',
    categories: ['All', 'Life', 'Health'],
    price: 199,
    originalPrice: 499,
    pages: 26,
    rating: 4.8,
    reviewCount: 980,
    description: 'The 6th, 8th and 12th houses read together — your constitution, your vulnerabilities, and when to watch them.',
    coverArtwork: 'linear-gradient(135deg, #4E65FF 0%, #92EFFD 100%)',
    highlights: [
      'Ayurvedic constitution (Vata, Pitta, Kapha) based on Ascendant',
      'Trika houses (6th, 8th, 12th) vulnerability mapping',
      'Planetary periods (Dasha) requiring extra vigilance',
      'Vital organs vulnerability assessment',
      'Maha Mrityunjaya & Vedic healing remedies'
    ],
    chapters: [
      { number: '01', title: 'Body Constitution & Elemental Balance', desc: 'Your physical temperament and inherent constitutional strengths mapped to the zodiac.' },
      { number: '02', title: 'The Trika Houses (6th, 8th & 12th)', desc: 'Disease inclinations, chronic vulnerabilities, and recovery patterns.' },
      { number: '03', title: 'Vulnerable Periods & Dasha Mapping', desc: 'Specific months and years when planetary periods require preventive lifestyle care.' },
      { number: '04', title: 'Dietary & Ayurvedic Recommendations', desc: 'Herbs, metals, and lifestyle adjustments aligned with your dominant planets.' },
      { number: '05', title: 'Spiritual Remedies & Maha Mrityunjaya Shield', desc: 'Mantras, charity guidelines, and protective Vedic rituals for longevity.' }
    ],
    samplePages: [
      { title: 'Page 5: Ayurvedic Dosha Distribution', desc: 'Percentage breakdown of Vata, Pitta, and Kapha based on your planetary placements.' },
      { title: 'Page 11: Organ Vulnerability Matrix', desc: 'Specific organs associated with afflicted planets and remedial recommendations.' },
      { title: 'Page 18: Timeline of Sensitive Periods', desc: 'Transit map of Saturn and Rahu alerting you to periods requiring health mindfulness.' },
      { title: 'Page 24: Consecrated Healing Remedies', desc: 'Customized mantra recitations and charitable offerings to mitigate health ailments.' }
    ],
    faqs: [
      { q: 'Can astrology really predict health vulnerabilities?', a: 'Vedic astrology recognizes each planet as governing specific bodily systems and elements. By examining afflictions to these planets, areas of potential vulnerability can be identified early for preventive care.' },
      { q: 'Does this report replace medical advice?', a: 'No, this report provides spiritual and astrological guidance based on classical texts and is intended to complement, not replace, qualified professional healthcare.' }
    ]
  },
  {
    id: 'kundali-dosh',
    numericId: '3',
    slug: 'kundali-dosh',
    title: 'Kundali Dosh report',
    subtitle: 'Identify hidden doshas affecting different areas of your life.',
    tagline: 'Comprehensive Planetary Flaws, Yogas & Scriptural Shanti Solutions',
    categories: ['All', 'Life'],
    price: 199,
    originalPrice: 499,
    pages: 28,
    rating: 4.9,
    reviewCount: 2310,
    description: 'Identify hidden doshas affecting different areas of your life.',
    coverArtwork: 'linear-gradient(135deg, #F37335 0%, #FDC830 100%)',
    highlights: [
      'Kaal Sarp Dosha diagnosis (12 specific varieties)',
      'Pitra Dosha (ancestral debt) identification and symptoms',
      'Manglik, Angarak, and Grahan Yoga check',
      'Kemdrum Yoga and Shani Sade Sati / Dhaiya analysis',
      'Authentic scriptural remedies and temple shanti pujas'
    ],
    chapters: [
      { number: '01', title: 'Kaal Sarp Dosha In-Depth Scan', desc: 'Position of Rahu-Ketu axis, type of Kaal Sarp yoga, and its specific life impacts.' },
      { number: '02', title: 'Pitra Dosha & Karmic Debts', desc: 'Analysis of Sun, 9th house, and 9th lord for ancestral afflictions and delays.' },
      { number: '03', title: 'Manglik & Fire Yogas', desc: 'Mars placement, Angarak dosha (Mars-Rahu), and its mitigation.' },
      { number: '04', title: 'Saturn Afflictions & Shani Sade Sati', desc: 'Current phase of Sade Sati, Dhaiya, and Kantaka Shani with exact relief dates.' },
      { number: '05', title: 'Targeted Shanti Vidhis & Remedies', desc: 'Step-by-step temple pilgrimages, donations, and daily mantras for each dosha.' }
    ],
    samplePages: [
      { title: 'Page 6: Kaal Sarp Category Diagram', desc: 'Visual depiction of all planets hemmed between Rahu and Ketu.' },
      { title: 'Page 12: Pitra Dosh Severity Meter', desc: 'Clear indicators of whether Pitra Dosh affects career, lineage, or peace of mind.' },
      { title: 'Page 20: Sade Sati Timeline 2026-2032', desc: 'Phase-by-phase impact of Saturn transiting your natal Moon.' },
      { title: 'Page 26: Authentic Vedic Shanti Steps', desc: 'Precise ritual recommendations including Shiva Rudrabhishek and Gau Seva.' }
    ],
    faqs: [
      { q: 'What if a dosha has cancellation (Bhanga) in my chart?', a: 'Our report explicitly checks all classical Bhanga rules (like exalted Mars or friendly aspects) so you are not frightened by doshas that have already been cancelled.' },
      { q: 'Are the suggested remedies expensive to perform?', a: 'No. The remedies focus on daily mantras, dietary fasts, donations to the needy, and simple temple visits that anyone can easily perform.' }
    ]
  },
  {
    id: 'monthly-horoscope',
    numericId: '4',
    slug: 'monthly-horoscope',
    title: 'Monthly Horoscope Report',
    subtitle: 'Your month ahead — transit-by-transit, mapped onto your birth chart.',
    tagline: 'Custom 30-Day Predictive Transit Guide',
    categories: ['All', 'Life', 'Career'],
    badge: 'THIS MONTH',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
    price: 199,
    originalPrice: 499,
    pages: 22,
    rating: 4.8,
    reviewCount: 1150,
    description: 'Your month ahead — transit-by-transit, mapped onto your birth chart.',
    coverArtwork: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    highlights: [
      'Day-by-day planetary transits mapped onto your personal ascendant',
      'Peak financial gain & career opportunity days',
      'Sensitive dates requiring caution in communications & travel',
      'New Moon & Full Moon impact on your emotional state',
      'Specific auspicious mantras for the current month'
    ],
    chapters: [
      { number: '01', title: 'Monthly Planetary Weather Overview', desc: 'Key planetary shifts occurring this month and their house-wise triggers.' },
      { number: '02', title: 'Week-by-Week Trajectory', desc: 'Detailed breakdown of week 1 through week 4 across career, money, and personal life.' },
      { number: '03', title: 'High-Impact Days Calendar', desc: 'Green days for new beginnings and investments; yellow days for caution.' },
      { number: '04', title: 'Personalized Daily Focus & Remedies', desc: 'Quick 2-minute daily practices to align with the dominant transit of the month.' }
    ],
    samplePages: [
      { title: 'Page 3: Monthly Transit Wheel', desc: 'Current sky positions overlaid on your natal birth chart.' },
      { title: 'Page 9: Career & Finance Weekly Guide', desc: 'Expected trends in business negotiations and workplace dynamics.' },
      { title: 'Page 16: Auspicious Muhurat Dates', desc: 'Best dates for major purchases, interviews, and spiritual vows.' }
    ],
    faqs: [
      { q: 'How is this different from a newspaper horoscope?', a: 'Newspaper horoscopes are generic for all people of a Sun sign. This report computes actual planetary transits against your exact degree of birth, ascendant, and Moon sign.' }
    ]
  },
  {
    id: 'premium-kundali',
    numericId: '5',
    slug: 'premium-kundali',
    title: 'Personalized Premium Kundali',
    subtitle: 'Your complete Vedic birth chart — charts, dashas, yogas and remedies.',
    tagline: 'The Ultimate 64-Page Vedic Life Companion & Roadmap',
    categories: ['All', 'Life', 'Career', 'Finance'],
    badge: 'MOST DETAILED',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300 font-bold',
    price: 499,
    originalPrice: 1100,
    pages: 64,
    rating: 5.0,
    reviewCount: 3840,
    description: 'Your complete Vedic birth chart — charts, dashas, yogas and remedies.',
    coverArtwork: 'linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)',
    highlights: [
      'Complete 16 Divisional Charts (Shodashvarga: D-1 through D-60)',
      '12 Houses Comprehensive Life Predictions (Finance, Career, Family, Health)',
      'Full 120-Year Vimshottari Mahadasha & Antardasha breakdown',
      'All major planetary Yogas (Raj Yoga, Gajakesari, Budhaditya, Neechbhanga)',
      'Personalized Gemstone, Rudraksha, Lucky Colors, Numbers & Ishta Devta'
    ],
    chapters: [
      { number: '01', title: 'Avakahada Chakra & Birth Fundamentals', desc: 'Panchang details, Nakshatra Pada, Gana, Yoni, Nadi, Varna, and Tattva.' },
      { number: '02', title: 'Shodashvarga (16 Divisional Charts)', desc: 'Full mathematical tables including Navamsha (D-9) and Dashamsha (D-10).' },
      { number: '03', title: 'House-by-House Deep Revelations', desc: 'In-depth predictions for all 12 houses covering every dimension of your life.' },
      { number: '04', title: 'Vimshottari Dasha Analysis', desc: 'Lifelong dasha periods, timing of life peaks, transitions, and spiritual awakening.' },
      { number: '05', title: 'Yogas & Special Combinations', desc: 'Benefic wealth combinations and cautionary yogas present in your horoscope.' },
      { number: '06', title: 'Complete Remedial Prescription', desc: 'Custom gemstones with wearing instructions, suitable Rudrakshas, and mantras.' }
    ],
    samplePages: [
      { title: 'Page 8: Complete Shodashvarga Matrix', desc: 'All 16 charts computed to the exact arcminute.' },
      { title: 'Page 21: Career & Profession (D-10) Reading', desc: 'Best career streams, business acumen, and leadership capacity.' },
      { title: 'Page 38: Wealth & Assets (2nd & 11th House)', desc: 'Financial accumulation, debt tendencies, and investment auspiciousness.' },
      { title: 'Page 52: Full Dasha Life Timeline', desc: 'Chronological timeline of your life divided into planetary chapters.' },
      { title: 'Page 61: Consecrated Gemstone & Rudraksha Guide', desc: 'Exact carat weight, metal, finger, and energizing mantras for your lucky gems.' }
    ],
    faqs: [
      { q: 'Is this suitable for children or adults of all ages?', a: 'Yes. It serves as an authoritative lifelong Vedic document for anyone from newborn babies to senior devotees.' },
      { q: 'How long does it take to prepare 64 pages?', a: 'The mathematical calculations are done by high-speed astronomical algorithms, and the document is compiled and sent to your WhatsApp within minutes.' }
    ]
  },
  {
    id: 'laal-kitaab',
    numericId: '6',
    slug: 'laal-kitaab',
    title: 'Laal Kitaab Report',
    subtitle: 'Simple, powerful Lal Kitab remedies read straight from your chart.',
    tagline: 'Practical Miracle Remedies Rooted in Classical Lal Kitab Grammar',
    categories: ['All', 'Life', 'Health'],
    badge: 'REMEDY-FOCUSED',
    badgeColor: 'bg-red-100 text-red-900 border-red-300 font-bold',
    price: 249,
    originalPrice: 599,
    pages: 30,
    rating: 4.9,
    reviewCount: 1670,
    description: 'Simple, powerful Lal Kitab remedies read straight from your chart.',
    coverArtwork: 'linear-gradient(135deg, #D31027 0%, #EA384D 100%)',
    highlights: [
      'Planetary placements translated into Lal Kitab Farman houses',
      'Identification of "Sleeping" (Soya Hua) houses and planets',
      'Ancestral Debt (Pitr Rin) and Dharmi Teva verification',
      'Extremely effective, low-cost everyday household remedies',
      'Precautions: what items NOT to accept or keep in your home'
    ],
    chapters: [
      { number: '01', title: 'Lal Kitab Horoscope Architecture', desc: 'Permanent house rulers (Pucca Ghar) and sleeping planet analysis.' },
      { number: '02', title: 'Artificial & Malefic Combinations', desc: 'Rahu-Ketu disguised placements and their practical manifestations.' },
      { number: '03', title: 'The 9 Types of Ancestral Debts', desc: 'Signs of past-life debts causing hurdles in money, progeny, or family peace.' },
      { number: '04', title: 'The 40-Day Upayas (Remedies)', desc: 'Clear instructions on water, metal, animal feeding, and color remedies.' },
      { number: '05', title: 'Strict Precautions & Prohibitions', desc: 'Donations to avoid and lifestyle taboos that prevent activation of bad planets.' }
    ],
    samplePages: [
      { title: 'Page 5: Lal Kitab Kundali Chart', desc: 'Fixed house layout with planetary degrees and aspects.' },
      { title: 'Page 14: Sleeping Planet Activation Vidhi', desc: 'How to awaken benefic planets that are dormant in your chart.' },
      { title: 'Page 22: Household Items Caution List', desc: 'Items in your house (electronic scraps, rusted iron, etc.) attracting malefic energy.' },
      { title: 'Page 28: Simple Miracle Remedies', desc: 'Feeding cows, birds, or offering sweets to reverse financial stagnation.' }
    ],
    faqs: [
      { q: 'Why are Lal Kitab remedies so popular?', a: 'Because they do not require expensive pujas or precious gems. They use simple everyday elements like water, copper, feeding animals, and charity to balance planetary vibrations.' }
    ]
  },
  {
    id: 'varshaphal',
    numericId: '7',
    slug: 'varshaphal',
    title: 'Varshaphal Report',
    subtitle: 'Your personal year ahead — the Tajika solar-return forecast.',
    tagline: 'Tajika Vedic Annual Solar Return Blueprint for the Next 12 Months',
    categories: ['All', 'Life', 'Career', 'Finance'],
    badge: 'ANNUAL',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
    price: 299,
    originalPrice: 699,
    pages: 40,
    rating: 4.9,
    reviewCount: 1890,
    description: 'Your personal year ahead — the Tajika solar-return forecast.',
    coverArtwork: 'linear-gradient(135deg, #F2994A 0%, #F2C94C 100%)',
    highlights: [
      'Solar return moment calculated to the exact second of Sun alignment',
      'Muntha position & Muntha Lord analysis for the current year',
      'Varsheshwar (Ruler of the Year) strength and life influence',
      'Month-by-month Tajika 12-month trajectory for career, wealth & health',
      'Annual Saham points (Fortune, Fame, Success, Happiness)'
    ],
    chapters: [
      { number: '01', title: 'The Solar Return Horoscope', desc: 'The exact astronomical moment the Sun returns to your birth longitude.' },
      { number: '02', title: 'Muntha & The Lord of the Year', desc: 'The driving spiritual and material engine for your next 365 days.' },
      { number: '03', title: 'The 16 Tajika Yogas', desc: 'Ithsala, Ishrafa, Nakta, and Yamaya yogas shaping your annual events.' },
      { number: '04', title: 'Month-Wise Detailed Forecast (12 Months)', desc: 'Predictive guide covering every month of your upcoming personal year.' },
      { number: '05', title: 'Sahams (Arabic Parts) Analysis', desc: 'Punya Saham, Vidya Saham, and Karma Saham points of victory.' },
      { number: '06', title: 'Annual Vedic Remedies', desc: 'Specific sankalp pujas and mantras to maximize the auspiciousness of your year.' }
    ],
    samplePages: [
      { title: 'Page 7: Annual Solar Return Chart', desc: 'Varsheshwar candidate selection table with Panchavargiya Bala.' },
      { title: 'Page 15: Muntha House Analysis', desc: 'In which house Muntha lands and what area of life will dominate the year.' },
      { title: 'Page 28: 12-Month Day-Wise Highlights', desc: 'Month-wise breakdown indicating peaks in financial luck and career promotions.' },
      { title: 'Page 36: Tajika Sahams Table', desc: 'Exact degree points where wealth and recognition are stored for this year.' }
    ],
    faqs: [
      { q: 'When is the best time to get a Varshaphal Report?', a: 'Around your birthday or at the beginning of any new year, as it maps the 12-month solar cycle from one birthday to the next.' }
    ]
  }
]

export function getAstroReportByIdOrSlug(idOrSlug: string): AstroReportDetail | undefined {
  const clean = idOrSlug.toLowerCase().trim()
  return ALL_ASTRO_REPORTS.find(
    r => r.slug === clean || r.id === clean || r.numericId === clean
  )
}
