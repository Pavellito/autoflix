/**
 * Shared utilities for AutoFlix data import scripts.
 *
 * Provides:
 *  - Supabase client (service-role for write access)
 *  - Rate limiter
 *  - Retry with exponential back-off
 *  - Batch upsert helper
 *  - Simple CSV parser
 *  - Progress logger
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Supabase client (service-role – required for bulk imports)
// ---------------------------------------------------------------------------

function getSupabaseAdmin(): SupabaseClient {
  const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!projectId) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_PROJECT_ID – set it in .env or environment"
    );
  }
  if (!serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY – set it in .env or environment"
    );
  }

  const url = `https://${projectId}.supabase.co`;
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

let _admin: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (!_admin) _admin = getSupabaseAdmin();
  return _admin;
}

// ---------------------------------------------------------------------------
// .env loader (best-effort – reads .env.local then .env)
// ---------------------------------------------------------------------------

export async function loadEnv(): Promise<void> {
  const fs = await import("fs");
  const path = await import("path");

  // Walk up from scripts/import to project root
  const root = path.resolve(import.meta.dirname ?? __dirname, "..", "..");

  for (const name of [".env.local", ".env"]) {
    const envPath = path.join(root, name);
    if (!fs.existsSync(envPath)) continue;
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let value = trimmed.slice(eqIdx + 1).trim();
      // Strip surrounding quotes
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Rate limiter
// ---------------------------------------------------------------------------

export class RateLimiter {
  private lastCall = 0;

  constructor(private readonly minIntervalMs: number) {}

  async wait(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastCall;
    if (elapsed < this.minIntervalMs) {
      await sleep(this.minIntervalMs - elapsed);
    }
    this.lastCall = Date.now();
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ---------------------------------------------------------------------------
// Retry with exponential back-off
// ---------------------------------------------------------------------------

export async function retry<T>(
  fn: () => Promise<T>,
  options: { retries?: number; baseDelayMs?: number; label?: string } = {}
): Promise<T> {
  const { retries = 3, baseDelayMs = 1000, label = "operation" } = options;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        const delay = baseDelayMs * 2 ** attempt;
        console.warn(
          `  [retry] ${label} failed (attempt ${attempt + 1}/${retries + 1}), retrying in ${delay}ms…`
        );
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

// ---------------------------------------------------------------------------
// Batch upsert helper
// ---------------------------------------------------------------------------

export interface UpsertOptions {
  table: string;
  rows: Record<string, unknown>[];
  onConflict: string; // e.g. "make_id" or "year,make,model"
  batchSize?: number;
  ignoreDuplicates?: boolean;
}

export async function batchUpsert(opts: UpsertOptions): Promise<number> {
  const {
    table,
    rows,
    onConflict,
    batchSize = 500,
    ignoreDuplicates = false,
  } = opts;
  if (rows.length === 0) return 0;

  const db = supabaseAdmin();
  let inserted = 0;

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error, count } = await db
      .from(table)
      .upsert(batch, {
        onConflict,
        ignoreDuplicates,
        count: "exact",
      });

    if (error) {
      console.error(
        `  [upsert] Error on ${table} batch ${Math.floor(i / batchSize) + 1}: ${error.message}`
      );
      // Continue with remaining batches
    } else {
      inserted += count ?? batch.length;
    }
  }

  return inserted;
}

// ---------------------------------------------------------------------------
// CSV parser (handles quoted fields, newlines inside quotes, etc.)
// ---------------------------------------------------------------------------

export function parseCsv(
  text: string,
  options: { delimiter?: string } = {}
): Record<string, string>[] {
  const { delimiter = "," } = options;
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < text.length && text[i + 1] === '"') {
          // Escaped quote
          currentField += '"';
          i += 2;
        } else {
          // End of quoted field
          inQuotes = false;
          i++;
        }
      } else {
        currentField += ch;
        i++;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
      } else if (ch === delimiter) {
        currentRow.push(currentField);
        currentField = "";
        i++;
      } else if (ch === "\r") {
        // Skip CR
        i++;
      } else if (ch === "\n") {
        currentRow.push(currentField);
        currentField = "";
        rows.push(currentRow);
        currentRow = [];
        i++;
      } else {
        currentField += ch;
        i++;
      }
    }
  }

  // Push last field / row
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.trim());
  const result: Record<string, string>[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (row.length === 0 || (row.length === 1 && row[0].trim() === ""))
      continue;
    const obj: Record<string, string> = {};
    for (let c = 0; c < headers.length; c++) {
      obj[headers[c]] = (row[c] ?? "").trim();
    }
    result.push(obj);
  }

  return result;
}

// ---------------------------------------------------------------------------
// Progress logger
// ---------------------------------------------------------------------------

export class ProgressLogger {
  private startTime: number;
  private current = 0;

  constructor(
    private readonly label: string,
    private readonly total: number
  ) {
    this.startTime = Date.now();
    console.log(`[${label}] Starting – ${total} items to process`);
  }

  tick(extra?: string): void {
    this.current++;
    if (
      this.current % 100 === 0 ||
      this.current === this.total ||
      this.current === 1
    ) {
      const pct = ((this.current / this.total) * 100).toFixed(1);
      const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
      const msg = `[${this.label}] ${this.current}/${this.total} (${pct}%) – ${elapsed}s`;
      console.log(extra ? `${msg} – ${extra}` : msg);
    }
  }

  done(): void {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
    console.log(
      `[${this.label}] Complete – ${this.current} items in ${elapsed}s`
    );
  }
}

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

export async function fetchJson<T = unknown>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchText(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}: ${res.statusText}`);
  }
  return res.text();
}

// ---------------------------------------------------------------------------
// Normalize helpers
// ---------------------------------------------------------------------------

export function normalizeString(s: string | null | undefined): string {
  return (s ?? "").trim().toLowerCase();
}

export function toNumber(
  val: string | null | undefined
): number | null {
  if (!val || val.trim() === "") return null;
  const n = Number(val);
  return Number.isFinite(n) ? n : null;
}

export function toInt(val: string | null | undefined): number | null {
  if (!val || val.trim() === "") return null;
  const n = parseInt(val, 10);
  return Number.isFinite(n) ? n : null;
}
