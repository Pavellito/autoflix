// ─── Car Image Service ───────────────────────────────────
// Real car photographs via Wikipedia API, with imagin.studio as fallback

// Client-side cache for Wikipedia image lookups
const wikiImageCache = new Map<string, string | null>();

/**
 * Fetch a real car photograph URL via our Wikipedia-backed API.
 * Returns null if no real photo found.
 */
export async function fetchRealCarImage(
  make: string,
  model: string,
  year: number | string = 2026
): Promise<string | null> {
  const cacheKey = `${make}-${model}-${year}`;
  if (wikiImageCache.has(cacheKey)) return wikiImageCache.get(cacheKey) || null;

  try {
    const res = await fetch(
      `/api/cars/image?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&year=${encodeURIComponent(year)}`
    );
    if (res.ok) {
      const data = await res.json();
      const url = data.url || null;
      wikiImageCache.set(cacheKey, url);
      return url;
    }
  } catch {
    // ignore
  }
  wikiImageCache.set(cacheKey, null);
  return null;
}

/**
 * Get prioritized image URLs for a car.
 * Returns array in priority order: imagin.studio → placeholder SVG
 * (Real Wikipedia photos are fetched separately via fetchRealCarImage)
 */
export function getCarImageUrls(make: string, model: string, year?: number): string[] {
  const urls: string[] = [];

  // 1. imagin.studio (free for development, renders 3D car images)
  const modelFamily = model.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "");
  urls.push(
    `https://cdn.imagin.studio/getimage?customer=hrjavascript-mastery&make=${encodeURIComponent(make)}&modelFamily=${encodeURIComponent(modelFamily)}&paintId=pspc0001&angle=01`
  );

  // 2. Second angle from imagin.studio
  urls.push(
    `https://cdn.imagin.studio/getimage?customer=hrjavascript-mastery&make=${encodeURIComponent(make)}&modelFamily=${encodeURIComponent(modelFamily)}&paintId=pspc0014&angle=09`
  );

  // 3. SVG placeholder with car name
  urls.push(getCarPlaceholderDataUri(make, model, year));

  return urls;
}

/**
 * Generate a gradient placeholder SVG data URI with make/model text.
 */
export function getCarPlaceholderDataUri(make: string, model: string, year?: number): string {
  const label = [year, make, model].filter(Boolean).join(" ");
  const initials = make.slice(0, 2).toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1a1a3e"/>
        <stop offset="50%" style="stop-color:#141428"/>
        <stop offset="100%" style="stop-color:#0a0a1a"/>
      </linearGradient>
      <radialGradient id="glow" cx="70%" cy="30%" r="50%">
        <stop offset="0%" style="stop-color:rgba(229,9,20,0.15)"/>
        <stop offset="100%" style="stop-color:transparent"/>
      </radialGradient>
    </defs>
    <rect width="800" height="450" fill="url(#bg)"/>
    <rect width="800" height="450" fill="url(#glow)"/>
    <circle cx="400" cy="180" r="60" fill="rgba(255,255,255,0.05)" stroke="rgba(229,9,20,0.3)" stroke-width="2"/>
    <text x="400" y="195" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="36" font-weight="900" fill="rgba(229,9,20,0.6)">${initials}</text>
    <text x="400" y="290" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="rgba(255,255,255,0.7)">${escapeXml(label)}</text>
    <text x="400" y="320" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="400" fill="rgba(255,255,255,0.3)">AUTOFLIX</text>
    <path d="M250 380 L280 360 L520 360 L550 380 L560 380 L560 400 L240 400 L240 380 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <circle cx="300" cy="400" r="15" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <circle cx="500" cy="400" r="15" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * Get a small thumbnail URL for cards
 */
export function getCarThumbnailUrl(make: string, model: string): string {
  const modelFamily = model.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "");
  return `https://cdn.imagin.studio/getimage?customer=hrjavascript-mastery&make=${encodeURIComponent(make)}&modelFamily=${encodeURIComponent(modelFamily)}&paintId=pspc0001&angle=01&width=400`;
}
