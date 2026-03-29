export default function CarsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-9 w-48 bg-white/5 rounded-lg animate-pulse mb-3" />
        <div className="h-5 w-96 bg-white/5 rounded-lg animate-pulse" />
      </div>

      {/* Search bar skeleton */}
      <div className="h-12 bg-white/5 rounded-xl animate-pulse mb-4" />
      <div className="h-5 w-32 bg-white/5 rounded animate-pulse mb-8" />

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-card-bg rounded-2xl overflow-hidden border border-white/5">
            <div className="h-36 bg-white/5 animate-pulse" />
            <div className="p-4 flex items-center justify-between">
              <div className="h-4 w-16 bg-white/5 rounded animate-pulse" />
              <div className="h-4 w-16 bg-white/5 rounded animate-pulse" />
              <div className="h-4 w-16 bg-white/5 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
