// hooks/useTranslationSuspended.ts
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import en from "../dictionaries/en";
import am from "../dictionaries/am";
import { Translations } from "@/types/Translations";

const translations: Record<string, Translations> = { en, am };

// This hook should be used inside a Suspense boundary
export const useTranslationSuspended = (): [
  Translations,
  (locale: string) => void
] => {
  const router = useRouter();
  const searchParams = useSearchParams(); // This requires Suspense
  const [locale, setLocaleState] = useState<string>("en");

  useEffect(() => {
    const savedLocale = localStorage.getItem("preferred-language");
    const urlLocale = searchParams.get("lang");

    const initialLocale = urlLocale || savedLocale || "en";
    setLocaleState(initialLocale);

    if (urlLocale !== savedLocale && savedLocale) {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", savedLocale);
      router.replace(url.toString());
    }
  }, [searchParams, router]);

  const setLocale = (newLocale: string) => {
    localStorage.setItem("preferred-language", newLocale);
    setLocaleState(newLocale);

    const url = new URL(window.location.href);
    url.searchParams.set("lang", newLocale);
    router.push(url.toString());
  };

  const t = translations[locale] || translations.en;
  return [t, setLocale];
};

// Regular hook that doesn't use searchParams (for components that don't need URL parsing)
export const useTranslation = (): [Translations, (locale: string) => void] => {
  const [locale, setLocaleState] = useState<string>("en");

  useEffect(() => {
    const savedLocale = localStorage.getItem("preferred-language") || "en";
    setLocaleState(savedLocale);
  }, []);

  const setLocale = (newLocale: string) => {
    localStorage.setItem("preferred-language", newLocale);
    setLocaleState(newLocale);
  };

  const t = translations[locale] || translations.en;
  return [t, setLocale];
};
