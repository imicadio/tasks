"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Reads/writes one query-string param as the source of truth for a piece of
 * filter state, so it survives reloads and is shareable via the URL.
 * Setting the value back to `defaultValue` removes the param instead of
 * writing it, keeping the URL clean.
 */
export function useUrlState<T extends string>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const value = (searchParams.get(key) as T | null) ?? defaultValue;

  const setValue = useCallback(
    (next: T) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === defaultValue) {
        params.delete(key);
      } else {
        params.set(key, next);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [key, defaultValue, searchParams, pathname, router],
  );

  return [value, setValue];
}
