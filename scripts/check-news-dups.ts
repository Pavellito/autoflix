import { createClient } from "@supabase/supabase-js";

const supabaseUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) throw new Error("Missing env");
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
    // 1. Fetch all news
    const { data: news, error } = await supabase.from('news').select('id, title, region');
    if (error) return console.error(error);
    
    // 2. Simple title-match deduping
    const seen = new Map();
    const dups: any[] = [];
    
    (news || []).forEach(post => {
        const key = post.title.trim().toLowerCase();
        if (seen.has(key)) {
            const first = seen.get(key);
            dups.push({ original: first, duplicate: post });
        } else {
            seen.set(key, { id: post.id, region: post.region });
        }
    });
    
    console.log(`Analyzing ${news?.length} news posts...`);
    if (dups.length === 0) {
        console.log("✅ No exact title duplicates found in news.");
    } else {
        console.log(`⚠️ Found ${dups.length} title-match news duplicates!`);
        console.log("Sample overlap regions:", dups.slice(0, 3).map(d => `${d.original.region} vs ${d.duplicate.region}`));
    }
})();
