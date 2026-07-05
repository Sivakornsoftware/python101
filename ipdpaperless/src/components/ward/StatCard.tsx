import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  /** Tailwind classes for the icon chip, e.g. "bg-blue-100 text-blue-600". */
  tone: string;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: StatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-xs text-slate-500">{label}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-slate-800">{value}</span>
          {sub ? (
            <span className="text-xs font-medium text-slate-400">{sub}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
