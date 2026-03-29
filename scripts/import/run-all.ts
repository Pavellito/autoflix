/**
 * AutoFlix Data Import Orchestrator
 *
 * Runs all import scripts in the correct order, with error isolation so that
 * a failure in one step does not prevent the remaining steps from running.
 *
 * Order:
 *   1. NHTSA vPIC      – makes & models (foundation)
 *   2. GitHub Auto Specs – global technical data
 *   3. EPA Fuel Economy  – US fuel economy
 *   4. NHTSA Safety      – US crash-test ratings
 *   5. Open EV Data      – EV-specific specs
 *
 * Run:  npx tsx scripts/import/run-all.ts
 */

import { loadEnv } from "./utils.js";

// ---------------------------------------------------------------------------
// Step runner
// ---------------------------------------------------------------------------

interface StepResult {
  name: string;
  status: "success" | "failed";
  durationSec: number;
  error?: string;
}

async function runStep(
  name: string,
  fn: () => Promise<void>
): Promise<StepResult> {
  const start = Date.now();
  try {
    await fn();
    const dur = (Date.now() - start) / 1000;
    return { name, status: "success", durationSec: Math.round(dur * 10) / 10 };
  } catch (err) {
    const dur = (Date.now() - start) / 1000;
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`\n[ERROR] ${name} failed: ${msg}\n`);
    return {
      name,
      status: "failed",
      durationSec: Math.round(dur * 10) / 10,
      error: msg,
    };
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║   AutoFlix Full Data Import                            ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log();

  // Load .env once for all scripts
  await loadEnv();

  const totalStart = Date.now();
  const results: StepResult[] = [];

  // 1. GitHub Auto Specs (fast — single zip download, global data)
  console.log("\n" + "=".repeat(60));
  console.log("  STEP 1 / 5 : GitHub Auto Specs (Global)");
  console.log("=".repeat(60));
  const { run: runAutoSpecs } = await import("./github-auto-specs.js");
  results.push(await runStep("GitHub Auto Specs", runAutoSpecs));

  // 2. EPA Fuel Economy (fast — single CSV download, 49K+ US vehicles)
  console.log("\n" + "=".repeat(60));
  console.log("  STEP 2 / 5 : EPA Fuel Economy");
  console.log("=".repeat(60));
  const { run: runEpa } = await import("./epa-fuel-economy.js");
  results.push(await runStep("EPA Fuel Economy", runEpa));

  // 3. Open EV Data (fast — single JSON, 1300+ EVs)
  console.log("\n" + "=".repeat(60));
  console.log("  STEP 3 / 5 : Open EV Data");
  console.log("=".repeat(60));
  const { run: runEvData } = await import("./openev-data.js");
  results.push(await runStep("Open EV Data", runEvData));

  // 4. NHTSA vPIC – makes & models (API-heavy, ~70 brands)
  console.log("\n" + "=".repeat(60));
  console.log("  STEP 4 / 5 : NHTSA vPIC (Makes & Models)");
  console.log("=".repeat(60));
  const { run: runVpic } = await import("./nhtsa-vpic.js");
  results.push(await runStep("NHTSA vPIC", runVpic));

  // 5. NHTSA Safety Ratings (API-heavy, years 2010-2026)
  console.log("\n" + "=".repeat(60));
  console.log("  STEP 5 / 5 : NHTSA Safety Ratings");
  console.log("=".repeat(60));
  const { run: runSafety } = await import("./nhtsa-safety.js");
  results.push(await runStep("NHTSA Safety Ratings", runSafety));

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------

  const totalDuration = ((Date.now() - totalStart) / 1000).toFixed(1);
  const passed = results.filter((r) => r.status === "success").length;
  const failed = results.filter((r) => r.status === "failed").length;

  console.log("\n" + "=".repeat(60));
  console.log("  IMPORT SUMMARY");
  console.log("=".repeat(60));
  console.log();

  for (const r of results) {
    const icon = r.status === "success" ? "[OK]" : "[FAIL]";
    const extra = r.error ? ` — ${r.error}` : "";
    console.log(
      `  ${icon} ${r.name.padEnd(25)} ${r.durationSec}s${extra}`
    );
  }

  console.log();
  console.log(`  Total: ${passed} passed, ${failed} failed, ${totalDuration}s`);
  console.log();

  if (failed > 0) {
    console.log(
      "  Some imports failed. You can re-run individual scripts safely (all are idempotent)."
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal orchestrator error:", err);
  process.exit(1);
});
