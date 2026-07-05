import { LayoutDashboard } from "lucide-react";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export default function DashboardPage() {
  return (
    <PagePlaceholder
      icon={LayoutDashboard}
      title="Dashboard"
      description="ภาพรวมทั้งโรงพยาบาล เช่น อัตราครองเตียง จำนวนผู้ป่วยแยกตามหอผู้ป่วย และตัวชี้วัดสำคัญ"
    />
  );
}
