import Link from "next/link";
import { AlertTriangle, BedDouble, MoreVertical } from "lucide-react";
import type { Bed } from "@/lib/types";
import { PRIORITY_STYLES } from "@/lib/priority";
import { CARD_PENDING_TYPES } from "@/lib/pending";

function MetricBox({
  label,
  value,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  tone: string;
  icon: (typeof CARD_PENDING_TYPES)[number]["icon"];
}) {
  const isZeroOrDash = value === "0" || value === "-";
  return (
    <div className="flex flex-col items-center rounded-md bg-slate-50 py-1">
      <span className="flex items-center gap-0.5 text-[9px] font-medium text-slate-400">
        <Icon className={`h-2.5 w-2.5 ${tone}`} />
        {label}
      </span>
      <span
        className={`text-sm font-bold ${
          isZeroOrDash ? "text-slate-300" : "text-slate-700"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function PatientCard({ bed }: { bed: Bed }) {
  // Empty bed
  if (bed.status === "empty" || !bed.patient) {
    return (
      <div className="flex flex-col rounded-xl border border-l-4 border-slate-200 border-l-slate-300 bg-slate-50/60 p-3 shadow-sm">
        <div className="flex items-start justify-between">
          <span className="inline-flex items-center rounded-md bg-slate-400 px-2 py-0.5 text-sm font-bold text-white">
            {bed.bed}
          </span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center py-4 text-slate-400">
          <BedDouble className="h-6 w-6" />
          <span className="mt-1 text-sm font-semibold text-slate-500">ว่าง</span>
          <span className="text-[11px]">Available</span>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {CARD_PENDING_TYPES.map((t) => (
            <MetricBox
              key={t.key}
              label={t.label}
              value="-"
              tone={t.tone}
              icon={t.icon}
            />
          ))}
        </div>
      </div>
    );
  }

  const p = bed.patient;
  const style = PRIORITY_STYLES[p.priority];
  const reserved = bed.status === "reserved";

  return (
    <Link
      href={`/patients/${p.id}`}
      className={`flex flex-col rounded-xl border border-l-4 ${style.accent} ${
        p.priority === "P0" ? style.cardTint : "border-slate-200 bg-white"
      } p-3 shadow-sm transition hover:shadow-md hover:ring-2 hover:ring-blue-100`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-1">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-sm font-bold ${style.badge}`}
          >
            {bed.bed}
          </span>
          <span className="text-[11px] font-medium text-slate-400">
            HN {p.hn}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          {p.hasAlert ? (
            <AlertTriangle className={`h-4 w-4`} style={{ color: style.hex }} />
          ) : null}
          <span className="text-slate-300" aria-hidden>
            <MoreVertical className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* Priority pill */}
      <div className="mt-1">
        <span
          className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold ${style.pill}`}
        >
          {p.priority}
        </span>
      </div>

      {/* Patient info */}
      <div className="mt-1.5 leading-tight">
        <p className="truncate text-sm font-semibold text-slate-800">{p.name}</p>
        <p className="text-[11px] text-slate-500">
          {p.ageYears} Y • {p.sex}
        </p>
        <p className="mt-0.5 truncate text-[11px] font-medium text-slate-600">
          {p.diagnosis}
        </p>
        <p className="text-[11px] text-slate-400">
          {reserved ? "LOS 0 Day" : `LOS ${p.losDays} Day${p.losDays === 1 ? "" : "s"}`}
        </p>
      </div>

      {/* Metrics */}
      <div className="mt-2 grid grid-cols-4 gap-1">
        {CARD_PENDING_TYPES.map((t) => (
          <MetricBox
            key={t.key}
            label={t.label}
            value={reserved ? "-" : String(p.pending[t.key] ?? 0)}
            tone={t.tone}
            icon={t.icon}
          />
        ))}
      </div>
    </Link>
  );
}
