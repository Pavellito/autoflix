import { createClient } from "@supabase/supabase-js";

const supabaseUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) throw new Error("Missing env");
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
    const { data: cars, error } = await supabase.from('cars').select('*').limit(1);
    if (error) return console.error(error);
    console.log("Schema Columns:", Object.keys(cars?.[0] || {}));
})();
