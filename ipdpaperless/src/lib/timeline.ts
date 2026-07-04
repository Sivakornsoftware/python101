import {
  User,
  Stethoscope,
  FlaskConical,
  Pill,
  Scan,
  ClipboardList,
  Users,
  FileText,
  type LucideIcon,
} from "lucide-react";
import type { TimelineEventType } from "@/lib/types";

export interface TimelineTypeStyle {
  icon: LucideIcon;
  /** Icon chip classes. */
  chip: string;
}

export const TIMELINE_TYPE_STYLE: Record<TimelineEventType, TimelineTypeStyle> = {
  nurse_note: { icon: User, chip: "bg-emerald-100 text-emerald-600" },
  doctor_note: { icon: Stethoscope, chip: "bg-blue-100 text-blue-600" },
  progress_note: { icon: FileText, chip: "bg-blue-100 text-blue-600" },
  lab: { icon: FlaskConical, chip: "bg-amber-100 text-amber-600" },
  medication: { icon: Pill, chip: "bg-violet-100 text-violet-600" },
  imaging: { icon: Scan, chip: "bg-slate-200 text-slate-600" },
  order: { icon: ClipboardList, chip: "bg-indigo-100 text-indigo-600" },
  consult: { icon: Users, chip: "bg-teal-100 text-teal-600" },
};
