"use client";

import { useLanguage } from "@/app/lib/i18n/context";
import type { TranslationKey } from "@/app/lib/i18n/translations";

/**
 * Client component that renders a translated label.
 * Used to inject i18n into server-rendered pages like car detail.
 */
export default function T({ k, fallback }: { k: TranslationKey; fallback?: string }) {
  const { t } = useLanguage();
  const translated = t(k);
  return <>{translated === k ? (fallback || k) : translated}</>;
}
