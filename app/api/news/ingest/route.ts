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

      for (const item of items) {
        // 1. Check if GUID exists just for logging (we will upsert anyway)
        const { data: existing, error: checkError } = await supabase
          .from("news")
          .select("id")
          .eq("guid", item.guid)
          .single();
          
        if (checkError && checkError.code !== 'PGRST116') {
          console.error(`[Ingestion] Error checking GUID for ${source.name}: ${checkError.message}`);
          if (checkError.message.includes("relation") || checkError.message.includes("does not exist")) {
            return NextResponse.json({
              success: false,
              error: checkError.message
            });
          }
          results.push({ source: source.name, error: checkError.message });
          break;
        }

        // 2. Upsert article to overwrite any previously mangled text (e.g. broken windows-1251 encoding)
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
        
        if (!upsertError && !existing) newCount++;
        if (upsertError) console.error(`[Ingestion] Upsert Error for ${source.name}: ${upsertError.message}`);
      }
      
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
