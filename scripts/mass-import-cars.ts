import { createClient } from "@supabase/supabase-js";

const supabaseUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) throw new Error("Missing env");
const supabase = createClient(supabaseUrl, supabaseKey);

const newCars = [
  { brand: "Audi", name: "Q4 e-tron", type: "SUV", range_km: "426", price: "$49,800", battery: "82 kWh", image: "https://images.unsplash.com/photo-1617469767053-d3b508a0d182?auto=format&fit=crop&w=800&q=80" },
  { brand: "Audi", name: "Q8 e-tron", type: "SUV", range_km: "505", price: "$75,000", battery: "114 kWh", image: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=800&q=80" },
  { brand: "BMW", name: "i4 eDrive35", type: "Sedan", range_km: "444", price: "$52,200", battery: "70 kWh", image: "https://images.unsplash.com/photo-1617469767053-d3b508a0d182?auto=format&fit=crop&w=800&q=80" },
  { brand: "Cadillac", name: "Lyriq", type: "SUV", range_km: "505", price: "$58,590", battery: "102 kWh", image: "https://images.unsplash.com/photo-1632243400843-ef4676435fd2?auto=format&fit=crop&w=800&q=80" },
  { brand: "Chevrolet", name: "Blazer EV", type: "SUV", range_km: "521", price: "$60,215", battery: "85 kWh", image: "https://images.unsplash.com/photo-1632762283733-14df39c631e3?auto=format&fit=crop&w=800&q=80" },
  { brand: "Chevrolet", name: "Equinox EV", type: "SUV", range_km: "513", price: "$34,995", battery: "75 kWh", image: "https://images.unsplash.com/photo-1632762283733-14df39c631e3?auto=format&fit=crop&w=800&q=80" },
  { brand: "Ford", name: "F-150 Lightning", type: "Pickup", range_km: "515", price: "$49,995", battery: "131 kWh", image: "https://images.unsplash.com/photo-1615887133385-d601951920ca?auto=format&fit=crop&w=800&q=80" },
  { brand: "Honda", name: "Prologue", type: "SUV", range_km: "476", price: "$47,400", battery: "85 kWh", image: "https://images.unsplash.com/photo-1590362891991-f776e947f631?auto=format&fit=crop&w=800&q=80" },
  { brand: "Hyundai", name: "Ioniq 5 N", type: "Performance", range_km: "356", price: "$66,100", battery: "84 kWh", image: "https://images.unsplash.com/photo-1662581177227-8386345607b3?auto=format&fit=crop&w=800&q=80" },
  { brand: "Kia", name: "EV9", type: "SUV", range_km: "489", price: "$54,900", battery: "99.8 kWh", image: "https://images.unsplash.com/photo-1694532677761-4603953e5b3f?auto=format&fit=crop&w=800&q=80" },
  { brand: "Lucid", name: "Air Pure", type: "Sedan", range_km: "674", price: "$69,900", battery: "88 kWh", image: "https://images.unsplash.com/photo-1630136585376-7928b80b740a?auto=format&fit=crop&w=800&q=80" },
  { brand: "Nissan", name: "Ariya", type: "SUV", range_km: "489", price: "$39,590", battery: "87 kWh", image: "https://images.unsplash.com/photo-1594535182308-8ffef921a841?auto=format&fit=crop&w=800&q=80" },
  { brand: "Polestar", name: "Polestar 3", type: "SUV", range_km: "507", price: "$73,400", battery: "111 kWh", image: "https://images.unsplash.com/photo-1662581177227-8386345607b3?auto=format&fit=crop&w=800&q=80" },
  { brand: "Rivian", name: "R1S", type: "SUV", range_km: "643", price: "$75,900", battery: "135 kWh", image: "https://images.unsplash.com/photo-1662581177227-8386345607b3?auto=format&fit=crop&w=800&q=80" },
  { brand: "Volvo", name: "EX30", type: "SUV", range_km: "442", price: "$34,950", battery: "69 kWh", image: "https://images.unsplash.com/photo-1694532677761-4603953e5b3f?auto=format&fit=crop&w=800&q=80" },
  { brand: "Zeekr", name: "001 FR", type: "Performance", range_km: "550", price: "$100,000", battery: "100 kWh", image: "https://images.unsplash.com/photo-1662581177227-8386345607b3?auto=format&fit=crop&w=800&q=80" }

];

async function run() {
  console.log(`Starting mass import of ${newCars.length} cars...`);
  for (const car of newCars) {
    const { data: existing } = await supabase.from('cars').select('id').eq('brand', car.brand).eq('name', car.name).single();
    if (existing) {
      console.log(`Skipping existing: ${car.brand} ${car.name}`);
      continue;
    }
    const { error } = await supabase.from('cars').insert(car);
    if (error) console.error(`Error inserting ${car.name}:`, error);
    else console.log(`Inserted: ${car.brand} ${car.name}`);
  }
}

run();
