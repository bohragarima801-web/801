import { toast } from 'sonner'

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false)
    if ((window as any).Razorpay) return resolve(true)

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export async function processToolPurchase({
  toolId,
  toolSlug,
  toolName,
  userEmail,
  userName,
  onSuccess,
  onError,
}: {
  toolId: string
  toolSlug: string
  toolName: string
  userEmail?: string
  userName?: string
  onSuccess?: () => void
  onError?: (err: string) => void
}) {
  try {
    toast.loading('Initializing secure payment...', { id: 'tool-buy' })

    // 1. Initialize order on backend
    const res = await fetch('/api/tools/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolId }),
    })

    toast.dismiss('tool-buy')
    const data = await res.json()

    if (!data.ok) {
      if (res.status === 401) {
        toast.error('Please login to activate premium tool access')
        const currentPath = encodeURIComponent(`/tools/${toolSlug}`)
        window.location.href = `/login?redirectTo=${currentPath}`
        return
      }
      toast.error(data.error || 'Failed to initialize purchase')
      onError?.(data.error)
      return
    }

    // 2. Free tool mode
    if (data.mode === 'free') {
      toast.success(data.message || 'Access granted!')
      if (onSuccess) {
        onSuccess()
      } else {
        window.location.href = `/tools/${toolSlug}`
      }
      return
    }

    // 3. Paid tool via Razorpay modal
    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
      toast.error('Could not load Razorpay payment gateway. Check your internet connection.')
      return
    }

    const { orderId, amount, currency, razorpayKeyId, paymentId } = data.paymentData || {}

    if (!razorpayKeyId) {
      toast.error('Razorpay API keys not configured. Please contact admin.')
      return
    }

    const options = {
      key: razorpayKeyId,
      amount,
      currency: currency || 'INR',
      name: 'Divya Yagyam',
      description: `Premium Access: ${toolName}`,
      order_id: orderId,
      handler: async function (response: any) {
        toast.loading('Verifying payment & activating tool...', { id: 'verify-tool' })
        try {
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId,
            }),
          })
          toast.dismiss('verify-tool')
          const verifyData = await verifyRes.json()

          if (verifyRes.ok && verifyData.ok && verifyData.verified) {
            toast.success('🎉 Payment Successful! Premium tool activated.')
            if (onSuccess) {
              onSuccess()
            } else {
              window.location.href = `/tools/${toolSlug}`
            }
          } else {
            toast.error(verifyData.error || 'Payment verification failed. If money was deducted, contact support.')
          }
        } catch {
          toast.dismiss('verify-tool')
          toast.error('Verification error. Please contact support with your payment receipt.')
        }
      },
      prefill: {
        name: userName || '',
        email: userEmail || '',
      },
      theme: { color: '#921C24' },
    }

    const rzp = new (window as any).Razorpay(options)
    rzp.on('payment.failed', function (response: any) {
      toast.error(`Payment failed: ${response.error?.description || 'Transaction cancelled'}`)
    })
    rzp.open()
  } catch (err: any) {
    toast.dismiss('tool-buy')
    toast.error(err?.message || 'Error processing tool purchase')
    onError?.(err?.message)
  }
}
