import { config } from "@/lib/config";
import type { Ward, WardCensus } from "@/lib/types";
import { apiFetch, delay } from "./client";
import { buildMockWardCensus, mockWards } from "./mock/ward";

/**
 * Data-access functions for the Ward Census screen.
 *
 * In mock mode they return locally generated data. Once the UX/UI is finalized,
 * set NEXT_PUBLIC_USE_MOCK=false and these functions call the FastAPI backend.
 * Endpoints below are placeholders — adjust the paths to match the real API.
 */

export async function getWards(): Promise<Ward[]> {
  if (config.useMock) {
    await delay();
    return mockWards;
  }
  return apiFetch<Ward[]>("/api/wards");
}

export async function getWardCensus(wardId: string): Promise<WardCensus> {
  if (config.useMock) {
    await delay();
    return buildMockWardCensus(wardId);
  }
  return apiFetch<WardCensus>(`/api/wards/${encodeURIComponent(wardId)}/census`);
}
