import { supabase } from "@/app/lib/supabase";

export default async function LiveNewsTicker() {
  const { data: news } = await supabase
    .from("news")
    .select("title, region")
    .order("published_at", { ascending: false })
    .limit(10);

  if (!news || news.length === 0) return null;

  return (
    <div className="w-full bg-accent/90 backdrop-blur-md py-3 overflow-hidden whitespace-nowrap border-y border-white/10 relative z-30 shadow-2xl">
      <div className="inline-block animate-marquee group cursor-default">
        {news.map((item, i) => (
          <span key={i} className="mx-8 text-[11px] font-black text-white uppercase tracking-widest flex-inline items-center gap-2">
            <span className="opacity-50 font-medium">[{item.region}]</span> {item.title}
          </span>
        ))}
        {/* Duplicate for seamless infinite scroll */}
        {news.map((item, i) => (
          <span key={`dup-${i}`} className="mx-8 text-[11px] font-black text-white uppercase tracking-widest flex-inline items-center gap-2">
             <span className="opacity-50 font-medium">[{item.region}]</span> {item.title}
          </span>
        ))}
      </div>
    </div>
  );
}
