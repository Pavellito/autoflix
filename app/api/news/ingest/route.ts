import { NextResponse } from "next/server";
import { RSS_SOURCES, fetchRSSFeed } from "@/app/lib/rss";
import { supabase } from "@/app/lib/supabase";

export const maxDuration = 60; // Allow Vercel hobby tier to run up to 60s for massive RSS dumps

export async function GET() {
  const results = [];
  
  try {
    for (const source of RSS_SOURCES) {
      let newCount = 0;
      const items = await fetchRSSFeed(source.url);
      
      if (!items || items.length === 0) {
        results.push({ source: source.name, status: "Empty feed" });
        continue;
      }

      const itemPromises = items.map(async (item) => {
        // 1. Check if GUID exists (for tracking new entries)
        const { data: existing, error: checkError } = await supabase
          .from("news")
          .select("id")
          .eq("guid", item.guid)
          .single();
          
        if (checkError && checkError.code !== 'PGRST116') {
          console.warn(`[Ingestion] Error checking GUID (ignoring for upsert): ${checkError.message}`);
        }

        // 2. Upsert article to overwrite mangled text and populate native image_urls
        const { error: upsertError } = await supabase.from("news").upsert({
          guid: item.guid,
          source_id: source.id,
          region: source.region,
          title: item.title,
          link: item.link,
          published_at: item.pubDate ? new Date(item.pubDate).toISOString() : null,
          image_url: item.imageUrl,
          content: item.content,
        }, { onConflict: 'guid' });
        
        if (!upsertError && !existing) return 1;
        if (upsertError) console.error(`[Ingestion] Upsert Error for ${item.title}: ${upsertError.message}`);
        return 0;
      });

      const newCounts = await Promise.all(itemPromises);
      newCount = newCounts.reduce((a, b) => a + b, 0);
      
      results.push({ source: source.name, fetched: items.length, new: newCount });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Ingestion complete", 
      details: results 
    });
  } catch (error: any) {
    console.error("[Ingestion Error]", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Ingestion failed. Ensure Supabase 'news' table exists.", 
      details: error.message 
    }, { status: 500 });
  }
}
