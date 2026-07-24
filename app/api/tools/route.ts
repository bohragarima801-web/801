import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

import { STATIC_TOOLS } from '@/lib/static-tools'

export async function GET() {
  try {
    const tools = await prisma.spiritualTool.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })
    
    // Merge DB tools with Static tools
    // DB tools take precedence if slugs overlap
    const dbSlugs = new Set(tools.map(t => t.slug))
    const uniqueStaticTools = STATIC_TOOLS.filter(t => !dbSlugs.has(t.slug))
    
    const mergedTools = [...tools, ...uniqueStaticTools]

    return NextResponse.json({ ok: true, data: mergedTools })
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Failed to fetch tools' }, { status: 500 })
  }
}
