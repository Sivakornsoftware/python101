import { config } from "@/lib/config";
import type { PatientDetail, RoundState } from "@/lib/types";
import { apiFetch, delay } from "./client";
import { buildMockPatientDetail, mockRoundState } from "./mock/patient";

export async function getPatientDetail(id: string): Promise<PatientDetail> {
  if (config.useMock) {
    await delay();
    return buildMockPatientDetail(id);
  }
  return apiFetch<PatientDetail>(`/api/patients/${encodeURIComponent(id)}`);
}

export async function getRoundState(wardId: string): Promise<RoundState> {
  if (config.useMock) {
    await delay();
    return mockRoundState;
  }
  return apiFetch<RoundState>(
    `/api/wards/${encodeURIComponent(wardId)}/round`,
  );
}
