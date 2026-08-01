import { calculateRealPanchang } from './real-panchang-engine'

export interface RealFestivalItem {
  id: string
  date: string
  festival: string
  festivalHi: string
  category: string
  categoryHi: string
  significance: string
  significanceHi: string
}

// Authentic Hindu Festival Knowledgebase with astronomical Tithi, Month, and Significance
const FESTIVAL_RULES: Array<{
  match: (p: any, dateObj: Date) => boolean
  festival: string
  festivalHi: string
  category: string
  categoryHi: string
  significance: string
  significanceHi: string
}> = [
  // Fixed Solar / National Festivals
  {
    match: (_, d) => d.getUTCMonth() === 0 && (d.getUTCDate() === 14 || d.getUTCDate() === 15),
    festival: 'Makar Sankranti',
    festivalHi: 'मकर संक्रांति पर्व',
    category: 'Major Festival',
    categoryHi: 'मुख्य त्योहार',
    significance: 'Sun enters Capricorn (Makara Rashi) marking the start of Uttarayana.',
    significanceHi: 'सूर्य देव का धनु राशि से मकर राशि में प्रवेश। उत्तरायण का प्रारंभ, दान-पुण्य एवं स्नान का महापुण्य पर्व।',
  },
  {
    match: (_, d) => d.getUTCMonth() === 0 && d.getUTCDate() === 26,
    festival: 'Republic Day',
    festivalHi: 'गणतंत्र दिवस',
    category: 'National Festival',
    categoryHi: 'राष्ट्रीय पर्व',
    significance: 'Celebration of Indian Constitution and democracy.',
    significanceHi: 'भारतवर्ष का पावन राष्ट्रीय पर्व।',
  },
  {
    match: (_, d) => d.getUTCMonth() === 7 && d.getUTCDate() === 15,
    festival: 'Independence Day',
    festivalHi: 'स्वतंत्रता दिवस',
    category: 'National Festival',
    categoryHi: 'राष्ट्रीय पर्व',
    significance: 'Celebration of Indian Independence.',
    significanceHi: 'भारत का स्वतंत्रता दिवस उत्सव।',
  },

  // Major Tithi Based Festivals
  {
    match: (p) => p.hinduMonthEn === 'Phalguna' && p.pakshaEn === 'Krishna Paksha' && p.tithiEn.includes('Chaturdashi'),
    festival: 'Maha Shivratri Vrat',
    festivalHi: 'महाशिवरात्रि व्रत',
    category: 'Major Festival',
    categoryHi: 'मुख्य त्योहार',
    significance: 'Sacred night dedicated to Lord Shiva and Goddess Parvati.',
    significanceHi: 'भगवान आशुतोष शिव और माता पार्वती का पावन महाव्रत। इस रात्रि जलाभिषेक, रुद्राभिषेक व बेलपत्र अर्पण से मनोकामनाएं पूर्ण होती हैं।',
  },
  {
    match: (p) => p.hinduMonthEn === 'Phalguna' && p.pakshaEn === 'Shukla Paksha' && p.tithiEn.includes('Purnima'),
    festival: 'Holika Dahan / Holi Purnima',
    festivalHi: 'होलिका दहन (होली पूर्णिमा)',
    category: 'Major Festival',
    categoryHi: 'मुख्य त्योहार',
    significance: 'Triumph of Bhakt Prahlad and virtue over evil.',
    significanceHi: 'असत्य पर सत्य और भक्ति की विजय का प्रतीक। होलिका दहन पूजन एवं रंगोत्सव पूर्णिमा।',
  },
  {
    match: (p) => p.hinduMonthEn === 'Chaitra' && p.pakshaEn === 'Shukla Paksha' && p.tithiEn.includes('Pratipada'),
    festival: 'Chaitra Navratri Ghatasthapana / Gudi Padwa',
    festivalHi: 'चैत्र नवरात्रि प्रारम्भ / गुड़ी पड़वा (नव संवत्सर)',
    category: 'Major Festival',
    categoryHi: 'मुख्य त्योहार',
    significance: 'Vedic Hindu New Year (Vikram Samvat) and 9 days Durga Puja start.',
    significanceHi: 'भारतीय नव संवत्सर का शुभारंभ एवं चैत्र नवरात्रि शक्ति उपासना का प्रथम दिन (कलश स्थापना)।',
  },
  {
    match: (p) => p.hinduMonthEn === 'Chaitra' && p.pakshaEn === 'Shukla Paksha' && p.tithiEn.includes('Navami'),
    festival: 'Shri Rama Navami',
    festivalHi: 'श्री राम नवमी जन्मोत्सव',
    category: 'Major Festival',
    categoryHi: 'मुख्य त्योहार',
    significance: 'Birth anniversary of Maryada Purushottam Lord Shri Ram.',
    significanceHi: 'मर्यादा पुरुषोत्तम भगवान श्री राम जी का पावन अवतरण दिवस।',
  },
  {
    match: (p) => p.hinduMonthEn === 'Chaitra' && p.pakshaEn === 'Shukla Paksha' && p.tithiEn.includes('Purnima'),
    festival: 'Hanuman Jayanti',
    festivalHi: 'श्री हनुमान जयंती',
    category: 'Jayanti',
    categoryHi: 'जयंती',
    significance: 'Birth anniversary of Sankat Mochan Shri Hanuman Ji.',
    significanceHi: 'अष्टसिद्धि-नवनिधि के दाता संकटमोचन श्री हनुमान जी का पावन प्राकट्य पर्व।',
  },
  {
    match: (p) => p.hinduMonthEn === 'Vaishakha' && p.pakshaEn === 'Shukla Paksha' && p.tithiEn.includes('Tritiya'),
    festival: 'Akshaya Tritiya',
    festivalHi: 'अक्षय तृतीया (अखातीज)',
    category: 'Major Festival',
    categoryHi: 'मुख्य त्योहार',
    significance: 'Unending auspicious merit, gold purchasing, and sacred endeavors.',
    significanceHi: 'अक्षय पुण्य प्राप्ति का महामुहूर्त। इस दिन किया गया दान, जप व खरीदारी अक्षय फल देती है।',
  },
  {
    match: (p) => p.hinduMonthEn === 'Jyeshtha' && p.pakshaEn === 'Shukla Paksha' && p.tithiEn.includes('Ekadashi'),
    festival: 'Nirjala Ekadashi Vrat',
    festivalHi: 'निर्जला एकादशी (भीमसेनी एकादशी) व्रत',
    category: 'Ekadashi',
    categoryHi: 'एकादशी व्रत',
    significance: 'Waterless fast yielding the spiritual merit of all 24 Ekadashis.',
    significanceHi: 'वर्ष की सबसे बड़ी एकादशी। जल ग्रहण किए बिना रखा जाने वाला महाव्रत।',
  },
  {
    match: (p) => p.hinduMonthEn === 'Ashadha' && p.pakshaEn === 'Shukla Paksha' && p.tithiEn.includes('Purnima'),
    festival: 'Guru Purnima',
    festivalHi: 'गुरु पूर्णिमा (व्यास पूजन)',
    category: 'Major Festival',
    categoryHi: 'मुख्य त्योहार',
    significance: 'Worshipping Gurus and Maharshi Ved Vyas.',
    significanceHi: 'अज्ञान के अंधकार को मिटाने वाले श्री गुरु देव एवं महर्षि वेदव्यास जी के पूजन का पावन पर्व।',
  },
  {
    match: (p) => p.hinduMonthEn === 'Shravana' && p.pakshaEn === 'Shukla Paksha' && p.tithiEn.includes('Panchami'),
    festival: 'Nag Panchami',
    festivalHi: 'नाग पंचमी पर्व',
    category: 'Major Festival',
    categoryHi: 'मुख्य त्योहार',
    significance: 'Worshipping Nag Devta for family protection and Kaal Sarp Dosh peace.',
    significanceHi: 'नाग देवों के पूजन व कालसर्प दोष शांति का पवित्र दिन।',
  },
  {
    match: (p) => p.hinduMonthEn === 'Shravana' && p.pakshaEn === 'Shukla Paksha' && p.tithiEn.includes('Purnima'),
    festival: 'Raksha Bandhan / Shravani Purnima',
    festivalHi: 'रक्षाबंधन (श्रावणी पूर्णिमा)',
    category: 'Major Festival',
    categoryHi: 'मुख्य त्योहार',
    significance: 'Sacred thread festival celebrating bond of brother and sister.',
    significanceHi: 'भाई-बहन के अटूट प्रेम, स्नेह व रक्षासूत्र का पवित्र महापर्व।',
  },
  {
    match: (p) => p.hinduMonthEn === 'Bhadrapada' && p.pakshaEn === 'Krishna Paksha' && p.tithiEn.includes('Ashtami'),
    festival: 'Shri Krishna Janmashtami',
    festivalHi: 'श्री कृष्ण जन्माष्टमी',
    category: 'Major Festival',
    categoryHi: 'मुख्य त्योहार',
    significance: 'Birth anniversary of Yogeshwar Lord Shri Krishna.',
    significanceHi: 'योगेश्वर भगवान श्री कृष्ण जी का रोहिणी नक्षत्र में मध्यरात्रि पावन जन्मोत्सव।',
  },
  {
    match: (p) => p.hinduMonthEn === 'Bhadrapada' && p.pakshaEn === 'Shukla Paksha' && p.tithiEn.includes('Chaturthi'),
    festival: 'Ganesh Chaturthi',
    festivalHi: 'श्री गणेश चतुर्थी महोत्सव',
    category: 'Major Festival',
    categoryHi: 'मुख्य त्योहार',
    significance: 'Welcoming Vighnaharta Lord Ganesha.',
    significanceHi: 'विघ्नहर्ता रिद्धि-सिद्धि के दाता भगवान श्री गणेश जी का जन्मोत्सव एवं स्थापना।',
  },
  {
    match: (p) => p.hinduMonthEn === 'Ashvina' && p.pakshaEn === 'Shukla Paksha' && p.tithiEn.includes('Pratipada'),
    festival: 'Sharad Navratri Ghatasthapana',
    festivalHi: 'शरद नवरात्रि प्रारम्भ',
    category: 'Major Festival',
    categoryHi: 'मुख्य त्योहार',
    significance: '9 Divine nights worshipping Goddess Durga.',
    significanceHi: 'मां भगवती जगदम्बा की 9 दिनों की पावन शक्ति उपासना का प्रारंभ।',
  },
  {
    match: (p) => p.hinduMonthEn === 'Ashvina' && p.pakshaEn === 'Shukla Paksha' && p.tithiEn.includes('Ashtami'),
    festival: 'Maha Durgashtami',
    festivalHi: 'महादुर्गाष्टमी व्रत',
    category: 'Major Festival',
    categoryHi: 'मुख्य त्योहार',
    significance: 'Special fast and Kanya Pujan on 8th day of Navratri.',
    significanceHi: 'नवरात्रि का आठवां दिन, महाअष्टमी पूजन व कन्या भोजन।',
  },
  {
    match: (p) => p.hinduMonthEn === 'Ashvina' && p.pakshaEn === 'Shukla Paksha' && p.tithiEn.includes('Navami'),
    festival: 'Maha Navami / Kanya Pujan',
    festivalHi: 'महानवमी / कन्या पूजन',
    category: 'Major Festival',
    categoryHi: 'मुख्य त्योहार',
    significance: 'Culmination of Navratri with Hawan and Goddess Siddhidatri worship.',
    significanceHi: 'मां सिद्धिदात्री पूजन, हवन व नवरात्रि व्रत का पारण।',
  },
  {
    match: (p) => p.hinduMonthEn === 'Ashvina' && p.pakshaEn === 'Shukla Paksha' && p.tithiEn.includes('Dashami'),
    festival: 'Dussehra (Vijayadashami)',
    festivalHi: 'दशहरा (विजयादशमी)',
    category: 'Major Festival',
    categoryHi: 'मुख्य त्योहार',
    significance: 'Victory of Lord Ram over Ravan.',
    significanceHi: 'अधर्म पर धर्म और असत्य पर सत्य की महान विजय का पर्व।',
  },
  {
    match: (p) => p.hinduMonthEn === 'Kartika' && p.pakshaEn === 'Krishna Paksha' && p.tithiEn.includes('Chaturthi'),
    festival: 'Karwa Chauth Vrat',
    festivalHi: 'करवा चौथ व्रत',
    category: 'Vrat',
    categoryHi: 'व्रत व उपवास',
    significance: 'Fasting by married women for husband longevity and marital bliss.',
    significanceHi: 'पति की दीर्घायु व अखंड सौभाग्य हेतु सुहागिन महिलाओं का निर्जला व्रत एवं चंद्र दर्शन।',
  },
  {
    match: (p) => p.hinduMonthEn === 'Kartika' && p.pakshaEn === 'Krishna Paksha' && p.tithiEn.includes('Trayodashi'),
    festival: 'Dhanteras',
    festivalHi: 'धनतेरस (धन्वंतरि जयंती)',
    category: 'Major Festival',
    categoryHi: 'मुख्य त्योहार',
    significance: 'Worshipping Lord Dhanvantari and Kuber for health and wealth.',
    significanceHi: 'आरोग्य देव धन्वंतरि, कुबेर देव व महालक्ष्मी पूजन तथा धातु खरीदारी का शुभ दिन।',
  },
  {
    match: (p) => p.hinduMonthEn === 'Kartika' && p.pakshaEn === 'Krishna Paksha' && p.tithiEn.includes('Amavasya'),
    festival: 'Deepawali / Lakshmi Puja',
    festivalHi: 'दीपावली (महालक्ष्मी पूजन)',
    category: 'Major Festival',
    categoryHi: 'मुख्य त्योहार',
    significance: 'Grand festival of lights worshipping Goddess Lakshmi and Lord Ganesha.',
    significanceHi: 'महालक्ष्मी, भगवान श्री गणेश व मां सरस्वती पूजन का महान प्रकाशोत्सव।',
  },
  {
    match: (p) => p.hinduMonthEn === 'Kartika' && p.pakshaEn === 'Shukla Paksha' && p.tithiEn.includes('Pratipada'),
    festival: 'Govardhan Puja / Annakut',
    festivalHi: 'गोवर्धन पूजा (अन्नकूट)',
    category: 'Major Festival',
    categoryHi: 'मुख्य त्योहार',
    significance: 'Worshipping Govardhan Giri and Gau Mata.',
    significanceHi: 'भगवान श्री कृष्ण द्वारा गोवर्धन पर्वत धारण व प्रकृति पूजन का पर्व।',
  },
  {
    match: (p) => p.hinduMonthEn === 'Kartika' && p.pakshaEn === 'Shukla Paksha' && p.tithiEn.includes('Dwitiya'),
    festival: 'Bhai Dooj',
    festivalHi: 'भाई दूज (यमा द्वितीया)',
    category: 'Major Festival',
    categoryHi: 'मुख्य त्योहार',
    significance: 'Sisters blessing brothers for health and prosperity.',
    significanceHi: 'यमराज व यमुना जी के स्मरण के साथ बहन द्वारा भाई के मंगल तिलकोत्सव।',
  },
  {
    match: (p) => p.hinduMonthEn === 'Kartika' && p.pakshaEn === 'Shukla Paksha' && p.tithiEn.includes('Shasthi'),
    festival: 'Chhath Puja (Surya Sashthi)',
    festivalHi: 'छठ पूजा (सूर्य षष्ठी)',
    category: 'Major Festival',
    categoryHi: 'मुख्य त्योहार',
    significance: 'Offering Arghya to Sun God and Chhathi Maiyya.',
    significanceHi: 'भगवान भास्कर (सूर्य देव) एवं छठी मैया के पूजन व अस्ताचलगामी/उदीयमान सूर्य अर्घ्य।',
  },
  {
    match: (p) => p.hinduMonthEn === 'Magha' && p.pakshaEn === 'Shukla Paksha' && p.tithiEn.includes('Panchami'),
    festival: 'Vasant Panchami / Saraswati Puja',
    festivalHi: 'वसन्त पञ्चमी (सरस्वती पूजन)',
    category: 'Major Festival',
    categoryHi: 'मुख्य त्योहार',
    significance: 'Worshipping Goddess Saraswati for knowledge and arts.',
    significanceHi: 'विद्या व बुद्धि की देवी मां सरस्वती जी के प्राकट्य व पूजन का शुभ पर्व।',
  },

  // Recurring Fasting Rules
  {
    match: (p) => p.tithiEn.includes('Ekadashi'),
    festival: 'Ekadashi Vrat',
    festivalHi: 'एकादशी व्रत',
    category: 'Ekadashi',
    categoryHi: 'एकादशी व्रत',
    significance: 'Sacred fast dedicated to Lord Vishnu.',
    significanceHi: 'भगवान श्री हरि विष्णु जी की भक्ति व पाप निवारण हेतु पवित्र एकादशी व्रत।',
  },
  {
    match: (p) => p.tithiEn.includes('Trayodashi'),
    festival: 'Pradosh Vrat',
    festivalHi: 'प्रदोष व्रत',
    category: 'Vrat',
    categoryHi: 'व्रत व उपवास',
    significance: 'Twilight worship dedicated to Lord Shiva.',
    significanceHi: 'सायंकाल प्रदोष काल में भगवान शिव व माता पार्वती की विशेष पूजा।',
  },
  {
    match: (p) => p.pakshaEn === 'Krishna Paksha' && p.tithiEn.includes('Chaturthi'),
    festival: 'Sankashti Chaturthi Vrat',
    festivalHi: 'संकष्टी गणेश चतुर्थी व्रत',
    category: 'Vrat',
    categoryHi: 'व्रत व उपवास',
    significance: 'Moonrise fast dedicated to Lord Ganesha for removing obstacles.',
    significanceHi: 'विघ्नहर्ता श्री गणेश जी के संकट निवारण हेतु चंद्र दर्शन युक्त व्रत।',
  },
  {
    match: (p) => p.tithiEn.includes('Purnima'),
    festival: 'Purnima Vrat & Satyanarayan Puja',
    festivalHi: 'पूर्णिमा व्रत व श्री सत्यनारायण कथा',
    category: 'Vrat',
    categoryHi: 'व्रत व उपवास',
    significance: 'Full moon fast and Shri Satyanarayan Katha.',
    significanceHi: 'पूर्णिमा व्रत, चंद्र देव पूजन व श्री सत्यनारायण स्वामी व्रत कथा।',
  },
]

export function getRealFestivalsForMonth(year: number, month: number, categoryFilter?: string, searchQuery?: string): RealFestivalItem[] {
  const festivals: RealFestivalItem[] = []

  // Number of days in requested month
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    const dateObj = new Date(dateStr + 'T00:00:00.000Z')

    const panchang = calculateRealPanchang(dateStr)

    for (const rule of FESTIVAL_RULES) {
      if (rule.match(panchang, dateObj)) {
        // Filter by Category
        if (categoryFilter && categoryFilter !== 'ALL') {
          const matchCat = rule.category.toLowerCase().includes(categoryFilter.toLowerCase()) ||
                           rule.categoryHi.toLowerCase().includes(categoryFilter.toLowerCase())
          if (!matchCat) continue
        }

        // Filter by Search Query
        if (searchQuery) {
          const q = searchQuery.toLowerCase()
          const matchSearch = rule.festival.toLowerCase().includes(q) ||
                              rule.festivalHi.toLowerCase().includes(q) ||
                              rule.significance.toLowerCase().includes(q) ||
                              rule.significanceHi.toLowerCase().includes(q)
          if (!matchSearch) continue
        }

        festivals.push({
          id: `real-fest-${dateStr}-${rule.festival.replace(/[^a-zA-Z0-9]/g, '-')}`,
          date: dateObj.toISOString(),
          festival: rule.festival,
          festivalHi: rule.festivalHi,
          category: rule.category,
          categoryHi: rule.categoryHi,
          significance: rule.significance,
          significanceHi: rule.significanceHi,
        })
      }
    }
  }

  return festivals
}
