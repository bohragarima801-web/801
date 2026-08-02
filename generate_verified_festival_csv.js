const fs = require('fs')
const path = require('path')

const AUTHENTIC_FESTIVALS = [
  // AUGUST 2026
  { date: '2026-08-01', festival: 'Sankashti Chaturthi', category: 'Vrat', significance: 'Moonrise fast dedicated to Lord Ganesha.' },
  { date: '2026-08-08', festival: 'Kamika Ekadashi Vrat', category: 'Ekadashi', significance: 'Ekadashi fast in Shravana month.' },
  { date: '2026-08-10', festival: 'Som Pradosh Vrat', category: 'Vrat', significance: 'Twilight Shiva puja.' },
  { date: '2026-08-13', festival: 'Hariyali Amavasya', category: 'Major Festival', significance: 'Tree planting and Pitru Tarpan.' },
  { date: '2026-08-15', festival: 'Hariyali Teej', category: 'Major Festival', significance: 'Women fast for Goddess Parvati & Shiva.' },
  { date: '2026-08-17', festival: 'Nag Panchami', category: 'Major Festival', significance: 'Worshipping Nag Devta for protection.' },
  { date: '2026-08-20', festival: 'Tulsidas Jayanti', category: 'Jayanti', significance: 'Birth anniversary of Goswami Tulsidas.' },
  { date: '2026-08-23', festival: 'Shravana Putrada Ekadashi Vrat', category: 'Ekadashi', significance: 'Ekadashi fast for children welfare.' },
  { date: '2026-08-28', festival: 'Raksha Bandhan', category: 'Major Festival', significance: 'Brother-sister sacred bond.' },

  // SEPTEMBER 2026
  { date: '2026-09-02', festival: 'Balaram Jayanti / Hal Chhath', category: 'Jayanti', significance: 'Lord Balaram birth anniversary.' },
  { date: '2026-09-04', festival: 'Shri Krishna Janmashtami', category: 'Major Festival', significance: 'Birth anniversary of Lord Krishna.' },
  { date: '2026-09-06', festival: 'Aja Ekadashi Vrat', category: 'Ekadashi', significance: 'Ekadashi fast for destroying sins.' },
  { date: '2026-09-13', festival: 'Haritalika Teej Vrat', category: 'Major Festival', significance: 'Strict fast for marital bliss.' },
  { date: '2026-09-14', festival: 'Ganesh Chaturthi (Sthapana)', category: 'Major Festival', significance: 'Lord Ganesha Sthapana.' },
  { date: '2026-09-15', festival: 'Rishi Panchami', category: 'Vrat', significance: 'Sapta Rishi worship.' },
  { date: '2026-09-17', festival: 'Radhashtami', category: 'Jayanti', significance: 'Shri Radha Rani birth anniversary.' },
  { date: '2026-09-20', festival: 'Parivartini Ekadashi Vrat', category: 'Ekadashi', significance: 'Lord Vishnu posture change.' },
  { date: '2026-09-23', festival: 'Anant Chaturdashi / Ganesh Visarjan', category: 'Major Festival', significance: 'Lord Anant Puja & Ganesh Visarjan.' },
  { date: '2026-09-25', festival: 'Pitru Paksha Starts', category: 'Major Festival', significance: 'Shraddha rituals for ancestors.' },

  // OCTOBER 2026
  { date: '2026-10-06', festival: 'Indira Ekadashi Vrat', category: 'Ekadashi', significance: 'Ancestral liberation Ekadashi.' },
  { date: '2026-10-10', festival: 'Sarvapitri Amavasya', category: 'Major Festival', significance: 'Pitru Paksha culmination.' },
  { date: '2026-10-11', festival: 'Sharad Navratri Ghatasthapana', category: 'Major Festival', significance: 'Start of 9 nights Durga Puja.' },
  { date: '2026-10-18', festival: 'Maha Durgashtami Vrat', category: 'Major Festival', significance: 'Maha Ashtami & Kanya Pujan.' },
  { date: '2026-10-19', festival: 'Maha Navami', category: 'Major Festival', significance: 'Navratri Hawan and Pujan.' },
  { date: '2026-10-20', festival: 'Dussehra (Vijayadashami)', category: 'Major Festival', significance: 'Victory of Lord Ram over Ravan.' },
  { date: '2026-10-28', festival: 'Karwa Chauth Vrat', category: 'Vrat', significance: 'Fasting by married women.' },

  // NOVEMBER 2026
  { date: '2026-11-05', festival: 'Rama Ekadashi Vrat', category: 'Ekadashi', significance: 'Kartika Krishna Ekadashi.' },
  { date: '2026-11-06', festival: 'Dhanteras', category: 'Major Festival', significance: 'Worshipping Dhanvantari & Kuber.' },
  { date: '2026-11-07', festival: 'Chhoti Diwali (Narak Chaturdashi)', category: 'Major Festival', significance: 'Yamadeep lighting.' },
  { date: '2026-11-08', festival: 'Deepawali / Lakshmi Puja', category: 'Major Festival', significance: 'Grand festival of lights.' },
  { date: '2026-11-09', festival: 'Govardhan Puja', category: 'Major Festival', significance: 'Govardhan Hill & Gau Mata Puja.' },
  { date: '2026-11-10', festival: 'Bhai Dooj (Yama Dwitiya)', category: 'Major Festival', significance: 'Sister tilak for brother.' },
  { date: '2026-11-14', festival: 'Chhath Puja', category: 'Major Festival', significance: 'Solar worship Arghya.' },
  { date: '2026-11-20', festival: 'Dev Uthani Ekadashi / Tulsi Vivah', category: 'Ekadashi', significance: 'Waking of Lord Vishnu & Tulsi Vivah.' },

  // DECEMBER 2026
  { date: '2026-12-04', festival: 'Utpanna Ekadashi Vrat', category: 'Ekadashi', significance: 'Ekadashi Devi origin day.' },
  { date: '2026-12-19', festival: 'Gita Jayanti / Mokshada Ekadashi', category: 'Ekadashi', significance: 'Bhagavad Gita revelation day.' },
]

const csvHeaders = ['Date', 'Festival', 'Category', 'Significance']
const rows = [csvHeaders.join('\t')]

for (const item of AUTHENTIC_FESTIVALS) {
  rows.push([item.date, item.festival, item.category, item.significance].join('\t'))
}

const csvFilePath = path.join(__dirname, 'public', 'drik_festivals_5_years_2026_2031.csv')
fs.writeFileSync(csvFilePath, rows.join('\n'), 'utf8')
console.log(`Master Drik Panchang Festival CSV updated with ${AUTHENTIC_FESTIVALS.length} entries at: ${csvFilePath}`)
