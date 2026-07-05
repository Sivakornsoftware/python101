import { MessagesSquare } from "lucide-react";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export default function ConsultsPage() {
  return (
    <PagePlaceholder
      icon={MessagesSquare}
      title="Consults"
      description="การปรึกษาแพทย์เฉพาะทาง (Consultation) ติดตามสถานะคำขอปรึกษาและการตอบกลับ"
    />
  );
}
