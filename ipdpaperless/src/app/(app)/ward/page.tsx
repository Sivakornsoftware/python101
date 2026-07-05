import WardCensusView from "@/components/ward/WardCensusView";
import { getWardCensus, getWards } from "@/lib/api/ward";

export default async function WardPage({
  searchParams,
}: {
  searchParams: Promise<{ ward?: string }>;
}) {
  const { ward } = await searchParams;
  const wards = await getWards();

  const selectedWardId =
    ward && wards.some((w) => w.id === ward)
      ? ward
      : wards[0]?.id ?? "5A";

  const census = await getWardCensus(selectedWardId);

  return (
    <WardCensusView
      data={census}
      wards={wards}
      selectedWardId={selectedWardId}
    />
  );
}
