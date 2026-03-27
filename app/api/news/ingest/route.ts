import { NextResponse } from "next/server";
import { RSS_SOURCES, fetchRSSFeed } from "@/app/lib/rss";
import { supabase } from "@/app/lib/supabase";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

export const maxDuration = 60; // Allow Vercel hobby tier to run up to 60s for massive RSS dumps

// Helper to scrape full HTML from the external news site
async function scrapeFullArticle(url: string) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "AutoFlix/2.0 NewsCrawler" }, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return { content: null, imageUrl: null };
    const html = await res.text();
    const doc = new JSDOM(html, { url });
    
    // Extract real OG Image
    let imageUrl = null;
    const ogImage = doc.window.document.querySelector('meta[property="og:image"]');
    if (ogImage) imageUrl = ogImage.getAttribute('content');

    const reader = new Readability(doc.window.document);
    const article = reader.parse();
    
    return {
      content: article?.content || null,
      imageUrl: imageUrl
    };
  } catch (e) {
    return { content: null, imageUrl: null };
  }
}

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

        // 2. SCRAPE FULL HTML IF NATIVE RSS CONTENT IS TRUNCATED OR MISSING IMAGE
        let finalContent = item.content;
        let finalImage = item.imageUrl;
        
        // Strip basic HTML tags from item.content to determine true text length
        const pureTextLength = (item.content || "").replace(/<[^>]*>?/gm, '').length;
        
        if ((pureTextLength < 1500 || !item.imageUrl) && item.link) {
          const scraped = await scrapeFullArticle(item.link);
          if (scraped.content) finalContent = scraped.content;
          if (scraped.imageUrl && !finalImage) finalImage = scraped.imageUrl;
        }

        // 3. Upsert article with FULL HTML and true source image
        const { error: upsertError } = await supabase.from("news").upsert({
          guid: item.guid,
          source_id: source.id,
          region: source.region,
          title: item.title,
          link: item.link,
          published_at: item.pubDate ? new Date(item.pubDate).toISOString() : null,
          image_url: finalImage,
          content: finalContent,
        }, { onConflict: 'guid' });
        
        if (!upsertError && !existing) return 1;
        if (upsertError) console.error(`[Ingestion] Upsert Error for ${item.title}: ${upsertError.message}`);
        return 0;
      });

      const newCounts = await Promise.all(itemPromises);
      newCount = 0;
      for (const c of newCounts) {
        if (typeof c === 'number') newCount += c;
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
