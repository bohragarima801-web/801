import { NextResponse } from 'next/server';

// This one-time DB migration endpoint has been disabled after successful execution.
// The migration (blogs authorId optional + seoKeywords column) was applied via Prisma migration.
export async function GET() {
  return NextResponse.json({ ok: false, error: 'This migration endpoint has been disabled.' }, { status: 410 });
}
