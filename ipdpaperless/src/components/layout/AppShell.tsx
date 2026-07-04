"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface PageMeta {
  title: string;
  subtitle?: string;
}

const PAGE_META: Record<string, PageMeta> = {
  "/dashboard": { title: "Dashboard", subtitle: "ภาพรวมโรงพยาบาล" },
  "/ward": { title: "Ward 5A", subtitle: "อายุรกรรมชาย 5A" },
  "/round": { title: "Round Mode", subtitle: "โหมดตรวจเยี่ยมผู้ป่วย" },
  "/tasks": { title: "Tasks", subtitle: "รายการงานที่ต้องทำ" },
  "/consults": { title: "Consults", subtitle: "การปรึกษาแพทย์เฉพาะทาง" },
  "/orders": { title: "Orders", subtitle: "คำสั่งการรักษา" },
  "/reports": { title: "Reports", subtitle: "รายงาน" },
  "/analytics": { title: "Analytics", subtitle: "การวิเคราะห์ข้อมูล" },
  "/alerts": { title: "Alerts", subtitle: "การแจ้งเตือน" },
  "/admin": { title: "Admin", subtitle: "ตั้งค่าระบบ" },
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const meta =
    PAGE_META[pathname] ??
    PAGE_META[`/${pathname.split("/")[1] ?? ""}`] ??
    ({ title: "IPDX" } as PageMeta);

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <Topbar
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setSidebarOpen((v) => !v)}
        />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
