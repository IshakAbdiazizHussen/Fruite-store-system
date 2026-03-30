"use client";

import {
  Package,
  LayoutDashboard,
  Box,
  TrendingUp,
  ShoppingCart,
  ShoppingBag,
  Users,
  FileText,
  Settings,
  Dot,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFrontendContent } from "@/hooks/useFrontendContent";

const menu = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Inventory", icon: Box, href: "/dashboard/inventory" },
  { label: "Sales", icon: TrendingUp, href: "/dashboard/sales" },
  { label: "Orders", icon: ShoppingCart, href: "/dashboard/orders" },
  { label: "Purchases", icon: ShoppingBag, href: "/dashboard/purchases" },
  { label: "Suppliers", icon: Users, href: "/dashboard/suppliers" },
  { label: "Reports", icon: FileText, href: "/dashboard/reports" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { content } = useFrontendContent({ authenticated: true });

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-green-700 via-green-800 to-green-900 text-white flex flex-col">
      {/* LOGO */}
      <div className="px-6 py-8 flex items-center gap-4">
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-3 rounded-xl shadow-lg">
          <Package className="text-white" size={22} />
        </div>
        <div>
          <h1 className="text-lg font-semibold">{content.branding.sidebarTitle}</h1>
          <p className="text-sm text-green-200">{content.branding.sidebarSubtitle}</p>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="h-px bg-green-600 mx-6 mb-4" />

      {/* MENU */}
      <nav className="flex-1 px-4 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
                  : "text-green-100 hover:bg-green-700"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={20} />
              <span className="text-base font-medium">{item.label}</span>
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
