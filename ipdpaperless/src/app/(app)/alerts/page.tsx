import { Bell } from "lucide-react";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export default function AlertsPage() {
  return (
    <PagePlaceholder
      icon={Bell}
      title="Alerts"
      description="การแจ้งเตือนสำคัญ เช่น ค่าวิกฤต (Critical value), ผู้ป่วยที่ต้องติดตามใกล้ชิด และงานเร่งด่วน"
    />
  );
}
