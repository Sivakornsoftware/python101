import WardCensusView from "@/components/ward/WardCensusView";
import { getWardCensus, getWards } from "@/lib/api/ward";
import { config } from "@/lib/config";

export default async function WardPage({
  searchParams,
}: {
  searchParams: Promise<{ ward?: string }>;
}) {
  const { ward } = await searchParams;
  const wards = await getWards();
  const has = (id?: string) => !!id && wards.some((w) => w.id === id);

  // Priority: ?ward= query -> configured default ward -> first ward in the list.
  const selectedWardId = has(ward)
    ? (ward as string)
    : has(config.defaultWard)
      ? config.defaultWard
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
