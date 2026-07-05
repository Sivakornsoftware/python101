import { AlertTriangle, Copy, HeartPulse } from "lucide-react";
import type { PatientDetail } from "@/lib/types";
import { PRIORITY_STYLES } from "@/lib/priority";

export default function PatientHeaderFull({ p }: { p: PatientDetail }) {
  const style = PRIORITY_STYLES[p.priority];
  const bedNo = p.hn ? p.id.replace(/^p/, "") : "";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start gap-x-6 gap-y-4">
        {/* Bed + identity */}
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <span
              className={`inline-flex items-center rounded-md px-2.5 py-1 text-base font-bold ${style.badge}`}
            >
              {bedNo}
            </span>
            <span className="mt-1 text-[11px] text-slate-400">Bed {bedNo}</span>
          </div>
          <div className="leading-tight">
            <p className="text-lg font-bold text-slate-800">{p.name}</p>
            <p className="flex items-center gap-1 text-xs text-slate-500">
              HN {p.hn}
              <Copy className="h-3 w-3 cursor-pointer hover:text-slate-700" />
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {p.ageDisplay ?? `${p.ageYears} Y`} · {p.sex} · {p.dob}
            </p>
          </div>
        </div>

        {/* Stay info */}
        <div className="space-y-1 text-xs leading-tight">
          <p className="text-slate-500">
            LOS <span className="font-semibold text-slate-700">{p.losDays} Days</span>
          </p>
          <p className="text-slate-500">
            Admitted{" "}
            <span className="font-semibold text-slate-700">{p.admittedDate}</span>
          </p>
          <p className="text-slate-500">
            Attending{" "}
            <span className="font-semibold text-slate-700">{p.attending}</span>
          </p>
        </div>

        {/* Diagnoses */}
        <div className="min-w-[180px] text-xs leading-tight">
          <p className="mb-1 font-semibold text-slate-500">Diagnoses</p>
          <ol className="space-y-0.5 text-slate-700">
            {p.diagnoses.map((d, i) => (
              <li key={d}>
                {i + 1}. {d}
              </li>
            ))}
          </ol>
        </div>

        {/* Allergy + code status */}
        <div className="ml-auto space-y-2">
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
            <div className="leading-tight">
              <p className="text-[10px] font-medium text-red-500">Allergy</p>
              <p className="text-sm font-bold text-red-600">
                {p.allergy ?? "NKDA"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-1">
            <HeartPulse className="h-4 w-4 text-slate-400" />
            <div className="leading-tight">
              <p className="text-[10px] font-medium text-slate-400">Code Status</p>
              <p className="text-sm font-semibold text-slate-700">
                {p.codeStatus}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
