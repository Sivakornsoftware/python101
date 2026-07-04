"use client";

export type ChartTab =
  | "summary"
  | "timeline"
  | "labs"
  | "medications"
  | "orders"
  | "notes"
  | "imaging"
  | "consults"
  | "tasks";

export const CHART_TABS: { key: ChartTab; label: string }[] = [
  { key: "summary", label: "Summary" },
  { key: "timeline", label: "Timeline" },
  { key: "labs", label: "Labs" },
  { key: "medications", label: "Medications" },
  { key: "orders", label: "Orders" },
  { key: "notes", label: "Notes" },
  { key: "imaging", label: "Imaging" },
  { key: "consults", label: "Consults" },
  { key: "tasks", label: "Tasks" },
];

export default function ChartTabs({
  active,
  onChange,
}: {
  active: ChartTab;
  onChange: (tab: ChartTab) => void;
}) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200">
      {CHART_TABS.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          className={`whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
            active === t.key
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
