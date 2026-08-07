const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🕉️ Updating 11,000 Maha Mrityunjaya Jaap & Maharudrabhishekam (Jaap & Abhishek only) in DB...')

  const pujaData = {
    name: '11,000 महामृत्युंजय मंत्र जाप एवं महारुद्राभिषेक (11,000 Maha Mrityunjaya Jaap & Abhishek)',
    slug: '11000-mahamrityunjaya-jaap-maharudrabhishekam',
    shortDescription: 'अकाल मृत्यु योग निवारण, असाध्य बीमारियों से रक्षा, दीर्घायु एवं उत्तम स्वास्थ्य हेतु 11,000 वैदिक सम्पुट महामृत्युंजय मंत्र जाप एवं 108 पवित्र द्रव्यों द्वारा महारुद्राभिषेक।',
    description: `
<h2>11,000 महामृत्युंजय मंत्र जाप एवं महारुद्राभिषेक अनुष्ठान</h2>
<p>भगवान महाकाल शिव का <strong>महामृत्युंजय मंत्र (त्र्यम्बकं यजामहे सुगन्धिं पुष्टिप्रवर्धनम्)</strong> सनातन धर्म का सबसे शक्तिशाली मृत्युंजय व आरोग्य मंत्र माना जाता है। <strong>माँ कात्यायनी दुर्गा शक्ति पीठ, जोधपुर (राजस्थान)</strong> में मुख्य वेदाचार्य पं. मुकेश बोहरा जी के सानिध्य में 11,000 मन्त्रों का सस्वर सम्पुट जाप एवं पावन महारुद्राभिषेक संपन्न किया जाता है।</p>

<h3>🌸 महाअनुष्ठान के अमोघ पावन लाभ (Key Divine & Health Benefits):</h3>
<ul>
  <li><strong>11,000 सम्पुट मंत्र जाप (11,000 Vedic Mantra Jaap):</strong> वेदपाठी आचार्यों द्वारा सस्वर 11,000 महामृत्युंजय मंत्र जाप से अकाल मृत्यु योग, मारकेश व अकाल दुर्घटनाओं से रक्षा।</li>
  <li><strong>108 पवित्र द्रव्यों द्वारा महारुद्राभिषेक (Maharudrabhishekam):</strong> गंगाजल, दुग्ध, शहद, पंचामृत, कुशा जल व भस्म द्वारा भगवान आशुतोष शिव का पवित्र महारुद्राभिषेक।</li>
  <li><strong>असाध्य रोग व शल्य चिकित्सा से सुरक्षा:</strong> गंभीर बीमारियों, आईसीयू कष्ट, दीर्घकालिक स्वास्थ्य समस्याओं से मुक्ति एवं उत्तम आरोग्यता की प्राप्ति।</li>
  <li><strong>शनि साढ़ेसाती व मारकेश शांति:</strong> शनि की साढ़ेसाती, ढैय्या, राहु-केतु महादशा व ग्रहबाधाओं का शमन।</li>
  <li><strong>लाइव वीडियो संकल्प व सिद्ध रक्षा भस्म प्रसाद:</strong> आपके नाम व गोत्र के साथ लाइव वीडियो संकल्प एवं सिद्ध मृत्युंजय भस्म व प्रसाद आपके घर पर।</li>
</ul>

<h3>📍 पूजा स्थल (Venue):</h3>
<p><strong>माँ कात्यायनी दुर्गा शक्ति पीठ, जोधपुर (राजस्थान)</strong></p>

<h3>👨‍⚖️ मुख्य वेदाचार्य (Assigned Priest):</h3>
<p><strong>पं. मुकेश बोहरा (Pt. Mukesh Bohra), जोधपुर</strong></p>

<h3>📅 पूजा तिथि (Date):</h3>
<p><em>(तिथि शीघ्र घोषित की जाएगी - आप अभी संकल्प बुक कर सकते हैं)</em></p>
    `,
    benefits: '11,000 महामृत्युंजय सम्पुट मंत्र जाप, 108 द्रव्य महारुद्राभिषेक, असाध्य रोग व अकाल दुर्घटना सुरक्षा, दीर्घायु व आरोग्य लाभ',
    procedure: 'सस्वर संकल्प -> 108 द्रव्य महारुद्राभिषेक -> 11,000 महामृत्युंजय सम्पुट मंत्र जाप -> सिद्ध मृत्युंजय आरती व रक्षा भस्म वितरण',
    seoTitle: '11000 Maha Mrityunjaya Jaap & Maharudrabhishekam Online Booking | Jodhpur',
    seoDescription: 'Book 11,000 Maha Mrityunjaya Jaap & Maharudrabhishekam online at Katyayani Shakti Peeth Jodhpur by Pt. Mukesh Bohra. Protection from diseases, accidents & longevity blessings.',
    seoKeywords: '11000 mahamrityunjay jaap online, mahamrityunjay jaap booking, maharudrabhishekam online, maha mrityunjaya mantra puja jodhpur, divyayagyam mahamrityunjaya puja'
  }

  const puja = await prisma.puja.update({
    where: { slug: pujaData.slug },
    data: pujaData
  })

  console.log('🎉 SUCCESS! Updated Puja (Jaap & Abhishek) in DB:', puja.name, 'ID:', puja.id)
}

main()
  .catch(err => {
    console.error('❌ Error updating Puja:', err)
  })
  .finally(() => prisma.$disconnect())
