"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import Link from "next/link";

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      if (!params?.id) return;
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("id", params.id)
        .single();
      
      if (!error && data) {
        setArticle(data);
      }
      setLoading(false);
    }
    fetchArticle();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl text-white font-bold mb-4">Article Not Found</h1>
        <button onClick={() => router.back()} className="text-accent underline">Go Back</button>
      </div>
    );
  }

  // Use the native image if it exists, otherwise fall back to generic
  const imageSrc = article.image_url || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1600&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Article Hero */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden group">
        <img 
          src={imageSrc} 
          alt={article.title} 
          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1600&auto=format&fit=crop"; }}
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[20s] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 md:max-w-5xl mx-auto flex flex-col justify-end">
          <Link href="/news" className="text-gray-400 hover:text-white mb-6 uppercase tracking-widest text-xs font-bold inline-flex items-center gap-2 transition-colors">
            ← Back to News
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-white/10 backdrop-blur text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border border-white/20">
              {article.source_id.replace('-', ' ')}
            </span>
            <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">
              {new Date(article.published_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 shadow-black drop-shadow-2xl tracking-tight italic">
            {article.title}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
        
        {/* Main Content Column */}
        <div className="lg:col-span-2">
          
          {/* Render Full Raw HTML Article */}
          <article 
            className="text-gray-300 text-lg md:text-xl leading-relaxed font-sans 
                       [&_p]:mb-6 [&_p]:font-medium
                       [&_a]:text-accent [&_a:hover]:underline 
                       [&_h2]:text-3xl [&_h2]:font-black [&_h2]:text-white [&_h2]:mt-12 [&_h2]:mb-6 [&_h2]:tracking-tight
                       [&_h3]:text-2xl [&_h3]:font-black [&_h3]:text-white [&_h3]:mt-10 [&_h3]:mb-4 
                       [&_img]:rounded-2xl [&_img]:my-8 [&_img]:w-full [&_img]:shadow-2xl 
                       [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_li]:mb-2 
                       [&_strong]:text-white [&_strong]:font-black
                       [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:my-8 [&_blockquote]:text-white/80
                       [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-2xl [&_iframe]:my-8"
            dangerouslySetInnerHTML={{ __html: article.content || '<p>No full text available for this article. Please read the AI summary above.</p>' }}
          />

          <div className="mt-16 pt-8 border-t border-white/10">
            <a href={article.link} target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-black px-8 py-4 rounded font-black uppercase tracking-widest text-sm hover:bg-accent hover:text-white transition-all shadow-xl">
              View External Source
            </a>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 border-l-0 lg:border-l border-white/10 pl-0 lg:pl-10">
           <div className="sticky top-24">
              <h4 className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-6 border-b border-white/10 pb-4">About the Source</h4>
              <div className="bg-card-bg rounded-xl p-6 border border-white/5 shadow-xl">
                <p className="text-white font-black text-xl mb-2">{article.source_id.replace('-', ' ').toUpperCase()}</p>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">This article was automatically ingested via RSS from {article.source_id} and enhanced with AutoFlix AI analysis.</p>
                <span className="px-3 py-1 bg-white/10 text-xs font-black uppercase tracking-widest border border-white/10 rounded-sm text-gray-300">
                  Region: {article.region}
                </span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
