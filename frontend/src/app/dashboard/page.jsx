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
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{content.dashboard.title}</h1>
        <p className="text-gray-500 text-sm mt-1">{content.dashboard.subtitle}</p>
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <InventoryPie />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <WeeklySalesChart />
        </div>
      </div>

      <StockTrend />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900">{content.dashboard.quickActionsTitle}</h3>
        <p className="text-sm text-gray-400 mt-0.5">{content.dashboard.quickActionsSubtitle}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {content.dashboard.actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={
                action.tone === "success"
                  ? "rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 hover:bg-green-100 transition-colors"
                  : action.tone === "info"
                    ? "rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                    : "rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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
