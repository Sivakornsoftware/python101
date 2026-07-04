"use client";

import { useState } from "react";
import {
  Pause,
  Square,
  Plus,
  ClipboardList,
  Users,
  Layers,
  MoreHorizontal,
} from "lucide-react";
import type { PatientDetail, RoundState } from "@/lib/types";
import { getPatientDetail } from "@/lib/api/patient";
import { useSetTopbar } from "@/lib/topbarStore";
import PatientHeaderFull from "./PatientHeaderFull";
import MetricRow from "./MetricRow";
import ChartTabs, { type ChartTab } from "./ChartTabs";
import SummaryTab from "./SummaryTab";
import RoundQueue from "./RoundQueue";

const NEWS_LEGEND = [
  { dot: "bg-red-500", label: "NEWS ≥ 5" },
  { dot: "bg-orange-500", label: "NEWS 3-4 / Abnormal" },
  { dot: "bg-emerald-500", label: "NEWS 0-2 / Normal" },
];

const PENDING_LEGEND = [
  "Abnormal Lab",
  "Pending Task",
  "Pending Consult",
  "Medication Count",
];

export default function RoundModeView({
  initialRound,
  initialPatient,
}: {
  initialRound: RoundState;
  initialPatient: PatientDetail;
}) {
  useSetTopbar(
    `Round Mode – ${initialRound.wardName}`,
    initialRound.wardNameTh,
  );

  const [activeId, setActiveId] = useState(initialRound.activePatientId);
  const [patient, setPatient] = useState(initialPatient);
  const [tab, setTab] = useState<ChartTab>("summary");

  async function selectPatient(id: string) {
    setActiveId(id);
    const detail = await getPatientDetail(id);
    setPatient(detail);
  }

  return (
    <div className="space-y-4">
      {/* Sub-header controls */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
          {initialRound.total} / 36 Beds
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Pause className="h-4 w-4" /> Pause Round
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-600">
            <Square className="h-4 w-4 fill-current" /> End Round
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row">
        {/* Main column */}
        <div className="min-w-0 flex-1 space-y-4">
          <PatientHeaderFull p={patient} />
          <MetricRow p={patient} />

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="px-4 pt-2">
              <ChartTabs active={tab} onChange={setTab} />
            </div>
            <div className="p-4">
              {tab === "summary" ? (
                <SummaryTab p={patient} />
              ) : (
                <div className="flex min-h-[240px] items-center justify-center rounded-lg border border-dashed border-slate-200 text-sm text-slate-400">
                  แท็บ “{tab}” — อยู่ระหว่างพัฒนา (ดูรายละเอียดเต็มได้ในหน้าแฟ้มผู้ป่วย)
                </div>
              )}
            </div>

            {/* Action bar */}
            <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 p-3">
              <ActionButton icon={Plus} label="Doctor Note" primary />
              <ActionButton icon={Plus} label="Order" primary />
              <ActionButton icon={Plus} label="Consult" primary />
              <ActionButton icon={Layers} label="Quick Order Set" />
              <ActionButton icon={MoreHorizontal} label="More Actions" />
            </div>
          </div>
        </div>

        {/* Round queue */}
        <div className="w-full shrink-0 xl:w-80">
          <RoundQueue
            round={initialRound}
            activeId={activeId}
            onSelect={selectPatient}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[11px] text-slate-600 shadow-sm">
        {NEWS_LEGEND.map((l) => (
          <span key={l.label} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${l.dot}`} />
            {l.label}
          </span>
        ))}
        <span className="mx-1 h-4 w-px bg-slate-200" />
        {PENDING_LEGEND.map((l) => (
          <span key={l} className="flex items-center gap-1.5 text-slate-500">
            {l === "Abnormal Lab" ? (
              <ClipboardList className="h-3.5 w-3.5 text-slate-400" />
            ) : l === "Pending Consult" ? (
              <Users className="h-3.5 w-3.5 text-slate-400" />
            ) : (
              <span className="h-2.5 w-2.5 rounded-sm bg-slate-300" />
            )}
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  primary,
}: {
  icon: typeof Plus;
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition ${
        primary
          ? "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
