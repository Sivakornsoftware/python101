import { AlertTriangle } from "lucide-react";
import type { Bed } from "@/lib/types";
import { PRIORITY_STYLES } from "@/lib/priority";
import { CARD_PENDING_TYPES } from "@/lib/pending";

export default function PatientRow({ bed }: { bed: Bed }) {
  if (bed.status === "empty" || !bed.patient) {
    return (
      <div className="grid grid-cols-2 items-center gap-2 border-b border-slate-100 px-4 py-3 text-sm last:border-0 md:grid-cols-12">
        <div className="md:col-span-1">
          <span className="inline-flex items-center rounded-md bg-slate-400 px-2 py-0.5 text-xs font-bold text-white">
            {bed.bed}
          </span>
        </div>
        <div className="text-slate-400 md:col-span-11">ว่าง / Available</div>
      </div>
    );
  }

  const p = bed.patient;
  const style = PRIORITY_STYLES[p.priority];
  const reserved = bed.status === "reserved";

  return (
    <div
      className={`grid grid-cols-2 items-center gap-2 border-b border-l-4 border-slate-100 ${style.accent} px-4 py-3 text-sm last:border-b-0 md:grid-cols-12`}
    >
      <div className="flex items-center gap-1.5 md:col-span-1">
        <span
          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ${style.badge}`}
        >
          {bed.bed}
        </span>
      </div>
      <div className="text-slate-500 md:col-span-2">
        <span className={`mr-1 rounded px-1 py-0.5 text-[10px] font-semibold ${style.pill}`}>
          {p.priority}
        </span>
        {p.hn}
      </div>
      <div className="col-span-2 flex items-center gap-1 font-medium text-slate-800 md:col-span-3">
        {p.name}
        {p.hasAlert ? (
          <AlertTriangle className="h-3.5 w-3.5" style={{ color: style.hex }} />
        ) : null}
        <span className="text-[11px] font-normal text-slate-400">
          {p.ageYears} Y • {p.sex}
        </span>
      </div>
      <div className="text-slate-600 md:col-span-2">{p.diagnosis}</div>
      <div className="text-slate-500 md:col-span-1">
        {reserved ? 0 : p.losDays} วัน
      </div>
      <div className="flex justify-end gap-3 text-slate-600 md:col-span-3">
        {CARD_PENDING_TYPES.map((t) => (
          <span key={t.key} className="flex items-center gap-1">
            <t.icon className={`h-3.5 w-3.5 ${t.tone}`} />
            {reserved ? "-" : (p.pending[t.key] ?? 0)}
          </span>
        ))}
      </div>
    </div>
  );
}
