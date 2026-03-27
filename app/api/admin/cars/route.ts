import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ─── Admin-only Supabase client (uses service role key) ──
function getAdminClient() {
  const url = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase admin credentials");
  return createClient(url, key);
}

// ─── Simple auth check ──────────────────────────────────
function isAuthorized(req: NextRequest): boolean {
  const secret = req.headers.get("x-admin-secret");
  return secret === process.env.ADMIN_SECRET;
}

// ─── GET /api/admin/cars — List all cars (admin view) ────
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .order("brand");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ cars: data, count: data?.length ?? 0 });
}

// ─── POST /api/admin/cars — Add a new car ────────────────
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getAdminClient();
  const body = await req.json();

  // Validate required fields
  const { name, brand, type, image } = body;
  if (!name || !brand || !type || !image) {
    return NextResponse.json(
      { error: "Missing required fields: name, brand, type, image" },
      { status: 400 }
    );
  }

  // Generate ID if not provided
  const id = body.id || `car-${Date.now()}`;

  // 1. Insert car
  const { error: carError } = await supabase.from("cars").upsert({
    id,
    name,
    brand,
    type,
    range_km: body.range ?? null,
    battery: body.battery ?? null,
    price: body.price ?? null,
    image,
    real_world_range: body.realWorldRange ?? null,
    charging_curve: body.chargingCurve ?? null,
    depreciation: body.depreciation ?? null,
    related_video_ids: body.relatedVideoIds ?? [],
  }, { onConflict: "id" });

  if (carError) {
    return NextResponse.json({ error: carError.message }, { status: 500 });
  }

  // 2. Insert prices (if provided)
  if (body.prices && typeof body.prices === "object") {
    const priceRows = Object.entries(body.prices).map(([region, price]) => ({
      car_id: id,
      region,
      price: price as string,
    }));

    const { error: priceError } = await supabase
      .from("car_prices")
      .upsert(priceRows, { onConflict: "car_id,region" });

    if (priceError) {
      return NextResponse.json({ error: priceError.message }, { status: 500 });
    }
  }

  // 3. Insert regional advice (if provided)
  if (body.regionalAdvice && typeof body.regionalAdvice === "object") {
    const adviceRows = Object.entries(body.regionalAdvice).map(([region, advice]) => ({
      car_id: id,
      region,
      advice: advice as string,
    }));

    const { error: adviceError } = await supabase
      .from("car_regional_advice")
      .upsert(adviceRows, { onConflict: "car_id,region" });

    if (adviceError) {
      return NextResponse.json({ error: adviceError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, id }, { status: 201 });
}

// ─── PUT /api/admin/cars — Update existing car ───────────
export async function PUT(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getAdminClient();
  const body = await req.json();

  if (!body.id) {
    return NextResponse.json({ error: "Missing car id" }, { status: 400 });
  }

  // Build update object (only include provided fields)
  const updates: Record<string, unknown> = {};
  if (body.name) updates.name = body.name;
  if (body.brand) updates.brand = body.brand;
  if (body.type) updates.type = body.type;
  if (body.range) updates.range_km = body.range;
  if (body.battery) updates.battery = body.battery;
  if (body.price) updates.price = body.price;
  if (body.image) updates.image = body.image;
  if (body.realWorldRange) updates.real_world_range = body.realWorldRange;
  if (body.chargingCurve) updates.charging_curve = body.chargingCurve;
  if (body.depreciation) updates.depreciation = body.depreciation;
  if (body.relatedVideoIds) updates.related_video_ids = body.relatedVideoIds;

  if (Object.keys(updates).length > 0) {
    const { error } = await supabase
      .from("cars")
      .update(updates)
      .eq("id", body.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  // Update prices if provided
  if (body.prices) {
    const priceRows = Object.entries(body.prices).map(([region, price]) => ({
      car_id: body.id,
      region,
      price: price as string,
    }));

    const { error } = await supabase
      .from("car_prices")
      .upsert(priceRows, { onConflict: "car_id,region" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  // Update advice if provided
  if (body.regionalAdvice) {
    const adviceRows = Object.entries(body.regionalAdvice).map(([region, advice]) => ({
      car_id: body.id,
      region,
      advice: advice as string,
    }));

    const { error } = await supabase
      .from("car_regional_advice")
      .upsert(adviceRows, { onConflict: "car_id,region" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, id: body.id });
}

// ─── DELETE /api/admin/cars — Delete a car ───────────────
export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getAdminClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing car id" }, { status: 400 });
  }

  // CASCADE will handle car_prices and car_regional_advice
  const { error } = await supabase.from("cars").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, deleted: id });
}
