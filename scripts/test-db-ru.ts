import { createClient } from "@supabase/supabase-js";

const supabaseUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) throw new Error("Missing env");
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
    console.log("Testing individual Supabase Insertion for Cyrillic...");
    
    const mockPost = {
        guid: "drom-test-1",
        source_id: "drom",
        region: "ru",
        title: "Идейный преемник Infiniti FX",
        link: "https://news.drom.ru/Infiniti-QX65-96570.html",
        published_at: new Date().toISOString(),
        content: "Федеральная антимонопольная служба (ФАС) начала анализ рынка моторных масел в России — в его рамках..."
    };

    const { data, error } = await supabase.from('news').upsert(mockPost, { onConflict: 'guid' }).select();
    
    if (error) {
        console.error("Supabase Error:", error);
    } else {
        console.log("Supabase Success! Row inserted:", data?.[0]?.title);
    }
})();
