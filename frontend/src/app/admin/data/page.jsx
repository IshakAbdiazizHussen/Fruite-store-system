import Link from "next/link";
import {
  FileText,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";

const sections = [
  {
    href: "/admin/inventory",
    title: "Inventory",
    description: "Add products, update stock, and remove old inventory items.",
    icon: Store,
  },
  {
    href: "/admin/sales",
    title: "Sales",
    description: "Record sales entries and keep revenue data updated.",
    icon: TrendingUp,
  },
  {
    href: "/admin/orders",
    title: "Orders",
    description: "Create orders and manage their delivery status.",
    icon: ShoppingCart,
  },
  {
    href: "/admin/purchases",
    title: "Purchases",
    description: "Track supplier purchases and mark completion status.",
    icon: ShoppingBag,
  },
  {
    href: "/admin/suppliers",
    title: "Suppliers",
    description: "Maintain supplier records and contact details.",
    icon: Users,
  },
  {
    href: "/admin/reports",
    title: "Reports",
    description: "Download CSV and JSON reports from backend data.",
    icon: FileText,
  },
  {
    href: "/admin/settings",
    title: "Settings",
    description: "Edit backend-managed branding and login text.",
    icon: Settings,
  },
];

export default function AdminDataPage() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600 dark:text-emerald-300">Backend Control</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Select a backend section</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Each section now has its own admin page, so you only edit the data for that sidebar item.
        </p>
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-0.5 hover:border-emerald-200 dark:border-white/10 dark:bg-slate-900/80"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{section.title}</h2>
              </div>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{section.description}</p>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
