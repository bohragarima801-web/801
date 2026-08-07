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

export function ProductClientView({ product }: { product: any }) {
  const router = useRouter()
  const { addToCart } = useCart()
  
  const [quantity, setQuantity] = useState(1)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [addedToast, setAddedToast] = useState(false)

  if (!product) {
    return (
      <div className="py-20 text-center text-slate-600 font-bold">
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
  const mrp = Math.round(price * 2.1) // Calculate realistic MRP for savings badge
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

  // Related products fallback list
  const relatedProducts = [
    {
      id: 'rel-1',
      name: 'सिद्ध प्राण-प्रतिष्ठित चैतन्य रुद्राक्ष माला',
      slug: 'siddha-abhimantrit-rudraksha-mala',
      price: 901,
      mrp: 1999,
      coverImage: '/rudraksha_mala_product.jpg',
      category: 'रुद्राक्ष माला'
    },
    {
      id: 'rel-2',
      name: 'दिव्य शुद्ध श्रीखण्ड मलयगिरि चन्दन (100g)',
      slug: 'divya-shrikhand-chandan-puja-100g',
      price: 200,
      mrp: 499,
      coverImage: '/divya_chandan_product.jpg',
      category: 'पूजा सामग्री'
    },
    {
      id: 'rel-3',
      name: 'दिव्य धूप स्पेशल - ३२ जड़ी-बूटी अभिमंत्रित (125g)',
      slug: 'divya-dhoop-special-negativity-remover-125g',
      price: 599,
      mrp: 1299,
      coverImage: '/divya_dhoop_product.jpg',
      category: 'धूप व सुगन्ध'
    },
    {
      id: 'rel-4',
      name: 'सिद्ध शुद्ध ताँबा नाग-नागिन जोड़ा (राहु शांति)',
      slug: 'siddha-pure-copper-naag-naagin-pair-rahu-shanti',
      price: 599,
      mrp: 1499,
      coverImage: '/naag_naagin_copper_product.jpg',
      category: 'राहु शांति'
    },
    {
      id: 'rel-5',
      name: 'सिद्ध अभिमंत्रित 9 महालक्ष्मी कौड़ी सेट',
      slug: 'siddha-9-abhimantrit-lakshmi-kaudi-set-free-gifts',
      price: 899,
      mrp: 1999,
      coverImage: '/laxmi_kaudi_set_product.jpg',
      category: 'लक्ष्मी कल्प'
    }
  ].filter(p => p.slug !== product.slug)

  return (
    <div className="bg-[#FFFDF7] text-[#1E120A] min-h-screen pb-20 font-sans">
      
      {/* Added to Cart Toast Notification */}
      {addedToast && (
        <div className="fixed top-20 right-5 z-50 bg-[#8B1A21] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#F2C94C] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
            ✓
          </div>
          <div>
            <p className="text-xs font-bold text-amber-200">सफलतापूर्वक कार्ट में जोड़ा गया!</p>
            <p className="text-sm font-extrabold">{product.name} ({quantity}x)</p>
          </div>
          <Link href="/cart" className="ml-3 px-3 py-1 bg-[#D49B00] hover:bg-amber-400 text-[#1E120A] text-xs font-black rounded-lg">
            कार्ट देखें →
          </Link>
        </div>
      )}

      {/* 1. Breadcrumb Bar */}
      <nav aria-label="Breadcrumb" className="bg-[#FFF8EA] border-b border-[#F5E2B8] py-3.5 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-medium text-[#6A4D3B]">
          <Link href="/" className="hover:text-[#8B1A21] transition-colors">मुख्य पृष्ठ</Link>
          <ChevronRight className="h-3.5 w-3.5 text-amber-600" />
          <Link href="/products" className="hover:text-[#8B1A21] transition-colors">स्टोर (Store)</Link>
          {product.category?.name && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-[#8B5A00] font-bold">{product.category.name}</span>
            </>
          )}
          <ChevronRight className="h-3.5 w-3.5 text-amber-600" />
          <span className="text-[#1E120A] font-bold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </div>
      </nav>

      {/* 2. Main E-Commerce Product Layout (Amazon / Flipkart Style) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Image Showcase & Gallery (5 Cols) */}
          <div className="lg:col-span-5 space-y-4 sticky top-24">
            
            {/* Main Product Image Card */}
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border-2 border-[#F2C94C] shadow-xl group">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                priority
                unoptimized
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              
              {/* Badges on Image */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.isAbhimantrit && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#8B1A21] to-[#B84430] text-white text-[11px] font-extrabold shadow-md">
                    <Sparkles className="h-3 w-3 text-amber-300" /> मंत्र अभिमंत्रित (Siddha)
                  </span>
                )}
                {isLimitedStock && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-[#1E120A] text-[10px] font-black uppercase shadow-sm">
                    <Zap className="h-3 w-3 fill-[#1E120A]" /> ⚡ Limited Batch
                  </span>
                )}
              </div>

              {/* Certified Watermark Seal */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-amber-300 shadow-md flex items-center gap-1.5 text-[11px] font-extrabold text-[#8B1A21]">
                <Award className="h-4 w-4 text-[#D49B00]" /> 100% Certified Divine
              </div>
            </div>

            {/* Thumbnail Carousel if multiple images exist */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={cn(
                      "relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden border-2 transition-all bg-white shadow-xs",
                      activeImageIndex === idx ? "border-[#8B1A21] ring-2 ring-amber-400 scale-105" : "border-[#F5E2B8] opacity-70 hover:opacity-100"
                    )}
                  >
                    <Image src={imgUrl} alt={`Thumbnail ${idx+1}`} fill unoptimized className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Guarantees bar */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="bg-[#FFF8EA] border border-[#F5E2B8] p-3 rounded-2xl text-center">
                <ShieldCheck className="h-5 w-5 mx-auto text-[#8B1A21] mb-1" />
                <p className="text-[11px] font-bold text-[#1E120A]">100% प्रामाणिक</p>
                <p className="text-[9px] text-[#6A4D3B]">वैदिक सिद्ध</p>
              </div>
              <div className="bg-[#FFF8EA] border border-[#F5E2B8] p-3 rounded-2xl text-center">
                <Truck className="h-5 w-5 mx-auto text-[#D49B00] mb-1" />
                <p className="text-[11px] font-bold text-[#1E120A]">एक्सप्रेस डिलीवरी</p>
                <p className="text-[9px] text-[#6A4D3B]">3-5 दिन में घर तक</p>
              </div>
              <div className="bg-[#FFF8EA] border border-[#F5E2B8] p-3 rounded-2xl text-center">
                <Award className="h-5 w-5 mx-auto text-emerald-600 mb-1" />
                <p className="text-[11px] font-bold text-[#1E120A]">गंगाजल व प्रसाद</p>
                <p className="text-[9px] text-[#6A4D3B]">फ्री उपहार संग</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Buying Box & Details (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Category & Ratings */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-[#FFF3D6] text-[#8B5A00] text-xs font-black uppercase tracking-wider border border-[#F2C94C]">
                  {product.category?.name || 'Sanatan Store'}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800">
                  <span className="flex text-amber-500">★★★★★</span> (4.9 / 5.0 • 148+ Verified Ratings)
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-[#1E120A] leading-snug">
                {product.name}
              </h1>
            </div>

            {/* Price & Discounts Box (Amazon/Flipkart Style) */}
            <div className="bg-gradient-to-r from-[#FFF8EA] via-[#FFF3D6] to-[#FFF8EA] border-2 border-[#F2C94C] p-5 sm:p-6 rounded-3xl space-y-3 shadow-md">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-black text-[#8B1A21]">
                  ₹{price.toLocaleString()}
                </span>
                <span className="text-lg text-slate-400 line-through font-bold">
                  M.R.P.: ₹{mrp.toLocaleString()}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-black shadow-xs">
                  {discountPercent}% OFF (बचत ₹{(mrp - price).toLocaleString()})
                </span>
              </div>
              <p className="text-xs text-[#6A4D3B] font-bold flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-600 stroke-[3]" /> सभी टैक्स शामिल • फ्री होम डिलीवरी (₹999+ ऑर्डर पर)
              </p>
            </div>

            {/* Custom Urgent Callout / Scarcity Box if set */}
            {product.customHtml && (
              <div 
                className="rounded-2xl overflow-hidden shadow-xs"
                dangerouslySetInnerHTML={{ __html: product.customHtml }}
              />
            )}

            {/* Short Description */}
            <p className="text-sm sm:text-base text-[#4A2D1B] leading-relaxed font-medium">
              {product.shortDescription}
            </p>

            {/* Stock Meter & Quantity Selector */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#6A4D3B] uppercase tracking-wider">मात्रा चुनें (Select Quantity):</span>
                <span className={cn("text-xs font-black", isAvailable ? "text-emerald-700" : "text-red-600")}>
                  {isAvailable ? `🟢 स्टॉक में उपलब्ध (${stockQty} पैकेट्स शेष)` : '🔴 आउट ऑफ स्टॉक'}
                </span>
              </div>

              {/* Quantity Selector buttons */}
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center rounded-2xl border-2 border-[#F2C94C] bg-white p-1 shadow-sm">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="h-10 w-10 rounded-xl bg-[#FFF8EA] hover:bg-amber-200 text-[#8B1A21] flex items-center justify-center font-bold transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-black text-base text-[#1E120A]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="h-10 w-10 rounded-xl bg-[#FFF8EA] hover:bg-amber-200 text-[#8B1A21] flex items-center justify-center font-bold transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <span className="text-xs text-[#6A4D3B] font-bold">
                  कुल राशि: <strong className="text-[#8B1A21] text-lg font-black">₹{(price * quantity).toLocaleString()}</strong>
                </span>
              </div>
            </div>

            {/* Action Buttons: BUY NOW & ADD TO CART */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <button
                onClick={() => handleAddToCart(false)}
                disabled={!isAvailable}
                className="w-full py-4 px-6 rounded-2xl bg-white border-2 border-[#D49B00] text-[#8B1A21] font-extrabold text-base shadow-md hover:bg-[#FFF8EA] transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5 text-[#8B1A21]" /> कार्ट में जोड़ें (Add to Cart)
              </button>

              <button
                onClick={() => handleAddToCart(true)}
                disabled={!isAvailable}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#8B1A21] via-[#B84430] to-[#8B1A21] text-white font-extrabold text-base shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
              >
                <Zap className="h-5 w-5 text-amber-300 fill-amber-300" /> अभी खरीदें (Buy Now)
              </button>
            </div>

            {/* Amazon-Style Trust Icons Banner */}
            <div className="border border-[#F5E2B8] bg-[#FFFBF3] p-4 rounded-2xl space-y-3">
              <p className="text-xs font-extrabold text-[#8B1A21] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#D49B00]" /> DivyaYagyam 100% सुरक्षा व संतुष्टि गारंटी
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#4A2D1B] font-medium">
                <div className="flex items-center gap-2">✓ वैदिक मन्त्रों से प्राण-प्रतिष्ठित</div>
                <div className="flex items-center gap-2">✓ कैश ऑन डिलीवरी (COD) उपलब्ध</div>
                <div className="flex items-center gap-2">✓ वाटरप्रूफ इको पैकिंग</div>
                <div className="flex items-center gap-2">✓ सिद्ध गंगाजल व रक्षा सूत्र संग</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Product Details Accordion / Tabs Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 border-t border-[#F5E2B8]">
        <div className="bg-white rounded-3xl border-2 border-[#F2C94C] p-6 sm:p-10 shadow-lg space-y-8">
          
          {/* Section Header */}
          <div className="border-b border-[#F5E2B8] pb-5">
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#1E120A] flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-[#8B1A21]" /> महिमा, फलप्राप्ति एवं उत्पाद विवरण
            </h2>
            <p className="text-xs sm:text-sm text-[#6A4D3B] font-bold mt-1">
              DivyaYagyam प्रमाणित शास्त्रों एवं वेदाचार्यों द्वारा अभिमंत्रित पावन जानकारी
            </p>
          </div>

          {/* Full Description & Benefits HTML */}
          {product.description && (
            <div className="prose prose-amber max-w-none prose-headings:font-heading prose-headings:font-extrabold prose-headings:text-[#1E120A] prose-p:text-[#4A2D1B] prose-li:text-[#4A2D1B]">
              <ProFormattedDescription content={product.description} />
            </div>
          )}

          {/* Product Specifications Grid */}
          <div className="bg-[#FFF8EA] border border-[#F5E2B8] p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-heading font-extrabold text-[#8B1A21]">
              📦 उत्पाद विनिर्देश (Product Specifications Table)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="flex justify-between border-b border-[#F5E2B8] pb-2">
                <span className="text-[#6A4D3B] font-bold">उत्पाद श्रेणी:</span>
                <span className="font-extrabold text-[#1E120A]">{product.category?.name || 'Sanatan Store'}</span>
              </div>
              <div className="flex justify-between border-b border-[#F5E2B8] pb-2">
                <span className="text-[#6A4D3B] font-bold">प्राण-प्रतिष्ठा स्टेटस:</span>
                <span className="font-extrabold text-emerald-700">100% अभिमंत्रित (Siddha)</span>
              </div>
              <div className="flex justify-between border-b border-[#F5E2B8] pb-2">
                <span className="text-[#6A4D3B] font-bold">उपलब्ध स्टॉक:</span>
                <span className="font-extrabold text-[#1E120A]">{stockQty} यूनिट्स</span>
              </div>
              <div className="flex justify-between border-b border-[#F5E2B8] pb-2">
                <span className="text-[#6A4D3B] font-bold">पैकेज में शामिल:</span>
                <span className="font-extrabold text-[#1E120A]">उत्पाद + गंगाजल + रक्षा सूत्र</span>
              </div>
            </div>
          </div>

          {/* Verified Customer Reviews Cards */}
          <div className="space-y-6 pt-4">
            <h3 className="text-xl font-heading font-extrabold text-[#1E120A] flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" /> भक्तों की प्रामाणिक समीक्षाएं (Customer Reviews)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: 'राजेश शर्मा (जयपुर)',
                  rating: 5,
                  date: '3 दिन पहले',
                  review: 'बहुत ही सिद्ध और पवित्र प्रॉडक्ट मिला। पैकिंग वाटरप्रूफ थी और साथ में मिला सिद्ध गंगाजल बहुत पावन है।'
                },
                {
                  name: 'सुनीता पटेल (अहमदाबाद)',
                  rating: 5,
                  date: '5 दिन पहले',
                  review: 'DivyaYagyam से मँगवाया यह सामान 100% असली है। दिव्य सुगन्ध और ऊर्जा का अहसास होता है। धन्यवाद!'
                }
              ].map((rev, i) => (
                <div key={i} className="bg-[#FFFBF3] border border-[#F5E2B8] p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#1E120A]">{rev.name}</span>
                    <span className="text-xs text-amber-500 font-bold">★★★★★</span>
                  </div>
                  <p className="text-xs text-[#4A2D1B] leading-relaxed font-medium">{rev.review}</p>
                  <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> 100% Verified Buyer • {rev.date}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 4. Related Recommended Products Section */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-heading font-extrabold text-[#1E120A]">
                  अन्य सिद्ध पावन प्रॉडक्ट्स (Recommended Products)
                </h2>
                <p className="text-xs text-[#6A4D3B] font-bold mt-1">भक्तों द्वारा अत्यधिक पसंद किए जाने वाले स्टोर प्रॉडक्ट्स</p>
              </div>
              <Link href="/products" className="text-xs font-extrabold text-[#8B1A21] hover:underline flex items-center gap-1">
                सभी देखें <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Grid of Related Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(rel => (
                <div key={rel.id} className="bg-white rounded-3xl border border-[#F5E2B8] hover:border-[#F2C94C] p-4 space-y-3 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FFF9EE]">
                      <Image src={rel.coverImage} alt={rel.name} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#8B1A21] text-white text-[10px] font-bold">
                        {rel.category}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sm text-[#1E120A] line-clamp-2 group-hover:text-[#8B1A21] transition-colors">
                        {rel.name}
                      </h3>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-lg font-black text-[#8B1A21]">₹{rel.price}</span>
                        <span className="text-xs text-slate-400 line-through">₹{rel.mrp}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/products/${rel.slug}`}
                    className="w-full py-2.5 rounded-xl bg-[#FFF8EA] border border-[#D49B00] text-[#8B1A21] font-extrabold text-xs text-center hover:bg-[#8B1A21] hover:text-white transition-all shadow-xs block"
                  >
                    विवरण व खरीदें →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
