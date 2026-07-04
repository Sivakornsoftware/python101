"use client";

import { useEffect } from "react";
import { useSyncExternalStore } from "react";

export interface TopbarOverride {
  title?: string;
  subtitle?: string;
}

let current: TopbarOverride | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function setOverride(next: TopbarOverride | null) {
  current = next;
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): TopbarOverride | null {
  return current;
}

function getServerSnapshot(): TopbarOverride | null {
  return null;
}

/** Read the current topbar override (used by the Topbar component). */
export function useTopbarOverride(): TopbarOverride | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Set the topbar title/subtitle for the lifetime of the calling component.
 * Uses a plain external store (not React state), so it's safe to call in an
 * effect and resets automatically on unmount.
 */
export function useSetTopbar(title?: string, subtitle?: string) {
  useEffect(() => {
    setOverride({ title, subtitle });
    return () => setOverride(null);
  }, [title, subtitle]);
}
