import { Construction, type LucideIcon } from "lucide-react";

interface PagePlaceholderProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export default function PagePlaceholder({
  title,
  description,
  icon: Icon = Construction,
}: PagePlaceholderProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
        <Icon className="h-7 w-7" />
      </div>
      <h2 className="mt-4 text-lg font-bold text-slate-800">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>
      <span className="mt-4 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
        อยู่ระหว่างการพัฒนา (ใช้ข้อมูลจำลอง)
      </span>
    </div>
  );
}
