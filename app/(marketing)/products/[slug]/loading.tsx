export default function ProductDetailsLoading() {
  return (
    <div className="min-h-screen bg-[#FFFBF7] text-[#111827] animate-pulse">
      {/* Product Detail Skeleton */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <div className="h-4 w-16 bg-orange-100 rounded-md" />
            <div className="h-3 w-3 bg-orange-100 rounded-full" />
            <div className="h-4 w-24 bg-orange-100 rounded-md" />
            <div className="h-3 w-3 bg-orange-100 rounded-full" />
            <div className="h-4 w-32 bg-orange-100 rounded-md" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Product Image Gallery Skeleton */}
            <div className="space-y-4">
              <div className="aspect-square w-full bg-gradient-to-br from-orange-100 via-amber-100/50 to-orange-100 rounded-3xl border border-[#F3E8DE]" />
              <div className="flex gap-3">
                <div className="h-20 w-20 bg-orange-100/70 rounded-2xl" />
                <div className="h-20 w-20 bg-orange-100/70 rounded-2xl" />
                <div className="h-20 w-20 bg-orange-100/70 rounded-2xl" />
              </div>
            </div>

            {/* Product Info Skeleton */}
            <div className="space-y-6">
              <div className="h-6 w-28 bg-orange-200/80 rounded-full" />
              <div className="h-10 w-full bg-orange-200/90 rounded-2xl" />
              <div className="h-8 w-36 bg-orange-300/80 rounded-xl" />

              <div className="p-4 bg-white rounded-2xl border border-[#F3E8DE] space-y-3">
                <div className="h-4 w-full bg-orange-100/60 rounded" />
                <div className="h-4 w-5/6 bg-orange-100/60 rounded" />
                <div className="h-4 w-4/6 bg-orange-100/60 rounded" />
              </div>

              <div className="flex gap-4 pt-4">
                <div className="h-12 flex-1 bg-gradient-to-r from-orange-400 to-amber-500 rounded-2xl" />
                <div className="h-12 w-36 bg-orange-200 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
