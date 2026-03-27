import iconv from "iconv-lite";

(async () => {
    const url = "https://news.auto.ru/rss/all_recent_news.rss";
    console.log(`Fetching RSS from ${url}...`);
    const res = await fetch(url, { 
        headers: { 
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/rss+xml,application/xml;q=0.9,*/*;q=0.8"
        } 
    });
    
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("First 500 chars of RSS:");
    console.log(text.substring(0, 500));
})();
