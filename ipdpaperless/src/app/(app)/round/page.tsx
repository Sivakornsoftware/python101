import { Radar } from "lucide-react";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export default function RoundPage() {
  return (
    <PagePlaceholder
      icon={Radar}
      title="Round Mode"
      description="โหมดตรวจเยี่ยมผู้ป่วยแบบทีละราย เหมาะสำหรับการ round ward พร้อมดูข้อมูลสำคัญของผู้ป่วยแต่ละเตียง"
    />
  );
}
