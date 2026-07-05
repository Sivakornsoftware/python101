"use client";

import { useSyncExternalStore } from "react";

/**
 * Returns the current time as a minute-bucket number that updates every
 * `intervalMs`, or `null` during server render / before hydration.
 *
 * Uses `useSyncExternalStore` so it stays hydration-safe and avoids calling
 * setState synchronously inside an effect.
 */
export function useNowBucket(intervalMs = 30_000): number | null {
  return useSyncExternalStore(
    (onChange) => {
      const id = setInterval(onChange, intervalMs);
      return () => clearInterval(id);
    },
    () => Math.floor(Date.now() / intervalMs),
    () => null,
  );
}
