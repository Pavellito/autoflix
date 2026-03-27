import { fetchRSSFeed, RSS_SOURCES } from "../app/lib/rss";

(async () => {
    console.log("Testing Russian Ingestion...");
    const ruSources = RSS_SOURCES.filter(s => s.region === 'ru');
    for (const source of ruSources) {
        console.log(`\nFetching ${source.name} (${source.url})...`);
        const items = await fetchRSSFeed(source.url);
        console.log(`Found ${items.length} items from ${source.name}.`);
        if (items.length > 0) {
            console.log("Sample:", items[0].title);
            console.log("Has Image:", !!items[0].imageUrl, "Link:", items[0].link);
        }
    }
})();
