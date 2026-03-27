import { createClient } from "@supabase/supabase-js";

const supabaseUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) throw new Error("Missing env");
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
    const { error } = await supabase.from('favorites').select('id').limit(1);
    if (error) {
        console.log("Favorites table missing. Creating...");
        // This is where we should run a SQL migration
    } else {
        console.log("Favorites table EXISTS.");
    }
})();
