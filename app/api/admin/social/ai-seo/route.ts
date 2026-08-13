import { NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/admin-session'
import { getLLM, getPreferredModel } from '@/lib/ai'

export async function POST(req: Request) {
  try {
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt, targetPlatform } = await req.json()
    if (!prompt) {
      return NextResponse.json({ ok: false, error: 'Prompt or topic is required.' }, { status: 400 })
    }

    let generatedTitle = `${prompt} — Divine Puja & Seva 🌸🕉️`
    let generatedCaption = `Experience divine blessings with our authentic Vedic rituals and puja offerings. Receive live video darshan, yajaman sankalp, and sacred prasad delivered right to your home.\n\n✨ Perform Seva: Join hundreds of devotees in this holy ceremony.\n\n📱 Book online today at DivyaYagyam!`
    let generatedHashtags = `#DivyaYagyam #VedicPuja #SanatanDharma #PujaOnline #HarHarMahadev #BhaktiSeva #SpiritualJourney #PrasadDelivery`

    try {
      const llm = await getLLM()
      const aiModel = getPreferredModel(llm.apiKey)
      const response = await llm.chat.completions.create({
        model: aiModel,
        messages: [
          {
            role: 'system',
            content: `You are a high-performing Social Media Manager and SEO Copywriter for DivyaYagyam (an online Sanatan Vedic Puja and Prasad delivery platform). Generate an engaging post caption, optimized SEO title, and relevant viral hashtags in Hindi/Hinglish/English mix. Format response as JSON with keys: title, caption, hashtags.`,
          },
          {
            role: 'user',
            content: `Topic/Prompt: ${prompt}. Target Platform: ${targetPlatform || 'General'}.`,
          },
        ],
        response_format: { type: 'json_object' },
      })

        const content = response.choices[0]?.message?.content
        if (content) {
          const parsed = JSON.parse(content)
          if (parsed.title) generatedTitle = parsed.title
          if (parsed.caption) generatedCaption = parsed.caption
          if (parsed.hashtags) generatedHashtags = parsed.hashtags
        }
      } catch (aiErr) {
        console.warn('[AISeo] OpenAI fallback to template generator:', aiErr)
      }
    }

    return NextResponse.json({
      ok: true,
      data: {
        title: generatedTitle,
        caption: generatedCaption,
        hashtags: generatedHashtags,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}
