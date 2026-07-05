"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  Filter,
  Eye,
  X,
  Activity,
  Heart,
  Wind,
  Droplet,
  Thermometer,
  ImageIcon,
} from "lucide-react";
import type { PatientDetail, TimelineEvent, TimelineEventType } from "@/lib/types";
import { TIMELINE_TYPE_STYLE } from "@/lib/timeline";
import { newsStyle } from "@/lib/news";

type FilterKey = "all" | "note" | "lab" | "medication" | "order" | "imaging" | "consult";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "note", label: "Note" },
  { key: "lab", label: "Lab" },
  { key: "medication", label: "Medication" },
  { key: "order", label: "Order" },
  { key: "imaging", label: "Imaging" },
  { key: "consult", label: "Consult" },
];

const NOTE_TYPES: TimelineEventType[] = ["nurse_note", "doctor_note", "progress_note"];

function matchesFilter(ev: TimelineEvent, f: FilterKey): boolean {
  if (f === "all") return true;
  if (f === "note") return NOTE_TYPES.includes(ev.type);
  return ev.type === f;
}

export default function TimelineTab({ p }: { p: PatientDetail }) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedId, setSelectedId] = useState<string>(
    p.timeline.find((e) => e.vitals)?.id ?? p.timeline[0]?.id,
  );

  const filtered = useMemo(
    () => p.timeline.filter((ev) => matchesFilter(ev, filter)),
    [p.timeline, filter],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, TimelineEvent[]>();
    for (const ev of filtered) {
      const arr = map.get(ev.date) ?? [];
      arr.push(ev);
      map.set(ev.date, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const selected = p.timeline.find((e) => e.id === selectedId) ?? null;

  return (
    <div className="space-y-4">
      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filter === f.key
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f.label}
              {f.key === "all" ? <ChevronDown className="h-3 w-3" /> : null}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
            Today <ChevronDown className="h-3 w-3" />
          </button>
          <button className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
            <Filter className="h-3.5 w-3.5" /> Filter
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Timeline list */}
        <div className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          {grouped.map(([date, events]) => (
            <div key={date} className="mb-4 last:mb-0">
              <div className="mb-2 inline-block rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                {date}
                {events[0]?.isToday ? " (วันนี้)" : ""}
              </div>
              <div className="space-y-3 border-l border-slate-200 pl-4">
                {events.map((ev) => (
                  <TimelineRow
                    key={ev.id}
                    ev={ev}
                    active={ev.id === selectedId}
                    onSelect={() => setSelectedId(ev.id)}
                  />
                ))}
              </div>
            </div>
          ))}

          <div className="mt-4 flex justify-center">
            <button className="flex items-center gap-1 rounded-lg border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50">
              Load More Events <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Event details */}
        <div className="w-full shrink-0 lg:w-80">
          {selected ? (
            <EventDetails ev={selected} />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-400">
              เลือกเหตุการณ์เพื่อดูรายละเอียด
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TimelineRow({
  ev,
  active,
  onSelect,
}: {
  ev: TimelineEvent;
  active: boolean;
  onSelect: () => void;
}) {
  const s = TIMELINE_TYPE_STYLE[ev.type];
  const Icon = s.icon;
  return (
    <div
      className={`-ml-[1.4rem] flex gap-3 rounded-lg p-2 transition ${
        active ? "bg-blue-50 ring-1 ring-blue-100" : "hover:bg-slate-50"
      }`}
    >
      <span className="w-10 shrink-0 pt-1 text-[11px] font-medium text-slate-400">
        {ev.time}
      </span>
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${s.chip}`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1 leading-tight">
        <p className="text-sm font-semibold text-slate-700">{ev.title}</p>
        <p className="text-xs text-slate-500">{ev.detail}</p>
        <p className="mt-0.5 text-[10px] text-slate-400">โดย {ev.author}</p>
      </div>
      {ev.thumbnailLabel ? (
        <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-md bg-slate-800 text-[9px] font-medium text-slate-300">
          <ImageIcon className="mr-0.5 h-3 w-3" />
          {ev.thumbnailLabel}
        </div>
      ) : null}
      <button
        type="button"
        onClick={onSelect}
        className="flex h-7 shrink-0 items-center gap-1 self-start rounded-md border border-slate-200 px-2 text-[11px] font-medium text-slate-500 hover:bg-white"
      >
        <Eye className="h-3 w-3" /> View Details
      </button>
    </div>
  );
}

function EventDetails({ ev }: { ev: TimelineEvent }) {
  const s = TIMELINE_TYPE_STYLE[ev.type];
  const Icon = s.icon;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-700">Event Details</h3>
        <X className="h-4 w-4 cursor-pointer text-slate-400 hover:text-slate-600" />
      </div>

      <div className="mb-3 flex items-center gap-2">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full ${s.chip}`}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-slate-700">{ev.title}</p>
          <p className="text-[11px] text-slate-400">
            {ev.date} {ev.time}
          </p>
        </div>
      </div>

      <p className="mb-4 text-xs text-slate-600">{ev.detail}</p>

      {ev.vitals ? (
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold text-slate-500">Vital Signs</p>
          <ul className="space-y-1.5 text-xs">
            <VitalRow icon={Activity} tone="text-slate-500" label="BP" value={ev.vitals.bp} unit="mmHg" />
            <VitalRow icon={Heart} tone="text-red-500" label="HR" value={ev.vitals.hr} unit="bpm" />
            <VitalRow icon={Wind} tone="text-sky-500" label="RR" value={ev.vitals.rr} unit="/min" />
            <VitalRow
              icon={Droplet}
              tone="text-blue-500"
              label="SpO₂"
              value={ev.vitals.spo2}
              unit={`% ${ev.vitals.spo2Note ? `(${ev.vitals.spo2Note})` : ""}`}
            />
            <VitalRow icon={Thermometer} tone="text-orange-500" label="Temp" value={ev.vitals.temp} unit="°C" />
          </ul>
        </div>
      ) : null}

      {ev.painScore !== undefined || ev.news !== undefined ? (
        <div className="mb-4 grid grid-cols-2 gap-2">
          {ev.painScore !== undefined ? (
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-2 text-center">
              <p className="text-[10px] text-slate-400">Pain Score</p>
              <p className="text-lg font-bold text-slate-700">
                {ev.painScore}
                <span className="text-[11px] font-normal text-slate-400"> /10</span>
              </p>
            </div>
          ) : null}
          {ev.news !== undefined ? (
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-2 text-center">
              <p className="text-[10px] text-slate-400">NEWS Score</p>
              <p className={`text-lg font-bold ${newsStyle(ev.news).text}`}>
                {ev.news}
                <span className="ml-1 text-[10px] font-medium">
                  {newsStyle(ev.news).label}
                </span>
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      {ev.io ? (
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold text-slate-500">I/O (24 hr.)</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[10px] text-slate-400">Intake</p>
              <p className="text-sm font-bold text-emerald-600">
                {ev.io.intake.toLocaleString()}
                <span className="text-[10px] font-normal text-slate-400"> ml</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400">Output</p>
              <p className="text-sm font-bold text-amber-600">
                {ev.io.output.toLocaleString()}
                <span className="text-[10px] font-normal text-slate-400"> ml</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400">Balance</p>
              <p className="text-sm font-bold text-blue-600">
                {ev.io.balance >= 0 ? "+" : ""}
                {ev.io.balance.toLocaleString()}
                <span className="text-[10px] font-normal text-slate-400"> ml</span>
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mb-4">
        <p className="mb-1 text-xs font-semibold text-slate-500">Attachments</p>
        <p className="text-xs text-slate-400">
          {ev.attachments && ev.attachments.length > 0
            ? ev.attachments.join(", ")
            : "ไม่มีไฟล์แนบ"}
        </p>
      </div>

      <button className="w-full rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
        Edit Note
      </button>
    </div>
  );
}

function VitalRow({
  icon: Icon,
  tone,
  label,
  value,
  unit,
}: {
  icon: typeof Activity;
  tone: string;
  label: string;
  value: number | string;
  unit: string;
}) {
  return (
    <li className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-slate-500">
        <Icon className={`h-3.5 w-3.5 ${tone}`} />
        {label}
      </span>
      <span className="font-semibold text-slate-700">
        {value} <span className="text-[10px] font-normal text-slate-400">{unit}</span>
      </span>
    </li>
  );
}
