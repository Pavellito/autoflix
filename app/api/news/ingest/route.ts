import { NextResponse } from "next/server";
import { RSS_SOURCES, fetchRSSFeed } from "@/app/lib/rss";
import { supabase } from "@/app/lib/supabase";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import iconv from "iconv-lite";

export const maxDuration = 60; // Allow Vercel hobby tier to run up to 60s for massive RSS dumps

// Helper to scrape full HTML from the external news site
async function scrapeFullArticle(url: string) {
  try {
    const res = await fetch(url, { 
      headers: { 
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,ru;q=0.8,ar;q=0.7"
      }, 
      signal: AbortSignal.timeout(8000) 
    });
    if (!res.ok) return { content: null, imageUrl: null };
    
    // Safely buffer the foreign payload to respect non-UTF8 encodings like Cyrillic windows-1251
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let charset = "utf-8";
    const contentType = res.headers.get("content-type") || "";
    const match = contentType.match(/charset=([\w-]+)/i);
    if (match && iconv.encodingExists(match[1])) {
        charset = match[1].toLowerCase();
    } else {
        const headHtml = buffer.toString("utf-8", 0, Math.min(buffer.length, 2048));
        const metaMatch = headHtml.match(/<meta[^>]*charset=['"]?([\w-]+)['"]?/i) || headHtml.match(/<meta[^>]*content=['"][^'"]*charset=([\w-]+)['"]/i);
        if (metaMatch && iconv.encodingExists(metaMatch[1])) charset = metaMatch[1].toLowerCase();
    }
    
    const html = iconv.decode(buffer, charset);
    const doc = new JSDOM(html, { url });
    
    // Extract real OG Image
    let imageUrl = null;
    const ogSelector = [
      'meta[property="og:image"]',
      'meta[name="og:image"]',
      'meta[property="twitter:image"]',
      'meta[name="twitter:image"]',
      'link[rel="image_src"]'
    ].join(',');
    const ogImage = doc.window.document.querySelector(ogSelector);
    if (ogImage) imageUrl = ogImage.getAttribute('content') || ogImage.getAttribute('href');

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
          .select("id, title")
          .or(`guid.eq."${item.guid}",title.eq."${item.title}"`)
          .limit(1)
          .single();
          
        if (checkError && checkError.code !== 'PGRST116') {
          console.warn(`[Ingestion] Error checking duplication (ignoring): ${checkError.message}`);
        }
        
        // CRITICAL PERFORMANCE FIX: If it already exists by GUID or TITLE, skip it!
        if (existing) return 0;

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
        
        // Clean Arabic/WP boilerplate footprints from specific global blogs
        if (finalContent) {
           finalContent = finalContent.replace(/<p>The post .*? appeared first on .*?<\/p>/gi, '');
           finalContent = finalContent.replace(/The post .*? appeared first on .*?\./gi, '');
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
