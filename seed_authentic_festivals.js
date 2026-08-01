const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const AUTHENTIC_FESTIVALS = [
  // AUGUST 2026
  { date: '2026-08-01', festival: 'Sankashti Chaturthi', festivalHi: 'संकष्टी श्री गणेश चतुर्थी व्रत', category: 'Vrat', categoryHi: 'व्रत व उपवास', significance: 'Moonrise fast dedicated to Lord Ganesha.', significanceHi: 'श्री गणेश जी की पूजा व संकट निवारण हेतु व्रत।' },
  { date: '2026-08-08', festival: 'Kamika Ekadashi Vrat', festivalHi: 'कामिका एकादशी व्रत', category: 'Ekadashi', categoryHi: 'एकादशी व्रत', significance: 'Ekadashi fast in Shravana month.', significanceHi: 'श्रावण मास के कृष्ण पक्ष की प्रसिद्ध कामिका एकादशी।' },
  { date: '2026-08-10', festival: 'Som Pradosh Vrat', festivalHi: 'सोम प्रदोष व्रत', category: 'Vrat', categoryHi: 'व्रत व उपवास', significance: 'Twilight Shiva puja.', significanceHi: 'भगवान शिव व माता पार्वती का पूजन।' },
  { date: '2026-08-13', festival: 'Hariyali Amavasya', festivalHi: 'हरियाली अमावस्या', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Tree planting and Pitru Tarpan.', significanceHi: 'वृक्षारोपण व पितृ तर्पण।' },
  { date: '2026-08-15', festival: 'Hariyali Teej', festivalHi: 'हरियाली तीज (श्रावणी तीज)', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Women fast for Goddess Parvati & Shiva.', significanceHi: 'माता पार्वती व शिव जी के पूजन का सुहाग पर्व।' },
  { date: '2026-08-17', festival: 'Nag Panchami', festivalHi: 'नाग पंचमी पर्व', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Worshipping Nag Devta for protection.', significanceHi: 'नाग देवों के पूजन व कालसर्प दोष शांति का दिन।' },
  { date: '2026-08-20', festival: 'Tulsidas Jayanti', festivalHi: 'संत तुलसीदास जयंती', category: 'Jayanti', categoryHi: 'जयंती', significance: 'Birth anniversary of Goswami Tulsidas.', significanceHi: 'गोस्वामी तुलसीदास जी का प्राकट्य दिवस।' },
  { date: '2026-08-23', festival: 'Shravana Putrada Ekadashi Vrat', festivalHi: 'श्रावण पुत्रदा एकादशी व्रत', category: 'Ekadashi', categoryHi: 'एकादशी व्रत', significance: 'Ekadashi fast for children welfare.', significanceHi: 'संतान प्राप्ति व रक्षा हेतु एकादशी व्रत।' },
  { date: '2026-08-28', festival: 'Raksha Bandhan', festivalHi: 'रक्षाबंधन (श्रावणी पूर्णिमा)', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Brother-sister sacred bond.', significanceHi: 'भाई-बहन के अमर स्नेह व रक्षासूत्र का पर्व।' },

  // SEPTEMBER 2026
  { date: '2026-09-02', festival: 'Balaram Jayanti / Hal Chhath', festivalHi: 'बलराम जयंती (हलछठ)', category: 'Jayanti', categoryHi: 'जयंती', significance: 'Lord Balaram birth anniversary.', significanceHi: 'श्री बलराम जी की जयंती।' },
  { date: '2026-09-04', festival: 'Shri Krishna Janmashtami', festivalHi: 'श्री कृष्ण जन्माष्टमी', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Birth anniversary of Lord Krishna.', significanceHi: 'भगवान श्री कृष्ण जी का प्राकट्य दिवस।' },
  { date: '2026-09-06', festival: 'Aja Ekadashi Vrat', festivalHi: 'अजा एकादशी व्रत', category: 'Ekadashi', categoryHi: 'एकादशी व्रत', significance: 'Ekadashi fast for destroying sins.', significanceHi: 'भाद्रपद कृष्ण एकादशी व्रत।' },
  { date: '2026-09-13', festival: 'Haritalika Teej Vrat', festivalHi: 'हरितालिका तीज व्रत', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Strict fast for marital bliss.', significanceHi: 'सुहागिनों का महान निर्जला व्रत।' },
  { date: '2026-09-14', festival: 'Ganesh Chaturthi (Sthapana)', festivalHi: 'श्री गणेश चतुर्थी महोत्सव', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Lord Ganesha Sthapana.', significanceHi: 'भगवान श्री गणेश जी का जन्मोत्सव।' },
  { date: '2026-09-15', festival: 'Rishi Panchami', festivalHi: 'ऋषि पंचमी व्रत', category: 'Vrat', categoryHi: 'व्रत व उपवास', significance: 'Sapta Rishi worship.', significanceHi: 'सप्त ऋषियों के पूजन का पवित्र दिन।' },
  { date: '2026-09-17', festival: 'Radhashtami', festivalHi: 'श्री राधाष्टमी जन्मोत्सव', category: 'Jayanti', categoryHi: 'जयंती', significance: 'Shri Radha Rani birth anniversary.', significanceHi: 'श्री राधा रानी जी का प्राकट्य उत्सव।' },
  { date: '2026-09-20', festival: 'Parivartini Ekadashi Vrat', festivalHi: 'परिवर्तिनी एकादशी व्रत', category: 'Ekadashi', categoryHi: 'एकादशी व्रत', significance: 'Lord Vishnu posture change.', significanceHi: 'परिवर्तिनी एकादशी व्रत।' },
  { date: '2026-09-23', festival: 'Anant Chaturdashi / Ganesh Visarjan', festivalHi: 'अनंत चतुर्दशी (गणेश विसर्जन)', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Lord Anant Puja & Ganesh Visarjan.', significanceHi: 'अनंत सूत्र धारण व गणेश विसर्जन।' },
  { date: '2026-09-25', festival: 'Pitru Paksha Starts', festivalHi: 'पितृ पक्ष प्रारम्भ', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Shraddha rituals for ancestors.', significanceHi: 'पितृ पक्ष का प्रारंभ व पितृ तर्पण।' },

  // OCTOBER 2026
  { date: '2026-10-06', festival: 'Indira Ekadashi Vrat', festivalHi: 'इन्दिरा एकादशी व्रत', category: 'Ekadashi', categoryHi: 'एकादशी व्रत', significance: 'Ancestral liberation Ekadashi.', significanceHi: 'पितरों को मोक्ष प्रदान करने वाली एकादशी।' },
  { date: '2026-10-10', festival: 'Sarvapitri Amavasya', festivalHi: 'सर्वपितृ मोक्ष अमावस्या', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Pitru Paksha culmination.', significanceHi: 'अंतिम तर्पण व पिण्डदान का महापुण्य पर्व।' },
  { date: '2026-10-11', festival: 'Sharad Navratri Ghatasthapana', festivalHi: 'शरद नवरात्रि प्रारम्भ', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Start of 9 nights Durga Puja.', significanceHi: 'मातारानी दुर्गा जी की शक्ति उपासना का प्रारंभ।' },
  { date: '2026-10-18', festival: 'Maha Durgashtami Vrat', festivalHi: 'महादुर्गाष्टमी व्रत', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Maha Ashtami & Kanya Pujan.', significanceHi: 'महाअष्टमी पूजन व कन्या भोजन।' },
  { date: '2026-10-19', festival: 'Maha Navami', festivalHi: 'महानवमी (कन्या पूजन)', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Navratri Hawan and Pujan.', significanceHi: 'मां सिद्धिदात्री पूजन व हवन।' },
  { date: '2026-10-20', festival: 'Dussehra (Vijayadashami)', festivalHi: 'दशहरा (विजयादशमी)', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Victory of Lord Ram over Ravan.', significanceHi: 'अधर्म पर धर्म की विजय का प्रतीक।' },
  { date: '2026-10-28', festival: 'Karwa Chauth Vrat', festivalHi: 'करवा चौथ व्रत', category: 'Vrat', categoryHi: 'व्रत व उपवास', significance: 'Fasting by married women.', significanceHi: 'सुहागिनों का निर्जला व्रत व चंद्र दर्शन।' },

  // NOVEMBER 2026
  { date: '2026-11-05', festival: 'Rama Ekadashi Vrat', festivalHi: 'रमा एकादशी व्रत', category: 'Ekadashi', categoryHi: 'एकादशी व्रत', significance: 'Kartika Krishna Ekadashi.', significanceHi: 'मां लक्ष्मी व विष्णु पूजन।' },
  { date: '2026-11-06', festival: 'Dhanteras', festivalHi: 'धनतेरस (धन्वंतरि जयंती)', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Worshipping Dhanvantari & Kuber.', significanceHi: 'धन्वंतरि व कुबेर देव पूजन।' },
  { date: '2026-11-07', festival: 'Chhoti Diwali (Narak Chaturdashi)', festivalHi: 'छोटी दिवाली (नरक चतुर्दशी)', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Yamadeep lighting.', significanceHi: 'रूप चौदस व यमदीप दान।' },
  { date: '2026-11-08', festival: 'Deepawali / Lakshmi Puja', festivalHi: 'दीपावली (महालक्ष्मी पूजन)', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Grand festival of lights.', significanceHi: 'महालक्ष्मी व श्री गणेश पूजन।' },
  { date: '2026-11-09', festival: 'Govardhan Puja', festivalHi: 'गोवर्धन पूजा (अन्नकूट)', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Govardhan Hill & Gau Mata Puja.', significanceHi: 'गोवर्धन पर्वत धारण व प्रकृति पूजन।' },
  { date: '2026-11-10', festival: 'Bhai Dooj (Yama Dwitiya)', festivalHi: 'भाई दूज (यमा द्वितीया)', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Sister tilak for brother.', significanceHi: 'भाई के मंगल तिलकोत्सव का पर्व।' },
  { date: '2026-11-14', festival: 'Chhath Puja', festivalHi: 'छठ पूजा (सूर्य षष्ठी)', category: 'Major Festival', categoryHi: 'मुख्य त्योहार', significance: 'Solar worship Arghya.', significanceHi: 'सूर्य देव व छठी मैया का महालोकपर्व।' },
  { date: '2026-11-20', festival: 'Dev Uthani Ekadashi / Tulsi Vivah', festivalHi: 'देवउठनी एकादशी (तुलसी विवाह)', category: 'Ekadashi', categoryHi: 'एकादशी व्रत', significance: 'Waking of Lord Vishnu & Tulsi Vivah.', significanceHi: 'भगवान श्री हरि का जागरण व तुलसी विवाह।' },

  // DECEMBER 2026
  { date: '2026-12-04', festival: 'Utpanna Ekadashi Vrat', festivalHi: 'उत्पन्ना एकादशी व्रत', category: 'Ekadashi', categoryHi: 'एकादशी व्रत', significance: 'Ekadashi Devi origin day.', significanceHi: 'एकादशी देवी का प्राकट्य दिवस।' },
  { date: '2026-12-19', festival: 'Gita Jayanti / Mokshada Ekadashi', festivalHi: 'गीता जयंती / मोक्षदा एकादशी', category: 'Ekadashi', categoryHi: 'एकादशी व्रत', significance: 'Bhagavad Gita revelation day.', significanceHi: 'श्रीमद्भगवद्गीता उपदेश दिवस व एकादशी।' },
]

async function seedAuthenticFestivals() {
  console.log('Clearing old festival database table...')
  await prisma.festival.deleteMany({})

  console.log('Seeding Master Drik Panchang Authentic Festival Database...')

  for (const item of AUTHENTIC_FESTIVALS) {
    const d = new Date(item.date + 'T00:00:00.000Z')
    await prisma.festival.create({
      data: {
        date: d,
        festival: item.festival,
        festivalHi: item.festivalHi,
        category: item.category,
        categoryHi: item.categoryHi,
        significance: item.significance,
        significanceHi: item.significanceHi,
        rawJson: { date: item.date, festival: item.festival }
      }
    })
  }

  console.log(`Seeded ${AUTHENTIC_FESTIVALS.length} Verified Master Drik Panchang Festivals successfully!`)
}

seedAuthenticFestivals()
  .then(() => {
    prisma.$disconnect()
    process.exit(0)
  })
  .catch((err) => {
    console.error('Error seeding authentic festivals:', err)
    prisma.$disconnect()
    process.exit(1)
  })
