import PatientChartView from "@/components/patient/PatientChartView";
import type { ChartTab } from "@/components/patient/ChartTabs";
import { getPatientDetail } from "@/lib/api/patient";

const VALID_TABS: ChartTab[] = [
  "summary",
  "timeline",
  "labs",
  "medications",
  "orders",
  "notes",
  "imaging",
  "consults",
  "tasks",
];

export default async function PatientChartPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;

  const patient = await getPatientDetail(id);
  const initialTab: ChartTab = VALID_TABS.includes(tab as ChartTab)
    ? (tab as ChartTab)
    : "summary";

  return <PatientChartView patient={patient} initialTab={initialTab} />;
}
