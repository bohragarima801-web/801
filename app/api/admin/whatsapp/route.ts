import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-session'
import { revalidatePath, revalidateTag } from 'next/cache'

export const dynamic = 'force-dynamic'

const DEFAULT_TEAM_MEMBERS = [
  {
    id: 'wa_default_1',
    name: 'Pandit Seva Desk',
    phone: '919530401984',
    role: 'Online Puja & Sankalp Booking',
    message: 'जय श्री राम! मुझे पूजा एवं नाम-गोत्र संकल्प के बारे में जानकारी चाहिए।',
    isPrimary: true,
    isActive: true,
  },
  {
    id: 'wa_default_2',
    name: 'Store & Prasad Helpline',
    phone: '919530401984',
    role: 'Prasad Delivery & Spiritual Products',
    message: 'जय श्री राम! मुझे सिद्ध प्रसाद एवं प्रोडक्ट डिलीवरी की जानकारी चाहिए।',
    isPrimary: false,
    isActive: true,
  },
]

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

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

    let teamMembers = DEFAULT_TEAM_MEMBERS
    if (settingsMap['whatsapp.team_members']) {
      try {
        const parsed = JSON.parse(settingsMap['whatsapp.team_members'])
        if (Array.isArray(parsed) && parsed.length > 0) {
          teamMembers = parsed
        }
      } catch (e) {}
    }

    return NextResponse.json({
      ok: true,
      data: {
        teamMembers,
        widgetEnabled: settingsMap['whatsapp.widget_enabled'] !== 'false',
        widgetTitle: settingsMap['whatsapp.widget_title'] || 'DivyaYagyam WhatsApp Seva (व्हाट्सएप सहायता)',
        defaultPhone: settingsMap['whatsapp.default_phone'] || '919530401984',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Database error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

    const { teamMembers, widgetEnabled, widgetTitle, defaultPhone } = await req.json()

    if (!Array.isArray(teamMembers)) {
      return NextResponse.json({ ok: false, error: 'teamMembers must be an array' }, { status: 400 });
    }

    // Format phone numbers to ensure standard wa.me format
    const formattedMembers = teamMembers.map((m: any, idx: number) => {
      let cleanPhone = String(m.phone || '').replace(/[^\d]/g, '')
      if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`
      return {
        id: m.id || `wa_${Date.now()}_${idx}`,
        name: String(m.name || 'Team Member').trim(),
        phone: cleanPhone || '919530401984',
        role: String(m.role || 'General Assistance').trim(),
        message: String(m.message || 'जय श्री राम! मुझे जानकारी चाहिए।').trim(),
        isPrimary: !!m.isPrimary,
        isActive: m.isActive !== undefined ? !!m.isActive : true,
      }
    })

    // Ensure at least 1 primary number
    if (!formattedMembers.some((m) => m.isPrimary) && formattedMembers.length > 0) {
      formattedMembers[0].isPrimary = true
    }

    const primaryMember = formattedMembers.find((m) => m.isPrimary) || formattedMembers[0]
    const primaryPhone = primaryMember ? primaryMember.phone : (defaultPhone || '919530401984')

    const upserts = [
      prisma.websiteSetting.upsert({
        where: { key: 'whatsapp.team_members' },
        create: { key: 'whatsapp.team_members', value: JSON.stringify(formattedMembers), group: 'whatsapp' },
        update: { value: JSON.stringify(formattedMembers) },
      }),
      prisma.websiteSetting.upsert({
        where: { key: 'whatsapp.widget_enabled' },
        create: { key: 'whatsapp.widget_enabled', value: String(!!widgetEnabled), group: 'whatsapp' },
        update: { value: String(!!widgetEnabled) },
      }),
      prisma.websiteSetting.upsert({
        where: { key: 'whatsapp.widget_title' },
        create: { key: 'whatsapp.widget_title', value: String(widgetTitle || '').trim(), group: 'whatsapp' },
        update: { value: String(widgetTitle || '').trim() },
      }),
      prisma.websiteSetting.upsert({
        where: { key: 'whatsapp.default_phone' },
        create: { key: 'whatsapp.default_phone', value: primaryPhone, group: 'whatsapp' },
        update: { value: primaryPhone },
      }),
    ]

    await prisma.$transaction(upserts)

    revalidatePath('/')
    revalidateTag('whatsapp-config')

    return NextResponse.json({
      ok: true,
      message: '✅ WhatsApp team numbers & settings saved live!',
      data: {
        teamMembers: formattedMembers,
        primaryPhone,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to save settings' }, { status: 500 });
  }
}
