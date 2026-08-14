'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ShoppingCart, ShieldCheck, Truck, RotateCcw, Award, Star, 
  Sparkles, CheckCircle2, Heart, Share2, Plus, Minus, Package, 
  ChevronRight, ArrowRight, Zap, Check
} from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { ProFormattedDescription } from '@/components/pro-formatted-description'
import { cn } from '@/lib/utils'

export function ProductClientView({ product, relatedProducts: dynamicRelated }: { product: any; relatedProducts?: any[] }) {
  const router = useRouter()
  const { addToCart } = useCart()
  
  const [quantity, setQuantity] = useState(1)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [addedToast, setAddedToast] = useState(false)

  if (!product) {
    return (
      <div className="py-20 text-center text-[#292321] font-bold">
        उत्पाद का विवरण उपलब्ध नहीं है...
      </div>
    )
  }

  // Image Gallery setup
  const mainCover = product.coverImage || '/placeholder.jpg'
  const extraImages = (product.images || []).map((img: any) => typeof img === 'string' ? img : img.url)
  const galleryImages = Array.from(new Set([mainCover, ...extraImages])).filter(Boolean)
  const currentImage = galleryImages[activeImageIndex] || mainCover

  // Price & Savings calculations
  const price = Number(product.salePrice || product.price || 0)
  const mrp = Math.round(price * 2.1)
  const discountPercent = Math.round(((mrp - price) / mrp) * 100)

  // Stock status
  const stockQty = product.inventory?.quantity || 500
  const isAvailable = stockQty > 0 && product.status !== 'OUT_OF_STOCK'
  const isLimitedStock = product.tags?.includes('LIMITED_STOCK') || stockQty < 100

  // Add to cart handler
  const handleAddToCart = (redirectAfter = false) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: price,
      image: mainCover
    }, quantity)

    setAddedToast(true)
    setTimeout(() => setAddedToast(false), 3000)

    if (redirectAfter) {
      router.push('/cart')
    }
  }

  // Dynamic active related products from DB
  const relatedProducts = (dynamicRelated && dynamicRelated.length > 0 ? dynamicRelated : []).filter(p => p.slug !== product.slug)

  return (
    <div className="bg-[#FFF9EF] text-[#292321] min-h-screen pb-20 font-sans notranslate" translate="no">
      
      {/* Added to Cart Toast Notification */}
      {addedToast && (
        <div className="fixed top-20 right-5 z-50 bg-[#292321] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#E58A16] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
            ✓
          </div>
          <div>
            <p className="text-xs font-bold text-[#E58A16]">सफलतापूर्वक कार्ट में जोड़ा गया!</p>
            <p className="text-xs font-extrabold text-white truncate max-w-[180px]">{product.name} ({quantity}x)</p>
          </div>
          <Link href="/cart" className="ml-2 px-3 py-1 bg-[#E58A16] hover:bg-[#d4790e] text-white text-xs font-black rounded-lg">
            कार्ट देखें →
          </Link>
        </div>
      )}

      {/* 1. Breadcrumb Bar */}
      <nav aria-label="Breadcrumb" className="bg-[#F7EBD7]/60 border-b border-[#E6D6BE] py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-medium text-[#665E58]">
          <Link href="/" className="hover:text-[#E58A16] transition-colors">मुख्य पृष्ठ</Link>
          <ChevronRight className="h-3.5 w-3.5 text-[#E58A16]" />
          <Link href="/products" className="hover:text-[#E58A16] transition-colors">स्टोर (Store)</Link>
          {product.category?.name && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-[#E58A16]" />
              <span className="text-[#E58A16] font-bold">{product.category.name}</span>
            </>
          )}
          <ChevronRight className="h-3.5 w-3.5 text-[#E58A16]" />
          <span className="text-[#292321] font-bold truncate max-w-[180px] sm:max-w-none">{product.name}</span>
        </div>
      </nav>

      {/* 2. Main Product Layout */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Image Showcase & Gallery */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Main Product Image Card */}
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-[#E6D6BE] shadow-xs group">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                priority
                unoptimized
                className="object-contain p-4 object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              
              {/* Badges on Image */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                {product.isAbhimantrit && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-[#6B2635] text-white text-[10px] font-black shadow-xs border border-[#C99A3D]">
                    <Sparkles className="h-3 w-3 text-[#C99A3D]" /> मंत्र अभिमंत्रित (Siddha)
                  </span>
                )}
                {isLimitedStock && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#E58A16] text-white text-[9px] font-bold uppercase shadow-2xs">
                    <Zap className="h-3 w-3" /> सीमित स्टॉक
                  </span>
                )}
              </div>

              {/* Certified Seal */}
              <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-[#E6D6BE] shadow-xs flex items-center gap-1 text-[10px] font-bold text-[#292321]">
                <Award className="h-3.5 w-3.5 text-[#E58A16]" /> 100% प्रामाणिक सामग्री
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={cn(
                      "relative h-16 w-16 shrink-0 rounded-2xl overflow-hidden border-2 transition-all bg-white shadow-2xs p-0.5 cursor-pointer",
                      activeImageIndex === idx ? "border-[#E58A16] ring-2 ring-[#E58A16]/40 scale-105" : "border-[#E6D6BE] opacity-70 hover:opacity-100"
                    )}
                  >
                    <Image src={imgUrl} alt={`Thumbnail ${idx+1}`} fill unoptimized className="object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Guarantees bar */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="bg-white border border-[#E6D6BE] p-2.5 rounded-2xl text-center shadow-2xs">
                <ShieldCheck className="h-4 w-4 mx-auto text-[#E58A16] mb-0.5" />
                <p className="text-[11px] font-bold text-[#292321]">100% प्रामाणिक</p>
                <p className="text-[9px] text-[#665E58]">वैदिक सिद्ध</p>
              </div>
              <div className="bg-white border border-[#E6D6BE] p-2.5 rounded-2xl text-center shadow-2xs">
                <Truck className="h-4 w-4 mx-auto text-[#E58A16] mb-0.5" />
                <p className="text-[11px] font-bold text-[#292321]">एक्सप्रेस डिलीवरी</p>
                <p className="text-[9px] text-[#665E58]">3-5 दिन में घर तक</p>
              </div>
              <div className="bg-white border border-[#E6D6BE] p-2.5 rounded-2xl text-center shadow-2xs">
                <Award className="h-4 w-4 mx-auto text-emerald-600 mb-0.5" />
                <p className="text-[11px] font-bold text-[#292321]">गंगाजल व प्रसाद</p>
                <p className="text-[9px] text-[#665E58]">सुरक्षित पैकिंग</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Buying Box & Details */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Category & Ratings */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-3 py-0.5 rounded-md bg-[#F7EBD7] text-[#E58A16] text-xs font-bold uppercase border border-[#E6D6BE]">
                  {product.category?.name || 'Sanatan Store'}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#665E58]">
                  <span className="flex text-amber-500">★★★★★</span> (4.9 / 5.0 • 150+ भक्त रेटिंग)
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-[#292321] leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price & Discounts Box */}
            <div className="bg-white border border-[#E6D6BE] p-4 sm:p-5 rounded-2xl space-y-2.5 shadow-2xs">
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="text-3xl font-black text-[#292321]">
                  ₹{price.toLocaleString('en-IN')}
                </span>
                <span className="text-base text-gray-400 line-through font-bold">
                  M.R.P.: ₹{mrp.toLocaleString('en-IN')}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-xs font-black shadow-2xs">
                  {discountPercent}% OFF (बचत ₹{(mrp - price).toLocaleString('en-IN')})
                </span>
              </div>
              <p className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <Check className="h-4 w-4 text-emerald-600 stroke-[3]" /> सभी टैक्स सम्मिलित • ₹999+ ऑर्डर पर फ्री होम डिलीवरी
              </p>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-[#4A403C] leading-relaxed font-normal">
              {product.shortDescription || 'शास्त्रोक्त विधि से अभिमंत्रित सिद्ध सामग्री, गंगाजल एवं पावन भस्म के साथ घर पर सुरक्षित डिलीवरी।'}
            </p>

            {/* Stock Meter & Quantity Selector */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#665E58] uppercase">मात्रा चुनें (Quantity):</span>
                <span className={cn("text-xs font-bold", isAvailable ? "text-emerald-700" : "text-red-600")}>
                  {isAvailable ? `🟢 स्टॉक में उपलब्ध (${stockQty} नग शेष)` : '🔴 आउट ऑफ स्टॉक'}
                </span>
              </div>

              {/* Quantity Selector buttons */}
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center rounded-xl border border-[#E6D6BE] bg-white p-1 shadow-2xs">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="h-8 w-8 rounded-lg bg-[#F7EBD7] hover:bg-[#ebd5b8] text-[#292321] flex items-center justify-center font-bold transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-10 text-center font-black text-sm text-[#292321]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="h-8 w-8 rounded-lg bg-[#F7EBD7] hover:bg-[#ebd5b8] text-[#292321] flex items-center justify-center font-bold transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                
                <span className="text-xs text-[#665E58] font-bold">
                  कुल राशि: <strong className="text-[#292321] text-base font-black">₹{(price * quantity).toLocaleString('en-IN')}</strong>
                </span>
              </div>
            </div>

            {/* Action Buttons: BUY NOW & ADD TO CART */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleAddToCart(false)}
                disabled={!isAvailable}
                className="w-full py-3 px-4 rounded-xl bg-white border border-[#E58A16] text-[#E58A16] font-bold text-xs sm:text-sm shadow-2xs hover:bg-[#FFF9EF] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <ShoppingCart className="h-4 w-4" /> कार्ट में जोड़ें (Add to Cart)
              </button>

              <button
                onClick={() => handleAddToCart(true)}
                disabled={!isAvailable}
                className="w-full py-3 px-4 rounded-xl bg-[#E58A16] hover:bg-[#d4790e] text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Zap className="h-4 w-4" /> अभी खरीदें (Buy Now)
              </button>
            </div>

            {/* Trust Guarantee Box */}
            <div className="border border-[#E6D6BE] bg-white p-3.5 rounded-2xl space-y-2 shadow-2xs">
              <p className="text-xs font-bold text-[#292321] uppercase tracking-wide flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#E58A16]" /> DivyaYagyam 100% सुरक्षा व संतुष्टि गारंटी
              </p>
              <div className="grid grid-cols-2 gap-1.5 text-xs text-[#4A403C] font-medium">
                <div className="flex items-center gap-1.5">✓ वैदिक मन्त्रों से प्राण-प्रतिष्ठित</div>
                <div className="flex items-center gap-1.5">✓ कैश ऑन डिलीवरी (COD) उपलब्ध</div>
                <div className="flex items-center gap-1.5">✓ वाटरप्रूफ सुरक्षा बॉक्स</div>
                <div className="flex items-center gap-1.5">✓ सिद्ध गंगाजल व रक्षा सूत्र संग</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Product Details Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 border-t border-[#E6D6BE]">
        <div className="bg-white rounded-3xl border border-[#E6D6BE] p-5 sm:p-8 shadow-2xs space-y-6">
          
          <div className="border-b border-[#E6D6BE] pb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#292321] flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#E58A16]" /> महिमा, फलप्राप्ति एवं उत्पाद विवरण
            </h2>
            <p className="text-xs text-[#665E58] font-medium mt-0.5">
              DivyaYagyam प्रमाणित शास्त्रों एवं वेदाचार्यों द्वारा अभिमंत्रित पावन जानकारी
            </p>
          </div>

          {/* Full Description */}
          {product.description && (
            <div className="prose max-w-none text-xs sm:text-sm text-[#4A403C]">
              <ProFormattedDescription content={product.description} type="product" />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
