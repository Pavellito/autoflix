import { NextResponse } from "next/server";
import { RSS_SOURCES, fetchRSSFeed } from "@/app/lib/rss";
import { supabase } from "@/app/lib/supabase";

// Trigger AI Processing (We'll call our existing internal logic or a separate function)
async function getAISummaryForNews(title: string, content: string) {
  // We'll reuse the logic from /api/summary but tailored for news
  // For now, we'll return null and let a separate process or the UI trigger it
  // to avoid hitting rate limits During bulk ingestion.
  return null;
}

export async function GET() {
  const results = [];
  
  try {
      for (const item of items) {
        // 1. Check if GUID exists
        const { data: existing, error: checkError } = await supabase
          .from("news")
          .select("id")
          .eq("guid", item.guid)
          .single();
          
        if (checkError && checkError.code !== 'PGRST116') {
          console.error(`[Ingestion] Error checking GUID: ${checkError.message}`);
          results.push({ source: source.name, error: "Database table 'news' might be missing. Please run the SQL from supabase_tables.md." });
          break; // Stop for this source if table error
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
    return NextResponse.json({ success: false, error: "Ingestion failed. Ensure Supabase 'news' table exists.", details: error.message }, { status: 500 });
  }
}
