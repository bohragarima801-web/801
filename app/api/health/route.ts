import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Ping DB to ensure it's alive
    await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      db: 'connected'
    }, { status: 200 });
  } catch (err: any) {
// console.error('❌ Health check failed:', err) (removed for production)
    // Return 503 Service Unavailable so monitoring tools (like UptimeRobot) know it's down
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: err.message
    }, { status: 503 });
  }
}
