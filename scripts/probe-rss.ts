// probe-rss.ts
import { fetchRSSFeed } from "../app/lib/rss";

(async () => {
    console.log("Analyzing Russian RSS Pipeline...");
    const url = "https://www.drom.ru/export/xml/news.rss";
    const items = await fetchRSSFeed(url);
    if (items.length > 0) {
        console.log("Feed Title 0:", items[0].title);
        console.log("Feed Content 0 (Snippet):", (items[0].content || "").substring(0, 100));
    } else {
        console.log("Feed returned zero items.");
    }
})();
