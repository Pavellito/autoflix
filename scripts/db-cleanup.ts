import { createClient } from "@supabase/supabase-js";

const supabaseUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) throw new Error("Missing env");
const supabase = createClient(supabaseUrl, supabaseKey);

async function mergeCars(originalId: string, duplicateId: string) {
    console.log(`➡️ Merging [${duplicateId}] into [${originalId}]...`);
    
    // 1. Move Prices
    const { error: pError } = await supabase.from('car_prices')
        .update({ car_id: originalId })
        .eq('car_id', duplicateId);
    if (pError) console.error("Error moving prices:", pError);

    // 2. Move Regional Advice
    const { error: aError } = await supabase.from('car_regional_advice')
        .update({ car_id: originalId })
        .eq('car_id', duplicateId);
    if (aError) console.error("Error moving advice:", aError);

    // 3. Delete Duplicate Car
    const { error: dError } = await supabase.from('cars')
        .delete()
        .eq('id', duplicateId);
    if (dError) console.error("Error deleting duplicate:", dError);
    else console.log(`✅ [${duplicateId}] deleted.`);
}

(async () => {
    console.log("🚀 Starting Phase 5: Production Cleanup...");

    const dupsToMerge = [
       { originalId: "car-10", duplicateId: "car-23" }, // Ford Mach-E
       { originalId: "car-4", duplicateId: "car-27" },  // BYD Seal
       { originalId: "car-8", duplicateId: "car-28" },  // Kia EV6
       { originalId: "car-3", duplicateId: "car-29" }   // Hyundai Ioniq 5
    ];

    for (const d of dupsToMerge) {
        await mergeCars(d.originalId, d.duplicateId);
    }

    console.log("\n📊 Normalizing numeric specifications for all cars...");
    const { data: cars } = await supabase.from('cars').select('*');
    
    if (cars) {
        for (const car of cars) {
            // Clean Range (strip 'km' if present)
            let rawRange = String(car.range_km || "");
            let cleanRange = parseInt(rawRange.replace(/\D/g, ''), 10);
            
            // Clean Battery (strip 'kWh')
            let rawBattery = String(car.battery || "");
            let cleanBattery = parseFloat(rawBattery.replace(/[^\d.]/g, ''));
            
            // Update if changed
            if (!isNaN(cleanRange) && cleanRange > 0 && String(cleanRange) !== rawRange) {
                 await supabase.from('cars').update({ range_km: cleanRange }).eq('id', car.id);
            }
            if (!isNaN(cleanBattery) && cleanBattery > 0 && String(cleanBattery) !== rawBattery) {
                 await supabase.from('cars').update({ battery: cleanBattery }).eq('id', car.id);
            }
        }
    }

    console.log("\n✅ Phase 5 Sanitization COMPLETE!");
})();
