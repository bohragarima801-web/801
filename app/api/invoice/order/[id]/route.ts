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
      ? { OR: [{ id }, { orderNumber: id }] }
      : { OR: [{ id }, { orderNumber: id }], userId: user.id }

    const order = await prisma.order.findFirst({
      where: whereCondition,
      include: {
        user: { select: { fullName: true, email: true, phone: true } },
        items: true,
        shippingAddress: true,
        payments: { where: { status: 'SUCCESS' }, take: 1 },
        coupon: { select: { code: true } },
      }
    })

    if (!order) return new NextResponse('Order tax invoice not found', { status: 404 })

    // ANTI-FRAUD SECURITY CHECK: Products allow Cash on Delivery (COD) or Online Paid Orders
    const isCodOrder = order.status === 'CONFIRMED' || order.status === 'SHIPPED' || order.status === 'DELIVERED'
    const isPaymentConfirmed = order.paymentStatus === 'SUCCESS' || isCodOrder
    
    if (!isPaymentConfirmed && !isAdmin) {
      const pendingHtml = `<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<title>Tax Invoice Locked - Order Pending</title>
<style>
  body { font-family: sans-serif; background: #0f172a; color: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; text-align: center; }
  .box { max-width: 480px; background: #1e293b; border: 2px solid #ea580c; border-radius: 20px; padding: 36px 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
  .icon { font-size: 48px; margin-bottom: 12px; }
  h2 { font-size: 20px; color: #f97316; margin-bottom: 12px; }
  p { font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-bottom: 20px; }
  .btn { display: inline-block; background: #ea580c; color: white; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; font-size: 14px; }
</style>
</head>
<body>
  <div class="box">
    <div class="icon">🔒</div>
    <h2>टैक्स इनवॉइस बिल लॉक है (Tax Invoice Locked)</h2>
    <p>सुरक्षा कारणों से टैक्स इनवॉइस बिल <strong>ऑनलाइन भुगतान या कूरियर कैश ऑन डिलीवरी (COD) कन्फर्मेशन के बाद ही</strong> जारी किया जाता है।<br><br>Order ID: <strong>${order.orderNumber}</strong> अभी लंबित (Pending) है।</p>
    <a href="https://wa.me/919587171984?text=Namaste!%20I%20want%20to%20confirm%20Order%20${order.orderNumber}" class="btn">
      💬 Order Support via WhatsApp
    </a>
  </div>
</body>
</html>`

      return new NextResponse(pendingHtml, {
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
      })
    }
    const paid = order.payments[0]
    const paymentDate = paid?.paidAt || order.updatedAt
    const discount = order.discount ? Number(order.discount) : 0
    const subtotal = Number(order.subtotal)
    const tax = order.tax ? Number(order.tax) : 0
    const shipping = order.shipping ? Number(order.shipping) : 0
    const total = Number(order.total)
    const addr = order.shippingAddress
    const customerName = addr?.fullName || order.user?.fullName || user.fullName || 'Valued Customer'

    const html = `<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tax Invoice - ${order.orderNumber}</title>
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
  .item-meta { font-size: 11px; color: #6b7280; margin-top: 2px; }

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
    ⬇️ Save as PDF / Print Invoice
  </button>
</div>

<div class="invoice">
  <!-- Header -->
  <div class="header">
    <div class="brand">
      <h1>🪔 Divyayagyam</h1>
      <p>divyayagyam.com · Product Tax Invoice</p>
    </div>
    <div class="invoice-meta">
      <div class="inv-label">Product Invoice</div>
      <div class="inv-num">${order.orderNumber}</div>
      <div class="inv-badge">${order.paymentStatus === 'SUCCESS' ? '✅ PAID ONLINE' : '📦 CASH ON DELIVERY'}</div>
    </div>
  </div>

  <!-- Status Banner -->
  <div class="status-banner">
    <span style="font-size:12px;font-weight:600;color:#065f46">
      ${order.paymentStatus === 'SUCCESS'
        ? `✅ Payment Confirmed · Paid Online on ${new Date(paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
        : `📦 Cash On Delivery (COD) · Collectable at Delivery (₹${total.toLocaleString('en-IN')})`}
    </span>
    ${paid?.gatewayRef ? `<span style="font-size:11px;color:#6b7280;">Ref: ${paid.gatewayRef}</span>` : ''}
  </div>

  <!-- Customer & Invoice Info -->
  <div class="info-grid">
    <div class="info-box">
      <h3>Billed To</h3>
      <p>
        <strong>${customerName}</strong><br>
        ${addr ? `
          ${addr.line1 ? `${addr.line1}<br>` : ''}
          ${addr.line2 ? `${addr.line2}<br>` : ''}
          ${addr.city ? `${addr.city}, ` : ''}${addr.state ? `${addr.state} - ` : ''}${addr.pincode ? `${addr.pincode}<br>` : ''}
          ${addr.phone ? `Phone: ${addr.phone}` : ''}
        ` : (order.user?.email || '')}
      </p>
    </div>
    <div class="info-box" style="text-align:right">
      <h3>Invoice Details</h3>
      <p>
        <strong>Invoice Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}<br>
        <strong>Order Status:</strong> ${order.status}<br>
        ${order.coupon?.code ? `<strong>Coupon Code:</strong> ${order.coupon.code}<br>` : ''}
        ${order.notes ? `<strong>Notes:</strong> ${order.notes}` : ''}
      </p>
    </div>
  </div>

  <!-- Items Table -->
  <table class="items-table">
    <thead>
      <tr>
        <th>Item Description</th>
        <th style="text-align:center">Qty</th>
        <th style="text-align:right">Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${order.items.map(item => `
      <tr>
        <td>
          <div class="item-name">${item.name}</div>
        </td>
        <td style="text-align:center;font-weight:600">${item.quantity}</td>
        <td style="text-align:right">₹${Number(item.price).toLocaleString('en-IN')}</td>
        <td>₹${Number(item.total).toLocaleString('en-IN')}</td>
      </tr>
      `).join('')}
    </tbody>
  </table>

  <!-- Totals Section -->
  <div class="totals-section">
    <table class="totals-table">
      <tr>
        <td style="color:#6b7280">Subtotal</td>
        <td>₹${subtotal.toLocaleString('en-IN')}</td>
      </tr>
      ${discount > 0 ? `
      <tr>
        <td style="color:#10b981">Discount</td>
        <td style="color:#10b981">-₹${discount.toLocaleString('en-IN')}</td>
      </tr>` : ''}
      ${tax > 0 ? `
      <tr>
        <td style="color:#6b7280">Tax / GST</td>
        <td>₹${tax.toLocaleString('en-IN')}</td>
      </tr>` : ''}
      ${shipping > 0 ? `
      <tr>
        <td style="color:#6b7280">Shipping Fee</td>
        <td>₹${shipping.toLocaleString('en-IN')}</td>
      </tr>` : ''}
      <tr class="grand-total">
        <td>Total Paid</td>
        <td>₹${total.toLocaleString('en-IN')}</td>
      </tr>
    </table>
  </div>

  <!-- Caution & Return/Refund Policy Section -->
  <div style="margin: 20px 40px; padding: 18px 22px; background: #fffbeb; border: 2px stroke #f59e0b; border: 2px solid #f59e0b; border-radius: 12px; font-size: 12px; color: #78350f; line-height: 1.6;">
    <div style="font-weight: 800; font-size: 13px; color: #b45309; text-transform: uppercase; margin-bottom: 8px;">
      ⚠️ आवश्यक सावधानी एवं 7-दिवसीय रिटर्न नीति (Important Caution & 7-Day Return Policy)
    </div>
    <ul style="padding-left: 18px; margin-top: 4px;">
      <li style="margin-bottom: 4px;"><strong>1. क्षतिग्रस्त/टूटा-फूटा सामान (No Damaged/Tampered Returns):</strong> ग्राहक द्वारा स्वयं तोड़ा गया, क्षतिग्रस्त, उपयोग किया गया या छेड़छाड़ (tampered) किया गया प्रोडक्ट वापस (return) या रिप्लेस नहीं किया जाएगा।</li>
      <li style="margin-bottom: 4px;"><strong>2. 7-दिवसीय रिफंड समय-सीमा (Strict 7-Day Window):</strong> किसी भी खराबी या रिफंड/रिप्लेसमेंट की क्लेम रिक्वेस्ट पार्सल डिलीवरी के <strong>केवल 7 दिनों (7 Days)</strong> के भीतर ही support@divyayagyam.com या WhatsApp पर दर्ज करानी होगी। 7 दिन के बाद कोई भी दावा स्वीकार नहीं किया जाएगा।</li>
      <li><strong>3. अनबॉक्सिंग वीडियो अनिवार्य (Mandatory Unboxing Video):</strong> पार्सल खोलते समय का 360° निरंतर Unboxing Video अनिवार्य है। बिना वीडियो के क्षति या मिसिंग आइटम का क्लेम मान्य नहीं होगा।</li>
    </ul>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div>
      <p style="font-size:14px;font-weight:700;color:#1e293b">Divyayagyam Spiritual Services</p>
      <p style="margin-top:2px">Thank you for your order. For inquiries, contact support@divyayagyam.com</p>
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
