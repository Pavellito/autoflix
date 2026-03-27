import { createClient } from "@supabase/supabase-js";

const supabaseUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) throw new Error("Missing env");
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
    const { data, error } = await supabase.from('news').select('region');
    if (error) {
        console.error("Error:", error);
        return;
    }
    
    const counts = data.reduce((acc, row) => {
        acc[row.region] = (acc[row.region] || 0) + 1;
        return acc;
    }, {});
    
    console.log("Region Counts in Supabase:", counts);
})();
