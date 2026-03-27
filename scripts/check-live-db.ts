import { createClient } from "@supabase/supabase-js";

const supabaseUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) throw new Error("Missing env");
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
    console.log("Fetching live 'news' table...");
    const { data: news, error } = await supabase.from('news').select('id, region, title, content, link, image_url').order('published_at', { ascending: false });
    
    if (error) {
        console.error("Error:", error);
        return;
    }
    
    console.log(`Total posts: ${news.length}`);
    const ru = news.filter(n => n.region === 'ru');
    const ar = news.filter(n => n.region === 'ar');
    console.log(`Russian posts: ${ru.length}`);
    console.log(`Arabic posts: ${ar.length}`);
    
    if (ru.length > 0) {
        console.log("\nSample Russian Post:");
        console.log(`Title: ${ru[0].title}`);
        console.log(`Content length: ${ru[0].content?.length || 0}`);
        console.log(`Link: ${ru[0].link}`);
    }
})();
