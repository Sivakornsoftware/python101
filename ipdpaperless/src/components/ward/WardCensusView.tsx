"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BedDouble,
  FileCheck2,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  Play,
  Plus,
  Users,
} from "lucide-react";
import type { Bed, WardCensus } from "@/lib/types";
import StatCard from "./StatCard";
import TrendChart from "./TrendChart";
import PatientCard from "./PatientCard";
import PatientRow from "./PatientRow";
import { LegendBar, BottomLegend } from "./Legends";

type TabKey = "overview" | "all" | "discharged" | "plan";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "ภาพรวม" },
  { key: "all", label: "ผู้ป่วยทั้งหมด" },
  { key: "discharged", label: "จำหน่ายวันนี้" },
  { key: "plan", label: "Discharge Plan" },
];

export default function WardCensusView({ data }: { data: WardCensus }) {
  const [tab, setTab] = useState<TabKey>("overview");
  const [view, setView] = useState<"grid" | "list">("grid");

  const { summary, beds, lastUpdated } = data;

  const visibleBeds: Bed[] = useMemo(() => {
    switch (tab) {
      case "all":
        return beds.filter((b) => b.status !== "empty");
      case "discharged":
        // No mock discharges yet — placeholder for the finalized API.
        return [];
      case "plan":
        return beds.filter((b) => b.patient?.priority === "P4");
      case "overview":
      default:
        return beds;
    }
  }, [tab, beds]);

  return (
    <div className="space-y-4">
      {/* Tab row + controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                tab === t.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <ArrowUpDown className="h-4 w-4" />
            Sort
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Play className="h-4 w-4 fill-current" />
            Round Mode
          </button>

          <div className="flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white">
            <button
              type="button"
              onClick={() => setView("grid")}
              aria-label="มุมมองการ์ด"
              className={`flex h-8 w-8 items-center justify-center ${
                view === "grid"
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              aria-label="มุมมองรายการ"
              className={`flex h-8 w-8 items-center justify-center ${
                view === "list"
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard
          icon={BedDouble}
          label="ทั้งหมด (Beds)"
          value={`${summary.occupiedBeds} / ${summary.totalBeds}`}
          tone="bg-blue-100 text-blue-600"
        />
        <StatCard
          icon={Users}
          label="อยู่ระหว่างรักษา"
          value={String(summary.admitted)}
          sub={`${summary.admittedPct.toFixed(1)}%`}
          tone="bg-emerald-100 text-emerald-600"
        />
        <StatCard
          icon={AlertTriangle}
          label="ต้องติดตามใกล้ชิด"
          value={String(summary.closeMonitor)}
          sub={`(${summary.closeMonitorPct.toFixed(1)}%)`}
          tone="bg-orange-100 text-orange-600"
        />
        <StatCard
          icon={Users}
          label="มีงาน/รอผล"
          value={String(summary.pending)}
          sub={`(${summary.pendingPct.toFixed(1)}%)`}
          tone="bg-violet-100 text-violet-600"
        />
        <StatCard
          icon={FileCheck2}
          label="พร้อมจำหน่าย"
          value={String(summary.readyDischarge)}
          sub={`(${summary.readyDischargePct.toFixed(1)}%)`}
          tone="bg-sky-100 text-sky-600"
        />
        <TrendChart data={summary.trend} labels={summary.trendLabels} />
      </div>

      {/* Compact legend */}
      <LegendBar />

      {/* Beds */}
      {visibleBeds.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400">
          ไม่มีข้อมูลผู้ป่วยในมุมมองนี้
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {visibleBeds.map((bed) => (
            <PatientCard key={bed.bed} bed={bed} />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="hidden grid-cols-12 gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2 text-[11px] font-semibold text-slate-500 md:grid">
            <div className="col-span-1">เตียง</div>
            <div className="col-span-2">HN</div>
            <div className="col-span-3">ชื่อ-สกุล</div>
            <div className="col-span-2">การวินิจฉัย</div>
            <div className="col-span-1">LOS</div>
            <div className="col-span-3 text-right">Lab / Consult / Task / Med</div>
          </div>
          {visibleBeds.map((bed) => (
            <PatientRow key={bed.bed} bed={bed} />
          ))}
        </div>
      )}

      {/* Detailed legend */}
      <BottomLegend lastUpdated={lastUpdated} />

      {/* Floating add button */}
      <button
        type="button"
        className="fixed bottom-6 right-6 z-20 flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700"
      >
        <Plus className="h-5 w-5" />
        เพิ่มผู้ป่วย
      </button>
    </div>
  );
}
