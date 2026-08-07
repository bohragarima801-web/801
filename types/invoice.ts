export type PaymentStatus = 'PAID' | 'PARTIALLY_PAID' | 'PENDING' | 'REFUNDED' | 'FAILED'
export type BookingStatus = 'CONFIRMED' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'IN_PROGRESS'
export type DeliveryStatus = 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED' | 'PENDING' | 'PROCESSING'

export interface CustomerDetails {
  fullName: string
  phone: string
  email: string
  address: string
  country: string
  state: string
  city: string
  pincode: string
}

export interface SpiritualDetails {
  sankalpName?: string
  gotra?: string
  nakshatra?: string
  rashi?: string
  purposeOfPuja?: string
}

export interface PujaItem {
  id: string
  name: string
  temple: string
  pandit: string
  quantity: number
  price: number
  discount: number
  amount: number
}

export interface VipPujaItem {
  id: string
  packageName: string
  benefits: string
  quantity: number
  amount: number
}

export interface BhaktiSevaItem {
  id: string
  sevaName: string
  description: string
  quantity: number
  donation: number
}

export interface SpiritualProductItem {
  id: string
  image?: string
  name: string
  sku: string
  quantity: number
  price: number
  discount: number
  amount: number
}

export interface DigitalToolItem {
  id: string
  name: string
  validity: string
  license: string
  amount: number
}

export interface OrderSummary {
  subtotal: number
  itemsDiscount: number
  couponCode?: string
  couponDiscount: number
  bhaktiDonation: number
  shippingCharges: number
  platformFee: number
  taxAmount: number
  taxRate?: number
  grandTotal: number
  paidAmount: number
  pendingAmount: number
  currencySymbol: string
  currencyCode: string
}

export interface PaymentDetails {
  status: PaymentStatus
  method: string
  transactionId: string
  razorpayPaymentId?: string
  gateway: string
  paymentTime: string
}

export interface BookingDetails {
  status: BookingStatus
  templeName: string
  scheduledDate: string
  scheduledTime: string
  assignedPandit: string
  meetingLink?: string
}

export interface DeliveryDetails {
  courierPartner: string
  trackingNumber: string
  shippingStatus: DeliveryStatus
  expectedDelivery: string
}

export interface InvoiceData {
  invoiceNumber: string
  orderNumber: string
  bookingNumber?: string
  invoiceDate: string
  paymentDate: string
  customer: CustomerDetails
  spiritualDetails?: SpiritualDetails
  pujaBookings?: PujaItem[]
  vipPujas?: VipPujaItem[]
  bhaktiSeva?: BhaktiSevaItem[]
  products?: SpiritualProductItem[]
  digitalTools?: DigitalToolItem[]
  summary: OrderSummary
  paymentDetails: PaymentDetails
  bookingDetails?: BookingDetails
  deliveryDetails?: DeliveryDetails
}
