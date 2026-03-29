import { redirect, notFound } from "next/navigation";
import { getVehicleById } from "@/app/lib/vehicle-queries";

/**
 * Redirects /cars/db/[numericId] to /cars/[slug] (the unified car detail page).
 * This ensures all car views use a single comprehensive page.
 */
export default async function VehicleDetailRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicleId = parseInt(id, 10);
  if (isNaN(vehicleId)) notFound();

  const data = await getVehicleById(vehicleId);
  if (!data) notFound();

  const { spec } = data;
  // Build a slug: make-model-year
  const slug = [spec.make_name, spec.model_name, spec.year]
    .filter(Boolean)
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  redirect(`/cars/${slug}`);
}
