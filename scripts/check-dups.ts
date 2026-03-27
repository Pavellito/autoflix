import { createClient } from "@supabase/supabase-js";

const supabaseUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) throw new Error("Missing env");
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
    const { data: cars, error } = await supabase.from('cars').select('id, brand, name');
    if (error) return console.error(error);
    
    const seen = new Map();
    const dups: any[] = [];
    
    (cars || []).forEach(car => {
        const key = `${car.brand.trim().toLowerCase()} ${car.name.trim().toLowerCase()}`;
        if (seen.has(key)) {
            const originalId = seen.get(key);
            dups.push({ originalId, duplicateId: car.id, name: key });
        } else {
            seen.set(key, car.id);
        }
    });
    
    console.log(`Analyzing ${cars?.length} car entries...`);
    if (dups.length === 0) {
        console.log("✅ No exact duplicates found by Brand + Name.");
    } else {
        console.log(`⚠️ Found ${dups.length} potential duplicates!`);
        console.log(JSON.stringify(dups, null, 2));
    }
})();
