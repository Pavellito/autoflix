import { JSDOM } from "jsdom";
import iconv from "iconv-lite";

(async () => {
    const url = "https://news.drom.ru/102330.html"; // Known Drom URL
    console.log("Fetching Drom with standard headers...");
    const res = await fetch(url, { 
        headers: { 
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "Referer": "https://www.drom.ru/"
        }
    });

    console.log("Status:", res.status);
    if (!res.ok) {
        console.log("Fetch failed. Trying Playwright...");
        return;
    }
    
    console.log("Fetch SUCCESS!");
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const htmlText = iconv.decode(buffer, "windows-1251");
    // Just verify the length
    console.log("Length:", htmlText.length);
    console.log("Preview:", htmlText.replace(/\n/g, '').substring(0, 150));
})();
