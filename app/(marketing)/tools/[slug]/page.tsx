import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle, Lock, Sparkles, Wrench } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ToolMapper } from '@/components/tools/ToolMapper'
import { PaywallOverlay } from '@/components/tools/PaywallOverlay'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ToolViewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const normalizedSlug = decodeURIComponent(slug).toLowerCase().trim()

  // 1. Try exact slug match
  let tool = await prisma.spiritualTool.findFirst({
    where: {
      OR: [
        { slug: slug },
        { slug: normalizedSlug },
        { id: slug }
      ]
    }
  })

  // 2. Fallback: case-insensitive search
  if (!tool) {
    tool = await prisma.spiritualTool.findFirst({
      where: {
        slug: { equals: normalizedSlug, mode: 'insensitive' }
      }
    })
  }

  // 3. Fallback: match by name slugified
  if (!tool) {
    const allTools = await prisma.spiritualTool.findMany()
    tool = allTools.find(t => 
      t.slug.toLowerCase().trim() === normalizedSlug ||
      t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === normalizedSlug
    ) || null
  }

  if (!tool) {
    return (
      <div className="container max-w-2xl py-20 text-center space-y-6">
        <div className="h-20 w-20 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Wrench className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-black text-slate-800">Spiritual Tool Coming Soon</h1>
        <p className="text-slate-600 font-medium">
          This Vedic tool is currently being configured or updated. Please check back shortly or explore our active tools.
        </p>
        <Button asChild className="bg-orange-600 hover:bg-orange-700 font-bold rounded-xl px-8 h-12">
          <Link href="/tools">Explore Active Tools</Link>
        </Button>
      </div>
    )
  }

  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') || '127.0.0.1'

  let allowed = tool.isFree

  if (!allowed) {
    // 1. Check if there is a valid free trial for this IP
    const trialLog = await prisma.toolUsageLog.findFirst({
      where: {
        toolId: tool.id,
        ipAddress: ip
      }
    })
    if (trialLog && tool.trialDays > 0) {
      const daysSinceTrial = Math.floor((Date.now() - new Date(trialLog.usedAt).getTime()) / (1000 * 60 * 60 * 24))
      if (daysSinceTrial < tool.trialDays) {
        allowed = true
      }
    }
  }

  if (!allowed) {
    try {
      const { getCurrentUser } = await import('@/lib/auth')
      const user = await getCurrentUser()
      if (user) {
        // Admin gets access to all tools
        if (user.role === 'super_admin' || user.role === 'store_manager') {
          allowed = true
        } else {
          // Check if user has a PAID order for this tool
          const userOrder = await prisma.order.findFirst({
            where: {
              userId: user.id,
              paymentStatus: 'SUCCESS',
              items: {
                some: {
                  OR: [
                    { name: { contains: tool.name } },
                    { productId: `tool-${tool.id}` }
                  ]
                }
              }
            }
          })
          if (userOrder) {
            allowed = true
          }
        }
      }
    } catch (err) {
      allowed = false
    }
  }

  return (
    <div className="container max-w-4xl py-10 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {tool.name} 
            {!tool.isFree && <span className="bg-amber-100 text-amber-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Sparkles className="h-3 w-3" /> Premium</span>}
          </h1>
          <p className="text-muted-foreground mt-1">{tool.description}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/tools">Back to Tools</Link>
        </Button>
      </div>

      <div className="relative">
        {/* Render the tool */}
        <div className={!allowed ? "max-h-[400px] overflow-hidden blur-[2px] opacity-60 pointer-events-none select-none relative" : ""}>
          <ToolMapper tool={tool} isPremiumUnlocked={allowed} />
        </div>

        {/* The Paywall Overlay */}
        {!allowed && (
          <PaywallOverlay tool={tool} />
        )}
      </div>
    </div>
  )
}
