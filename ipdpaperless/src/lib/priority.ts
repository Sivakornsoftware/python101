import type { PriorityLevel } from "@/lib/types";

export interface PriorityStyle {
  level: PriorityLevel;
  /** Short Thai label. */
  labelTh: string;
  /** English severity word shown in parentheses. */
  labelEn: string;
  /** Solid dot / badge background. */
  dot: string;
  /** Left accent border colour class. */
  accent: string;
  /** Bed-number badge classes. */
  badge: string;
  /** Priority pill classes. */
  pill: string;
  /** Optional tinted card background (used for the most urgent levels). */
  cardTint: string;
  /** Hex colour, handy for inline SVG / charts. */
  hex: string;
}

/**
 * Full Tailwind class strings are declared statically here so the JIT compiler
 * keeps them in the final CSS (dynamic string building would purge them).
 */
export const PRIORITY_STYLES: Record<PriorityLevel, PriorityStyle> = {
  P0: {
    level: "P0",
    labelTh: "เร่งด่วน",
    labelEn: "Urgent",
    dot: "bg-red-500",
    accent: "border-l-red-500",
    badge: "bg-red-500 text-white",
    pill: "bg-red-100 text-red-700",
    cardTint: "bg-red-50/70 border-red-200",
    hex: "#ef4444",
  },
  P1: {
    level: "P1",
    labelTh: "ต้องติดตามใกล้ชิด",
    labelEn: "High",
    dot: "bg-orange-500",
    accent: "border-l-orange-500",
    badge: "bg-orange-500 text-white",
    pill: "bg-orange-100 text-orange-700",
    cardTint: "bg-white border-slate-200",
    hex: "#f97316",
  },
  P2: {
    level: "P2",
    labelTh: "เฝ้าระวัง",
    labelEn: "Moderate",
    dot: "bg-amber-400",
    accent: "border-l-amber-400",
    badge: "bg-amber-400 text-white",
    pill: "bg-amber-100 text-amber-700",
    cardTint: "bg-white border-slate-200",
    hex: "#fbbf24",
  },
  P3: {
    level: "P3",
    labelTh: "ปกติ",
    labelEn: "Stable",
    dot: "bg-emerald-500",
    accent: "border-l-emerald-500",
    badge: "bg-emerald-500 text-white",
    pill: "bg-emerald-100 text-emerald-700",
    cardTint: "bg-white border-slate-200",
    hex: "#10b981",
  },
  P4: {
    level: "P4",
    labelTh: "พร้อมจำหน่าย/รอจำหน่าย",
    labelEn: "Discharge",
    dot: "bg-blue-500",
    accent: "border-l-blue-500",
    badge: "bg-blue-500 text-white",
    pill: "bg-blue-100 text-blue-700",
    cardTint: "bg-white border-slate-200",
    hex: "#3b82f6",
  },
};

export const PRIORITY_ORDER: PriorityLevel[] = ["P0", "P1", "P2", "P3", "P4"];
