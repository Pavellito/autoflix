export default function VehicleDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="h-4 w-32 bg-white/5 rounded animate-pulse mb-6" />

      {/* Hero skeleton */}
      <div className="bg-card-bg rounded-2xl overflow-hidden border border-white/5 mb-8">
        <div className="p-12 bg-gradient-to-br from-[#1a1a3e] via-[#141428] to-[#0a0a1a]">
          <div className="flex gap-2 mb-4">
            <div className="h-6 w-20 bg-white/10 rounded-full animate-pulse" />
            <div className="h-6 w-16 bg-white/10 rounded-full animate-pulse" />
          </div>
          <div className="h-12 w-96 bg-white/10 rounded-lg animate-pulse mb-2" />
          <div className="h-5 w-48 bg-white/5 rounded animate-pulse mb-8" />
          <div className="flex gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="h-3 w-12 bg-white/5 rounded animate-pulse" />
                <div className="h-8 w-20 bg-white/10 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specs grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-card-bg rounded-2xl border border-white/5 overflow-hidden">
            <div className="px-5 py-3 border-b border-white/5 bg-white/5">
              <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
            </div>
            <div className="p-5 space-y-3">
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="flex justify-between py-2 border-b border-white/5">
                  <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
