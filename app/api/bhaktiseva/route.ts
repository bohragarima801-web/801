import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const offerings = await prisma.bhaktiSevaOffering.findMany({
      where: {
        isActive: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ ok: true, offerings, data: offerings })
  } catch (error) {
    console.error('Error fetching bhaktiSeva offerings:', error)
    return NextResponse.json({ ok: false, offerings: [], data: [] }, { status: 500 })
  }
}

