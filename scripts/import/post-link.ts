/**
 * Post-import FK linking script
 *
 * Links fuel_economy, safety_ratings, and ev_specs to vehicle_specs
 * by matching on make/model/year. Run this after all imports are complete.
 *
 * Run:  npx tsx scripts/import/post-link.ts
 */

import { loadEnv } from "./utils.js";
import { createClient } from "@supabase/supabase-js";

async function getServiceClient() {
  const url = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY not set");
  return createClient(url, key);
}

export async function run(): Promise<void> {
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║   Post-Import FK Linking                    ║");
  console.log("╚══════════════════════════════════════════════╝");

  await loadEnv();
  const sb = await getServiceClient();

  // 1. Link fuel_economy → vehicle_specs
  console.log("\n1. Linking fuel_economy → vehicle_specs...");
  const { count: feUnlinked } = await sb
    .from("fuel_economy")
    .select("id", { count: "exact", head: true })
    .is("vehicle_spec_id", null);
  console.log(`   ${feUnlinked ?? 0} unlinked fuel_economy rows`);

  if (feUnlinked && feUnlinked > 0) {
    // Fetch unlinked fuel_economy rows in batches
    let linked = 0;
    let offset = 0;
    const batchSize = 1000;

    while (offset < feUnlinked) {
      const { data: feRows } = await sb
        .from("fuel_economy")
        .select("id, year, make, model")
        .is("vehicle_spec_id", null)
        .range(offset, offset + batchSize - 1);

      if (!feRows || feRows.length === 0) break;

      for (const fe of feRows) {
        if (!fe.make || !fe.model || !fe.year) continue;

        // Find matching vehicle_spec
        const { data: matches } = await sb
          .from("vehicle_specs")
          .select("id")
          .eq("year", fe.year)
          .ilike("make_name", fe.make)
          .ilike("model_name", `${fe.model}%`)
          .limit(1);

        if (matches && matches.length > 0) {
          await sb
            .from("fuel_economy")
            .update({ vehicle_spec_id: matches[0].id })
            .eq("id", fe.id);
          linked++;
        }
      }

      offset += batchSize;
      console.log(`   Progress: ${offset}/${feUnlinked} checked, ${linked} linked`);
    }
    console.log(`   Linked ${linked} fuel_economy rows`);
  }

  // 2. Link safety_ratings → vehicle_specs
  console.log("\n2. Linking safety_ratings → vehicle_specs...");
  const { count: srUnlinked } = await sb
    .from("safety_ratings")
    .select("id", { count: "exact", head: true })
    .is("vehicle_spec_id", null);
  console.log(`   ${srUnlinked ?? 0} unlinked safety_ratings rows`);

  if (srUnlinked && srUnlinked > 0) {
    let linked = 0;
    let offset = 0;
    const batchSize = 500;

    while (offset < srUnlinked) {
      const { data: srRows } = await sb
        .from("safety_ratings")
        .select("id, year, make, model")
        .is("vehicle_spec_id", null)
        .range(offset, offset + batchSize - 1);

      if (!srRows || srRows.length === 0) break;

      for (const sr of srRows) {
        if (!sr.make || !sr.model || !sr.year) continue;

        const { data: matches } = await sb
          .from("vehicle_specs")
          .select("id")
          .eq("year", sr.year)
          .ilike("make_name", sr.make)
          .ilike("model_name", `${sr.model}%`)
          .limit(1);

        if (matches && matches.length > 0) {
          await sb
            .from("safety_ratings")
            .update({ vehicle_spec_id: matches[0].id })
            .eq("id", sr.id);
          linked++;
        }
      }

      offset += batchSize;
      console.log(`   Progress: ${offset}/${srUnlinked} checked, ${linked} linked`);
    }
    console.log(`   Linked ${linked} safety_ratings rows`);
  }

  // 3. Link ev_specs → vehicle_specs
  console.log("\n3. Linking ev_specs → vehicle_specs...");
  const { count: evUnlinked } = await sb
    .from("ev_specs")
    .select("id", { count: "exact", head: true })
    .is("vehicle_spec_id", null);
  console.log(`   ${evUnlinked ?? 0} unlinked ev_specs rows`);

  if (evUnlinked && evUnlinked > 0) {
    let linked = 0;
    const { data: evRows } = await sb
      .from("ev_specs")
      .select("id, make, model, release_year")
      .is("vehicle_spec_id", null)
      .limit(2000);

    for (const ev of evRows ?? []) {
      if (!ev.make || !ev.model) continue;

      // Try exact match first, then partial
      let { data: matches } = await sb
        .from("vehicle_specs")
        .select("id")
        .ilike("make_name", ev.make)
        .ilike("model_name", `%${ev.model}%`)
        .limit(1);

      if (!matches || matches.length === 0) {
        // Try with first word of model only
        const firstWord = ev.model.split(" ")[0];
        ({ data: matches } = await sb
          .from("vehicle_specs")
          .select("id")
          .ilike("make_name", ev.make)
          .ilike("model_name", `%${firstWord}%`)
          .limit(1));
      }

      if (matches && matches.length > 0) {
        await sb
          .from("ev_specs")
          .update({ vehicle_spec_id: matches[0].id })
          .eq("id", ev.id);
        linked++;
      }
    }
    console.log(`   Linked ${linked} ev_specs rows`);
  }

  // Summary
  console.log("\n--- Post-import linking complete ---");
  const [feLinked, srLinked, evLinked] = await Promise.all([
    sb.from("fuel_economy").select("id", { count: "exact", head: true }).not("vehicle_spec_id", "is", null),
    sb.from("safety_ratings").select("id", { count: "exact", head: true }).not("vehicle_spec_id", "is", null),
    sb.from("ev_specs").select("id", { count: "exact", head: true }).not("vehicle_spec_id", "is", null),
  ]);

  console.log(`  fuel_economy linked: ${feLinked.count ?? 0}`);
  console.log(`  safety_ratings linked: ${srLinked.count ?? 0}`);
  console.log(`  ev_specs linked: ${evLinked.count ?? 0}`);
}

// Allow direct execution
if (
  process.argv[1]?.endsWith("post-link.ts") ||
  process.argv[1]?.endsWith("post-link.js")
) {
  run().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
