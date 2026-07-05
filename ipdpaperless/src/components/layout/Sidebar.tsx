"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LogOut } from "lucide-react";
import { NAV_ITEMS } from "./nav";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-30 bg-slate-900/50 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-gradient-to-b from-[#182642] to-[#0f1c33] text-slate-200 shadow-xl transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg">
            <Activity className="h-6 w-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-wide text-white">
                IPDX
              </span>
              <span className="rounded bg-sky-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-sky-300">
                HIS
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Smart Hospital Platform
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="mt-2 flex-1 space-y-1 overflow-y-auto px-3">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon
                  className={`h-[18px] w-[18px] ${
                    active
                      ? "text-white"
                      : "text-slate-400 group-hover:text-white"
                  }`}
                />
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* User card */}
        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-sm font-semibold text-white">
                DN
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0f1c33] bg-emerald-400" />
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-semibold text-white">
                Dr.Narin
              </p>
              <p className="text-[11px] text-slate-400">Attending</p>
            </div>
            <span className="text-[10px] font-medium text-emerald-400">
              Online
            </span>
          </div>

          <button
            type="button"
            className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
