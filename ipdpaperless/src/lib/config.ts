/**
 * Runtime configuration for the IPDX (IPD Paperless) frontend.
 *
 * The app is designed to run in two modes:
 *   1. Mock mode (default)   -> data comes from `src/lib/api/mock/*`
 *   2. Live mode             -> data comes from the FastAPI backend (Oracle 11g)
 *                               and, for data not available there, a PostgreSQL-backed API.
 *
 * Switching is centralized here so that flipping `NEXT_PUBLIC_USE_MOCK=false`
 * (once the UX/UI is finalized) routes every data call to the real APIs
 * without touching component code.
 */

/** Tolerant parse: trims whitespace / stray CR / BOM before comparing. */
const useMockRaw = (process.env.NEXT_PUBLIC_USE_MOCK ?? "true")
  .replace(/^\uFEFF/, "")
  .trim()
  .toLowerCase();

export const config = {
  /** When true, all data-layer functions return mock data. */
  useMock: useMockRaw !== "false",

  /** Base URL of the FastAPI service backed by Oracle 11g. */
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000",

  /**
   * Base URL of the service that exposes data stored in PostgreSQL
   * (information that is not available from the Oracle/FastAPI API).
   * Defaults to the same FastAPI host; override if it is a separate service.
   */
  pgApiBaseUrl:
    process.env.NEXT_PUBLIC_PG_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:8000",

  /** Simulated network latency (ms) for mock mode, to mimic real requests. */
  mockLatencyMs: Number(process.env.NEXT_PUBLIC_MOCK_LATENCY_MS ?? 250),

  /** Ward code to open by default on the Ward Census page (e.g. "1013"). */
  defaultWard: (process.env.NEXT_PUBLIC_DEFAULT_WARD ?? "").trim(),
} as const;

export type AppConfig = typeof config;

// One-time server-side log so you can see which data source is active in the
// `npm run dev` terminal.
if (typeof window === "undefined") {
  console.log(
    `[IPDX] data source: ${
      config.useMock ? "MOCK" : `LIVE (${config.apiBaseUrl})`
    }`,
  );
}
