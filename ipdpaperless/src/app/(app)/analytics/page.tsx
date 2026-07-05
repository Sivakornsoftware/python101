import { BarChart3 } from "lucide-react";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export default function AnalyticsPage() {
  return (
    <PagePlaceholder
      icon={BarChart3}
      title="Analytics"
      description="การวิเคราะห์ข้อมูลเชิงลึก เช่น แนวโน้ม LOS อัตราการกลับมารักษาซ้ำ และตัวชี้วัดคุณภาพ"
    />
  );
}
