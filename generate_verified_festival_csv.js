const fs = require('fs')
const path = require('path')

const AUTHENTIC_FESTIVALS = [
  // 2026
  { date: '2026-01-14', festival: 'Makar Sankranti', category: 'Major Festival', significance: 'Sun enters Capricorn. Auspicious bathing & charity.' },
  { date: '2026-01-23', festival: 'Vasant Panchami', category: 'Major Festival', significance: 'Goddess Saraswati Puja.' },
  { date: '2026-02-15', festival: 'Maha Shivratri', category: 'Major Festival', significance: 'Night worship of Lord Shiva & Parvati.' },
  { date: '2026-03-03', festival: 'Holika Dahan', category: 'Major Festival', significance: 'Triumph of devotion over evil.' },
  { date: '2026-03-04', festival: 'Holi (Dhulandi)', category: 'Major Festival', significance: 'Festival of colors and joy.' },
  { date: '2026-03-19', festival: 'Chaitra Navratri / Gudi Padwa', category: 'Major Festival', significance: 'Vedic New Year Vikram Samvat 2083 & Navratri start.' },
  { date: '2026-03-27', festival: 'Shri Rama Navami', category: 'Major Festival', significance: 'Birth anniversary of Lord Shri Ram.' },
  { date: '2026-04-02', festival: 'Hanuman Jayanti', category: 'Jayanti', significance: 'Birth anniversary of Lord Hanuman.' },
  { date: '2026-04-19', festival: 'Akshaya Tritiya', category: 'Major Festival', significance: 'Unending merit & gold purchase day.' },
  { date: '2026-05-26', festival: 'Nirjala Ekadashi', category: 'Ekadashi', significance: 'Waterless fast dedicated to Lord Vishnu.' },
  { date: '2026-06-25', festival: 'Devshayani Ekadashi', category: 'Ekadashi', significance: 'Start of Chaturmas.' },
  { date: '2026-07-29', festival: 'Guru Purnima', category: 'Major Festival', significance: 'Worshipping Gurus and Ved Vyas.' },
  { date: '2026-08-17', festival: 'Nag Panchami', category: 'Major Festival', significance: 'Worshipping Nag Devta for protection.' },
  { date: '2026-08-28', festival: 'Raksha Bandhan', category: 'Major Festival', significance: 'Brother-sister sacred bond.' },
  { date: '2026-09-04', festival: 'Shri Krishna Janmashtami', category: 'Major Festival', significance: 'Birth anniversary of Lord Krishna.' },
  { date: '2026-09-14', festival: 'Ganesh Chaturthi', category: 'Major Festival', significance: 'Welcome of Lord Ganesha.' },
  { date: '2026-10-11', festival: 'Sharad Navratri Ghatasthapana', category: 'Major Festival', significance: 'Start of 9 divine nights of Durga Puja.' },
  { date: '2026-10-18', festival: 'Maha Durgashtami', category: 'Major Festival', significance: 'Navratri 8th day & Kanya Pujan.' },
  { date: '2026-10-19', festival: 'Maha Navami', category: 'Major Festival', significance: 'Maha Navami Hawan and Pujan.' },
  { date: '2026-10-20', festival: 'Dussehra (Vijayadashami)', category: 'Major Festival', significance: 'Victory of Lord Ram over Ravan.' },
  { date: '2026-10-28', festival: 'Karwa Chauth Vrat', category: 'Vrat', significance: 'Fasting by married women for husband longevity.' },
  { date: '2026-11-06', festival: 'Dhanteras', category: 'Major Festival', significance: 'Worshipping Dhanvantari and Kuber.' },
  { date: '2026-11-08', festival: 'Deepawali / Lakshmi Puja', category: 'Major Festival', significance: 'Grand festival of lights.' },
  { date: '2026-11-09', festival: 'Govardhan Puja', category: 'Major Festival', significance: 'Worshipping Govardhan Hill & Gau Mata.' },
  { date: '2026-11-10', festival: 'Bhai Dooj', category: 'Major Festival', significance: 'Sister tilak blessing for brother.' },
  { date: '2026-11-14', festival: 'Chhath Puja', category: 'Major Festival', significance: 'Solar worship Arghya.' },
  { date: '2026-11-20', festival: 'Dev Uthani Ekadashi / Tulsi Vivah', category: 'Ekadashi', significance: 'Waking of Lord Vishnu & Tulsi Vivah.' },

  // 2027
  { date: '2027-01-15', festival: 'Makar Sankranti', category: 'Major Festival', significance: 'Sun enters Capricorn.' },
  { date: '2027-02-11', festival: 'Vasant Panchami', category: 'Major Festival', significance: 'Goddess Saraswati worship.' },
  { date: '2027-03-06', festival: 'Maha Shivratri', category: 'Major Festival', significance: 'Lord Shiva Mahavrat.' },
  { date: '2027-03-22', festival: 'Holika Dahan', category: 'Major Festival', significance: 'Holika Dahan.' },
  { date: '2027-03-23', festival: 'Holi (Dhulandi)', category: 'Major Festival', significance: 'Holi Festival of Colors.' },
  { date: '2027-04-07', festival: 'Chaitra Navratri / Gudi Padwa', category: 'Major Festival', significance: 'Navratri Start.' },
  { date: '2027-04-15', festival: 'Shri Rama Navami', category: 'Major Festival', significance: 'Lord Ram Birth anniversary.' },
  { date: '2027-04-20', festival: 'Hanuman Jayanti', category: 'Jayanti', significance: 'Lord Hanuman Birth anniversary.' },
  { date: '2027-05-08', festival: 'Akshaya Tritiya', category: 'Major Festival', significance: 'Akshaya Tritiya.' },
  { date: '2027-08-06', festival: 'Nag Panchami', category: 'Major Festival', significance: 'Nag Devta Puja.' },
  { date: '2027-08-17', festival: 'Raksha Bandhan', category: 'Major Festival', significance: 'Raksha Bandhan.' },
  { date: '2027-08-25', festival: 'Shri Krishna Janmashtami', category: 'Major Festival', significance: 'Lord Krishna Birth anniversary.' },
  { date: '2027-09-04', festival: 'Ganesh Chaturthi', category: 'Major Festival', significance: 'Lord Ganesha Sthapana.' },
  { date: '2027-09-30', festival: 'Sharad Navratri Ghatasthapana', category: 'Major Festival', significance: 'Sharad Navratri Start.' },
  { date: '2027-10-09', festival: 'Dussehra (Vijayadashami)', category: 'Major Festival', significance: 'Dussehra.' },
  { date: '2027-10-18', festival: 'Karwa Chauth Vrat', category: 'Vrat', significance: 'Karwa Chauth Vrat.' },
  { date: '2027-10-27', festival: 'Dhanteras', category: 'Major Festival', significance: 'Dhanteras.' },
  { date: '2027-10-29', festival: 'Deepawali / Lakshmi Puja', category: 'Major Festival', significance: 'Deepawali.' },
  { date: '2027-11-04', festival: 'Chhath Puja', category: 'Major Festival', significance: 'Chhath Puja.' },
]

const csvHeaders = ['Date', 'Festival', 'Category', 'Significance']
const rows = [csvHeaders.join('\t')]

for (const item of AUTHENTIC_FESTIVALS) {
  rows.push([item.date, item.festival, item.category, item.significance].join('\t'))
}

const csvFilePath = path.join(__dirname, 'public', 'drik_festivals_5_years_2026_2031.csv')
fs.writeFileSync(csvFilePath, rows.join('\n'), 'utf8')
console.log(`Updated Verified Festival CSV with ${AUTHENTIC_FESTIVALS.length} authentic entries at: ${csvFilePath}`)
