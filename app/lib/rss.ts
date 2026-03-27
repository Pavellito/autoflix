import Parser from "rss-parser";
import iconv from "iconv-lite";

export interface RSSSource {
  id: string;
  name: string;
  url: string;
  region: "global" | "il" | "ru" | "ar";
}

export const RSS_SOURCES: RSSSource[] = [
  // Global
  { id: "insideevs", name: "InsideEVs", url: "https://insideevs.com/rss/articles/all/", region: "global" },
  { id: "electrek", name: "Electrek", url: "https://electrek.co/feed/", region: "global" },
  { id: "techcrunch-auto", name: "TechCrunch Transportation", url: "https://techcrunch.com/category/transportation/feed/", region: "global" },
  
  // Israel
  { id: "walla-auto", name: "Walla Auto", url: "https://rss.walla.co.il/feed/30", region: "il" },
  { id: "ynet-auto", name: "Ynet Auto", url: "https://www.ynet.co.il/Integration/StoryRss550.xml", region: "il" },
  
  // Russia
  { id: "autoru", name: "Auto.ru News", url: "https://news.auto.ru/rss/all_recent_news.rss", region: "ru" },
  { id: "drom", name: "Drom.ru", url: "https://www.drom.ru/export/xml/news.rss", region: "ru" },
  
  // Arabic
  { id: "arabgt", name: "ArabGT", url: "https://www.arabgt.com/feed/", region: "ar" },
];

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['content:encoded', 'contentEncoded']
    ]
  }
});

export async function fetchRSSFeed(url: string) {
  try {
    const response = await fetch(url, { 
      headers: { 
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      } 
    });
    if (!response.ok) {
      console.warn(`[RSS] Failed to fetch ${url}: ${response.statusText}`);
      return [];
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // First try decoding as utf-8
    let text = iconv.decode(buffer, "utf-8");
    
    // Detect custom encoding from XML declaration
    const match = text.match(/<\?xml[^>]*encoding=['"]([^'"]+)['"]/i);
    if (match && match[1].toLowerCase() !== 'utf-8') {
      const encoding = match[1].toLowerCase();
      try {
        if (iconv.encodingExists(encoding)) {
          text = iconv.decode(buffer, encoding);
        }
      } catch (e) {
         console.warn(`[RSS] Unsupported encoding ${encoding} for ${url}, using utf-8 fallback`);
      }
    }

    const feed = await parser.parseString(text);
    return feed.items.map((item: any) => {
      // 1. Extract high-quality image URL from various possible RSS schemas
      let imageUrl = null;
      if (item.enclosure?.url) imageUrl = item.enclosure.url;
      else if (item.mediaContent?.['$']?.url) imageUrl = item.mediaContent['$'].url;
      else if (item.mediaThumbnail?.['$']?.url) imageUrl = item.mediaThumbnail['$'].url;
      // Fallback: regex search through the HTML body for the first <img> tag
      else if (item.content || item.contentEncoded) {
         const imgMatch = (item.content || item.contentEncoded).match(/<img[^>]+src=["']([^"']+)["']/i);
         if (imgMatch) imageUrl = imgMatch[1];
      }

      // 2. Extract full HTML article content
      const fullContent = item.contentEncoded || item.content || item.contentSnippet || "";

      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        contentSnippet: item.contentSnippet,
        guid: item.guid || item.link,
        creator: item.creator,
        imageUrl,
        content: fullContent
      };
    });
  } catch (error) {
    console.error(`[RSS] Error parsing feed from ${url}:`, error);
    return [];
  }
}
