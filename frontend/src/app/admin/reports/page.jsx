"use client";

import { useMemo } from "react";
import { Download, FileSpreadsheet, PackageCheck } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { usePurchases } from "@/hooks/usePurchases";
import { useSales } from "@/hooks/useSales";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useInventory } from "@/hooks/useInventory";

function downloadFile(filename, content, type = "application/json") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function AdminReportsPage() {
  const { items } = useInventory();
  const { orders } = useOrders();
  const { purchases } = usePurchases();
  const { sales, analytics } = useSales();
  const { suppliers } = useSuppliers();

  const summary = useMemo(() => {
    const deliveredOrders = orders.filter((order) => order.status === "Delivered").length;
    const totalSales = sales.reduce((sum, sale) => sum + Number(sale.total || 0), 0);
    const totalPurchases = purchases.reduce((sum, purchase) => sum + Number(purchase.amount || 0), 0);

    return {
      inventoryItems: items.length,
      orders: orders.length,
      deliveredOrders,
      purchases: purchases.length,
      sales: sales.length,
      suppliers: suppliers.length,
      totalSales,
      totalPurchases,
      analytics,
    };
  }, [analytics, items, orders, purchases, sales, suppliers]);

  function exportJson() {
    downloadFile(
      `backend-report-${Date.now()}.json`,
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          summary,
          items,
          orders,
          purchases,
          sales,
          suppliers,
        },
        null,
        2,
      ),
    );
  }

  function exportCsv() {
    const rows = [
      ["Metric", "Value"],
      ["Inventory Items", summary.inventoryItems],
      ["Orders", summary.orders],
      ["Delivered Orders", summary.deliveredOrders],
      ["Purchases", summary.purchases],
      ["Sales", summary.sales],
      ["Suppliers", summary.suppliers],
      ["Total Sales", summary.totalSales],
      ["Total Purchases", summary.totalPurchases],
    ];
    const csv = rows.map((row) => row.map((col) => `"${String(col).replaceAll('"', '""')}"`).join(",")).join("\n");
    downloadFile(`backend-report-${Date.now()}.csv`, csv, "text/csv;charset=utf-8");
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600 dark:text-emerald-300">Reports Control</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Export backend reports</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Generate downloadable backend summaries without leaving the admin control area.
        </p>
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
          <p className="text-sm text-slate-500 dark:text-slate-400">Inventory Items</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{summary.inventoryItems}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
          <p className="text-sm text-slate-500 dark:text-slate-400">Orders</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{summary.orders}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
          <p className="text-sm text-slate-500 dark:text-slate-400">Sales Total</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">${summary.totalSales.toFixed(2)}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
          <p className="text-sm text-slate-500 dark:text-slate-400">Purchases Total</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">${summary.totalPurchases.toFixed(2)}</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">CSV export</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Download a quick business summary for reporting.</p>
            </div>
          </div>
          <button onClick={exportCsv} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
            <Download className="h-4 w-4" />
            Download CSV
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-orange-100 p-3 text-orange-700 dark:bg-orange-500/10 dark:text-orange-200">
              <PackageCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">JSON backup</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Download all backend records in one structured file.</p>
            </div>
          </div>
          <button onClick={exportJson} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600">
            <Download className="h-4 w-4" />
            Download JSON
          </button>
        </div>
      </section>
    </div>
  );
}
