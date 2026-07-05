import { FileText } from "lucide-react";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export default function ReportsPage() {
  return (
    <PagePlaceholder
      icon={FileText}
      title="Reports"
      description="รายงานสรุปต่าง ๆ เช่น รายงานการครองเตียง รายงานการจำหน่าย และเอกสารเวชระเบียน"
    />
  );
}
