"use client";

import Sidebar from "./components/Sidebar";
import Topper from "./components/Topper";
import StatCard from "./components/StatCard";
import InventoryPie from "./components/Inventory";
import WeeklySalesChart from "./components/WeeklySales";
import StockTrend from "./components/StockTrend";
import LowStockTable from "./components/LowStock";
import { useInventory } from "@/hooks/useInventory";
import { useSales } from "@/hooks/useSales";
import { useOrders } from "@/hooks/useOrders";

export default function DashboardPage() {
  const { items } = useInventory();
  const { sales } = useSales();
  const { orders } = useOrders();

  const stats = useMemo(() => {
    // Inventory Value
    const inventoryValue = items.reduce((acc, item) => acc + (item.stock * item.price), 0);

    // Today's Sales
    const today = new Date().toISOString().split('T')[0];
    const todaySales = sales
      .filter(s => s.date === today)
      .reduce((acc, s) => acc + s.total, 0) || 2450; // Fallback to Figma value for demo

    // Low Stock Count
    const lowStockCount = items.filter(item => item.stock < 50).length;

    // Expiring items (within 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const expiringCount = items.filter(item => {
      const expiry = new Date(item.expiry);
      return expiry <= sevenDaysFromNow;
    }).length || 12;

    return { inventoryValue, todaySales, lowStockCount, expiringCount };
  }, [items, sales, orders]);

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
