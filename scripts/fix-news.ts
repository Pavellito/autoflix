import { createClient } from "@supabase/supabase-js";
import { fetchRSSFeed } from "../app/lib/rss";

const supabaseUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) throw new Error("Missing env");
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
    console.log("🧹 Flushing corrupted Russian and Arabic news rows...");
    const { error } = await supabase
      .from('news')
      .delete()
      .in('region', ['ru', 'ar']);
      
    if (error) {
        console.error("Error deleting rows:", error);
    } else {
        console.log("✅ Successfully flushed corrupted rows. The user can now click 'Live Sync' to pull a perfectly clean feed.");
    }
})();
