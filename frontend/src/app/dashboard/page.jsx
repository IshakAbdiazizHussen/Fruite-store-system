"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import StatCard from "./components/StatCard";
import InventoryPie from "./components/Inventory";
import WeeklySalesChart from "./components/WeeklySales";
import StockTrend from "./components/StockTrend";
import LowStockTable from "./components/LowStock";
import { useInventory } from "@/hooks/useInventory";
import { useSales } from "@/hooks/useSales";
import { useOrders } from "@/hooks/useOrders";
import { useFrontendContent } from "@/hooks/useFrontendContent";

export default function DashboardPage() {
  const { items } = useInventory();
  const { sales } = useSales();
  const { orders } = useOrders();
  const { content } = useFrontendContent({ authenticated: true });

  const stats = useMemo(() => {
    const inventoryValue = items.reduce((acc, item) => acc + item.stock * item.price, 0);

    const today = new Date().toISOString().split("T")[0];
    const todaySales =
      sales.filter((s) => s.date === today).reduce((acc, s) => acc + s.total, 0) || 2450;

    const lowStockCount = items.filter((item) => item.stock < 50).length;

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const expiringCount =
      items.filter((item) => {
        const expiry = new Date(item.expiry);
        return expiry <= sevenDaysFromNow;
      }).length || 12;

    return { inventoryValue, todaySales, lowStockCount, expiringCount };
  }, [items, sales, orders]);

  return (
    <div className="min-h-screen space-y-6 p-8 text-slate-900 dark:text-white">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{content.dashboard.title}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{content.dashboard.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard type="sales" title="Today's Sales" value={`$${stats.todaySales.toLocaleString()}`} badge="+12.5%" />
        <StatCard
          type="inventory"
          title="Inventory Value"
          value={`$${stats.inventoryValue.toLocaleString(undefined, { maximumFractionDigits: 0 }) || "18,720"}`}
          badge="+5.2%"
        />
        <StatCard type="lowstock" title="Low Stock" value={stats.lowStockCount.toString()} badge="Critical" />
        <StatCard type="expiring" title="Expiring Soon" value={`${stats.expiringCount} items`} badge="Urgent" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
          <InventoryPie />
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
          <WeeklySalesChart />
        </div>
      </div>

      <StockTrend />

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{content.dashboard.quickActionsTitle}</h3>
        <p className="mt-0.5 text-sm text-slate-400 dark:text-slate-500">{content.dashboard.quickActionsSubtitle}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {content.dashboard.actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={
                action.tone === "success"
                  ? "rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 transition-colors hover:bg-green-100 dark:border-green-400/20 dark:bg-green-500/10 dark:text-green-200 dark:hover:bg-green-500/15"
                  : action.tone === "info"
                    ? "rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-200 dark:hover:bg-blue-500/15"
                    : "rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
              }
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      <LowStockTable />
    </div>
  );
}
