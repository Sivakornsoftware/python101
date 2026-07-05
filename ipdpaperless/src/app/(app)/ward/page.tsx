import WardCensusView from "@/components/ward/WardCensusView";
import { getWardCensus, getWards } from "@/lib/api/ward";

export default async function WardPage() {
  // Use the first available ward (real ward code in live mode, "5A" in mock).
  const wards = await getWards();
  const wardId = wards[0]?.id ?? "5A";
  const census = await getWardCensus(wardId);
  return <WardCensusView data={census} />;
}
