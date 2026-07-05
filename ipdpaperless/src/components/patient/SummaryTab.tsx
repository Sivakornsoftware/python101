import {
  Activity,
  Heart,
  Wind,
  Droplet,
  Thermometer,
  Plus,
} from "lucide-react";
import type {
  OrderStatus,
  PatientDetail,
  ProblemStatus,
  TimelineEvent,
} from "@/lib/types";
import { TIMELINE_TYPE_STYLE } from "@/lib/timeline";

const PROBLEM_PILL: Record<ProblemStatus, string> = {
  Active: "bg-red-100 text-red-600",
  Monitoring: "bg-amber-100 text-amber-600",
  Resolved: "bg-slate-100 text-slate-500",
};

const ORDER_PILL: Record<OrderStatus, string> = {
  Pending: "bg-amber-100 text-amber-600",
  Active: "bg-blue-100 text-blue-600",
  Completed: "bg-emerald-100 text-emerald-600",
  Cancelled: "bg-slate-100 text-slate-500",
};

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-700">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function CompactTimelineItem({ ev }: { ev: TimelineEvent }) {
  const s = TIMELINE_TYPE_STYLE[ev.type];
  const Icon = s.icon;
  return (
    <div className="flex gap-2.5">
      <span className="w-10 shrink-0 pt-0.5 text-[11px] font-medium text-slate-400">
        {ev.time}
      </span>
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${s.chip}`}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 leading-tight">
        <p className="text-xs font-semibold text-slate-700">{ev.title}</p>
        <p className="text-[11px] text-slate-500">{ev.detail}</p>
        <p className="text-[10px] text-slate-400">โดย {ev.author}</p>
      </div>
    </div>
  );
}

export default function SummaryTab({ p }: { p: PatientDetail }) {
  const vitals = [
    { icon: Activity, tone: "text-slate-500", label: "BP", value: p.vitals.bp, unit: "mmHg" },
    { icon: Heart, tone: "text-red-500", label: "HR", value: p.vitals.hr, unit: "bpm" },
    { icon: Wind, tone: "text-sky-500", label: "RR", value: p.vitals.rr, unit: "/min" },
    {
      icon: Droplet,
      tone: "text-blue-500",
      label: "SpO₂",
      value: p.vitals.spo2,
      unit: `% ${p.vitals.spo2Note ? `(${p.vitals.spo2Note})` : ""}`,
    },
    { icon: Thermometer, tone: "text-orange-500", label: "Temp", value: p.vitals.temp, unit: "°C" },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Column 1 */}
      <div className="space-y-4">
        <Panel
          title="Problem List"
          action={
            <button className="flex items-center gap-0.5 text-xs font-medium text-blue-600 hover:underline">
              <Plus className="h-3 w-3" /> Add
            </button>
          }
        >
          <ol className="space-y-2">
            {p.problems.map((pr, i) => (
              <li
                key={pr.id}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span className="text-slate-700">
                  {i + 1}. {pr.name}
                </span>
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${PROBLEM_PILL[pr.status]}`}
                >
                  {pr.status}
                </span>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title={`Vital Signs (Latest) · ${p.vitals.time ?? ""}`}>
          <ul className="space-y-2">
            {vitals.map((v) => (
              <li key={v.label} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-500">
                  <v.icon className={`h-4 w-4 ${v.tone}`} />
                  {v.label}
                </span>
                <span className="font-semibold text-slate-700">
                  {v.value} <span className="text-[11px] font-normal text-slate-400">{v.unit}</span>
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Column 2 */}
      <Panel
        title="Clinical Timeline (Latest)"
        action={
          <button className="text-xs font-medium text-blue-600 hover:underline">
            ดูทั้งหมด
          </button>
        }
      >
        <div className="space-y-3.5">
          {p.timeline.slice(0, 5).map((ev) => (
            <CompactTimelineItem key={ev.id} ev={ev} />
          ))}
        </div>
      </Panel>

      {/* Column 3 */}
      <div className="space-y-4">
        <Panel
          title="SOAP (Latest)"
          action={
            <button className="text-xs font-medium text-blue-600 hover:underline">
              แก้ไข
            </button>
          }
        >
          <div className="space-y-2.5 text-xs">
            <SoapRow letter="S" tone="bg-sky-500" lines={[p.soap.s]} />
            <SoapRow letter="O" tone="bg-emerald-500" lines={p.soap.o} />
            <SoapRow letter="A" tone="bg-amber-500" lines={p.soap.a} />
            <SoapRow letter="P" tone="bg-violet-500" lines={p.soap.p} bullet />
          </div>
        </Panel>

        <Panel title="Plan / Today's Orders">
          <ol className="space-y-2">
            {p.todaysOrders.map((o, i) => (
              <li key={o.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="text-slate-700">
                  {i + 1}. {o.name}
                </span>
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${ORDER_PILL[o.status]}`}
                >
                  {o.status}
                </span>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </div>
  );
}

function SoapRow({
  letter,
  tone,
  lines,
  bullet,
}: {
  letter: string;
  tone: string;
  lines: string[];
  bullet?: boolean;
}) {
  return (
    <div className="flex gap-2">
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${tone}`}
      >
        {letter}
      </span>
      <div className="min-w-0 space-y-0.5 text-slate-600">
        {lines.map((l, i) => (
          <p key={i}>
            {bullet ? "- " : ""}
            {l}
          </p>
        ))}
      </div>
    </div>
  );
}
