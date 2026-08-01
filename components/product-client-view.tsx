'use client'

import { useState } from 'react'
import Image from 'next/image';
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck, ShoppingBag, MapPin, Star, UserCircle2, Flame, Award, PackageCheck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { cn } from '@/lib/utils'
import { getAutoSeoAlt } from '@/lib/seo-auto'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PaymentTrustBadge } from '@/components/payment-trust-badge'
import { ProFormattedDescription } from '@/components/pro-formatted-description'

export function ProductClientView({ product }: { product: any }) {
  const router = useRouter()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  
  if (!product) return <div className="py-20 text-center font-bold text-slate-600">Product Not Found</div>

  const fallbackImage = process.env.NEXT_PUBLIC_URL_4681 || ''
  
  const allImages = [
    ...(product.coverImage ? [{ url: product.coverImage, alt: product.name }] : []),
    ...(product.images || []).map((img: any) => ({ url: img.url, alt: img.alt || product.name }))
  ]
  const [selectedMedia, setSelectedMedia] = useState(allImages[0]?.url || fallbackImage)
  
  const hasStock = product.inventory ? product.inventory.quantity > 0 : true
  const reviews = product.reviews || []

  // Price calculations
  const originalPrice = Number(product.price || 0)
  const salePriceNum = product.salePrice ? Number(product.salePrice) : null
  const hasDiscount = salePriceNum !== null && salePriceNum > 0 && salePriceNum < originalPrice
  const activePrice = hasDiscount ? salePriceNum : originalPrice
  const discountPercent = hasDiscount ? Math.round(((originalPrice - salePriceNum!) / originalPrice) * 100) : 0
  
  // Calculate average rating
  const avgRating = reviews.length > 0 
    ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length 
    : 5

  const currentIndex = allImages.findIndex(img => img.url === selectedMedia)
  const handlePrevProductImage = () => {
    const prevIdx = currentIndex <= 0 ? allImages.length - 1 : currentIndex - 1
    if (allImages[prevIdx]) setSelectedMedia(allImages[prevIdx].url)
  }
  const handleNextProductImage = () => {
    const nextIdx = currentIndex >= allImages.length - 1 ? 0 : currentIndex + 1
    if (allImages[nextIdx]) setSelectedMedia(allImages[nextIdx].url)
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: activePrice,
      image: product.coverImage || fallbackImage
    }, quantity)
    setTimeout(() => router.push('/cart'), 50)
  }
  
  const isVideo = (url: string) => {
    return url.endsWith('.mp4') || url.endsWith('.webm') || url.includes('video');
  }

  // Check if description is distinct from shortDescription to avoid duplicate rendering
  const showFullDescription = product.description && 
    product.description.trim() !== '' && 
    product.description.trim() !== (product.shortDescription || '').trim();

  return (
    <div className="container py-6 lg:py-8 max-w-7xl">
      {/* Breadcrumbs */}
      <nav className="flex text-xs text-slate-500 mb-4 overflow-x-auto whitespace-nowrap pb-2">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3 mx-1 mt-0.5" />
        <Link href="/products" className="hover:text-primary transition-colors">Store</Link>
        <ChevronRight className="h-3 w-3 mx-1 mt-0.5" />
        <span className="text-slate-800 font-medium truncate">{product.name}</span>
      </nav>

      {/* Main Product Layout (3 Columns on Desktop) */}
      <div className="grid lg:grid-cols-12 gap-8 relative">
        
        {/* LEFT COL - MEDIA (Gallery) */}
        <div className="lg:col-span-5 flex flex-col md:flex-row gap-4 h-max">
          {/* Vertical Thumbnails (Desktop) */}
          <div className="hidden md:flex flex-col gap-3 w-20 shrink-0">
            {allImages.map((img, idx) => (
              <button 
                key={idx} 
                onMouseEnter={() => setSelectedMedia(img.url)}
                onClick={() => setSelectedMedia(img.url)}
                className={cn(
                  "aspect-square rounded-lg overflow-hidden bg-white border-2 transition-all p-1",
                  selectedMedia === img.url ? "border-orange-500 shadow-sm scale-105" : "border-slate-200 hover:border-orange-300"
                )}
              >
                {isVideo(img.url) ? (
                  <div className="w-full h-full bg-slate-800 text-white flex items-center justify-center text-[9px] font-bold">VIDEO</div>
                ) : (
                  <img src={img.url} alt={getAutoSeoAlt(product.name, 'product', idx)} title={getAutoSeoAlt(product.name, 'product', idx)} className="w-full h-full object-contain mix-blend-multiply" />
                )}
              </button>
            ))}
          </div>

          {/* Main Viewer */}
          <div className="flex-1 aspect-square md:aspect-auto md:h-[500px] rounded-2xl overflow-hidden bg-white border border-slate-200 relative p-4 flex items-center justify-center shadow-sm group">
             {isVideo(selectedMedia) ? (
               <video src={selectedMedia} controls autoPlay muted loop className="w-full h-full object-contain" />
             ) : (
               <img 
                 src={selectedMedia} 
                 alt={getAutoSeoAlt(product.name, 'product')} 
                 title={getAutoSeoAlt(product.name, 'product')} 
                 className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500" 
               />
             )}
             
             {product.isAbhimantrit && (
               <Badge className="absolute top-4 left-4 bg-orange-600 text-white font-bold border-none shadow-md text-xs px-3 py-1 z-10">
                 🔥 100% अभिमंत्रित
               </Badge>
             )}

             {/* Prev / Next Slide Arrows */}
             {allImages.length > 1 && (
               <>
                 <button 
                   type="button" 
                   onClick={handlePrevProductImage}
                   className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-orange-500 text-slate-800 hover:text-white flex items-center justify-center border border-slate-200 transition-all shadow-md z-20 cursor-pointer"
                   aria-label="Previous Image"
                 >
                   <ChevronLeft className="w-5 h-5" />
                 </button>
                 <button 
                   type="button" 
                   onClick={handleNextProductImage}
                   className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-orange-500 text-slate-800 hover:text-white flex items-center justify-center border border-slate-200 transition-all shadow-md z-20 cursor-pointer"
                   aria-label="Next Image"
                 >
                   <ChevronRight className="w-5 h-5" />
                 </button>
                 <Badge className="absolute top-4 right-4 bg-slate-900/80 text-white font-bold border-none text-[11px] px-2.5 py-0.5 shadow-sm z-10">
                   {(currentIndex >= 0 ? currentIndex : 0) + 1} / {allImages.length}
                 </Badge>
               </>
             )}

             {!hasStock && (
               <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-20">
                 <Badge className="bg-slate-900 text-white border-none shadow-lg text-lg px-6 py-2">Out of Stock</Badge>
               </div>
             )}
          </div>
          
          {/* Horizontal Thumbnails (Mobile) */}
          <div className="flex md:hidden gap-3 overflow-x-auto pb-2 w-full">
            {allImages.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setSelectedMedia(img.url)}
                className={cn(
                  "aspect-square h-16 shrink-0 rounded-lg overflow-hidden bg-white border-2 transition-all p-1",
                  selectedMedia === img.url ? "border-orange-500 shadow-sm" : "border-slate-200"
                )}
              >
                {isVideo(img.url) ? (
                  <div className="w-full h-full bg-slate-900 text-white flex items-center justify-center text-[8px] font-bold">VIDEO</div>
                ) : (
                  <img src={img.url} alt={img.alt} className="w-full h-full object-contain mix-blend-multiply" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* MIDDLE COL - DETAILS */}
        <div className="lg:col-span-4 space-y-5">
          <div>
            {product.category?.name && (
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block mb-1">
                {product.category.name}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">{product.name}</h1>
          </div>
          
          {/* Ratings Snippet */}
          <div className="flex items-center gap-2">
            <div className="flex text-[#F4B400]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={cn("h-4 w-4", i < Math.round(avgRating) ? "fill-current" : "fill-slate-200 text-slate-200")} />
              ))}
            </div>
            <a href="#reviews" className="text-sm font-semibold text-blue-600 hover:underline hover:text-orange-600">
              {reviews.length} reviews & ratings
            </a>
          </div>

          <hr className="border-slate-200" />

          {/* Price & Discounts */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                <span className="text-xl align-top mr-0.5">₹</span>
                {activePrice.toLocaleString('en-IN')}
              </span>

              {hasDiscount && (
                <>
                  <span className="text-base text-slate-400 line-through font-medium">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                  <Badge className="bg-green-600 text-white font-bold text-xs border-none px-2 py-0.5">
                    {discountPercent}% OFF
                  </Badge>
                </>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">Inclusive of all taxes & free sacred packaging</p>
          </div>

          <hr className="border-slate-200" />

          {/* Product Specifications & Trust Highlights */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs">
            {product.sku && (
              <div>
                <span className="text-slate-400 block font-medium">Product Code:</span>
                <span className="font-bold text-slate-800">{product.sku}</span>
              </div>
            )}
            {product.weight && (
              <div>
                <span className="text-slate-400 block font-medium">Weight:</span>
                <span className="font-bold text-slate-800">{product.weight} grams</span>
              </div>
            )}
            <div>
              <span className="text-slate-400 block font-medium">Authenticity:</span>
              <span className="font-bold text-emerald-700">100% Pure & Blessed</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Shipping:</span>
              <span className="font-bold text-slate-800">Doorstep Delivery</span>
            </div>
          </div>

          {/* About this item (Clean Highlights only, NO raw keyword badges) */}
          <div className="space-y-3 pt-1">
             <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
               <PackageCheck className="h-5 w-5 text-orange-600" /> About this item (मुख्य विवरण)
             </h3>

             <ProFormattedDescription 
               content={product.shortDescription || 'गंगाजल से अभिमंत्रित एवं सिद्ध सनातन सामग्री। सिद्ध पीठ से मंत्रोचार द्वारा प्राण-प्रतिष्ठित।'} 
               type="product" 
             />
          </div>
        </div>

        {/* RIGHT COL - BUY BOX */}
        <div className="lg:col-span-3">
          <Card className="border-slate-200 shadow-sm sticky top-24 rounded-2xl">
            <CardContent className="p-5 space-y-5">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">
                  <span className="text-lg align-top mr-0.5">₹</span>
                  {activePrice.toLocaleString('en-IN')}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-slate-400 line-through">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {/* Delivery Info */}
              <div className="flex gap-2.5 text-xs text-slate-700">
                <MapPin className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                <span><span className="font-semibold text-slate-900">Fast Delivery</span> available across India with live tracking.</span>
              </div>

              <div className="space-y-1">
                {hasStock ? (
                  <h4 className="text-base font-bold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> In Stock (उपलब्ध है)
                  </h4>
                ) : (
                  <h4 className="text-base font-bold text-red-600">Out of Stock</h4>
                )}
                <p className="text-[11px] text-slate-500">Fulfilled & Blessed by DivyaYagyam</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-semibold text-slate-700">Quantity:</label>
                  <Select value={String(quantity)} onValueChange={(v) => setQuantity(Number(v))} disabled={!hasStock}>
                    <SelectTrigger className="w-20 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: Math.min(10, product.inventory?.quantity || 10) }).map((_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleAddToCart}
                  className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-slate-950 font-bold border border-[#FCD200] shadow-sm rounded-xl h-11 text-sm"
                  disabled={!hasStock}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" /> Add to Cart (कार्ट में जोड़ें)
                </Button>
                <Button 
                  onClick={handleAddToCart}
                  className="w-full bg-[#FFA41C] hover:bg-[#FA8900] text-slate-950 font-extrabold border border-[#FF8F00] shadow-sm rounded-xl h-11 text-sm"
                  disabled={!hasStock}
                >
                  Buy Now (अभी खरीदें)
                </Button>
              </div>

              <div className="flex items-center gap-2 pt-2 text-xs text-slate-600">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>100% Genuine & Verified Product</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <hr className="my-10 border-slate-200" />

      {/* BOTTOM - PRODUCT DESCRIPTION (Only rendered if distinct full description exists) */}
      {showFullDescription && (
        <div className="mb-10 max-w-4xl space-y-4">
           <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3">Detailed Description (विस्तृत जानकारी)</h2>
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
             <ProFormattedDescription content={product.description} type="product" />
           </div>
        </div>
      )}

      {/* Custom HTML / JS Embed Code Section (Rendered clean & instant) */}
      {product.customHtml && product.customHtml.trim() && (
        <div className="mb-10 max-w-4xl space-y-4">
           <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3">Custom Specifications & Output (विशेष जानकारी)</h2>
           <div 
             className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs leading-relaxed text-slate-800 overflow-x-auto"
             dangerouslySetInnerHTML={{ __html: product.customHtml }} 
           />
        </div>
      )}

      <PaymentTrustBadge className="my-6 max-w-4xl" />

      <hr className="my-10 border-slate-200" />

      {/* BOTTOM - CUSTOMER REVIEWS */}
      <div id="reviews" className="grid md:grid-cols-12 gap-8 max-w-5xl">
        <div className="md:col-span-4 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Devotee Reviews</h2>
          <div className="flex items-center gap-3">
            <div className="flex text-[#F4B400]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={cn("h-5 w-5", i < Math.round(avgRating) ? "fill-current" : "fill-slate-200 text-slate-200")} />
              ))}
            </div>
            <span className="text-lg font-bold text-slate-900">{avgRating.toFixed(1)} out of 5</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">{reviews.length} total devotee ratings</p>
          
          <div className="space-y-2 mt-4">
            {[5, 4, 3, 2, 1].map(star => {
              const count = reviews.filter((r: any) => r.rating === star).length
              const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : (star === 5 ? 100 : 0)
              return (
                <div key={star} className="flex items-center gap-3 text-xs text-slate-700">
                  <span className="w-12 font-medium">{star} star</span>
                  <div className="flex-1 h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div className="h-full bg-[#FFA41C]" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-10 text-right font-semibold text-slate-500">{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="md:col-span-8 space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Verified Reviews</h3>
          {reviews.length === 0 ? (
            <div className="p-6 text-center border border-dashed rounded-2xl bg-slate-50 text-slate-500 text-sm">
              No reviews yet. Be the first to share your blessing experience!
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((r: any) => (
                <div key={r.id} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <UserCircle2 className="h-5 w-5 text-slate-400" />
                    {r.reviewerName || r.user?.firstName || 'Verified Devotee'}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex text-[#F4B400]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn("h-3.5 w-3.5", i < r.rating ? "fill-current" : "fill-slate-200 text-slate-200")} />
                      ))}
                    </div>
                    {r.title && <span className="text-sm font-bold text-slate-900">{r.title}</span>}
                  </div>
                  <p className="text-[11px] text-slate-400">Reviewed on {new Date(r.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p className="text-sm text-slate-700 leading-relaxed pt-1">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Sticky Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] z-50 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">मूल्य:</span>
            <span className="text-xl font-black text-slate-900">₹{activePrice.toLocaleString('en-IN')}</span>
          </div>
          <Button 
            onClick={handleAddToCart}
            disabled={!hasStock}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black h-12 text-base rounded-xl shadow-md uppercase tracking-wider"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            {hasStock ? 'Add to Cart / अभी खरीदें' : 'Out of Stock'}
          </Button>
        </div>
      </div>

    </div>
  )
}
