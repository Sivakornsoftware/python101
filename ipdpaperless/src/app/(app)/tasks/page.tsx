import { ListChecks } from "lucide-react";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export default function TasksPage() {
  return (
    <PagePlaceholder
      icon={ListChecks}
      title="Tasks"
      description="รายการงานที่ต้องทำของทีมแพทย์และพยาบาล เช่น งานค้าง การติดตามผล และกิจกรรมการพยาบาล"
    />
  );
}
