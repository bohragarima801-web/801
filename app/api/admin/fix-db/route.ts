import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

import { getAdminSession } from '@/lib/admin-session';

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

    await prisma.$executeRawUnsafe('ALTER TABLE "blogs" ALTER COLUMN "authorId" DROP NOT NULL;');
    await prisma.$executeRawUnsafe('ALTER TABLE "blogs" ADD COLUMN IF NOT EXISTS "seoKeywords" TEXT;');
    return NextResponse.json({ success: true, message: "Database fixed! authorId is optional and seoKeywords is added." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
