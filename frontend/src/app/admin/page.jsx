"use client";

import Link from "next/link";
import { useInventory } from "@/hooks/useInventory";
import { useOrders } from "@/hooks/useOrders";
import { usePurchases } from "@/hooks/usePurchases";
import { useSales } from "@/hooks/useSales";
import { useSuppliers } from "@/hooks/useSuppliers";

function AdminCard({ label, value, href, tone }) {
  const classes =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100"
      : tone === "info"
        ? "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-100"
        : "border-slate-200 bg-white text-slate-900 dark:border-white/10 dark:bg-slate-900/80 dark:text-white";

  return (
    <Link href={href} className={`rounded-3xl border p-6 shadow-sm transition-transform hover:-translate-y-0.5 ${classes}`}>
      <p className="text-sm font-medium opacity-70">{label}</p>
      <p className="mt-3 text-4xl font-semibold">{value}</p>
    </Link>
  );
}

export default function AdminOverviewPage() {
  const { items } = useInventory();
  const { orders } = useOrders();
  const { purchases } = usePurchases();
  const { sales } = useSales();
  const { suppliers } = useSuppliers();

  return (
    <div className="space-y-8 p-8">
      <section className="rounded-[32px] bg-gradient-to-r from-green-700 via-lime-500 to-emerald-700 px-8 py-10 text-white shadow-xl shadow-green-200 dark:shadow-none">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-green-50/85">Separate Backend Section</p>
        <h1 className="mt-4 text-4xl font-semibold">Admin control for your live store data.</h1>
        <p className="mt-3 max-w-2xl text-sm text-green-50/90">
          This panel is separate from the dashboard and focused only on managing the backend-connected data and frontend content.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <AdminCard label="Inventory Items" value={items.length} href="/dashboard/inventory" tone="success" />
        <AdminCard label="Orders" value={orders.length} href="/dashboard/orders" tone="info" />
        <AdminCard label="Purchases" value={purchases.length} href="/dashboard/purchases" tone="neutral" />
        <AdminCard label="Sales Records" value={sales.length} href="/dashboard/sales" tone="success" />
        <AdminCard label="Suppliers" value={suppliers.length} href="/dashboard/suppliers" tone="info" />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Link href="/admin/content" className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:border-emerald-200 dark:border-white/10 dark:bg-slate-900/80">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600 dark:text-emerald-300">Frontend Content</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">Edit visible frontend information</h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Update login page text, sidebar branding, dashboard titles, and quick action labels from the backend.
          </p>
        </Link>

        <Link href="/admin/data" className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:border-blue-200 dark:border-white/10 dark:bg-slate-900/80">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600 dark:text-blue-300">Data Control</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">Open data management tools</h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Jump into inventory, orders, purchases, suppliers, and settings management from one backend-focused page.
          </p>
        </Link>
      </section>
    </div>
  );
}
