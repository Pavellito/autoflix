import { GET } from "../app/api/news/ingest/route";
import { supabase } from "../app/lib/supabase";

(async () => {
    console.log("Triggering Ingestion Engine...");
    
    // Polyfill Response for local test
    const res = await GET();
    const data = await res.json();
    console.log("Ingest Result:", JSON.stringify(data, null, 2));

    console.log("Checking DB for Russian rows...");
    const { data: ruNews, error } = await supabase.from('news').select('id, title, content').eq('region', 'ru');
    if (error) {
        console.error("DB Error:", error);
    } else {
        console.log(`Found ${ruNews?.length} Russian rows in DB.`);
        if (ruNews && ruNews.length > 0) {
            console.log("Sample DB content:", ruNews[0].content?.substring(0, 100));
        }
    }
})();
