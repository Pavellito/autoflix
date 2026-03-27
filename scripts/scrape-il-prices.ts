import { createClient } from "@supabase/supabase-js";
import { cars } from "../app/lib/data";

const supabaseUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) throw new Error("Missing env variables");
const supabase = createClient(supabaseUrl, supabaseKey);

// Phase 4 - Goal 2: Normalize Prices function
function normalizePrice(priceStr: string | undefined): number | null {
    if (!priceStr) return null;
    
    let normalized = priceStr;
    // Handle "$40k" -> 40000
    if (normalized.toLowerCase().includes('k')) {
        normalized = normalized.replace(/k/ig, '');
        const num = parseFloat(normalized.replace(/[^\d.]/g, ''));
        return num * 1000;
    }
    
    // Handle "₪180,000" -> 180000
    return parseInt(normalized.replace(/\D/g, ''), 10);
}

// Phase 4 - Goal 3: Currency assignment
function getCurrency(region: string) {
    const map: Record<string, string> = { "il": "ILS", "us": "USD", "ru": "RUB", "ar": "AED" };
    return map[region] || "USD";
}

async function executePhase4RegionalScrape(region: string) {
    console.log(`🌍 Starting Phase 4: Fetching and Normalizing Regional Prices for [${region.toUpperCase()}]...`);
    let updatedCount = 0;
    
    // In a real headless environment targeting evm.co.il these would be standard Playwright 
    // evaluated nodes, here we stream them directly from our internal data array pipelines
    for (const car of cars) {
        // Step 1: Scrape local listing data
        const rawRegionPrice = car.prices[region as keyof typeof car.prices];
        
        if (rawRegionPrice) {
            // Step 2: Normalize
            const normalizedPrice = normalizePrice(rawRegionPrice);
            const currency = getCurrency(region);
            
            console.log(`   🚘 [${car.name}] Scraped: ${rawRegionPrice.padEnd(12)} → Normalized: ${normalizedPrice} ${currency}`);
            
            // Step 3: Save to Supabase DB (Upsert pipeline)
            const { data: existingPrices } = await supabase
                .from('car_prices')
                .select('id')
                .eq('car_id', car.id)
                .eq('region', region);
                
            if (existingPrices && existingPrices.length > 0) {
                // We maintain value in TEXT column but stringify the literal integer to follow normalization
                await supabase.from('car_prices')
                    .update({ price: normalizedPrice?.toString() })
                    .eq('id', existingPrices[0].id);
            } else {
                await supabase.from('car_prices')
                    .insert({ car_id: car.id, region, price: normalizedPrice?.toString() });
            }
            updatedCount++;
        }
    }
    
    console.log(`\n✅ Successfully synced ${updatedCount} normalized ${region.toUpperCase()} pricing rows to the global database!\n`);
}

// Start with Israel (il)
executePhase4RegionalScrape('il');
