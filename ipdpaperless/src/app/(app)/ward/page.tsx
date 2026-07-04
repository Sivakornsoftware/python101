import WardCensusView from "@/components/ward/WardCensusView";
import { getWardCensus } from "@/lib/api/ward";

export default async function WardPage() {
  const census = await getWardCensus("5A");
  return <WardCensusView data={census} />;
}
