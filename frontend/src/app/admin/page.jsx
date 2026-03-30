"use client";

import Link from "next/link";
import {
  FileText,
  LayoutDashboard,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";

function AdminCard({ label, description, href, icon: Icon, tone }) {
  const classes = {
    green: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100",
    blue: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-100",
    orange: "border-orange-200 bg-orange-50 text-orange-900 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-100",
    slate: "border-slate-200 bg-white text-slate-900 dark:border-white/10 dark:bg-slate-900/80 dark:text-white",
  };
  return (
    <Link href={href} className={`rounded-3xl border p-6 shadow-sm transition-transform hover:-translate-y-0.5 ${classes[tone]}`}>
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-white/70 p-3 dark:bg-white/10">
          <Icon className="h-5 w-5" />
        </div>
        <p className="text-lg font-semibold">{label}</p>
      </div>
      <p className="mt-4 text-sm opacity-75">{description}</p>
    </Link>
  );
}

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8 p-8">
      <section className="rounded-[32px] bg-gradient-to-r from-green-700 via-lime-500 to-emerald-700 px-8 py-10 text-white shadow-xl shadow-green-200 dark:shadow-none">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-green-50/85">Backend Administration</p>
        <h1 className="mt-4 text-4xl font-semibold">Choose a backend section to edit.</h1>
        <p className="mt-3 max-w-2xl text-sm text-green-50/90">
          This area is now for control only. Open a sidebar section to edit its own backend data without mixing it with the frontend dashboard screens.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminCard label="Dashboard" description="Return to the admin home and open any control area." href="/admin" icon={LayoutDashboard} tone="green" />
        <AdminCard label="Inventory" description="Edit products, stock levels, pricing, and expiry data." href="/admin/inventory" icon={Store} tone="green" />
        <AdminCard label="Sales" description="Record sales entries and manage backend revenue records." href="/admin/sales" icon={TrendingUp} tone="orange" />
        <AdminCard label="Orders" description="Create orders and update delivery workflow from admin." href="/admin/orders" icon={ShoppingCart} tone="blue" />
        <AdminCard label="Purchases" description="Manage supplier purchases and completion status." href="/admin/purchases" icon={ShoppingBag} tone="slate" />
        <AdminCard label="Suppliers" description="Maintain supplier contacts and reset supplier records." href="/admin/suppliers" icon={Users} tone="green" />
        <AdminCard label="Reports" description="Download backend CSV and JSON reports from one page." href="/admin/reports" icon={FileText} tone="blue" />
        <AdminCard label="Settings" description="Change backend-managed branding and login text." href="/admin/settings" icon={Settings} tone="orange" />
      </section>
    </div>
  );
}
