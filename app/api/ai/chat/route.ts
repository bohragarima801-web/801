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
  const q = (userQuery || '').toLowerCase()

  // 1. Off-topic check (outside DivyaYagyam & Sanatan Seva)
  const offTopicKeywords = [
    'code', 'python', 'javascript', 'html', 'css', 'java', 'c++', 'programming',
    'cricket', 'football', 'sports', 'match', 'ipl', 'score',
    'movie', 'actor', 'bollywood', 'hollywood', 'song',
    'politics', 'election', 'modi', 'rahul', 'party',
    'weather', 'joke', 'chutkula', 'news', 'bitcoin', 'crypto'
  ]

  const isOffTopic = offTopicKeywords.some(k => q.includes(k))

  if (isOffTopic) {
    if (mode === 'gargi') {
      return `हरि ओम्! 🙏 मैं गार्गी हूँ, दिव्ययज्ञम् की सहायता अधिकारी।\n\nक्षमा करें, मैं केवल दिव्ययज्ञम् (www.divyayagyam.com) की पूजाओं, अभिमंत्रित उत्पादों और बुकिंग सेवाओं से संबंधित प्रश्नों का उत्तर देने के लिए ही समर्पित हूँ। कृपया अपनी पूजा या उत्पाद संबंधी प्रश्न पूछें। कल्याणम अस्तु! 🌸`
    }
    return `हरि ओम्! 🙏 मैं दिव्ययज्ञम् का वैदिक वर्चुअल पंडित जी हूँ।\n\nमैं केवल दिव्ययज्ञम् पोर्टल पर उपलब्ध पूजा अनुष्ठानों, अभिमंत्रित उत्पादों (रुद्राक्ष, कौड़ी, यंत्र), पंचांग और सनातन वैदिक मार्गदर्शिका से संबंधित प्रश्नों का उत्तर देने के लिए अधिकृत हूँ।\n\nआप दिव्ययज्ञम् (www.divyayagyam.com) पर उपलब्ध पूजा या आध्यात्मिक समस्या के बारे में पूछ सकते हैं। कल्याणम अस्तु! 🌸`
  }

  // 2. Specific DivyaYagyam Puja / Product query matching
  if (q.includes('कालसर्प') || q.includes('kalsarp') || q.includes('सर्प')) {
    return `हरि ओम्! 🙏 **कालसर्प दोष निवारण पूजा (Trimbakeshwar / Ujjain)**\n\nयदि आपकी कुंडली में कालसर्प दोष है तो जीवन में रुकावटें, मानसिक तनाव व कार्य में देरी आती है। दिव्ययज्ञम् पर विद्वान आचार्यों द्वारा नाम व गोत्र से सिद्ध कालसर्प दोष शांति पूजा आयोजित की जाती है।\n\nविस्तृत जानकारी व बुकिंग के लिए हमारी वेबसाइट पर **Pujas → Kalsarp Dosh** सेक्शन देखें या WhatsApp (+91-95871-71984) पर संपर्क करें। कल्याणम अस्तु! 🌸`
  }

  if (q.includes('महामृत्युंजय') || q.includes('mrityunjaya') || q.includes('स्वास्थ्य') || q.includes('बीमारी')) {
    return `हरि ओम्! 🙏 **महामृत्युंजय हवन एवं मंत्र जाप**\n\nअसाध्य रोगों से मुक्ति, उत्तम स्वास्थ्य और दीर्घायु के लिए महामृत्युंजय अनुष्ठान सर्वोत्तम है। दिव्ययज्ञम् द्वारा यह अनुष्ठान वैदिक रीति से सम्पन्न कराया जाता है और अभिमंत्रित भस्म/प्रसाद आपके घर भेजा जाता है।\n\nबुकिंग के लिए पोर्टल पर **Mahamrityunjaya Hawan** विकल्प चुनें। शुभम भवतु! 🌸`
  }

  if (q.includes('रुद्राक्ष') || q.includes('rudraksha') || q.includes('माला')) {
    return `हरि ओम्! 🙏 **100% असली व अभिमंत्रित रुद्राक्ष माला**\n\nदिव्ययज्ञम् पर 5-मुखी एवं 7-मुखी सिद्ध रुद्राक्ष माला उपलब्ध है जो नेपाल/हरिद्वार के पवित्र स्थानों से मंत्रों द्वारा अभिमंत्रित कर आपके घर भेजी जाती है।\n\nखरीदने के लिए हमारी वेबसाइट पर **Products → Rudraksha Mala** देखें। हरि ओम्! 🌸`
  }

  if (q.includes('बगलामुखी') || q.includes('bagalamukhi') || q.includes('शत्रु') || q.includes('कोर्ट')) {
    return `हरि ओम्! 🙏 **बगलामुखी मिर्ची हवन एवं कवच पूजा**\n\nशत्रु बाधा, कोर्ट-कचहरी के विवाद और तंत्र बाधा से मुक्ति के लिए माँ बगलामुखी की पूजा अत्यंत प्रभावकारी है। दिव्ययज्ञम् पर नाम-गोत्र संकल्प से यह विशेष अनुष्ठान कराया जाता है।\n\nअधिक जानकारी के लिए **Pujas → Bagalamukhi Hawan** पर जाएँ। कल्याणम अस्तु! 🌸`
  }

  if (q.includes('बुकिंग') || q.includes('book') || q.includes('ऑर्डर') || q.includes('order')) {
    return `हरि ओम्! 🙏 **दिव्ययज्ञम् पर पूजा बुक करने की प्रक्रिया:**\n\n1. हमारी वेबसाइट www.divyayagyam.com पर जाएँ।\n2. अपनी इच्छित पूजा (जैसे कालसर्प, महामृत्युंजय, नवग्रह) चुनें।\n3. अपना नाम, गोत्र और संकल्प विवरण दर्ज करके सुरक्षित ऑनलाइन भुगतान करें।\n4. पूजा सम्पन्न होने के बाद वीडियो/तस्वीरें एवं अभिमंत्रित प्रसाद आपके पते पर भेजा जाएगा।\n\nसहायता के लिए कॉल/व्हाट्सएप करें: +91-95871-71984। 🌸`
  }

  if (mode === 'gargi') {
    return `हरि ओम्! 🙏 मैं गार्गी, दिव्ययज्ञम् की सहायक।\n\nदिव्ययज्ञम् (www.divyayagyam.com) पर आपका स्वागत है। हमारे माध्यम से आप देश के प्रसिद्ध मंदिरों से नाम-गोत्र संकल्प से ऑनलाइन पूजा बुक कर सकते हैं तथा अभिमंत्रित रुद्राक्ष, लक्ष्मी कौड़ी एवं महाप्रसाद घर मँगवा सकते हैं।\n\nसहायता के लिए हमें WhatsApp (+91-95871-71984) करें। कल्याणम अस्तु! 🌸`
  }

  return `हरि ओम्! 🙏 दिव्ययज्ञम् के वर्चुअल पंडित जी का प्रणाम।\n\nअपनी समस्या या कुंडली विवरण (जन्म तिथि, समय, स्थान) साझा करें। हम आपको दिव्ययज्ञम् पर उपलब्ध सही वैदिक पूजा (कालसर्प, नवग्रह, महामृत्युंजय) एवं उपायों की सलाह देंगे।\n\nवेबसाइट: www.divyayagyam.com | हेल्पलाइन: +91-95871-71984। कल्याणम अस्तु! 🌸`
}
