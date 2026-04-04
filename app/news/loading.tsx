export default function NewsLoading() {
  return (
    <div className="bg-[#141414] min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-[4%]">
        <div className="h-10 bg-white/5 rounded w-64 mb-3 animate-pulse" />
        <div className="h-5 bg-white/5 rounded w-96 mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-[#1a1a1a] rounded-lg overflow-hidden animate-pulse">
              <div className="aspect-[16/10] bg-white/5" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-white/5 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
