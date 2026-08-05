import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const DEFAULT_MEMBERS = [
  {
    id: 'wa_1',
    name: 'Pandit Seva Desk',
    phone: '919587171984',
    role: 'Online Puja & Sankalp Booking',
    message: 'जय श्री राम! मुझे पूजा एवं नाम-गोत्र संकल्प के बारे में जानकारी चाहिए।',
    isPrimary: true,
    isActive: true,
  },
  {
    id: 'wa_2',
    name: 'Store & Prasad Helpline',
    phone: '919532011984',
    role: 'Prasad Delivery & Spiritual Products',
    message: 'जय श्री राम! मुझे सिद्ध प्रसाद एवं प्रोडक्ट डिलीवरी की जानकारी चाहिए।',
    isPrimary: false,
    isActive: true,
  },
]

export async function GET() {
  try {
    const settings = await prisma.websiteSetting.findMany({
      where: {
        key: {
          in: [
            'whatsapp.team_members',
            'whatsapp.widget_enabled',
            'whatsapp.widget_title',
            'whatsapp.default_phone',
          ],
        },
      },
    })

    const settingsMap: Record<string, string> = {}
    settings.forEach((s) => {
      const val = typeof s.value === 'string' ? s.value : JSON.stringify(s.value)
      settingsMap[s.key] = val.replace(/^"|"$/g, '')
    })

    let teamMembers = DEFAULT_MEMBERS
    if (settingsMap['whatsapp.team_members']) {
      try {
        const parsed = JSON.parse(settingsMap['whatsapp.team_members'])
        if (Array.isArray(parsed) && parsed.length > 0) {
          teamMembers = parsed
        }
      } catch (e) {}
    }

    const activeMembers = teamMembers.filter((m) => m.isActive)
    const primaryMember = activeMembers.find((m) => m.isPrimary) || activeMembers[0] || DEFAULT_MEMBERS[0]

    return NextResponse.json({
      ok: true,
      widgetEnabled: settingsMap['whatsapp.widget_enabled'] !== 'false',
      widgetTitle: settingsMap['whatsapp.widget_title'] || 'DivyaYagyam WhatsApp Seva (व्हाट्सएप सहायता)',
      primaryMember,
      teamMembers: activeMembers,
    }, {
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
    })
  } catch {
    return NextResponse.json({
      ok: true,
      widgetEnabled: true,
      widgetTitle: 'DivyaYagyam WhatsApp Seva',
      primaryMember: DEFAULT_MEMBERS[0],
      teamMembers: DEFAULT_MEMBERS,
    })
  }
}
