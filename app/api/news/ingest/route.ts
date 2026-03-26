import { NextResponse } from "next/server";
import { RSS_SOURCES, fetchRSSFeed } from "@/app/lib/rss";
import { supabase } from "@/app/lib/supabase";

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
        // 1. Check if GUID exists (PGRST116 means not found)
        const { data: existing, error: checkError } = await supabase
          .from("news")
          .select("id")
          .eq("guid", item.guid)
          .single();
          
        if (checkError && checkError.code !== 'PGRST116') {
          console.error(`[Ingestion] Error checking GUID for ${source.name}: ${checkError.message}`);
          results.push({ source: source.name, error: "Database error. Table 'news' might be missing." });
          break; // Stop for this source
        }

        if (!existing) {
          // 2. Insert new article
          const { error: insertError } = await supabase.from("news").insert({
            guid: item.guid,
            source_id: source.id,
            region: source.region,
            title: item.title,
            link: item.link,
            published_at: item.pubDate ? new Date(item.pubDate).toISOString() : null,
          });
          
          if (!insertError) newCount++;
          else console.error(`[Ingestion] Insert Error: ${insertError.message}`);
        }
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
      error: "Ingestion failed. Ensure Supabase 'news' table exists.", 
      details: error.message 
    }, { status: 500 });
  }
}
