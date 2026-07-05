import { Settings } from "lucide-react";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export default function AdminPage() {
  return (
    <PagePlaceholder
      icon={Settings}
      title="Admin"
      description="ตั้งค่าระบบ ผู้ใช้งาน สิทธิ์การเข้าถึง และการเชื่อมต่อกับ API (FastAPI/Oracle, PostgreSQL)"
    />
  );
}
