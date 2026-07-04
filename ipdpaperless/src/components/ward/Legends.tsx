import { PRIORITY_ORDER, PRIORITY_STYLES } from "@/lib/priority";
import { ALL_PENDING_TYPES } from "@/lib/pending";
import type { LastUpdated } from "@/lib/types";

/** Compact legend bar shown above the bed grid. */
export function LegendBar() {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
        <p className="mb-1.5 text-[11px] font-semibold text-slate-500">
          ระดับความเร่งด่วน (Priority Level)
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {PRIORITY_ORDER.map((level) => {
            const s = PRIORITY_STYLES[level];
            return (
              <span
                key={level}
                className="flex items-center gap-1.5 text-[11px] text-slate-600"
              >
                <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
                <span className="font-semibold">{level}</span>
                {s.labelTh} ({s.labelEn})
              </span>
            );
          })}
          <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            ไม่มีผู้ป่วย
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
        <p className="mb-1.5 text-[11px] font-semibold text-slate-500">
          ประเภทงาน/ผล (Pending)
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {ALL_PENDING_TYPES.map((t) => {
            const Icon = t.icon;
            return (
              <span
                key={t.key}
                className="flex items-center gap-1 text-[11px] text-slate-600"
              >
                <Icon className={`h-3.5 w-3.5 ${t.tone}`} />
                {t.label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Detailed legend + last-updated panel shown below the bed grid. */
export function BottomLegend({ lastUpdated }: { lastUpdated: LastUpdated }) {
  return (
    <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-3">
      <div>
        <p className="mb-2 text-xs font-semibold text-slate-600">
          คำอธิบายระดับความเร่งด่วน (Priority Level)
        </p>
        <ul className="space-y-1">
          {PRIORITY_ORDER.map((level) => {
            const s = PRIORITY_STYLES[level];
            return (
              <li
                key={level}
                className="flex items-center gap-2 text-[11px] text-slate-600"
              >
                <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
                <span className="font-semibold text-slate-700">{level}</span>
                {s.labelTh} ({s.labelEn})
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-slate-600">
          ประเภทงาน/ผล (Pending)
        </p>
        <ul className="space-y-1">
          {ALL_PENDING_TYPES.map((t) => {
            const Icon = t.icon;
            return (
              <li
                key={t.key}
                className="flex items-center gap-2 text-[11px] text-slate-600"
              >
                <Icon className={`h-3.5 w-3.5 ${t.tone}`} />
                <span className="font-semibold text-slate-700">{t.label}</span>
                {t.descTh}
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-slate-600">
          ข้อมูลอัปเดตล่าสุด
        </p>
        <ul className="space-y-1 text-[11px] text-slate-600">
          <li className="flex justify-between">
            <span>Vitals ล่าสุด</span>
            <span className="font-medium text-slate-700">
              {lastUpdated.vitals}
            </span>
          </li>
          <li className="flex justify-between">
            <span>Lab ล่าสุด</span>
            <span className="font-medium text-slate-700">{lastUpdated.lab}</span>
          </li>
          <li className="flex justify-between">
            <span>Orders ล่าสุด</span>
            <span className="font-medium text-slate-700">
              {lastUpdated.orders}
            </span>
          </li>
          <li className="flex justify-between">
            <span>Tasks ล่าสุด</span>
            <span className="font-medium text-slate-700">
              {lastUpdated.tasks}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
