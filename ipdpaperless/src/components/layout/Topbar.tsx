"use client";

import { Bell, Menu, RefreshCw, Search } from "lucide-react";
import { formatThaiDate, formatTime12h } from "@/lib/datetime";
import { useNowBucket } from "@/lib/useNow";

interface TopbarProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
}

export default function Topbar({ title, subtitle, onMenuClick }: TopbarProps) {
  const bucket = useNowBucket();
  const now = bucket === null ? null : new Date();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
        aria-label="เปิดเมนู"
      >
        <Menu className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={onMenuClick}
        className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:flex"
        aria-label="สลับเมนู"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Title */}
      <div className="min-w-0 leading-tight">
        <h1 className="truncate text-lg font-bold text-slate-800">{title}</h1>
        {subtitle ? (
          <p className="truncate text-xs text-slate-500">{subtitle}</p>
        ) : null}
      </div>

      {/* Search */}
      <div className="ml-auto hidden max-w-md flex-1 md:block">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search (HN, Name, Bed, AN)"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="ml-auto flex items-center gap-1 md:ml-0">
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          aria-label="การแจ้งเตือน"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            12
          </span>
        </button>

        <div className="mx-2 hidden text-right leading-tight sm:block">
          <p className="text-xs font-semibold text-slate-700">
            {now ? formatThaiDate(now) : "—"}
          </p>
          <p className="text-[11px] text-slate-500">
            {now ? formatTime12h(now) : "—"}
          </p>
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          aria-label="รีเฟรช"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
