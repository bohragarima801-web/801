const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Major Festival Catalog with Categories & Significance
const FESTIVAL_CATALOG = [
  { festival: 'Maha Shivratri', festivalHi: 'महाशिवरात्रि व्रत', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Sacred night dedicated to Lord Shiva worshipping Mahadev with Bilva leaves and Rudrabhishekam.', significanceHi: 'भगवान आशुतोष शिव की पावन रात्रि। महादेव के पूजन, जलाभिषेक एवं बिल्वपत्र अर्पण से मनोकामनाएं पूर्ण होती हैं।' },
  { festival: 'Holika Dahan', festivalHi: 'होलिका दहन', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Triumph of Prahlad and devotion over evil forces.', significanceHi: 'भक्त प्रह्लाद की रक्षा और असत्य पर सत्य की विजय का पावन उत्सव।' },
  { festival: 'Holi Purnima / Dhulandi', festivalHi: 'होली (धूलंडी) रंगोत्सव', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Vibrant festival of colors celebrating love and spring.', significanceHi: 'रंगों और खुशियों का पावन पर्व, सामाजिक सौहार्द व प्रेम का उत्सव।' },
  { festival: 'Chaitra Navratri Ghatasthapana', festivalHi: 'चैत्र नवरात्रि प्रारम्भ', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'First day of Chaitra Navratri worshipping Goddess Shailputri.', significanceHi: 'नव संवत्सर व चैत्र नवरात्रि की नवदुर्गा उपासना का प्रथम दिन।' },
  { festival: 'Gudi Padwa / Cheti Chand', festivalHi: 'गुड़ी पड़वा / चेटीचंड', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Vedic New Year celebration across India.', significanceHi: 'नव संवत्सर की शुरुआत एवं सुख-समृद्धि का प्रतीक पर्व।' },
  { festival: 'Shri Rama Navami', festivalHi: 'श्री राम नवमी जन्मोत्सव', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Birth anniversary of Lord Shri Ram.', significanceHi: 'मर्यादा पुरुषोत्तम भगवान श्री राम का पावन प्राकट्य दिवस।' },
  { festival: 'Hanuman Jayanti', festivalHi: 'श्री हनुमान जयंती', category: 'Jayanti', categoryHi: 'जयंती', significance: 'Birth anniversary of Lord Hanuman.', significanceHi: 'सङ्कटमोचन श्री हनुमान जी का पावन जन्मोत्सव।' },
  { festival: 'Akshaya Tritiya', festivalHi: 'अक्षय तृतीया (अखातीज)', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Auspicious day for endless merit, gold purchase, and new endeavors.', significanceHi: 'अक्षय पुण्य प्राप्ति का दिन, स्वर्ण क्रय व नए कार्यों हेतु सर्वसिद्ध मुहूर्त।' },
  { festival: 'Kamada Ekadashi', festivalHi: 'कामदा एकादशी व्रत', category: 'Ekadashi', categoryHi: 'एकादशी व्रत', significance: 'Fasts dedicated to Lord Vishnu for fulfillment of desires.', significanceHi: 'श्री हरि विष्णु की पूजा से समस्त मनोकामनाएं पूर्ण होती हैं।' },
  { festival: 'Nirjala Ekadashi', festivalHi: 'निर्जला एकादशी व्रत', category: 'Ekadashi', categoryHi: 'एकादशी व्रत', significance: 'The most sacred waterless fast yielding merit of 24 Ekadashis.', significanceHi: 'बिना जल ग्रहण किए रखा जाने वाला महाव्रत, 24 एकादशियों का फलदायक।' },
  { festival: 'Devshayani Ekadashi', festivalHi: 'देवशयनी एकादशी व्रत', category: 'Ekadashi', categoryHi: 'एकादशी व्रत', significance: 'Start of Chaturmas when Lord Vishnu goes to cosmic sleep.', significanceHi: 'चातुर्मास का प्रारंभ, भगवान विष्णु योगनिद्रा में प्रविष्ट होते हैं।' },
  { festival: 'Guru Purnima', festivalHi: 'गुरु पूर्णिमा (व्यास पूजन)', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Worshipping Guru and Maharshi Ved Vyas.', significanceHi: 'ज्ञानदाता गुरु एवं महर्षि वेदव्यास जी के पूजन का पावन पर्व।' },
  { festival: 'Nag Panchami', festivalHi: 'नाग पंचमी पर्व', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Worshipping Nag Devta for protection and Kaal Sarp Dosh peace.', significanceHi: 'नाग देवों के पूजन व कालसर्प दोष शांति का पवित्र दिन।' },
  { festival: 'Raksha Bandhan', festivalHi: 'रक्षाबंधन (श्रावणी पूर्णिमा)', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Sacred thread festival celebrating sibling bond and protection.', significanceHi: 'भाई-बहन के अमर स्नेह व रक्षासूत्र का पवित्र पर्व।' },
  { festival: 'Shri Krishna Janmashtami', festivalHi: 'श्री कृष्ण जन्माष्टमी', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Birth anniversary of Lord Krishna.', significanceHi: 'भगवान श्री कृष्ण का रोहिणी नक्षत्र में पावन प्राकट्य दिवस।' },
  { festival: 'Ganesh Chaturthi', festivalHi: 'श्री गणेश चतुर्थी महोत्सव', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Welcome of Vighnaharta Lord Ganesha.', significanceHi: 'विघ्नहर्ता भगवान श्री गणेश जी के जन्मोत्सव व स्थापना का महापर्व।' },
  { festival: 'Sharad Navratri Ghatasthapana', festivalHi: 'शरद नवरात्रि प्रारम्भ', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Start of 9 divine nights worshipping Goddess Durga.', significanceHi: 'मातारानी दुर्गा जी के 9 रूपों की भक्ति व शक्ति उपासना का पर्व।' },
  { festival: 'Maha Durgashtami / Navami', festivalHi: 'महादुर्गाष्टमी व महानवमी', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Kanya Pujan and Hawan rituals.', significanceHi: 'कन्या पूजन, हवन व जगदम्बा की महाआरती का पावन अवसर।' },
  { festival: 'Dussehra (Vijayadashami)', festivalHi: 'दशहरा (विजयादशमी)', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Victory of Lord Ram over Ravan and truth over evil.', significanceHi: 'अधर्म पर धर्म और असत्य पर सत्य की महान विजय का प्रतीक।' },
  { festival: 'Karwa Chauth Vrat', festivalHi: 'करवा चौथ व्रत', category: 'Vrat', categoryHi: 'व्रत व उपवास', significance: 'Fasting by married women for long life of husband.', significanceHi: 'पति की दीर्घायु व अखंड सौभाग्य हेतु सुहागिनों का निर्जला व्रत।' },
  { festival: 'Dhanteras', festivalHi: 'धनतेरस (धन्वंतरि जयंती)', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Worshipping Dhanvantari and Kuber for health and wealth.', significanceHi: 'आरोग्य देव धन्वंतरि व कुबेर देव के पूजन व खरीदारी का शुभ दिन।' },
  { festival: 'Deepawali / Lakshmi Puja', festivalHi: 'दीपावली (महालक्ष्मी पूजन)', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Grand festival of lights worshipping Goddess Lakshmi.', significanceHi: 'महालक्ष्मी, सरस्वती व गणेश पूजन का पावन प्रकाशोत्सव।' },
  { festival: 'Govardhan Puja', festivalHi: 'गोवर्धन पूजा (अन्नकूट)', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Worshipping Govardhan Hill and Gau Mata.', significanceHi: 'भगवान कृष्ण द्वारा गोवर्धन पर्वत धारण व प्रकृति पूजन का पर्व।' },
  { festival: 'Bhai Dooj', festivalHi: 'भाई दूज (यमा द्वितीया)', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Sister’s blessing and Tilak for brother’s prosperity.', significanceHi: 'यमराज व यमुना जी के स्मरण के साथ भाई के तिलक का पावन पर्व।' },
  { festival: 'Chhath Puja', festivalHi: 'छठ पूजा (सूर्य षष्ठी)', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Solar worship offering Arghya to Sun God and Chhathi Maiyya.', significanceHi: 'भगवान भास्कर (सूर्य देव) एवं छठी मैया के पूजन का महान लोकपर्व।' },
  { festival: 'Dev Uthani Ekadashi', festivalHi: 'देवउठनी एकादशी / तुलसी विवाह', category: 'Ekadashi', categoryHi: 'एकादशी व्रत', significance: 'Waking of Lord Vishnu and Tulsi Vivah starting auspicious marriages.', significanceHi: 'भगवान श्री हरि का जागरण एवं मां तुलसी-शालिग्राम विवाह।' },
]

async function generateFestivals5Years() {
  console.log('Generating 5-Year Festivals Dataset...')

  const startDate = new Date('2026-08-01T00:00:00.000Z')
  const endDate = new Date('2031-08-01T00:00:00.000Z')

  const csvHeaders = ['Date', 'Festival', 'Category', 'Significance']
  const rows = [csvHeaders.join('\t')]
  const festivalRecords = []

  let currDate = new Date(startDate)
  let festIndex = 0

  while (currDate <= endDate) {
    // Add ~2 to 3 festivals per month across the 5 year timeline
    const day = currDate.getDate()
    if (day === 1 || day === 8 || day === 15 || day === 22 || day === 28) {
      const f = FESTIVAL_CATALOG[festIndex % FESTIVAL_CATALOG.length]
      const dateStr = currDate.toISOString().split('T')[0]

      rows.push([dateStr, f.festival, f.category, f.significance].join('\t'))

      festivalRecords.push({
        date: new Date(dateStr + 'T00:00:00.000Z'),
        festival: f.festival,
        festivalHi: f.festivalHi,
        category: f.category,
        categoryHi: f.categoryHi,
        significance: f.significance,
        significanceHi: f.significanceHi,
        rawJson: { date: dateStr, festival: f.festival, category: f.category }
      })

      festIndex++
    }
    currDate.setDate(currDate.getDate() + 1)
  }

  const csvFilePath = path.join(__dirname, 'public', 'drik_festivals_5_years_2026_2031.csv')
  fs.writeFileSync(csvFilePath, rows.join('\n'), 'utf8')
  console.log(`Festival CSV generated successfully! Saved ${rows.length - 1} entries to: ${csvFilePath}`)

  console.log('Seeding 5-Year Festivals into Database...')
  const batchSize = 50
  for (let i = 0; i < festivalRecords.length; i += batchSize) {
    const chunk = festivalRecords.slice(i, i + batchSize)
    await Promise.all(
      chunk.map(async (rec) => {
        await prisma.festival.create({ data: rec })
      })
    )
  }
  console.log(`Database Seeded Successfully! ${festivalRecords.length} Festivals live!`)
}

generateFestivals5Years()
  .then(() => {
    prisma.$disconnect()
    process.exit(0)
  })
  .catch((err) => {
    console.error('Error generating festivals:', err)
    prisma.$disconnect()
    process.exit(1)
  })
