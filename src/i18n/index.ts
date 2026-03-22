"use client";
// ============================================================
// src/i18n/index.ts — i18n context, hook and utilities
// ============================================================
import React, { createContext, useContext, useState, useEffect } from "react";
import { pt } from "./pt";
import { en } from "./en";
import type { Locale } from "@/types";
import type { Translations } from "./pt";

const translations: Record<Locale, Translations> = { pt, en };

interface I18nContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "pt",
  t: pt,
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved && (saved === "pt" || saved === "en")) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    document.documentElement.lang = newLocale;
  };

  return React.createElement(
    I18nContext.Provider,
    { value: { locale, t: translations[locale], setLocale } },
    children
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export function formatPrice(amount: number, locale: Locale = "pt"): string {
  return new Intl.NumberFormat(locale === "pt" ? "pt-AO" : "en-US", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDistance(meters: number, locale: Locale = "pt"): string {
  if (meters < 1000) return `${meters}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}
