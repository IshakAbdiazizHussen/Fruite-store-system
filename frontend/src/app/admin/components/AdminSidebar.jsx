"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database, LayoutDashboard, MonitorSmartphone, Settings2 } from "lucide-react";
import { useFrontendContent } from "@/hooks/useFrontendContent";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/content", label: "Frontend Content", icon: MonitorSmartphone },
  { href: "/admin/data", label: "Data Control", icon: Database },
  { href: "/dashboard/settings", label: "System Settings", icon: Settings2 },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { content } = useFrontendContent({ authenticated: true });

  return (
    <aside className="flex min-h-screen w-72 flex-col bg-slate-950 text-white">
      <div className="border-b border-white/10 px-6 py-7">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Backend</p>
        <h1 className="mt-3 text-2xl font-semibold">{content.branding.appName}</h1>
        <p className="mt-1 text-sm text-slate-400">Admin panel for managing live data and visible frontend content.</p>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-5">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors ${
                isActive
                  ? "bg-emerald-500 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
