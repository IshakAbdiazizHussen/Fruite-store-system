"use client";

import Sidebar from "./components/Sidebar";
import Topper from "./components/Topper";
import StatCard from "./components/StatCard";
import Inventory from "./components/Inventory";
import WeeklySales from "./components/WeeklySales";
import StockTrend from "./components/StockTrend";
import LowStock from "./components/LowStock";

export default function DashboardPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <Topper />

        {/* PAGE CONTENT */}
        <div className="p-6 space-y-6">

          {/* STATS */}
          <div className="grid grid-cols-4 gap-6">
            <StatCard title="Today's Sales" value="$2,450" badge="+12.5%" />
            <StatCard title="Inventory Value" value="$18,720" badge="+5.2%" />
            <StatCard title="Low Stock" value="7" />
            <StatCard title="Expiring Soon" value="12 items" />
          </div>

          {/* PIE + BAR */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl">
              <h3 className="font-semibold mb-4">Inventory by Category</h3>
              <Inventory />
            </div>

            <div className="bg-white p-6 rounded-xl">
              <h3 className="font-semibold mb-4">Weekly Sales</h3>
              <WeeklySales />
            </div>
          </div>

          {/* LINE CHART (FULL WIDTH) */}
          <StockTrend />

          {/* TABLE */}
          <LowStock />

        </div>
      </main>
    </div>
  );
}
