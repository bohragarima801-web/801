import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

function esc(s: unknown): string {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))
}

async function resolveDbUserId(user: { id: string; email: string; supabaseId?: string | null }) {
  let dbUserId = user.id
  if (!dbUserId || dbUserId === 'admin-system-id' || dbUserId.length > 36) {
    const dbUser = await prisma.user.findFirst({
      where: { OR: [{ email: user.email }, { supabaseId: user.supabaseId ?? '' }] }
    }).catch(() => null)
    if (dbUser) dbUserId = dbUser.id
  }
  return dbUserId
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    const dbUserId = await resolveDbUserId(user)
    const { id } = await params
    const isAdmin = user.role === 'super_admin' || user.role === 'store_manager'

    const payment = await prisma.payment.findFirst({
      where: isAdmin ? { id } : { id, userId: dbUserId },
      include: {
        user: { select: { fullName: true, email: true, phone: true } },
        order: {
          include: {
            items: true
          }
        },
        booking: {
          include: {
            puja: { select: { name: true } }
          }
        }
      }
    })

    if (!payment) return new NextResponse('Payment invoice not found', { status: 404 })

    const meta = payment.metadata as Record<string, any> | null
    const paymentType = meta?.paymentType || 'General Payment'
    const isTool = paymentType === 'tool_access'
    const isBhaktiSeva = paymentType === 'bhaktiSeva'
    
    let paymentTitle = 'Payment Receipt'
    let paymentSubtitle = 'Miscellaneous Payment'
    
    if (isTool) {
      paymentTitle = 'Tool Access Invoice'
      paymentSubtitle = 'Digital Tool Subscription'
    } else if (isBhaktiSeva) {
      paymentTitle = 'Bhakti Seva Receipt'
      paymentSubtitle = 'Donation / Seva'
    } else if (payment.order) {
      paymentTitle = 'Order Payment Receipt'
      paymentSubtitle = `Order #${payment.order.orderNumber}`
    } else if (payment.booking) {
      paymentTitle = 'Booking Payment Receipt'
      paymentSubtitle = `Booking #${payment.booking.bookingNumber} - ${payment.booking.puja?.name || ''}`
    }

    const paymentDate = payment.paidAt || payment.updatedAt
    const customerName = payment.user?.fullName || user.fullName || 'Valued Customer'
    const total = Number(payment.amount)

    const html = `<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Receipt - ${payment.id.slice(-8).toUpperCase()}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; background: #f8f8f8; color: #1a1a2e; font-size: 13px; }
  .invoice { max-width: 750px; margin: 20px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }

  .header { background: linear-gradient(135deg, #1e293b, #0f172a); color: white; padding: 32px 40px; display: flex; justify-content: space-between; align-items: flex-start; }
  .brand h1 { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
  .brand p { font-size: 11px; opacity: 0.75; margin-top: 4px; }
  .invoice-meta { text-align: right; }
  .invoice-meta .inv-num { font-size: 22px; font-weight: 800; }
  .invoice-meta .inv-label { font-size: 10px; opacity: 0.75; text-transform: uppercase; letter-spacing: 1px; }
  .inv-badge { display: inline-block; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 20px; padding: 4px 14px; font-size: 11px; font-weight: 700; margin-top: 8px; }

  .status-banner { background: #ecfdf5; border-left: 4px solid #10b981; padding: 12px 40px; display: flex; align-items: center; justify-content: space-between; }
  .status-banner.pending { background: #fffbeb; border-color: #f59e0b; }
  .status-banner.failed { background: #fef2f2; border-color: #ef4444; }

  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; padding: 28px 40px; border-bottom: 1px solid #f0f0f0; }
  .info-box h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; font-weight: 700; margin-bottom: 8px; }
  .info-box p { font-size: 13px; color: #374151; line-height: 1.7; }
  .info-box strong { font-weight: 700; color: #111827; }

  .items-table { width: 100%; border-collapse: collapse; }
  .items-table th { background: #f9fafb; padding: 12px 40px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; color: #6b7280; text-align: left; border-bottom: 1px solid #e5e7eb; }
  .items-table th:last-child { text-align: right; }
  .items-table td { padding: 16px 40px; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
  .items-table td:last-child { text-align: right; font-weight: 700; }
  .item-name { font-weight: 700; color: #111827; font-size: 14px; }

  .totals-section { padding: 24px 40px; display: flex; justify-content: flex-end; border-bottom: 1px solid #f0f0f0; }
  .totals-table { width: 280px; font-size: 13px; }
  .totals-table td { padding: 6px 0; }
  .totals-table td:last-child { text-align: right; font-weight: 600; }
  .totals-table tr.grand-total td { border-top: 2px solid #111827; padding-top: 12px; font-size: 16px; font-weight: 800; color: #111827; }

  .footer { background: #f9fafb; padding: 24px 40px; display: flex; justify-content: space-between; align-items: center; }
  .footer p { font-size: 11px; color: #9ca3af; }

  @media print {
    body { background: white; }
    .invoice { box-shadow: none; margin: 0; border-radius: 0; }
    .print-btn { display: none; }
  }
</style>
</head>
<body>

<div style="text-align:center;padding:16px;background:#1a1a2e;" class="print-btn">
  <button onclick="window.print()" style="background:#ea580c;color:white;border:none;padding:12px 32px;border-radius:8px;font-size:15px;font-weight:700;cursor:pointer;">
    ⬇️ Save as PDF / Print Receipt
  </button>
</div>

<div class="invoice">
  <!-- Header -->
  <div class="header">
    <div class="brand">
      <h1>🪔 Divyayagyam</h1>
      <p>divyayagyam.com · ${esc(paymentTitle)}</p>
    </div>
    <div class="invoice-meta">
      <div class="inv-label">Receipt Number</div>
      <div class="inv-num">${payment.id.slice(-8).toUpperCase()}</div>
      <div class="inv-badge">${payment.status === 'SUCCESS' ? '✅ PAID' : payment.status === 'PENDING' ? '⏳ PENDING' : '❌ FAILED'}</div>
    </div>
  </div>

  <!-- Status Banner -->
  <div class="status-banner ${payment.status !== 'SUCCESS' ? (payment.status === 'PENDING' ? 'pending' : 'failed') : ''}">
    <span style="font-size:12px;font-weight:600;color:${payment.status === 'SUCCESS' ? '#065f46' : payment.status === 'PENDING' ? '#92400e' : '#991b1b'}">
      ${payment.status === 'SUCCESS'
        ? `✅ Payment Confirmed · Paid on ${new Date(paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
        : payment.status === 'PENDING' ? '⏳ Payment Pending' : '❌ Payment Failed'}
    </span>
    ${payment.gatewayRef ? `<span style="font-size:11px;color:#6b7280;">Ref: ${payment.gatewayRef}</span>` : ''}
  </div>

  <!-- Customer & Invoice Info -->
  <div class="info-grid">
    <div class="info-box">
      <h3>Billed To</h3>
      <p>
        <strong>${esc(customerName)}</strong><br>
        ${payment.user?.email ? `${esc(payment.user.email)}<br>` : ''}
        ${payment.user?.phone ? `Phone: ${esc(payment.user.phone)}` : ''}
      </p>
    </div>
    <div class="info-box" style="text-align:right">
      <h3>Payment Details</h3>
      <p>
        <strong>Date:</strong> ${new Date(payment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}<br>
        <strong>Type:</strong> ${esc(paymentSubtitle)}<br>
        ${payment.gateway ? `<strong>Gateway:</strong> ${esc(payment.gateway)}<br>` : ''}
      </p>
    </div>
  </div>

  <!-- Items Table -->
  <table class="items-table">
    <thead>
      <tr>
        <th>Description</th>
        ${payment.order ? '<th style="text-align:center">Qty</th><th style="text-align:right">Price</th>' : ''}
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${payment.order && payment.order.items.length > 0 ? 
        payment.order.items.map(item => `
        <tr>
          <td><div class="item-name">${esc(item.name)}</div></td>
          <td style="text-align:center;font-weight:600">${item.quantity}</td>
          <td style="text-align:right">₹${Number(item.price).toLocaleString('en-IN')}</td>
          <td>₹${Number(item.total).toLocaleString('en-IN')}</td>
        </tr>
        `).join('')
      : `
        <tr>
          <td><div class="item-name">${esc(paymentSubtitle)}</div></td>
          <td>₹${total.toLocaleString('en-IN')}</td>
        </tr>
      `}
    </tbody>
  </table>

  <!-- Totals Section -->
  <div class="totals-section">
    <table class="totals-table">
      ${payment.order ? `
        <tr>
          <td style="color:#6b7280">Subtotal</td>
          <td>₹${Number(payment.order.subtotal).toLocaleString('en-IN')}</td>
        </tr>
        ${Number(payment.order.discount) > 0 ? `
        <tr>
          <td style="color:#10b981">Discount</td>
          <td style="color:#10b981">-₹${Number(payment.order.discount).toLocaleString('en-IN')}</td>
        </tr>` : ''}
        ${Number(payment.order.tax) > 0 ? `
        <tr>
          <td style="color:#6b7280">Tax / GST</td>
          <td>₹${Number(payment.order.tax).toLocaleString('en-IN')}</td>
        </tr>` : ''}
        ${Number(payment.order.shipping) > 0 ? `
        <tr>
          <td style="color:#6b7280">Shipping Fee</td>
          <td>₹${Number(payment.order.shipping).toLocaleString('en-IN')}</td>
        </tr>` : ''}
      ` : ''}
      <tr class="grand-total">
        <td>Total Paid</td>
        <td>₹${total.toLocaleString('en-IN')}</td>
      </tr>
    </table>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div>
      <p style="font-size:14px;font-weight:700;color:#1e293b">Divyayagyam Spiritual Services</p>
      <p style="margin-top:2px">Thank you for your payment. For inquiries, contact Seva@divyayagyam.com</p>
    </div>
    <div style="text-align:right">
      <p>This is a computer-generated receipt.</p>
      <p>No signature required.</p>
    </div>
  </div>
</div>

</body>
</html>`

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      }
    })
  } catch (err: any) {
    return new NextResponse('Error generating invoice: ' + err.message, { status: 500 })
  }
}
