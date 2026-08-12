export default function PujaDetailsLoading() {
  return (
    <div className="min-h-screen bg-[#FFFBF7] text-[#111827] animate-pulse">
      {/* Hero Header Skeleton */}
      <section className="bg-gradient-to-b from-[#FFF8F2] to-[#FFFBF7] py-12 md:py-16 border-b border-[#F3E8DE]">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center gap-2 mb-6">
            <div className="h-4 w-16 bg-orange-100 rounded-md" />
            <div className="h-3 w-3 bg-orange-100 rounded-full" />
            <div className="h-4 w-24 bg-orange-100 rounded-md" />
            <div className="h-3 w-3 bg-orange-100 rounded-full" />
            <div className="h-4 w-36 bg-orange-100 rounded-md" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Cover Image Skeleton */}
            <div className="lg:col-span-7 space-y-4">
              <div className="aspect-[4/3] w-full bg-gradient-to-br from-orange-100 via-amber-100/50 to-orange-100 rounded-3xl border border-[#F3E8DE] shadow-sm" />
              <div className="flex gap-3">
                <div className="h-20 w-24 bg-orange-100/70 rounded-xl" />
                <div className="h-20 w-24 bg-orange-100/70 rounded-xl" />
                <div className="h-20 w-24 bg-orange-100/70 rounded-xl" />
              </div>
            </div>

            {/* Right: Puja Basic Details Skeleton */}
            <div className="lg:col-span-5 space-y-6">
              <div className="h-6 w-32 bg-orange-200/80 rounded-full" />
              <div className="h-10 w-full bg-orange-200/90 rounded-2xl" />
              <div className="h-10 w-4/5 bg-orange-200/90 rounded-2xl" />
              <div className="h-5 w-3/5 bg-orange-100 rounded-lg" />

              <div className="p-4 bg-white rounded-2xl border border-[#F3E8DE] space-y-3">
                <div className="h-4 w-full bg-orange-100/60 rounded" />
                <div className="h-4 w-5/6 bg-orange-100/60 rounded" />
                <div className="h-4 w-4/6 bg-orange-100/60 rounded" />
              </div>

              {/* Price & CTA Skeleton */}
              <div className="pt-4 border-t border-[#F3E8DE] flex items-center justify-between">
                <div className="space-y-1">
                  <div className="h-3 w-20 bg-orange-100 rounded" />
                  <div className="h-8 w-32 bg-orange-200 rounded-xl" />
                </div>
                <div className="h-12 w-44 bg-gradient-to-r from-orange-400 to-amber-500 rounded-2xl shadow-md" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Package Selection Cards Skeleton */}
      <section className="container mx-auto px-4 md:px-6 py-12 max-w-6xl">
        <div className="h-8 w-64 bg-orange-200/80 rounded-xl mb-6 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 bg-white rounded-3xl border border-[#F3E8DE] space-y-4 shadow-xs">
              <div className="h-6 w-3/4 bg-orange-100 rounded-lg" />
              <div className="h-8 w-1/2 bg-orange-200 rounded-xl" />
              <div className="space-y-2 pt-2">
                <div className="h-4 w-full bg-orange-50 rounded" />
                <div className="h-4 w-5/6 bg-orange-50 rounded" />
                <div className="h-4 w-4/6 bg-orange-50 rounded" />
              </div>
              <div className="h-11 w-full bg-orange-100 rounded-xl pt-2" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
