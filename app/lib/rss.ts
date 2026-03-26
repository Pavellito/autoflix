import Parser from "rss-parser";

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

const parser = new Parser();

export async function fetchRSSFeed(url: string) {
  try {
    const response = await fetch(url, { headers: { "User-Agent": "AutoFlix/2.0" } });
    if (!response.ok) {
      console.warn(`[RSS] Failed to fetch ${url}: ${response.statusText}`);
      return [];
    }

    const arrayBuffer = await response.arrayBuffer();
    let text = new TextDecoder("utf-8").decode(arrayBuffer);
    
    // Detect custom encoding from XML declaration
    const match = text.match(/<\?xml[^>]*encoding=['"]([^'"]+)['"]/i);
    if (match && match[1].toLowerCase() !== 'utf-8') {
      const encoding = match[1].toLowerCase();
      try {
        text = new TextDecoder(encoding).decode(arrayBuffer);
      } catch (e) {
         console.warn(`[RSS] Unsupported encoding ${encoding} for ${url}, using utf-8 fallback`);
      }
    }

    const feed = await parser.parseString(text);
    return feed.items.map((item: any) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      contentSnippet: item.contentSnippet,
      guid: item.guid || item.link,
      creator: item.creator,
    }));
  } catch (error) {
    console.error(`[RSS] Error parsing feed from ${url}:`, error);
    return [];
  }
}
