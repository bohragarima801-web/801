import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    const { id } = await params

    const order = await prisma.order.findFirst({
      where: { id, userId: user.id },
      include: {
        items: true,
        shippingAddress: true,
        payments: { where: { status: 'SUCCESS' }, take: 1 },
        coupon: { select: { code: true } },
      }
    })

    if (!order) return new NextResponse('Order not found', { status: 404 })

    const paid = order.payments[0]
    const paymentDate = paid?.paidAt || order.updatedAt
    const discount = order.discount ? Number(order.discount) : 0
    const subtotal = Number(order.subtotal)
    const addr = order.shippingAddress

    const html = `<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Invoice - ${order.orderNumber}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; background: #f8f8f8; color: #1a1a2e; font-size: 13px; }
  .invoice { max-width: 750px; margin: 20px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  
  /* Header */
  .header { background: linear-gradient(135deg, #b45309, #d97706, #92400e); color: white; padding: 32px 40px; display: flex; justify-content: space-between; align-items: flex-start; }
  .brand h1 { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
  .brand p { font-size: 11px; opacity: 0.85; margin-top: 4px; }
  .invoice-meta { text-align: right; }
  .invoice-meta .inv-num { font-size: 22px; font-weight: 800; }
  .invoice-meta .inv-label { font-size: 10px; opacity: 0.75; text-transform: uppercase; letter-spacing: 1px; }
  .inv-badge { display: inline-block; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.4); border-radius: 20px; padding: 4px 14px; font-size: 11px; font-weight: 700; margin-top: 8px; }

  /* Status Banner */
  .status-banner { background: #ecfdf5; border-left: 4px solid #10b981; padding: 12px 40px; display: flex; align-items: center; gap: 8px; }
  .status-banner.pending { background: #fffbeb; border-color: #f59e0b; }
  .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; }
  .status-dot.pending { background: #f59e0b; }

  /* Info Grid */
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; padding: 28px 40px; border-bottom: 1px solid #f0f0f0; }
  .info-box h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; font-weight: 700; margin-bottom: 8px; }
  .info-box p { font-size: 13px; color: #374151; line-height: 1.6; }
  .info-box strong { font-weight: 700; color: #111827; }

  /* Items Table */
  .items-section { padding: 28px 40px; }
  .items-section h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; font-weight: 700; margin-bottom: 14px; }
  table { width: 100%; border-collapse: collapse; }
  thead tr { background: #fef3c7; }
  th { padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px; }
  th:last-child, td:last-child { text-align: right; }
  td { padding: 12px 12px; border-bottom: 1px solid #f3f4f6; font-size: 13px; color: #374151; }
  tr:last-child td { border-bottom: none; }
  tbody tr:hover { background: #fafafa; }

  /* Totals */
  .totals { padding: 20px 40px 28px; display: flex; justify-content: flex-end; }
  .totals-box { width: 260px; }
  .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #6b7280; border-bottom: 1px solid #f3f4f6; }
  .totals-row:last-child { border-bottom: none; }
  .totals-row.discount { color: #16a34a; }
  .totals-row.total { font-size: 16px; font-weight: 800; color: #111827; padding-top: 12px; border-top: 2px solid #e5e7eb; border-bottom: none; }

  /* Footer */
  .footer { background: #f9fafb; border-top: 1px solid #f0f0f0; padding: 24px 40px; display: flex; justify-content: space-between; align-items: center; }
  .footer p { font-size: 11px; color: #9ca3af; }
  .footer .thank { font-size: 14px; font-weight: 700; color: #b45309; }

  @media print {
    body { background: white; }
    .invoice { box-shadow: none; margin: 0; border-radius: 0; }
    .print-btn { display: none; }
  }
</style>
</head>
<body>
<div style="text-align:center;padding:16px;background:#1a1a2e;" class="print-btn">
  <button onclick="window.print()" style="background:#f97316;color:white;border:none;padding:12px 32px;border-radius:8px;font-size:15px;font-weight:700;cursor:pointer;letter-spacing:0.5px;">
    ⬇️ Save as PDF / Print Invoice
  </button>
</div>

<div class="invoice">
  <!-- Header -->
  <div class="header">
    <div class="brand">
      <h1>🪔 Divyayagyam</h1>
      <p>divyayagyam.com · Sacred Puja & Products</p>
      <p style="margin-top:6px;font-size:11px;opacity:0.7;">GSTIN: As Applicable</p>
    </div>
    <div class="invoice-meta">
      <div class="inv-label">Tax Invoice</div>
      <div class="inv-num">${order.orderNumber}</div>
      <div class="inv-badge">${order.paymentStatus === 'SUCCESS' ? '✅ PAID' : '⏳ PENDING'}</div>
    </div>
  </div>

  <!-- Status Banner -->
  <div class="status-banner ${order.paymentStatus !== 'SUCCESS' ? 'pending' : ''}">
    <div class="status-dot ${order.paymentStatus !== 'SUCCESS' ? 'pending' : ''}"></div>
    <span style="font-size:12px;font-weight:600;color:${order.paymentStatus === 'SUCCESS' ? '#065f46' : '#92400e'}">
      ${order.paymentStatus === 'SUCCESS' ? `Payment Received on ${new Date(paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}` : 'Payment Pending'}
    </span>
    ${paid?.gatewayRef ? `<span style="margin-left:auto;font-size:11px;color:#6b7280;">Payment ID: ${paid.gatewayRef}</span>` : ''}
  </div>

  <!-- Info Grid -->
  <div class="info-grid">
    <div class="info-box">
      <h3>Billed To</h3>
      <p>
        <strong>${addr?.fullName || user.fullName}</strong><br>
        ${addr ? `${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}<br>${addr.city}, ${addr.state} - ${addr.pincode}<br>${addr.country}` : 'Address on file'}
        ${addr?.phone ? `<br><strong>Phone:</strong> ${addr.phone}` : ''}
      </p>
    </div>
    <div class="info-box" style="text-align:right">
      <h3>Invoice Details</h3>
      <p>
        <strong>Invoice Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}<br>
        <strong>Order Status:</strong> ${order.status}<br>
        ${order.coupon ? `<strong>Coupon:</strong> ${order.coupon.code}<br>` : ''}
        <strong>Payment:</strong> Razorpay
      </p>
    </div>
  </div>

  <!-- Items Table -->
  <div class="items-section">
    <h3>Order Items</h3>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Item Description</th>
          <th style="text-align:center">Qty</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map((item, idx) => `
        <tr>
          <td style="color:#9ca3af">${idx + 1}</td>
          <td><strong>${item.name}</strong></td>
          <td style="text-align:center">${item.quantity}</td>
          <td>₹${Number(item.price).toLocaleString('en-IN')}</td>
          <td style="font-weight:600">₹${(Number(item.price) * item.quantity).toLocaleString('en-IN')}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>

  <!-- Totals -->
  <div class="totals">
    <div class="totals-box">
      <div class="totals-row"><span>Subtotal</span><span>₹${subtotal.toLocaleString('en-IN')}</span></div>
      ${discount > 0 ? `<div class="totals-row discount"><span>Discount Applied</span><span>−₹${discount.toLocaleString('en-IN')}</span></div>` : ''}
      <div class="totals-row" style="font-size:11px;color:#9ca3af"><span>Taxes (Included)</span><span>As Applicable</span></div>
      <div class="totals-row total"><span>Amount Paid</span><span style="color:#b45309">₹${Number(order.total).toLocaleString('en-IN')}</span></div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div>
      <p class="thank">🙏 धन्यवाद! Thank you for your order.</p>
      <p style="margin-top:4px">For support: support@divyayagyam.com</p>
    </div>
    <div style="text-align:right">
      <p>This is a computer-generated invoice.</p>
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
