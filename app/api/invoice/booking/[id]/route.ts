import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    const { id } = await params
    const isAdmin = user.role === 'super_admin' || user.role === 'store_manager'

    const whereCondition = isAdmin
      ? { OR: [{ id }, { bookingNumber: id }] }
      : { OR: [{ id }, { bookingNumber: id }], userId: user.id }

    const booking = await prisma.booking.findFirst({
      where: whereCondition,
      include: {
        user: { select: { fullName: true, email: true, phone: true } },
        puja: { select: { name: true, location: true } },
        temple: { select: { name: true, city: true, state: true } },
        members: true,
        payments: { where: { status: 'SUCCESS' }, take: 1 },
      }
    })

    if (!booking) return new NextResponse('Booking receipt not found', { status: 404 })

    const paid = booking.payments[0]
    const paymentDate = paid?.paidAt || booking.updatedAt
    const devoteeName = booking.user?.fullName || user.fullName || 'Valued Devotee'

    const html = `<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Booking Receipt - ${booking.bookingNumber}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Noto+Sans+Devanagari:wght@400;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', 'Noto Sans Devanagari', sans-serif; background: #f3f0ff; color: #1a1a2e; font-size: 13px; }
  .invoice { max-width: 750px; margin: 20px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }

  .header { background: linear-gradient(135deg, #4c1d95, #7c3aed, #5b21b6); color: white; padding: 32px 40px; display: flex; justify-content: space-between; align-items: flex-start; }
  .brand h1 { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
  .brand p { font-size: 11px; opacity: 0.85; margin-top: 4px; }
  .invoice-meta { text-align: right; }
  .invoice-meta .inv-num { font-size: 22px; font-weight: 800; }
  .invoice-meta .inv-label { font-size: 10px; opacity: 0.75; text-transform: uppercase; letter-spacing: 1px; }
  .inv-badge { display: inline-block; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.4); border-radius: 20px; padding: 4px 14px; font-size: 11px; font-weight: 700; margin-top: 8px; }

  .status-banner { background: #ecfdf5; border-left: 4px solid #10b981; padding: 12px 40px; display: flex; align-items: center; gap: 8px; }
  .status-banner.pending { background: #fffbeb; border-color: #f59e0b; }

  .puja-hero { background: linear-gradient(135deg, #f5f3ff, #ede9fe); padding: 24px 40px; border-bottom: 1px solid #e9d5ff; text-align: center; }
  .puja-hero h2 { font-size: 22px; font-weight: 800; color: #4c1d95; }
  .puja-hero p { font-size: 12px; color: #7c3aed; margin-top: 4px; }

  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; padding: 24px 40px; border-bottom: 1px solid #f0f0f0; }
  .info-box h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; font-weight: 700; margin-bottom: 8px; }
  .info-box p { font-size: 13px; color: #374151; line-height: 1.7; }
  .info-box strong { font-weight: 700; color: #111827; }

  .sankalp-section { padding: 20px 40px; background: #faf5ff; border-bottom: 1px solid #e9d5ff; }
  .sankalp-section h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #7c3aed; font-weight: 700; margin-bottom: 12px; }
  .sankalp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .sankalp-item { background: white; border: 1px solid #e9d5ff; border-radius: 8px; padding: 10px 14px; }
  .sankalp-item label { font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; }
  .sankalp-item value { display: block; font-size: 13px; font-weight: 700; color: #4c1d95; margin-top: 2px; }

  .amount-section { padding: 24px 40px; display: flex; justify-content: flex-end; }
  .amount-box { background: #4c1d95; color: white; border-radius: 12px; padding: 20px 28px; min-width: 220px; text-align: center; }
  .amount-box .label { font-size: 11px; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px; }
  .amount-box .amount { font-size: 32px; font-weight: 800; margin-top: 4px; }
  .amount-box .sub { font-size: 11px; opacity: 0.7; margin-top: 4px; }

  .footer { background: #f9fafb; border-top: 1px solid #f0f0f0; padding: 24px 40px; display: flex; justify-space-between; align-items: center; }
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
  <button onclick="window.print()" style="background:#7c3aed;color:white;border:none;padding:12px 32px;border-radius:8px;font-size:15px;font-weight:700;cursor:pointer;">
    ⬇️ Save as PDF / Print Receipt
  </button>
</div>

<div class="invoice">
  <!-- Header -->
  <div class="header">
    <div class="brand">
      <h1>🪔 Divyayagyam</h1>
      <p>divyayagyam.com · Sacred Puja Booking</p>
    </div>
    <div class="invoice-meta">
      <div class="inv-label">Booking Receipt</div>
      <div class="inv-num">${booking.bookingNumber}</div>
      <div class="inv-badge">${booking.paymentStatus === 'SUCCESS' ? '✅ CONFIRMED' : '⏳ PENDING'}</div>
    </div>
  </div>

  <!-- Status Banner -->
  <div class="status-banner ${booking.paymentStatus !== 'SUCCESS' ? 'pending' : ''}">
    <span style="font-size:12px;font-weight:600;color:${booking.paymentStatus === 'SUCCESS' ? '#065f46' : '#92400e'}">
      ${booking.paymentStatus === 'SUCCESS'
        ? `✅ Booking Confirmed · Payment received on ${new Date(paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
        : '⏳ Payment Pending — Booking Not Yet Confirmed'}
    </span>
    ${paid?.gatewayRef ? `<span style="margin-left:auto;font-size:11px;color:#6b7280;">Payment ID: ${paid.gatewayRef}</span>` : ''}
  </div>

  <!-- Puja Name Hero -->
  <div class="puja-hero">
    <div style="font-size:28px;margin-bottom:6px;">🪔</div>
    <h2>${booking.puja?.name || 'Sacred Puja'}</h2>
    ${booking.temple ? `<p>📍 ${booking.temple.name}, ${booking.temple.city}, ${booking.temple.state}</p>` : ''}
    ${booking.scheduledAt ? `<p style="margin-top:6px;font-weight:700;color:#4c1d95">📅 Scheduled: ${new Date(booking.scheduledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>` : ''}
  </div>

  <!-- Info Grid -->
  <div class="info-grid">
    <div class="info-box">
      <h3>Devotee Details</h3>
      <p>
        <strong>${devoteeName}</strong><br>
        ${booking.user?.email ? `${booking.user.email}<br>` : ''}
        ${booking.user?.phone ? `${booking.user.phone}<br>` : ''}
        ${booking.gotra ? `<strong>Gotra:</strong> ${booking.gotra}<br>` : ''}
        ${booking.sankalpText ? `<strong>Sankalp:</strong> ${booking.sankalpText}` : ''}
      </p>
    </div>
    <div class="info-box" style="text-align:right">
      <h3>Booking Details</h3>
      <p>
        <strong>Booking Date:</strong> ${new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}<br>
        <strong>Status:</strong> ${booking.status}<br>
        <strong>Members:</strong> ${booking.memberCount || 1}
      </p>
    </div>
  </div>

  <!-- Sankalp Members if any -->
  ${booking.members && booking.members.length > 0 ? `
  <div class="sankalp-section">
    <h3>🙏 Sankalp Members</h3>
    <div class="sankalp-grid">
      ${booking.members.map((m: any) => `
      <div class="sankalp-item">
        <label>Name</label>
        <value>${m.fullName}</value>
        ${m.gotra ? `<label style="display:block;margin-top:4px">Gotra</label><value>${m.gotra}</value>` : ''}
      </div>`).join('')}
    </div>
  </div>` : ''}

  <!-- Amount -->
  <div class="amount-section">
    <div>
      <table style="width:240px;font-size:13px;margin-bottom:12px;">
        ${Number(booking.tax) > 0 ? `<tr><td style="color:#6b7280;padding:4px 0">Tax</td><td style="text-align:right;font-weight:600">₹${Number(booking.tax).toLocaleString('en-IN')}</td></tr>` : ''}
        <tr style="border-top:2px solid #e5e7eb">
          <td style="padding-top:8px;font-weight:800;font-size:15px">Total Paid</td>
          <td style="text-align:right;font-weight:800;font-size:15px;color:#4c1d95">₹${Number(booking.total).toLocaleString('en-IN')}</td>
        </tr>
      </table>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div>
      <p style="font-size:14px;font-weight:700;color:#4c1d95">🙏 जय श्री राम · भगवान आपको आशीर्वाद दें</p>
      <p style="margin-top:4px">For support: support@divyayagyam.com</p>
    </div>
    <div style="text-align:right">
      <p>Computer-generated receipt.</p>
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
    return new NextResponse('Error generating receipt: ' + err.message, { status: 500 })
  }
}
