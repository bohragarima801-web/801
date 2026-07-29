import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const dummySlugs = ['kundali', 'panchang', 'milan', 'muhurat', 'numerology', 'ratna', 'mala']
    const tools = await prisma.spiritualTool.findMany({
      where: { 
        isActive: true,
        slug: { notIn: dummySlugs }
      },
      orderBy: { createdAt: 'desc' }
    })

    const user = await getCurrentUser().catch(() => null)
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'

    // Fetch user paid orders
    let paidToolSlugs: string[] = []
    if (user) {
      if (user.role === 'super_admin' || user.role === 'store_manager') {
        paidToolSlugs = tools.map(t => t.slug)
      } else {
        const userOrders = await prisma.order.findMany({
          where: {
            userId: user.id,
            paymentStatus: 'SUCCESS'
          },
          include: { items: true }
        })
        tools.forEach(t => {
          const hasPaidOrder = userOrders.some(order => 
            order.items.some(item => 
              item.name.toLowerCase().includes(t.name.toLowerCase()) || 
              item.name.toLowerCase().includes(t.slug.toLowerCase())
            )
          )
          if (hasPaidOrder) {
            paidToolSlugs.push(t.slug)
          }
        })
      }
    }

    // Fetch active trials by IP
    const trialLogs = await prisma.toolUsageLog.findMany({
      where: { ipAddress: ip }
    })

    const activeTrialSlugs: string[] = []
    tools.forEach(t => {
      if (t.trialDays > 0) {
        const log = trialLogs.find(l => l.toolId === t.id)
        if (log) {
          const daysSinceTrial = Math.floor((Date.now() - new Date(log.usedAt).getTime()) / (1000 * 60 * 60 * 24))
          if (daysSinceTrial < t.trialDays) {
            activeTrialSlugs.push(t.slug)
          }
        }
      }
    })
    
    return NextResponse.json({ 
      ok: true, 
      data: tools,
      userPaidSlugs: paidToolSlugs,
      activeTrialSlugs
    })
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Failed to fetch tools' }, { status: 500 })
  }
}
