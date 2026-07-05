"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { RoundState } from "@/lib/types";
import { newsStyle } from "@/lib/news";

export default function RoundQueue({
  round,
  activeId,
  onSelect,
}: {
  round: RoundState;
  activeId: string;
  onSelect: (patientId: string) => void;
}) {
  const activeIndex = round.queue.findIndex((q) => q.patientId === activeId);

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-bold text-slate-700">Round Queue</h3>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </div>

      <div className="border-b border-slate-100 px-4 py-3">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-slate-500">Progress</span>
          <span className="font-semibold text-slate-700">
            {round.current} / {round.total}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600"
            style={{ width: `${(round.current / round.total) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-slate-400">
          Estimated Time{" "}
          <span className="font-medium text-slate-600">
            {round.estimatedTime}
          </span>
        </p>
      </div>

      <div className="max-h-[520px] flex-1 space-y-2 overflow-y-auto p-3">
        {round.queue.map((q) => {
          const active = q.patientId === activeId;
          const s = newsStyle(q.news);
          return (
            <button
              key={q.patientId}
              type="button"
              onClick={() => onSelect(q.patientId)}
              className={`flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition ${
                active
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span className="text-sm font-bold text-slate-500">{q.bed}</span>
              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate text-sm font-semibold text-slate-700">
                  {q.name}
                </p>
                <p className="truncate text-[11px] text-slate-400">
                  {q.diagnosis}
                </p>
              </div>
              <div className="text-right leading-none">
                <span className="text-[9px] font-medium text-slate-400">
                  NEWS
                </span>
                <p className={`text-lg font-bold ${s.text}`}>{q.news}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <span className="text-xs text-slate-400">
            {activeIndex + 1} / {round.total}
          </span>
          <button className="ml-auto flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700">
            Next Patient <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <button className="mt-2 w-full text-center text-xs font-medium text-slate-400 hover:text-slate-600">
          Skip Patient
        </button>
      </div>
    </div>
  );
}
