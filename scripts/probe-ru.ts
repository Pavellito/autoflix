import iconv from "iconv-lite";

(async () => {
    const url = "https://news.drom.ru/Infiniti-QX65-96570.html";
    console.log(`Fetching ${url}...`);
    const res = await fetch(url, { headers: { "User-Agent": "AutoFlix/2.0 NewsCrawler" } });
    
    console.log("Status:", res.status);
    const contentType = res.headers.get("content-type") || "";
    console.log("Content-Type Header:", contentType);
    
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let charset = "utf-8";
    const headerMatch = contentType.match(/charset=([\w-]+)/i);
    if (headerMatch && iconv.encodingExists(headerMatch[1])) {
        charset = headerMatch[1].toLowerCase();
        console.log("Detected charset from App logic (Header):", charset);
    } else {
        const headHtml = buffer.toString("utf-8", 0, Math.min(buffer.length, 2048));
        const metaMatch = headHtml.match(/<meta[^>]*charset=['"]?([\w-]+)['"]?/i) || headHtml.match(/<meta[^>]*content=['"][^'"]*charset=([\w-]+)['"]/i);
        console.log("Meta HTML Snippet:", headHtml.substring(0, 300));
        if (metaMatch && iconv.encodingExists(metaMatch[1])) {
           charset = metaMatch[1].toLowerCase();
           console.log("Detected charset from App logic (Meta):", charset);
        } else {
           console.log("FAILED to detect charset. Defaulting to utf-8.");
        }
    }
    
    const html = iconv.decode(buffer, charset);
    console.log("First 100 chars decoded:", html.substring(0, 100).replace(/\n/g, ' '));
})();
