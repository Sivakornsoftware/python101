/**
 * Domain types for the IPDX Ward Census / IPD Paperless system.
 * These mirror the shape the FastAPI backend is expected to return so that
 * switching from mock to live data requires no changes in the UI layer.
 */

/** Clinical priority level shown as the coloured accent on each bed card. */
export type PriorityLevel = "P0" | "P1" | "P2" | "P3" | "P4";

/** Patient sex. */
export type Sex = "M" | "F";

/** Bed occupancy status. */
export type BedStatus =
  | "occupied" // มีผู้ป่วยรักษาอยู่
  | "empty" // เตียงว่าง
  | "reserved"; // จองไว้ / รอ Admit

/** Types of pending work / results tracked per patient. */
export interface PendingCounts {
  lab: number;
  consult: number;
  task: number;
  med: number;
  order?: number;
  other?: number;
}

/** A single bed within a ward (occupied or empty). */
export interface Bed {
  /** Bed number, e.g. "101". */
  bed: string;
  status: BedStatus;
  /** Present when status !== "empty". */
  patient?: Patient;
}

/** A patient currently admitted to a bed. */
export interface Patient {
  id: string;
  hn: string; // Hospital Number
  an?: string; // Admission Number
  name: string;
  ageYears: number;
  sex: Sex;
  /** Free-text / short diagnosis list shown on the card. */
  diagnosis: string;
  /** Length of stay in days. */
  losDays: number;
  priority: PriorityLevel;
  pending: PendingCounts;
  /** True to render the alert (warning) glyph on the card. */
  hasAlert?: boolean;
  ward?: string;
}

/** KPI summary cards shown at the top of the Ward Census page. */
export interface WardSummary {
  totalBeds: number;
  occupiedBeds: number;
  admitted: number;
  admittedPct: number;
  closeMonitor: number;
  closeMonitorPct: number;
  pending: number;
  pendingPct: number;
  readyDischarge: number;
  readyDischargePct: number;
  /** 3-day trend of occupied beds for the mini chart. */
  trend: number[];
  trendLabels?: string[];
}

/** Timestamps of the last data refresh per data source. */
export interface LastUpdated {
  vitals: string;
  lab: string;
  orders: string;
  tasks: string;
}

/** Full payload backing the Ward Census screen. */
export interface WardCensus {
  wardId: string;
  wardName: string; // e.g. "Ward 5A"
  wardNameTh: string; // e.g. "อายุรกรรมชาย 5A"
  summary: WardSummary;
  beds: Bed[];
  lastUpdated: LastUpdated;
}

/** Minimal ward descriptor for the ward switcher. */
export interface Ward {
  id: string;
  name: string;
  nameTh: string;
}
