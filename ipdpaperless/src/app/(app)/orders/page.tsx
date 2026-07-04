import { ClipboardList } from "lucide-react";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export default function OrdersPage() {
  return (
    <PagePlaceholder
      icon={ClipboardList}
      title="Orders"
      description="คำสั่งการรักษา (Doctor Orders) ทั้ง One-day order และ Continue order พร้อมสถานะการดำเนินการ"
    />
  );
}
