import { AlertTriangle, Plus } from "lucide-react";
import type { PatientDetail } from "@/lib/types";
import { PRIORITY_STYLES } from "@/lib/priority";
import { newsStyle } from "@/lib/news";

/** Compact horizontal patient header used on the detail / timeline pages. */
export default function PatientHeaderBar({ p }: { p: PatientDetail }) {
  const style = PRIORITY_STYLES[p.priority];
  const news = newsStyle(p.news);
  const bedNo = p.id.replace(/^p/, "");

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center">
          <span
            className={`inline-flex items-center rounded-md px-2.5 py-1 text-base font-bold ${style.badge}`}
          >
            {bedNo}
          </span>
          <span className="mt-0.5 text-[10px] text-slate-400">Bed {bedNo}</span>
        </div>
        <div className="leading-tight">
          <p className="text-base font-bold text-slate-800">{p.name}</p>
          <p className="text-xs text-slate-500">
            HN {p.hn} · {p.ageDisplay ?? `${p.ageYears} Y`} · {p.sex} · {p.dob}
          </p>
        </div>
      </div>

      <div className="text-sm font-medium text-slate-600">
        {p.diagnoses.map((d) => d.replace(/\s*\(.*?\)\s*/g, "")).join(", ")}
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5">
        <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
        <div className="leading-tight">
          <p className="text-[10px] font-medium text-red-500">Allergy</p>
          <p className="text-sm font-bold text-red-600">{p.allergy ?? "NKDA"}</p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-5">
        <div className="text-center leading-tight">
          <p className="text-[10px] text-slate-400">LOS</p>
          <p className="text-sm font-bold text-slate-700">{p.losDays} Days</p>
        </div>
        <div className="text-center leading-tight">
          <p className="text-[10px] text-slate-400">NEWS</p>
          <p className={`text-sm font-bold ${news.text}`}>
            {p.news}{" "}
            <span className="text-[10px] font-medium">{news.label}</span>
          </p>
        </div>
        <div className="text-center leading-tight">
          <p className="text-[10px] text-slate-400">Code Status</p>
          <p className="text-sm font-semibold text-slate-700">{p.codeStatus}</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Event
        </button>
      </div>
    </div>
  );
}
