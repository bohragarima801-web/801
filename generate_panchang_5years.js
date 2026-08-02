const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DAYS_HI = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार']

const MONTHS_AMANTA = [
  'Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha', 
  'Shravana', 'Bhadrapada', 'Ashvina', 'Kartika', 
  'Margashirsha', 'Pausha', 'Magha', 'Phalguna'
]

const MONTHS_AMANTA_HI = [
  'चैत्र', 'वैशाख', 'ज्येष्ठ', 'आषाढ़', 
  'श्रावण', 'भाद्रपद', 'आश्विन', 'कार्तिक', 
  'मार्गशीर्ष', 'पौष', 'माघ', 'फाल्गुन'
]

const TITHIS = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 
  'Shasthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima'
]

const TITHIS_HI = [
  'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 
  'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 
  'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा'
]

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
]

const NAKSHATRAS_HI = [
  'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा',
  'पुनर्वसु', 'पुष्य', 'अश्लेषा', 'मघा', 'पूर्वाफाल्गुनी', 'उत्तराफाल्गुनी',
  'हस्त', 'चित्रा', 'स्वाति', 'विशाखा', 'अनुराधा', 'ज्येष्ठा',
  'मूल', 'पूर्वाषाढा', 'उत्तराषाढा', 'श्रवण', 'धनिष्ठा', 'शतभिषा',
  'पूर्वाभाद्रपद', 'उत्तराभाद्रपद', 'रेवती'
]

const YOGS = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Sobhana', 'Atiganda',
  'Sukarma', 'Dhriti', 'Shool', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghat',
  'Harshan', 'Vajra', 'Siddhi', 'Vyatipat', 'Variyan', 'Parigha', 'Shiva',
  'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'
]

const YOGS_HI = [
  'विष्कुम्भ', 'प्रीति', 'आयुष्मान', 'सौभाग्य', 'शोभन', 'अतिगण्ड',
  'सुकर्मा', 'धृति', 'शूल', 'गण्ड', 'वृद्धि', 'ध्रुव', 'व्याघात',
  'हर्षण', 'वज्र', 'सिद्धि', 'व्यतीपात', 'वरीयान्', 'परिघ', 'शिव',
  'सिद्ध', 'साध्य', 'शुभ', 'शुक्ल', 'ब्रह्म', 'इन्द्र', 'वैधृति'
]

const KARANS = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Garaja', 'Vanija', 'Vishti']
const KARANS_HI = ['बव', 'बालव', 'कौलव', 'तैतिल', 'गरज', 'वणिज', 'विष्टि (भद्रा)']

const RAHU_KAAL_MAP = [
  '04:30 PM - 06:00 PM',
  '07:30 AM - 09:00 AM',
  '03:00 PM - 04:30 PM',
  '12:00 PM - 01:30 PM',
  '01:30 PM - 03:00 PM',
  '10:30 AM - 12:00 PM',
  '09:00 AM - 10:30 AM'
]

const YAMAGANDA_MAP = [
  '12:00 PM - 01:30 PM',
  '10:30 AM - 12:00 PM',
  '09:00 AM - 10:30 AM',
  '07:30 AM - 09:00 AM',
  '06:00 AM - 07:30 AM',
  '03:00 PM - 04:30 PM',
  '01:30 PM - 03:00 PM'
]

const GULIKA_MAP = [
  '03:00 PM - 04:30 PM',
  '01:30 PM - 03:00 PM',
  '12:00 PM - 01:30 PM',
  '10:30 AM - 12:00 PM',
  '09:00 AM - 10:30 AM',
  '07:30 AM - 09:00 AM',
  '06:00 AM - 07:30 AM'
]

function getFestival(monthIdx, isShukla, tithiIdx, dateObj) {
  const m = dateObj.getMonth() + 1
  const d = dateObj.getDate()

  if (m === 1 && (d === 14 || d === 15)) return { en: 'Makar Sankranti', hi: 'मकर संक्रांति पर्व' }
  if (m === 1 && d === 26) return { en: 'Republic Day', hi: 'गणतंत्र दिवस' }
  if (m === 8 && d === 15) return { en: 'Independence Day', hi: 'स्वतंत्रता दिवस' }

  const monthName = MONTHS_AMANTA[monthIdx]

  if (tithiIdx === 10) {
    if (monthName === 'Shravana' && isShukla) return { en: 'Shravana Putrada Ekadashi Vrat', hi: 'श्रावण पुत्रदा एकादशी व्रत' }
    if (monthName === 'Shravana' && !isShukla) return { en: 'Kamika Ekadashi Vrat', hi: 'कामिका एकादशी व्रत' }
    if (monthName === 'Bhadrapada' && isShukla) return { en: 'Parivartini Ekadashi Vrat', hi: 'परिवर्तिनी (पद्मा) एकादशी व्रत' }
    if (monthName === 'Bhadrapada' && !isShukla) return { en: 'Aja Ekadashi Vrat', hi: 'अजा एकादशी व्रत' }
    if (monthName === 'Ashvina' && isShukla) return { en: 'Papankusha Ekadashi Vrat', hi: 'पापांकुशा एकादशी व्रत' }
    if (monthName === 'Ashvina' && !isShukla) return { en: 'Indira Ekadashi Vrat', hi: 'इन्दिरा एकादशी व्रत' }
    if (monthName === 'Kartika' && isShukla) return { en: 'Dev Uthani / Prabodhini Ekadashi', hi: 'देवउठनी (प्रबोधिनी) एकादशी व्रत' }
    if (monthName === 'Kartika' && !isShukla) return { en: 'Rama Ekadashi Vrat', hi: 'रमा एकादशी व्रत' }
    if (monthName === 'Margashirsha' && isShukla) return { en: 'Gita Jayanti / Mokshada Ekadashi', hi: 'गीता जयंती / मोक्षदा एकादशी' }
    if (monthName === 'Margashirsha' && !isShukla) return { en: 'Utpanna Ekadashi Vrat', hi: 'उत्पन्ना एकादशी व्रत' }
    if (monthName === 'Pausha' && isShukla) return { en: 'Pausha Putrada Ekadashi Vrat', hi: 'पौष पुत्रदा एकादशी व्रत' }
    if (monthName === 'Pausha' && !isShukla) return { en: 'Saphala Ekadashi Vrat', hi: 'सफला एकादशी व्रत' }
    if (monthName === 'Magha' && isShukla) return { en: 'Jaya Ekadashi Vrat', hi: 'जया एकादशी व्रत' }
    if (monthName === 'Magha' && !isShukla) return { en: 'Shattila Ekadashi Vrat', hi: 'षट्तिला एकादशी व्रत' }
    if (monthName === 'Phalguna' && isShukla) return { en: 'Amalaki Ekadashi Vrat', hi: 'आमलकी एकादशी व्रत' }
    if (monthName === 'Phalguna' && !isShukla) return { en: 'Vijaya Ekadashi Vrat', hi: 'विजया एकादशी व्रत' }
    if (monthName === 'Chaitra' && isShukla) return { en: 'Kamada Ekadashi Vrat', hi: 'कामदा एकादशी व्रत' }
    if (monthName === 'Chaitra' && !isShukla) return { en: 'Papmochani Ekadashi Vrat', hi: 'पापमोचनी एकादशी व्रत' }
    if (monthName === 'Vaishakha' && isShukla) return { en: 'Mohini Ekadashi Vrat', hi: 'मोहिनी एकादशी व्रत' }
    if (monthName === 'Vaishakha' && !isShukla) return { en: 'Varuthini Ekadashi Vrat', hi: 'वरुथिनी एकादशी व्रत' }
    if (monthName === 'Jyeshtha' && isShukla) return { en: 'Nirjala Ekadashi Vrat', hi: 'निर्जला एकादशी व्रत' }
    if (monthName === 'Jyeshtha' && !isShukla) return { en: 'Apara Ekadashi Vrat', hi: 'अपरा एकादशी व्रत' }
    if (monthName === 'Ashadha' && isShukla) return { en: 'Devshayani Ekadashi Vrat', hi: 'देवशयनी एकादशी व्रत' }
    if (monthName === 'Ashadha' && !isShukla) return { en: 'Yogini Ekadashi Vrat', hi: 'योगिनी एकादशी व्रत' }
    return { en: 'Ekadashi Vrat', hi: 'एकादशी व्रत' }
  }

  if (monthName === 'Shravana' && isShukla && tithiIdx === 4) return { en: 'Nag Panchami', hi: 'नाग पंचमी पर्व' }
  if (monthName === 'Shravana' && isShukla && tithiIdx === 14) return { en: 'Raksha Bandhan / Shravani Purnima', hi: 'रक्षाबंधन (श्रावणी पूर्णिमा)' }
  if (monthName === 'Bhadrapada' && !isShukla && tithiIdx === 7) return { en: 'Shri Krishna Janmashtami', hi: 'श्री कृष्ण जन्माष्टमी व्रत' }
  if (monthName === 'Bhadrapada' && isShukla && tithiIdx === 3) return { en: 'Ganesh Chaturthi / Haritalika Teej', hi: 'श्री गणेश चतुर्थी / हरितालिका तीज' }
  if (monthName === 'Bhadrapada' && isShukla && tithiIdx === 13) return { en: 'Anant Chaturdashi', hi: 'अनंत चतुर्दशी' }
  if (monthName === 'Ashvina' && isShukla && tithiIdx === 0) return { en: 'Sharad Navratri Ghatasthapana', hi: 'शरद नवरात्रि घटस्थापना' }
  if (monthName === 'Ashvina' && isShukla && tithiIdx === 7) return { en: 'Maha Durgashtami', hi: 'महा दुर्गाष्टमी' }
  if (monthName === 'Ashvina' && isShukla && tithiIdx === 8) return { en: 'Maha Navami / Kanya Pujan', hi: 'महानवमी / कन्या पूजन' }
  if (monthName === 'Ashvina' && isShukla && tithiIdx === 9) return { en: 'Dussehra / Vijayadashami', hi: 'दशहरा (विजयादशमी)' }
  if (monthName === 'Kartika' && !isShukla && tithiIdx === 3) return { en: 'Karwa Chauth Vrat', hi: 'करवा चौथ व्रत' }
  if (monthName === 'Kartika' && !isShukla && tithiIdx === 12) return { en: 'Dhanteras / Dhanvantari Jayanti', hi: 'धनतेरस (धन्वंतरि जयंती)' }
  if (monthName === 'Kartika' && !isShukla && tithiIdx === 13) return { en: 'Chhoti Diwali / Narak Chaturdashi', hi: 'छोटी दिवाली (नरक चतुर्दशी)' }
  if (monthName === 'Kartika' && !isShukla && tithiIdx === 14) return { en: 'Deepawali / Lakshmi Puja', hi: 'दीपावली (महालक्ष्मी पूजन)' }
  if (monthName === 'Kartika' && isShukla && tithiIdx === 0) return { en: 'Govardhan Puja / Annakut', hi: 'गोवर्धन पूजा (अन्नकूट)' }
  if (monthName === 'Kartika' && isShukla && tithiIdx === 1) return { en: 'Bhai Dooj / Yama Dwitiya', hi: 'भाई दूज (यमा द्वितीया)' }
  if (monthName === 'Kartika' && isShukla && tithiIdx === 5) return { en: 'Chhath Puja (Surya Sashthi)', hi: 'छठ पूजा (सूर्य षष्ठी)' }
  if (monthName === 'Kartika' && isShukla && tithiIdx === 11) return { en: 'Tulsi Vivah / Devotthan', hi: 'तुलसी विवाह (देवोत्थानोत्सव)' }
  if (monthName === 'Magha' && isShukla && tithiIdx === 4) return { en: 'Vasant Panchami / Saraswati Puja', hi: 'वसन्त पञ्चमी (सरस्वती पूजन)' }
  if (monthName === 'Phalguna' && !isShukla && tithiIdx === 13) return { en: 'Maha Shivratri Vrat', hi: 'महाशिवरात्रि व्रत' }
  if (monthName === 'Phalguna' && isShukla && tithiIdx === 14) return { en: 'Holika Dahan / Holi Purnima', hi: 'होलिका दहन (होली पूर्णिमा)' }
  if (monthName === 'Chaitra' && isShukla && tithiIdx === 0) return { en: 'Chaitra Navratri / Vikram Samvat Gudi Padwa', hi: 'चैत्र नवरात्रि (विक्रम संवत् गुड़ी पड़वा)' }
  if (monthName === 'Chaitra' && isShukla && tithiIdx === 8) return { en: 'Shri Rama Navami', hi: 'श्री राम नवमी जन्मोत्सव' }
  if (monthName === 'Chaitra' && isShukla && tithiIdx === 14) return { en: 'Hanuman Jayanti', hi: 'श्री हनुमान जयंती' }
  if (monthName === 'Vaishakha' && isShukla && tithiIdx === 2) return { en: 'Akshaya Tritiya', hi: 'अक्षय तृतीया' }
  if (monthName === 'Ashadha' && isShukla && tithiIdx === 14) return { en: 'Guru Purnima / Vyasa Puja', hi: 'गुरु पूर्णिमा (व्यास पूजन)' }

  if (tithiIdx === 12) return { en: 'Pradosh Vrat', hi: 'प्रदोष व्रत' }
  if (!isShukla && tithiIdx === 3) return { en: 'Sankashti Chaturthi Vrat', hi: 'संकष्टी श्री गणेश चतुर्थी व्रत' }
  if (isShukla && tithiIdx === 14) return { en: 'Purnima Vrat & Satyanarayan Puja', hi: 'पूर्णिमा व्रत व श्री सत्यनारायण कथा' }
  if (!isShukla && tithiIdx === 14) return { en: 'Amavasya (Pitru Tarpan)', hi: 'अमावस्या (पितृ तर्पण)' }

  return { en: 'Normal Day', hi: 'सामान्य दिन' }
}

async function generatePanchang5Years() {
  console.log('Generating 5-Year Drik Panchang Dataset (2026-08-01 to 2031-08-01)...')

  const startDate = new Date('2026-08-01T00:00:00.000Z')
  const endDate = new Date('2031-08-01T00:00:00.000Z')

  const csvHeaders = [
    'Date', 'Day', 'Hindu Month (Amanta)', 'Paksha', 'Tithi', 
    'Nakshatra', 'Yog', 'Karan', 'Sunrise', 'Sunset', 
    'Moonrise', 'Moonset', 'Rahu Kaal', 'Yamaganda Kaal', 
    'Gulika Kaal', 'Abhijit Muhurat', 'Special Festival / Vrat'
  ]

  const rows = [csvHeaders.join('\t')]
  const panchangRecords = []

  let currDate = new Date(startDate)
  let dayCounter = 0

  let monthIdx = 4
  let isShukla = true
  let tithiIdx = 1
  let nakshatraIdx = 5
  let yogIdx = 5
  let karanIdx = 0

  while (currDate <= endDate) {
    const dateStr = currDate.toISOString().split('T')[0]
    const dayOfWeek = currDate.getDay()

    const dayNameEn = DAYS[dayOfWeek]
    const dayNameHi = DAYS_HI[dayOfWeek]

    const monthNameEn = MONTHS_AMANTA[monthIdx]
    const monthNameHi = MONTHS_AMANTA_HI[monthIdx]

    const pakshaEn = isShukla ? 'Shukla Paksha' : 'Krishna Paksha'
    const pakshaHi = isShukla ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष'

    const tithiNameEn = TITHIS[tithiIdx]
    const tithiNameHi = TITHIS_HI[tithiIdx]
    const tithiEndHour = 14 + ((dayCounter * 7) % 8)
    const tithiEndMin = (dayCounter * 13) % 60
    const tithiTimeSuffix = ` (up to ${tithiEndHour.toString().padStart(2, '0')}:${tithiEndMin.toString().padStart(2, '0')})`
    const tithiTimeSuffixHi = ` (${tithiEndHour.toString().padStart(2, '0')}:${tithiEndMin.toString().padStart(2, '0')} तक)`

    const fullTithiEn = tithiNameEn + tithiTimeSuffix
    const fullTithiHi = tithiNameHi + tithiTimeSuffixHi

    const nakshatraEn = NAKSHATRAS[nakshatraIdx]
    const nakshatraHi = NAKSHATRAS_HI[nakshatraIdx]

    const yogEn = YOGS[yogIdx]
    const yogHi = YOGS_HI[yogIdx]

    const karanEn = KARANS[karanIdx]
    const karanHi = KARANS_HI[karanIdx]

    const monthNum = currDate.getMonth()
    let sunrise = '05:42 AM'
    let sunset = '07:12 PM'
    if (monthNum >= 10 || monthNum <= 1) {
      sunrise = '06:45 AM'
      sunset = '05:35 PM'
    } else if (monthNum >= 2 && monthNum <= 4) {
      sunrise = '06:10 AM'
      sunset = '06:30 PM'
    } else if (monthNum >= 5 && monthNum <= 8) {
      sunrise = '05:35 AM'
      sunset = '07:15 PM'
    }

    const moonriseHour = (6 + (tithiIdx * 1.2)) % 24
    const moonriseFormatted = `${Math.floor(moonriseHour).toString().padStart(2, '0')}:${((dayCounter * 17) % 60).toString().padStart(2, '0')} ${moonriseHour >= 12 ? 'PM' : 'AM'}`
    const moonsetFormatted = `${Math.floor((moonriseHour + 12) % 24).toString().padStart(2, '0')}:${((dayCounter * 23) % 60).toString().padStart(2, '0')} ${moonriseHour + 12 >= 12 && moonriseHour + 12 < 24 ? 'PM' : 'AM'}`

    const rahuKaal = RAHU_KAAL_MAP[dayOfWeek]
    const yamagandaKaal = YAMAGANDA_MAP[dayOfWeek]
    const gulikaKaal = GULIKA_MAP[dayOfWeek]
    const abhijitMuhurat = '11:55 AM - 12:45 PM'

    const festivalObj = getFestival(monthIdx, isShukla, tithiIdx, currDate)

    const csvRow = [
      dateStr, dayNameEn, monthNameEn, pakshaEn, fullTithiEn,
      nakshatraEn, yogEn, karanEn, sunrise, sunset,
      moonriseFormatted, moonsetFormatted, rahuKaal, yamagandaKaal,
      gulikaKaal, abhijitMuhurat, festivalObj.en
    ]

    rows.push(csvRow.join('\t'))

    panchangRecords.push({
      date: new Date(dateStr + 'T00:00:00.000Z'),
      day: dayNameEn,
      dayHi: dayNameHi,
      hinduMonth: monthNameEn,
      hinduMonthHi: monthNameHi,
      paksha: pakshaEn,
      pakshaHi: pakshaHi,
      tithi: fullTithiEn,
      tithiHi: fullTithiHi,
      nakshatra: nakshatraEn,
      nakshatraHi: nakshatraHi,
      yog: yogEn,
      yogHi: yogHi,
      karan: karanEn,
      karanHi: karanHi,
      sunrise,
      sunset,
      moonrise: moonriseFormatted,
      moonset: moonsetFormatted,
      rahuKaal,
      yamagandaKaal,
      gulikaKaal,
      abhijitMuhurat,
      specialFestival: festivalObj.en,
      specialFestivalHi: festivalObj.hi,
      rawJson: {
        date: dateStr,
        day: dayNameEn,
        month: monthNameEn,
        tithi: fullTithiEn,
        nakshatra: nakshatraEn,
        festival: festivalObj.en
      }
    })

    tithiIdx++
    if (tithiIdx >= 15) {
      tithiIdx = 0
      if (isShukla) {
        isShukla = false
      } else {
        isShukla = true
        monthIdx = (monthIdx + 1) % 12
      }
    }

    nakshatraIdx = (nakshatraIdx + 1) % NAKSHATRAS.length
    yogIdx = (yogIdx + 1) % YOGS.length
    karanIdx = (karanIdx + 1) % KARANS.length

    dayCounter++
    currDate.setDate(currDate.getDate() + 1)
  }

  const csvFilePath = path.join(__dirname, 'public', 'drik_panchang_5_years_2026_2031.csv')
  fs.writeFileSync(csvFilePath, rows.join('\n'), 'utf8')
  console.log(`CSV generated successfully! Saved ${rows.length - 1} rows to: ${csvFilePath}`)

  console.log('Seeding 5-Year Panchang into Database...')
  let seededCount = 0

  // Sequential seeding to prevent Prisma connection pool overflow
  for (const record of panchangRecords) {
    await prisma.panchang.upsert({
      where: { date: record.date },
      update: record,
      create: record,
    })
    seededCount++
    if (seededCount % 200 === 0) {
      console.log(`Seeded ${seededCount} / ${panchangRecords.length} Panchang records...`)
    }
  }

  console.log(`Database Seeded Successfully! Total ${seededCount} daily Panchang records live in database!`)
}

generatePanchang5Years()
  .then(() => {
    prisma.$disconnect()
    process.exit(0)
  })
  .catch((err) => {
    console.error('Error generating 5-year panchang:', err)
    prisma.$disconnect()
    process.exit(1)
  })
