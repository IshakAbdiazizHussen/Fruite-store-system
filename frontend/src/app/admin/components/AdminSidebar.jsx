"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database, Dot, LayoutDashboard, MonitorSmartphone, Package, Settings2 } from "lucide-react";
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
    <aside className="w-64 min-h-screen bg-gradient-to-b from-green-700 via-green-800 to-green-900 text-white flex flex-col">
      <div className="px-6 py-8 flex items-center gap-4">
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-3 rounded-xl shadow-lg">
          <Package className="text-white" size={22} />
        </div>
        <div>
          <h1 className="text-lg font-semibold">{content.branding.sidebarTitle}</h1>
          <p className="text-sm text-green-200">Backend Administration</p>
        </div>
      </div>

      <div className="h-px bg-green-600 mx-6 mb-4" />

      <nav className="flex-1 space-y-2 px-4 py-5">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
                  : "text-green-100 hover:bg-green-700"
              }`}
            >
              <Icon size={20} />
              <span className="text-base font-medium">{link.label}</span>
              {isActive ? (
                <Dot className="absolute right-4 text-yellow-200" size={32} />
              ) : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
