"use client";
// hooks/useUrlState.ts
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export function useUrlState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const updateUrl = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && value !== 1) {
          // Don't store page=1
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
      });

      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const getParam = useCallback(
    (key: string, defaultValue?: string): string | undefined => {
      return searchParams.get(key) || defaultValue;
    },
    [searchParams]
  );

  const getNumericParam = useCallback(
    (key: string, defaultValue: number): number => {
      const value = searchParams.get(key);
      return value ? parseInt(value, 10) : defaultValue;
    },
    [searchParams]
  );

  return {
    updateUrl,
    getParam,
    getNumericParam,
    searchParams: Object.fromEntries(searchParams.entries()),
  };
}
