import { config } from "@/lib/config";

/** Small helper to simulate network latency in mock mode. */
export function delay(ms: number = config.mockLatencyMs): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type ApiSource = "oracle" | "postgres";

function baseUrlFor(source: ApiSource): string {
  return source === "postgres" ? config.pgApiBaseUrl : config.apiBaseUrl;
}

/**
 * Thin fetch wrapper used once the app is switched to live data.
 * `source` selects between the Oracle-backed FastAPI and the PostgreSQL API.
 */
export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { source?: ApiSource },
): Promise<T> {
  const { source = "oracle", ...rest } = init ?? {};
  const url = `${baseUrlFor(source)}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, {
    // Ward data changes frequently; never cache by default.
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...(rest.headers ?? {}) },
    ...rest,
  });

  if (!res.ok) {
    throw new Error(`API ${res.status} ${res.statusText} for ${url}`);
  }
  return (await res.json()) as T;
}
