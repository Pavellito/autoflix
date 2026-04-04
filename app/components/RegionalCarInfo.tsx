"use client";

import { useState } from "react";
import type { Car } from "@/app/lib/data";
import { useLanguage } from "@/app/lib/i18n/context";

const REGIONS = [
  { id: "us", label: "Global / US", flag: "🌍", currency: "USD", symbol: "$" },
  { id: "il", label: "Israel", flag: "🇮🇱", currency: "ILS", symbol: "₪" },
  { id: "ru", label: "Russia", flag: "🇷🇺", currency: "RUB", symbol: "₽" },
  { id: "ar", label: "Arabic World", flag: "🇸🇦", currency: "AED", symbol: "د.إ" },
];

function formatPrice(value: number, regionId: string): string {
  if (regionId === "ru") return `₽${value.toLocaleString()}`;
  if (regionId === "il") return `₪${value.toLocaleString()}`;
  if (regionId === "ar") return `${value.toLocaleString()} AED`;
  return `$${value.toLocaleString()}`;
}

const REGIONAL_ADVICE: Record<string, Record<string, string>> = {
  us: {
    EV: "Strong federal tax credits ($7,500) and state incentives. Excellent charging infrastructure on both coasts.",
    Hybrid: "Good fuel savings with no range anxiety. Tax incentives may apply depending on battery size.",
    ICE: "Competitive pricing and wide dealer network. Consider fuel costs vs European models.",
  },
  il: {
    EV: "Reduced purchase tax (~20% vs 83% for ICE). Government pushing EV adoption. Limited public charging outside Tel Aviv.",
    Hybrid: "Lower purchase tax than ICE but higher than pure EV. Good choice for mixed city/highway driving.",
    ICE: "Very high purchase tax (~83%) + 17% VAT. Consider total cost carefully. Popular grey market imports available.",
  },
  ru: {
    EV: "Limited official EV availability. Charging infrastructure growing in Moscow/St. Petersburg. Cold winters reduce range 30-40%.",
    Hybrid: "Limited official availability for many brands. Parallel import may be required. Consider service network.",
    ICE: "Parallel import available for most brands. Check parts availability. Russian winter requires cold-weather package.",
  },
  ar: {
    EV: "Low import duties (~5%). Extreme heat can affect battery life. Growing charging network in UAE/Saudi.",
    Hybrid: "Good fuel savings in city traffic. Low tax environment makes it affordable.",
    ICE: "Very competitive pricing due to low taxes. Fuel is cheap. Ensure the car handles extreme heat well.",
  },
};

export default function RegionalCarInfo({ car }: { car: Car }) {
  const { t } = useLanguage();
  const [region, setRegion] = useState("us");

  const ext = car.externalData;
  const regionalPricing = ext?.regionalPricing as { usd?: number; ils?: number; rub?: number; aed?: number } | undefined;

  // Get price for selected region
  let displayPrice: string;
  if (regionalPricing) {
    const priceMap: Record<string, number | undefined> = {
      us: regionalPricing.usd,
      il: regionalPricing.ils,
      ru: regionalPricing.rub,
      ar: regionalPricing.aed,
    };
    const value = priceMap[region];
    displayPrice = value ? formatPrice(value, region) : (car.price || "Price TBD");
  } else if (car.prices) {
    displayPrice = car.prices[region as keyof typeof car.prices] || car.price || "Price TBD";
  } else {
    displayPrice = car.price || "Price TBD";
  }

  const advice = REGIONAL_ADVICE[region]?.[car.type] || car.regionalAdvice?.[region as keyof NonNullable<Car["regionalAdvice"]>] || "Market analysis pending.";

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t("car_select_region")}</h3>
      <div className="flex flex-wrap gap-2">
        {REGIONS.map((r) => (
          <button
            key={r.id}
            onClick={() => setRegion(r.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              region === r.id
                ? "bg-accent border-accent text-white shadow-lg shadow-accent/20"
                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="mr-1.5">{r.flag}</span>
            {r.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Price Card */}
        <div className="bg-black/40 p-4 rounded-xl border border-white/10 relative overflow-hidden">
          <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{t("car_local_price")}</h4>
          <p className="text-2xl font-black text-green-400 tracking-tight leading-tight">
            {displayPrice.startsWith("From") || displayPrice.startsWith("$") || displayPrice.startsWith("₪") || displayPrice.startsWith("₽")
              ? displayPrice
              : `From ${displayPrice}`}
          </p>
          <p className="text-[9px] text-gray-600 mt-1.5 italic">
            * Estimated starting price in {REGIONS.find(r => r.id === region)?.label}
          </p>
        </div>

        {/* Advice Card */}
        <div className="bg-accent/5 p-4 rounded-xl border border-accent/20 relative overflow-hidden">
          <h4 className="text-[10px] font-bold text-accent/80 uppercase tracking-widest mb-1.5">
            {t("car_should_buy")} {REGIONS.find(r => r.id === region)?.label}?
          </h4>
          <p className="text-[12px] text-gray-300 leading-relaxed">
            {advice}
          </p>
        </div>
      </div>
    </div>
  );
}
