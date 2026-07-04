import RoundModeView from "@/components/patient/RoundModeView";
import { getRoundState, getPatientDetail } from "@/lib/api/patient";

export default async function RoundPage() {
  const round = await getRoundState("5A");
  const patient = await getPatientDetail(round.activePatientId);
  return <RoundModeView initialRound={round} initialPatient={patient} />;
}
