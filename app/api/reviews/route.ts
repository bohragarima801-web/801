import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureDbUser } from '@/lib/user-resolver'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      pujaId,
      productId,
      rating,
      comment,
      title,
      reviewerName,
      phone,
      email
    } = body

    const numericRating = Math.max(1, Math.min(5, Number(rating) || 5))
    const name = String(reviewerName || 'श्रद्धालु').trim()
    const text = String(comment || '').trim()

    if (!text || text.length < 5) {
      return NextResponse.json(
        { success: false, message: 'कृपया अपनी समीक्षा में कम से कम 5 अक्षर लिखें।' },
        { status: 400 }
      )
    }

    if (!pujaId && !productId) {
      return NextResponse.json(
        { success: false, message: 'पूजा या उत्पाद का चयन अनिवार्य है।' },
        { status: 400 }
      )
    }

    // Resolve or create devotee user
    const dbUser = await ensureDbUser(null, {
      name,
      phone: phone ? String(phone).trim() : null,
      email: email ? String(email).trim() : null
    })

    const newReview = await prisma.review.create({
      data: {
        userId: dbUser.id,
        pujaId: pujaId || null,
        productId: productId || null,
        rating: numericRating,
        title: title ? String(title).trim() : 'पावन अनुभव व आशीर्वाद',
        comment: text,
        reviewerName: name,
        isVerified: true,
        isApproved: false // Admin approval ensures zero spam
      }
    })

    return NextResponse.json({
      success: true,
      message: 'धन्यवाद! आपकी पावन समीक्षा सफलतापूर्वक दर्ज कर ली गई है। समीक्षा अनुमोदन (Approval) के बाद वेबसाइट पर प्रदर्शित होगी।',
      reviewId: newReview.id
    })
  } catch (error: any) {
    console.error('Error submitting review:', error)
    return NextResponse.json(
      { success: false, message: 'समीक्षा दर्ज करने में त्रुटि हुई। कृपया पुनः प्रयास करें।' },
      { status: 500 }
    )
  }
}
