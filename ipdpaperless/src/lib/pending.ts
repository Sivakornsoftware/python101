import {
  FlaskConical,
  Users,
  ClipboardCheck,
  Pill,
  ClipboardList,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import type { PendingCounts } from "@/lib/types";

export interface PendingType {
  key: keyof PendingCounts;
  label: string;
  descTh: string;
  icon: LucideIcon;
  /** Icon/text tone class. */
  tone: string;
}

/** The four metrics rendered on each bed card, in order. */
export const CARD_PENDING_TYPES: PendingType[] = [
  {
    key: "lab",
    label: "Lab",
    descTh: "รอผลตรวจทางห้องปฏิบัติการ",
    icon: FlaskConical,
    tone: "text-sky-600",
  },
  {
    key: "consult",
    label: "Consult",
    descTh: "รอการปรึกษาแพทย์เฉพาะทาง",
    icon: Users,
    tone: "text-violet-600",
  },
  {
    key: "task",
    label: "Task",
    descTh: "งานพยาบาล/กิจกรรมการพยาบาล",
    icon: ClipboardCheck,
    tone: "text-amber-600",
  },
  {
    key: "med",
    label: "Med",
    descTh: "รอการบริหารยา",
    icon: Pill,
    tone: "text-emerald-600",
  },
];

/** Extra pending types shown only in the legend. */
export const EXTRA_PENDING_TYPES: PendingType[] = [
  {
    key: "order",
    label: "Order",
    descTh: "รอรับคำสั่งการรักษา",
    icon: ClipboardList,
    tone: "text-slate-600",
  },
  {
    key: "other",
    label: "Other",
    descTh: "อื่น ๆ",
    icon: MoreHorizontal,
    tone: "text-slate-600",
  },
];

export const ALL_PENDING_TYPES: PendingType[] = [
  ...CARD_PENDING_TYPES,
  ...EXTRA_PENDING_TYPES,
];
