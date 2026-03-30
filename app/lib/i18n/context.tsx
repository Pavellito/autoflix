"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { type Locale, type TranslationKey, RTL_LOCALES, translations } from "./translations";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
  isRTL: false,
  dir: "ltr",
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("autoflix-lang") as Locale | null;
    if (saved && translations[saved]) {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("autoflix-lang", newLocale);
    // Update HTML attributes
    document.documentElement.lang = newLocale;
    document.documentElement.dir = RTL_LOCALES.includes(newLocale) ? "rtl" : "ltr";
  }, []);

  // Set initial HTML attributes
  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale;
      document.documentElement.dir = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
    }
  }, [locale, mounted]);

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[locale]?.[key] || translations.en[key] || key;
    },
    [locale]
  );

  const isRTL = RTL_LOCALES.includes(locale);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isRTL, dir: isRTL ? "rtl" : "ltr" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
