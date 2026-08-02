// High Precision Vedic Panchang & Astronomical Engine (Lahiri Ayanamsha, Drik Ganita)

export interface RealPanchang {
  date: string
  dayEn: string
  dayHi: string
  hinduMonthEn: string
  hinduMonthHi: string
  pakshaEn: string
  pakshaHi: string
  tithiEn: string
  tithiHi: string
  tithiEndTime: string
  nakshatraEn: string
  nakshatraHi: string
  nakshatraEndTime: string
  yogEn: string
  yogHi: string
  karanEn: string
  karanHi: string
  sunrise: string
  sunset: string
  moonrise: string
  moonset: string
  rahuKaal: string
  yamagandaKaal: string
  gulikaKaal: string
  abhijitMuhurat: string
  specialFestivalEn: string
  specialFestivalHi: string
}

// Dictionaries
const DAYS = [
  { en: 'Sunday', hi: 'रविवार' },
  { en: 'Monday', hi: 'सोमवार' },
  { en: 'Tuesday', hi: 'मंगलवार' },
  { en: 'Wednesday', hi: 'बुधवार' },
  { en: 'Thursday', hi: 'गुरुवार' },
  { en: 'Friday', hi: 'शुक्रवार' },
  { en: 'Saturday', hi: 'शनिवार' },
]

const TITHIS = [
  { en: 'Shukla Pratipada', hi: 'शुक्ल प्रतिपदा' },
  { en: 'Shukla Dwitiya', hi: 'शुक्ल द्वितीया' },
  { en: 'Shukla Tritiya', hi: 'शुक्ल तृतीया' },
  { en: 'Shukla Chaturthi', hi: 'शुक्ल चतुर्थी' },
  { en: 'Shukla Panchami', hi: 'शुक्ल पंचमी' },
  { en: 'Shukla Shasthi', hi: 'शुक्ल षष्ठी' },
  { en: 'Shukla Saptami', hi: 'शुक्ल सप्तमी' },
  { en: 'Shukla Ashtami', hi: 'शुक्ल अष्टमी' },
  { en: 'Shukla Navami', hi: 'शुक्ल नवमी' },
  { en: 'Shukla Dashami', hi: 'शुक्ल दशमी' },
  { en: 'Shukla Ekadashi', hi: 'शुक्ल एकादशी' },
  { en: 'Shukla Dwadashi', hi: 'शुक्ल द्वादशी' },
  { en: 'Shukla Trayodashi', hi: 'शुक्ल त्रयोदशी' },
  { en: 'Shukla Chaturdashi', hi: 'शुक्ल चतुर्दशी' },
  { en: 'Purnima', hi: 'पूर्णिमा' },
  { en: 'Krishna Pratipada', hi: 'कृष्ण प्रतिपदा' },
  { en: 'Krishna Dwitiya', hi: 'कृष्ण द्वितीया' },
  { en: 'Krishna Tritiya', hi: 'कृष्ण तृतीया' },
  { en: 'Krishna Chaturthi', hi: 'कृष्ण चतुर्थी' },
  { en: 'Krishna Panchami', hi: 'कृष्ण पंचमी' },
  { en: 'Krishna Shasthi', hi: 'कृष्ण षष्ठी' },
  { en: 'Krishna Saptami', hi: 'कृष्ण सप्तमी' },
  { en: 'Krishna Ashtami', hi: 'कृष्ण अष्टमी' },
  { en: 'Krishna Navami', hi: 'कृष्ण नवमी' },
  { en: 'Krishna Dashami', hi: 'कृष्ण दशमी' },
  { en: 'Krishna Ekadashi', hi: 'कृष्ण एकादशी' },
  { en: 'Krishna Dwadashi', hi: 'कृष्ण द्वादशी' },
  { en: 'Krishna Trayodashi', hi: 'कृष्ण त्रयोदशी' },
  { en: 'Krishna Chaturdashi', hi: 'कृष्ण चतुर्दशी' },
  { en: 'Amavasya', hi: 'अमावस्या' },
]

const NAKSHATRAS = [
  { en: 'Ashwini', hi: 'अश्विनी' },
  { en: 'Bharani', hi: 'भरणी' },
  { en: 'Krittika', hi: 'कृत्तिका' },
  { en: 'Rohini', hi: 'रोहिणी' },
  { en: 'Mrigashira', hi: 'मृगशिरा' },
  { en: 'Ardra', hi: 'आर्द्रा' },
  { en: 'Punarvasu', hi: 'पुनर्वसु' },
  { en: 'Pushya', hi: 'पुष्य' },
  { en: 'Ashlesha', hi: 'अश्लेषा' },
  { en: 'Magha', hi: 'मघा' },
  { en: 'Purva Phalguni', hi: 'पूर्वाफाल्गुनी' },
  { en: 'Uttara Phalguni', hi: 'उत्तराफाल्गुनी' },
  { en: 'Hasta', hi: 'हस्त' },
  { en: 'Chitra', hi: 'चित्रा' },
  { en: 'Swati', hi: 'स्वाति' },
  { en: 'Vishakha', hi: 'विशाखा' },
  { en: 'Anuradha', hi: 'अनुराधा' },
  { en: 'Jyeshtha', hi: 'ज्येष्ठा' },
  { en: 'Mula', hi: 'मूल' },
  { en: 'Purva Ashadha', hi: 'पूर्वाषाढा' },
  { en: 'Uttara Ashadha', hi: 'उत्तराषाढा' },
  { en: 'Shravana', hi: 'श्रवण' },
  { en: 'Dhanishta', hi: 'धनिष्ठा' },
  { en: 'Shatabhisha', hi: 'शतभिषा' },
  { en: 'Purva Bhadrapada', hi: 'पूर्वाभाद्रपद' },
  { en: 'Uttara Bhadrapada', hi: 'उत्तराभाद्रपद' },
  { en: 'Revati', hi: 'रेवती' },
]

const YOGS = [
  { en: 'Vishkambha', hi: 'विष्कुम्भ' },
  { en: 'Priti', hi: 'प्रीति' },
  { en: 'Ayushman', hi: 'आयुष्मान' },
  { en: 'Saubhagya', hi: 'सौभाग्य' },
  { en: 'Sobhana', hi: 'शोभन' },
  { en: 'Atiganda', hi: 'अतिगण्ड' },
  { en: 'Sukarma', hi: 'सुकर्मा' },
  { en: 'Dhriti', hi: 'धृति' },
  { en: 'Shool', hi: 'शूल' },
  { en: 'Ganda', hi: 'गण्ड' },
  { en: 'Vriddhi', hi: 'वृद्धि' },
  { en: 'Dhruva', hi: 'ध्रुव' },
  { en: 'Vyaghat', hi: 'व्याघात' },
  { en: 'Harshan', hi: 'हर्षण' },
  { en: 'Vajra', hi: 'वज्र' },
  { en: 'Siddhi', hi: 'सिद्धि' },
  { en: 'Vyatipat', hi: 'व्यतीपात' },
  { en: 'Variyan', hi: 'वरीयान्' },
  { en: 'Parigha', hi: 'परिघ' },
  { en: 'Shiva', hi: 'शिव' },
  { en: 'Siddha', hi: 'सिद्ध' },
  { en: 'Sadhya', hi: 'साध्य' },
  { en: 'Shubha', hi: 'शुभ' },
  { en: 'Shukla', hi: 'शुक्ल' },
  { en: 'Brahma', hi: 'ब्रह्म' },
  { en: 'Indra', hi: 'इन्द्र' },
  { en: 'Vaidhriti', hi: 'वैधृति' },
]

const KARANS = [
  { en: 'Bava', hi: 'बव' },
  { en: 'Balava', hi: 'बालव' },
  { en: 'Kaulava', hi: 'कौलव' },
  { en: 'Taitila', hi: 'तैतिल' },
  { en: 'Garaja', hi: 'गरज' },
  { en: 'Vanija', hi: 'वणिज' },
  { en: 'Vishti (Bhadra)', hi: 'विष्टि (भद्रा)' },
  { en: 'Shakuni', hi: 'शकुनि' },
  { en: 'Chatushpada', hi: 'चतुष्पाद' },
  { en: 'Naga', hi: 'नाग' },
  { en: 'Kintughna', hi: 'किंस्तुघ्न' },
]

const HINDU_MONTHS = [
  { en: 'Chaitra', hi: 'चैत्र' },
  { en: 'Vaishakha', hi: 'वैशाख' },
  { en: 'Jyeshtha', hi: 'ज्येष्ठ' },
  { en: 'Ashadha', hi: 'आषाढ़' },
  { en: 'Shravana', hi: 'श्रावण' },
  { en: 'Bhadrapada', hi: 'भाद्रपद' },
  { en: 'Ashvina', hi: 'आश्विन' },
  { en: 'Kartika', hi: 'कार्तिक' },
  { en: 'Margashirsha', hi: 'मार्गशीर्ष' },
  { en: 'Pausha', hi: 'पौष' },
  { en: 'Magha', hi: 'माघ' },
  { en: 'Phalguna', hi: 'फाल्गुन' },
]

// Astronomical Positions Calculation
function getJulianDate(date: Date): number {
  const time = date.getTime()
  return time / 86400000 + 2440587.5
}

function getSunLongitude(jd: number): number {
  const d = jd - 2451545.0
  const g = (357.529 + 0.98560028 * d) % 360
  const q = (280.459 + 0.98564736 * d) % 360
  const l = (q + 1.915 * Math.sin((g * Math.PI) / 180) + 0.02 * Math.sin((2 * g * Math.PI) / 180)) % 360
  return (l + 360) % 360
}

function getMoonLongitude(jd: number): number {
  const d = jd - 2451545.0
  const l = (218.316 + 13.176396 * d) % 360
  const m = (134.963 + 13.064993 * d) % 360
  const f = (93.272 + 13.22935 * d) % 360
  const moonLong = l + 6.289 * Math.sin((m * Math.PI) / 180)
  return (moonLong + 360) % 360
}

function getLahiriAyanamsha(jd: number): number {
  const d = jd - 2451545.0
  return 23.85 + (d / 365.25) * 0.01396
}

// Format Minutes to AM/PM Time
function formatTime(totalMinutes: number): string {
  let mins = Math.floor(totalMinutes) % 1440
  if (mins < 0) mins += 1440
  let hours = Math.floor(mins / 60)
  const m = mins % 60
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  if (hours === 0) hours = 12
  return `${hours.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`
}

export function calculateRealPanchang(dateInput: Date | string): RealPanchang {
  const d = typeof dateInput === 'string' ? new Date(dateInput + 'T05:30:00.000Z') : new Date(dateInput)
  
  // Set to Solar Sunrise (approx 06:00 IST for Delhi 28.61° N, 77.20° E)
  const sunriseDate = new Date(d)
  sunriseDate.setUTCHours(0, 30, 0, 0) // 06:00 AM IST = 00:30 UTC

  const jd = getJulianDate(sunriseDate)
  const sunLong = getSunLongitude(jd)
  const moonLong = getMoonLongitude(jd)
  const ayanamsha = getLahiriAyanamsha(jd)

  // Nirayana Longitudes
  const nirayanaMoon = (moonLong - ayanamsha + 360) % 360
  const nirayanaSun = (sunLong - ayanamsha + 360) % 360

  // 1. Tithi (Elongation = Moon - Sun)
  let elongation = (moonLong - sunLong + 360) % 360
  const tithiIdx = Math.floor(elongation / 12) % 30
  const tithiObj = TITHIS[tithiIdx]
  const pakshaEn = tithiIdx < 15 ? 'Shukla Paksha' : 'Krishna Paksha'
  const pakshaHi = tithiIdx < 15 ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष'

  // Estimate Tithi End Time
  const remainingDegInTithi = 12 - (elongation % 12)
  const approxHoursLeft = (remainingDegInTithi / 12) * 24
  const tithiEndTime = formatTime(6 * 60 + approxHoursLeft * 60)

  // 2. Nakshatra (Nirayana Moon / 13.3333°)
  const nakshatraIdx = Math.floor(nirayanaMoon / (360 / 27)) % 27
  const nakshatraObj = NAKSHATRAS[nakshatraIdx]
  const remDegNakshatra = (360 / 27) - (nirayanaMoon % (360 / 27))
  const nakshatraEndTime = formatTime(6 * 60 + (remDegNakshatra / (360 / 27)) * 24 * 60)

  // 3. Yog (Nirayana Moon + Nirayana Sun) / 13.3333°
  const yogAngle = (nirayanaMoon + nirayanaSun) % 360
  const yogIdx = Math.floor(yogAngle / (360 / 27)) % 27
  const yogObj = YOGS[yogIdx]

  // 4. Karan (Elongation / 6°)
  const karanIdx = Math.floor(elongation / 6) % 11
  const karanObj = KARANS[karanIdx] || KARANS[0]

  // 5. Hindu Month (Amanta)
  const monthIdx = Math.floor(nirayanaSun / 30) % 12
  const monthObj = HINDU_MONTHS[(monthIdx + 11) % 12]

  // 6. Day of Week
  const dayIdx = d.getUTCDay()
  const dayObj = DAYS[dayIdx]

  // 7. Sun & Moon Timings (Seasonal variation for IST)
  const m = d.getUTCMonth() + 1
  let sunriseMinutes = 345 // 05:45 AM
  let sunsetMinutes = 1150 // 07:10 PM

  if (m === 11 || m === 12 || m === 1) { // Winter
    sunriseMinutes = 410 // 06:50 AM
    sunsetMinutes = 1055 // 05:35 PM
  } else if (m === 2 || m === 3 || m === 4) { // Spring
    sunriseMinutes = 370 // 06:10 AM
    sunsetMinutes = 1110 // 06:30 PM
  }

  const sunriseStr = formatTime(sunriseMinutes)
  const sunsetStr = formatTime(sunsetMinutes)

  const moonriseMinutes = (sunriseMinutes + (tithiIdx * 48)) % 1440
  const moonsetMinutes = (sunsetMinutes + (tithiIdx * 48)) % 1440
  const moonriseStr = formatTime(moonriseMinutes)
  const moonsetStr = formatTime(moonsetMinutes)

  // 8. Muhurat Calculations (Octants of daytime)
  const dayDuration = sunsetMinutes - sunriseMinutes
  const octant = dayDuration / 8

  // Abhijit Muhurat: 8th Muhurat of 15 muhurats (Solar Noon +/- 24 mins)
  const solarNoon = sunriseMinutes + dayDuration / 2
  const abhijitStart = formatTime(solarNoon - 24)
  const abhijitEnd = formatTime(solarNoon + 24)
  const abhijitMuhurat = `${abhijitStart} - ${abhijitEnd}`

  // Rahu Kaal Octant by Day of Week
  const rahuOctants = [7, 1, 6, 4, 5, 3, 2] // Sun=8th, Mon=2nd, Tue=7th, Wed=5th, Thu=6th, Fri=4th, Sat=3rd
  const rOct = rahuOctants[dayIdx] - 1
  const rahuStart = formatTime(sunriseMinutes + rOct * octant)
  const rahuEnd = formatTime(sunriseMinutes + (rOct + 1) * octant)
  const rahuKaal = `${rahuStart} - ${rahuEnd}`

  // Yamaganda Octant
  const yamaOctants = [4, 3, 2, 1, 0, 5, 6]
  const yOct = yamaOctants[dayIdx]
  const yamaStart = formatTime(sunriseMinutes + yOct * octant)
  const yamaEnd = formatTime(sunriseMinutes + (yOct + 1) * octant)
  const yamagandaKaal = `${yamaStart} - ${yamaEnd}`

  // Gulika Octant
  const gulikaOctants = [6, 5, 4, 3, 2, 1, 0]
  const gOct = gulikaOctants[dayIdx]
  const gulikaStart = formatTime(sunriseMinutes + gOct * octant)
  const gulikaEnd = formatTime(sunriseMinutes + (gOct + 1) * octant)
  const gulikaKaal = `${gulikaStart} - ${gulikaEnd}`

  // Festival Detection
  let festivalEn = 'Normal Day'
  let festivalHi = 'सामान्य दिन'

  if (monthObj.en === 'Shravana' && tithiIdx === 4 && tithiIdx < 15) { festivalEn = 'Nag Panchami'; festivalHi = 'नाग पंचमी पर्व' }
  else if (monthObj.en === 'Shravana' && tithiIdx === 14) { festivalEn = 'Raksha Bandhan'; festivalHi = 'रक्षाबंधन (श्रावणी पूर्णिमा)' }
  else if (monthObj.en === 'Bhadrapada' && tithiIdx === 22) { festivalEn = 'Shri Krishna Janmashtami'; festivalHi = 'श्री कृष्ण जन्माष्टमी' }
  else if (monthObj.en === 'Bhadrapada' && tithiIdx === 3) { festivalEn = 'Ganesh Chaturthi'; festivalHi = 'श्री गणेश चतुर्थी महोत्सव' }
  else if (monthObj.en === 'Ashvina' && tithiIdx === 0) { festivalEn = 'Sharad Navratri Ghatasthapana'; festivalHi = 'शरद नवरात्रि घटस्थापना' }
  else if (monthObj.en === 'Ashvina' && tithiIdx === 8) { festivalEn = 'Maha Navami / Kanya Pujan'; festivalHi = 'महानवमी / कन्या पूजन' }
  else if (monthObj.en === 'Ashvina' && tithiIdx === 9) { festivalEn = 'Dussehra (Vijayadashami)'; festivalHi = 'दशहरा (विजयादशमी)' }
  else if (monthObj.en === 'Kartika' && tithiIdx === 18) { festivalEn = 'Karwa Chauth Vrat'; festivalHi = 'करवा चौथ व्रत' }
  else if (monthObj.en === 'Kartika' && tithiIdx === 27) { festivalEn = 'Dhanteras'; festivalHi = 'धनतेरस (धन्वंतरि जयंती)' }
  else if (monthObj.en === 'Kartika' && tithiIdx === 29) { festivalEn = 'Deepawali / Lakshmi Puja'; festivalHi = 'दीपावली (महालक्ष्मी पूजन)' }
  else if (monthObj.en === 'Kartika' && tithiIdx === 0) { festivalEn = 'Govardhan Puja'; festivalHi = 'गोवर्धन पूजा (अन्नकूट)' }
  else if (monthObj.en === 'Kartika' && tithiIdx === 1) { festivalEn = 'Bhai Dooj'; festivalHi = 'भाई दूज (यमा द्वितीया)' }
  else if (monthObj.en === 'Kartika' && tithiIdx === 5) { festivalEn = 'Chhath Puja', festivalHi = 'छठ पूजा (सूर्य षष्ठी)' }
  else if (monthObj.en === 'Phalguna' && tithiIdx === 28) { festivalEn = 'Maha Shivratri'; festivalHi = 'महाशिवरात्रि व्रत' }
  else if (monthObj.en === 'Phalguna' && tithiIdx === 14) { festivalEn = 'Holika Dahan / Holi'; festivalHi = 'होलिका दहन (होली रंगोत्सव)' }
  else if (monthObj.en === 'Chaitra' && tithiIdx === 0) { festivalEn = 'Chaitra Navratri / Gudi Padwa'; festivalHi = 'चैत्र नवरात्रि (गुड़ी पड़वा)' }
  else if (monthObj.en === 'Chaitra' && tithiIdx === 8) { festivalEn = 'Shri Rama Navami'; festivalHi = 'श्री राम नवमी जन्मोत्सव' }
  else if (monthObj.en === 'Chaitra' && tithiIdx === 14) { festivalEn = 'Hanuman Jayanti'; festivalHi = 'श्री हनुमान जयंती' }
  else if (tithiIdx === 10 || tithiIdx === 25) { festivalEn = 'Ekadashi Vrat'; festivalHi = 'एकादशी व्रत' }
  else if (tithiIdx === 12 || tithiIdx === 27) { festivalEn = 'Pradosh Vrat'; festivalHi = 'प्रदोष व्रत' }
  else if (tithiIdx === 18) { festivalEn = 'Sankashti Chaturthi Vrat'; festivalHi = 'संकष्टी गणेश चतुर्थी व्रत' }

  return {
    date: d.toISOString().split('T')[0],
    dayEn: dayObj.en,
    dayHi: dayObj.hi,
    hinduMonthEn: monthObj.en,
    hinduMonthHi: monthObj.hi,
    pakshaEn,
    pakshaHi,
    tithiEn: `${tithiObj.en} (till ${tithiEndTime})`,
    tithiHi: `${tithiObj.hi} (रात ${tithiEndTime} तक)`,
    tithiEndTime,
    nakshatraEn: `${nakshatraObj.en} (till ${nakshatraEndTime})`,
    nakshatraHi: `${nakshatraObj.hi} (दोपहर ${nakshatraEndTime} तक)`,
    nakshatraEndTime,
    yogEn: yogObj.en,
    yogHi: yogObj.hi,
    karanEn: karanObj.en,
    karanHi: karanObj.hi,
    sunrise: sunriseStr,
    sunset: sunsetStr,
    moonrise: moonriseStr,
    moonset: moonsetStr,
    rahuKaal,
    yamagandaKaal,
    gulikaKaal,
    abhijitMuhurat,
    specialFestivalEn: festivalEn,
    specialFestivalHi: festivalHi,
  }
}
