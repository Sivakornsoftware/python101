"use client";

import { useState } from "react";
import type { PatientDetail } from "@/lib/types";
import { useSetTopbar } from "@/lib/topbarStore";
import PatientHeaderBar from "./PatientHeaderBar";
import ChartTabs, { type ChartTab } from "./ChartTabs";
import SummaryTab from "./SummaryTab";
import TimelineTab from "./TimelineTab";

const TAB_TITLE: Record<ChartTab, string> = {
  summary: "แฟ้มผู้ป่วย (Summary)",
  timeline: "Timeline (เหตุการณ์ทั้งหมด)",
  labs: "Labs (ผลตรวจ)",
  medications: "Medications (ยา)",
  orders: "Orders (คำสั่งการรักษา)",
  notes: "Notes (บันทึก)",
  imaging: "Imaging (ภาพถ่ายรังสี)",
  consults: "Consults (การปรึกษา)",
  tasks: "Tasks (งาน)",
};

export default function PatientChartView({
  patient,
  initialTab = "summary",
}: {
  patient: PatientDetail;
  initialTab?: ChartTab;
}) {
  const [tab, setTab] = useState<ChartTab>(initialTab);
  useSetTopbar(TAB_TITLE[tab], patient.ward ? `Ward ${patient.ward}` : undefined);

  return (
    <div className="space-y-4">
      <PatientHeaderBar p={patient} />

      <div className="rounded-xl border border-slate-200 bg-white px-4 pt-2 shadow-sm">
        <ChartTabs active={tab} onChange={setTab} />
      </div>

      {tab === "summary" ? (
        <SummaryTab p={patient} />
      ) : tab === "timeline" ? (
        <TimelineTab p={patient} />
      ) : (
        <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white text-sm text-slate-400">
          แท็บ “{TAB_TITLE[tab]}” — อยู่ระหว่างพัฒนา (ข้อมูลจำลอง)
        </div>
      )}
    </div>
  );
}
