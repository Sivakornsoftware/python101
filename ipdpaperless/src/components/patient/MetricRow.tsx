import {
  HeartPulse,
  FlaskConical,
  ClipboardList,
  Users,
  Pill,
  Droplet,
  type LucideIcon,
} from "lucide-react";
import type { PatientDetail } from "@/lib/types";
import { newsStyle } from "@/lib/news";

function MetricCard({
  icon: Icon,
  iconTone,
  label,
  value,
  sub,
  subTone,
}: {
  icon: LucideIcon;
  iconTone: string;
  label: string;
  value: string;
  sub: string;
  subTone: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-1.5">
        <Icon className={`h-4 w-4 ${iconTone}`} />
        <span className="text-[11px] font-medium text-slate-500">{label}</span>
      </div>
      <p className="mt-1 text-2xl font-bold text-slate-800">{value}</p>
      <p className={`text-[11px] font-medium ${subTone}`}>{sub}</p>
    </div>
  );
}

export default function MetricRow({ p }: { p: PatientDetail }) {
  const news = newsStyle(p.news);
  const balance =
    p.io.balance >= 0 ? `+${p.io.balance}` : String(p.io.balance);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      <MetricCard
        icon={HeartPulse}
        iconTone={news.text}
        label="NEWS Score"
        value={String(p.news)}
        sub={news.label}
        subTone={news.text}
      />
      <MetricCard
        icon={FlaskConical}
        iconTone="text-orange-500"
        label="Lab Alerts"
        value={String(p.labAlerts)}
        sub="Abnormal"
        subTone="text-orange-500"
      />
      <MetricCard
        icon={ClipboardList}
        iconTone="text-violet-500"
        label="Pending Results"
        value={String(p.pendingResults)}
        sub="Results"
        subTone="text-violet-500"
      />
      <MetricCard
        icon={Users}
        iconTone="text-blue-500"
        label="Pending Consult"
        value={String(p.pendingConsults)}
        sub="Consults"
        subTone="text-blue-500"
      />
      <MetricCard
        icon={Pill}
        iconTone="text-indigo-500"
        label="Medication Items"
        value={String(p.medItems)}
        sub="Active"
        subTone="text-indigo-500"
      />
      <MetricCard
        icon={Droplet}
        iconTone="text-emerald-500"
        label="I/O (24 hr.)"
        value={`${balance}`}
        sub="ml."
        subTone="text-emerald-500"
      />
    </div>
  );
}
