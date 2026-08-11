import { NextRequest } from 'next/server'
import { getLLM, MODELS, SYSTEM_PROMPTS, type ChatMessage } from '@/lib/ai'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const maxDuration = 60

type Mode = 'pandit' | 'admin_content' | 'admin_blog' | 'admin_seo' | 'support' | 'gargi'

export async function OPTIONS(req: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function POST(req: NextRequest) {
  let doStream = true
  let session_id = null
  let mode: Mode = 'pandit'
  try {
    const body = await req.json().catch(() => null)
    const {
      messages = [],
      mode: inputMode = 'pandit' as Mode,
      model,
      stream = true,
      session_id: sid = null,
    } = body || {}

    mode = inputMode
    doStream = stream
    session_id = sid

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ ok: false, error: 'messages required' }), { status: 400 })
    }

    let chosenModel =
      model ||
      (mode === 'admin_blog' || mode === 'admin_content' ? MODELS.PRO : MODELS.FLASH)

    let systemPrompt = SYSTEM_PROMPTS[mode as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.pandit

    if (mode === 'support' || mode === 'gargi') {
      const user = await getCurrentUser()
      if (user) {
        try {
          const [orders, bookings, tickets] = await Promise.all([
            prisma.order.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 3 }),
            prisma.booking.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 3, include: { puja: { select: { name: true } } } }),
            prisma.supportTicket.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 3 })
          ])

          const contextData = `
\n--- CUSTOMER DATA (DO NOT SHARE RAW DATA, JUST USE TO ANSWER) ---
Customer Name: ${user.fullName || 'Devotee'}
Recent Orders: ${orders.length > 0 ? orders.map(o => `#${o.orderNumber} (${o.status})`).join(', ') : 'None'}
Recent Bookings: ${bookings.length > 0 ? bookings.map(b => `${b.puja?.name || 'Puja'} - ${b.status}`).join(', ') : 'None'}
Recent Tickets: ${tickets.length > 0 ? tickets.map(t => `#${t.ticketNumber} - ${t.subject} (${t.status})`).join(', ') : 'None'}
--------------------------------------------------------------
`
          systemPrompt += contextData
        } catch (e) {
          // ignore db errors
        }
      } else {
        systemPrompt += `\n\nNote: The user is currently NOT logged in. If they ask about orders, ask them to login first.`
      }
    }

    // Extract last user message
    const lastUserMessage = [...messages].reverse().find((m: any) => m.role === 'user')?.content || ''

    const chatMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: any) => ({ role: m.role, content: m.content })),
    ]

    try {
      const llm = await getLLM()

      if (!doStream) {
        const completion = await llm.chat.completions.create({
          model: chosenModel,
          messages: chatMessages as any,
          temperature: mode.startsWith('admin') ? 0.75 : 0.85,
        })
        const text = completion.choices?.[0]?.message?.content ?? ''
        return new Response(JSON.stringify({
          ok: true,
          content: text,
          model: chosenModel,
          session_id: session_id || null,
        }), { headers: { 'Content-Type': 'application/json' } })
      }

      // Streaming path
      const completionStream = await llm.chat.completions.create({
        model: chosenModel,
        messages: chatMessages as any,
        temperature: mode.startsWith('admin') ? 0.75 : 0.85,
        stream: true,
      })

      const encoder = new TextEncoder()
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of completionStream as any) {
              const delta = chunk?.choices?.[0]?.delta?.content
              if (delta) controller.enqueue(encoder.encode(delta))
            }
            controller.close()
          } catch (err: any) {
            const fallback = getSiteAwareFallback(lastUserMessage, mode)
            controller.enqueue(encoder.encode(`\n\n${fallback}`))
            controller.close()
          }
        },
      })

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'X-Model': chosenModel,
        },
      })
    } catch (llmErr: any) {
      // Smart site fallback when LLM API Key is missing, invalid or unavailable
      const fallbackText = getSiteAwareFallback(lastUserMessage, mode)

      if (!doStream) {
        return new Response(JSON.stringify({
          ok: true,
          content: fallbackText,
          model: 'site-aware-fallback',
          session_id: session_id || null,
        }), { headers: { 'Content-Type': 'application/json' } })
      } else {
        const encoder = new TextEncoder()
        const readable = new ReadableStream({
          start(controller) {
            controller.enqueue(encoder.encode(fallbackText))
            controller.close()
          }
        })
        return new Response(readable, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            'X-Model': 'site-aware-fallback',
          },
        })
      }
    }
  } catch (err: any) {
    const fallbackText = `हरि ओम्! 🙏 दिव्ययज्ञम् (www.divyayagyam.com) के वर्चुअल पंडित जी कक्ष में आपका स्वागत है। किसी भी सहायता के लिए हमें WhatsApp +91-95871-71984 पर संपर्क करें।`
    return new Response(JSON.stringify({ ok: true, content: fallbackText }), { headers: { 'Content-Type': 'application/json' } })
  }
}

function getSiteAwareFallback(userQuery: string, mode: Mode): string {
  const q = (userQuery || '').trim().toLowerCase()

  // 1. Off-topic check (outside DivyaYagyam & Sanatan Seva)
  const offTopicKeywords = [
    'code', 'python', 'javascript', 'html', 'css', 'java', 'c++', 'programming',
    'cricket', 'football', 'sports', 'match', 'ipl', 'score',
    'movie', 'actor', 'bollywood', 'hollywood', 'song',
    'politics', 'election', 'modi', 'rahul', 'party',
    'weather', 'joke', 'chutkula', 'news', 'bitcoin', 'crypto', 'game'
  ]

  if (offTopicKeywords.some(k => q.includes(k))) {
    if (mode === 'gargi') {
      return `हरि ओम्! 🙏 मैं गार्गी हूँ, दिव्ययज्ञम् की सहायता अधिकारी।\n\nक्षमा करें, मैं केवल दिव्ययज्ञम् (www.divyayagyam.com) की पूजाओं, अभिमंत्रित उत्पादों और बुकिंग सेवाओं से संबंधित प्रश्नों का उत्तर देने के लिए ही समर्पित हूँ। किसी भी फालतू या बाहरी सवाल का जवाब देना मेरे कार्यक्षेत्र से बाहर है।\n\nकृपया अपनी पूजा या उत्पाद संबंधी प्रश्न पूछें। कल्याणम अस्तु! 🌸`
    }
    return `हरि ओम्! 🙏 मैं दिव्ययज्ञम् का वैदिक वर्चुअल पंडित जी हूँ।\n\nमैं केवल दिव्ययज्ञम् पोर्टल पर उपलब्ध पूजा अनुष्ठानों, अभिमंत्रित उत्पादों (रुद्राक्ष, कौड़ी, यंत्र), पंचांग और सनातन वैदिक मार्गदर्शिका से संबंधित प्रश्नों का उत्तर देने के लिए अधिकृत हूँ।\n\nआप दिव्ययज्ञम् (www.divyayagyam.com) पर उपलब्ध पूजा या आध्यात्मिक समस्या के बारे में पूछ सकते हैं। कल्याणम अस्तु! 🌸`
  }

  // 2. Greetings
  if (['hi', 'hello', 'hey', 'pranam', 'namaste', 'hari om', 'जय श्री कृष्णा', 'नमस्कार', 'राम राम'].some(g => q === g || q.startsWith(g))) {
    if (mode === 'gargi') {
      return `हरि ओम्! 🙏 मैं गार्गी, दिव्ययज्ञम् कस्टमर सपोर्ट से हूँ।\n\nदिव्ययज्ञम् पोर्टल पर आपका स्वागत है। मैं आपकी पूजा बुकिंग, ऑर्डर स्टेटस, रुद्राक्ष/कौड़ी उत्पादों तथा मंदिर सेवाओं में सहायता कर सकती हूँ। आप आज क्या जानना चाहते हैं? 🌸`
    }
    return `हरि ओम्! 🙏 कल्याणम अस्तु। मैं दिव्ययज्ञम् का वर्चुअल पंडित जी हूँ।\n\nअपनी जन्म-तिथि (DOB), जन्म समय (Time) और स्थान (Place) के साथ अपनी समस्या बताएँ या दिव्ययज्ञम् पर उपलब्ध पूजा अनुष्ठानों के बारे में पूछें। शुभम भवतु! 🌸`
  }

  // 3. Marriage / Relationship / Katyayani Puja
  if (q.includes('शादी') || q.includes('विवाह') || q.includes('marriage') || q.includes('रिश्ता') || q.includes('कात्यायनी') || q.includes('katyayani')) {
    return `हरि ओम्! 🙏 **विवाह बाधा निवारण एवं माँ कात्यायनी यज्ञ**\n\nयदि विवाह में विलंब हो रहा है या योग्य जीवनसाथी मिलने में बाधा आ रही है, तो माँ कात्यायनी की पूजा अत्यंत फलदायी है।\n\nदिव्ययज्ञम् पर विद्वान आचार्यों द्वारा नाम-गोत्र से **Katyayani Yagya** का अनुष्ठान कराया जाता है। अपनी जन्म-कुण्डली के आधार पर विशेष जानकारी के लिए हमारी वेबसाइट पर **Pujas → Katyayani Yagya** देखें या WhatsApp (+91-95871-71984) करें। कल्याणम अस्तु! 🌸`
  }

  // 4. Health / Illness / Mahamrityunjaya Puja
  if (q.includes('स्वास्थ्य') || q.includes('बीमारी') || q.includes('health') || q.includes('महामृत्युंजय') || q.includes('रोग') || q.includes('mrityunjaya')) {
    return `हरि ओम्! 🙏 **महामृत्युंजय अनुष्ठान एवं आरोग्य लाभ**\n\nदीर्घकालिक रोगों से मुक्ति, शारीरिक कष्ट निवारण और दीर्घायु के लिए महामृत्युंजय जाप व हवन सर्वोत्तम वैदिक उपाय है।\n\nदिव्ययज्ञम् पर यह अनुष्ठान आपके नाम-गोत्र के संकल्प से सम्पादित किया जाता है और सिद्ध भस्म प्रसाद आपके पते पर भेजा जाता है। बुकिंग के लिए पोर्टल पर **Pujas → Mahamrityunjaya Hawan** चुनें। शुभम भवतु! 🌸`
  }

  // 5. Wealth / Money / Career / Ashta Lakshmi / Navgrah Puja
  if (q.includes('धन') || q.includes('पैसा') || q.includes('नौकरी') || q.includes('करियर') || q.includes('व्यापार') || q.includes('लक्ष्मी') || q.includes('wealth') || q.includes('job') || q.includes('money')) {
    return `हरि ओम्! 🙏 **समृद्धि एवं व्यापार वृद्धि हेतु अष्टलक्ष्मी व नवग्रह पूजा**\n\nआर्थिक तंगी, व्यापार में घाटा या नौकरी में रुकावट के लिए **Ashta Lakshmi 16 Days Puja** तथा **Navgrah Shanti Yagya** का अनुष्ठान सिद्ध माना गया है।\n\nसाथ ही दिव्ययज्ञम् पर 100% सिद्ध **Laxmi Kaudi Set (11 कौड़ी)** भी घर मँगवा सकते हैं। अधिक जानकारी के लिए वेबसाइट पर **Pujas & Products** सेक्शन देखें। कल्याणम अस्तु! 🌸`
  }

  // 6. Enemy / Court Case / Protection / Bagalamukhi / Pratyangira
  if (q.includes('शत्रु') || q.includes('कोर्ट') || q.includes('मुकदमा') || q.includes('बगलामुखी') || q.includes('प्रत्यंगिरा') || q.includes('जादू') || q.includes('तंत्र')) {
    return `हरि ओम्! 🙏 **माँ बगलामुखी मिर्ची हवन एवं प्रत्यंगिरा शक्ति कवच**\n\nशत्रु विजय, कोर्ट-कचहरी के केस एवं तंत्र/नकारात्मक ऊर्जाओं से रक्षा के लिए माँ पीताम्बरा (बगलामुखी) का विशेष मिर्ची हवन अचूक है।\n\nदिव्ययज्ञम् पर यह उग्र अनुष्ठान सिद्ध पीठों में कराया जाता है। विस्तृत जानकारी के लिए **Pujas → Bagalamukhi Hawan** पर जाएँ। शुभम भवतु! 🌸`
  }

  // 7. Kalsarp Dosh / Rahu Ketu
  if (q.includes('कालसर्प') || q.includes('kalsarp') || q.includes('राहु') || q.includes('केतु') || q.includes('सर्प')) {
    return `हरि ओम्! 🙏 **कालसर्प दोष शांति पूजा (Trimbakeshwar / Ujjain)**\n\nकुंडली में राहु-केतु के बीच सभी ग्रहों के आने से कालसर्प योग बनता है जिससे हर काम में असफलता व मानसिक तनाव रहता है।\n\nदिव्ययज्ञम् पर त्र्यंबकेश्वर व उज्जैन से पंडित जी द्वारा **Kalsarp Dosh Puja** (Single / Couple / VIP) नाम-गोत्र संकल्प से कराई जाती है। बुकिंग हेतु पोर्टल पर **Pujas → Kalsarp Dosh** देखें। कल्याणम अस्तु! 🌸`
  }

  // 8. Shani Dosh / Sade Sati / Dhaiya
  if (q.includes('शनि') || q.includes('साढ़े साती') || q.includes('ढैय्या') || q.includes('shani')) {
    return `हरि ओम्! 🙏 **शनि दोष शांति एवं तेल अभिषेक पूजा**\n\nशनि की साढ़े साती या ढैय्या के दुष्प्रभाव से मुक्ति पाने के लिए शनिवार विशेष तेल शांति व नवग्रह शनि यज्ञ कराया जाता है।\n\nदिव्ययज्ञम् पर सिद्ध पंडितों द्वारा **Shani Dosh Nivaran** अनुष्ठान बुक करें। कल्याणम अस्तु! 🌸`
  }

  // 9. Pitra Dosh / Ancestors / Tarpan
  if (q.includes('पितृ') || q.includes('pitra') || q.includes('तर्पण') || q.includes('श्राद्ध') || q.includes('पूर्वज')) {
    return `हरि ओम्! 🙏 **पितृ शांति तर्पण एवं पितृ गीता पाठ**\n\nपूर्वजों की शांति हेतु तथा पितृ दोष से परिवार की सुरक्षा के लिए पितृ तर्पण एवं गीता पाठ अत्यंत आवश्यक है।\n\nदिव्ययज्ञम् पर हरिद्वार/काशी तट पर नाम-गोत्र संकल्प से **Pitra Shanti Puja** आयोजित की जाती है। **Pujas → Pitra Puja** पर जाएँ। 🌸`
  }

  // 10. Products / Rudraksha / Kaudi / Naag Naagin
  if (q.includes('रुद्राक्ष') || q.includes('rudraksha') || q.includes('कौड़ी') || q.includes('kaudi') || q.includes('नाग') || q.includes('सामग्री') || q.includes('उत्पाद')) {
    return `हरि ओम्! 🙏 **100% अभिमंत्रित सनातन वैदिक उत्पाद**\n\n- **सिद्ध रुद्राक्ष माला (5/7 मुखी)**: मानसिक शांति व स्वास्थ्य के लिए\n- **लक्ष्मी कौड़ी सेट (11 Pcs)**: तिजोरी व व्यापार में धन वृद्धि हेतु\n- **तांबे का नाग-नागिन जोड़ा**: कालसर्प व राहु शांति हेतु\n\nसभी उत्पाद मंत्रों द्वारा सिद्ध कर होम डिलीवरी किए जाते हैं। **Products** मेनू में देखें। 🌸`
  }

  // 11. Booking Process / Order Status / Support
  if (q.includes('बुकिंग') || q.includes('book') || q.includes('ऑर्डर') || q.includes('order') || q.includes('स्टेटस') || q.includes('status') || q.includes('प्रसाद')) {
    if (mode === 'gargi') {
      return `हरि ओम्! 🙏 **दिव्ययज्ञम् सपोर्ट गाइड:**\n\n1. **ऑर्डर / बुकिंग स्थिति**: अपने एकाउंट (/dashboard/bookings) में लॉगिन करें या हमें WhatsApp (+91-95871-71984) पर अपना ऑर्डर नंबर भेजें।\n2. **पूजा बुकिंग**: इच्छित पूजा चुनें → नाम/गोत्र दर्ज करें → भुगतान करें।\n3. **प्रसाद**: पूजा के 3-5 दिन में अभिमंत्रित प्रसाद कोरियर द्वारा आपके पते पर पहुँच जाता है। 🌸`
    }
    return `हरि ओम्! 🙏 **दिव्ययज्ञम् पूजा बुकिंग प्रक्रिया:**\n\n1. www.divyayagyam.com पर अपनी इच्छित पूजा (जैसे कालसर्प, महामृत्युंजय) चुनें।\n2. अपना नाम, गोत्र और संकल्प विवरण दर्ज करके बुकिंग पूर्ण करें।\n3. पूजा सम्पन्न होने के बाद वीडियो/तस्वीरें एवं अभिमंत्रित प्रसाद घर मँगवाया जाता है।\n\nकॉल/व्हाट्सएप: +91-95871-71984। कल्याणम अस्तु! 🌸`
  }

  // 12. Mode Specific Default Fallbacks (Intelligent & Diverse)
  if (mode === 'gargi') {
    return `हरि ओम्! 🙏 मैं गार्गी, दिव्ययज्ञम् Customer Support से।\n\nआप दिव्ययज्ञम् पोर्टल पर उपलब्ध किसी भी पूजा अनुष्ठान (कालसर्प, महामृत्युंजय, बगलामुखी), मंदिर VIP दर्शन, गौ-सेवा या सिद्ध उत्पादों (रुद्राक्ष, लक्ष्मी कौड़ी) के बारे में पूछ सकते हैं।\n\nसहायता हेतु Helpline: +91-95871-71984। कल्याणम अस्तु! 🌸`
  }

  return `हरि ओम्! 🙏 दिव्ययज्ञम् के डिजिटल पंडित कक्ष में आपका स्वागत है।\n\nअपनी जन्म-तिथि (DOB), समय (Time) व स्थान (Place) के साथ अपनी समस्या साझा करें, या दिव्ययज्ञम् (www.divyayagyam.com) पर उपलब्ध विशेष वैदिक पूजाओं के बारे में पूछें।\n\nहेल्पलाइन: +91-95871-71984 | Email: seva@divyayagyam.com। कल्याणम अस्तु! 🌸`
}
