(async () => {
    const urls = [
        "https://www.zr.ru/rss/rss.xml",
        "https://motor.ru/rss/",
        "https://quto.ru/news/rss/"
    ];
    for (const url of urls) {
        console.log(`Checking ${url}...`);
        try {
            const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
            console.log(`- Status: ${res.status}`);
        } catch (e) {
            console.log(`- Error: ${e.message}`);
        }
    }
})();
