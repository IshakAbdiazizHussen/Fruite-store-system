import Link from "next/link";
import { ArrowRight, ShieldCheck, ShoppingBasket, Store, TrendingUp } from "lucide-react";

const quickLinks = [
  {
    title: "Admin Login",
    description: "Open the backend control panel to manage your store data.",
    href: "/login",
    icon: ShieldCheck,
    tone: "emerald",
  },
  {
    title: "Inventory System",
    description: "Track fruits, stock levels, pricing, and expiry information.",
    href: "/login",
    icon: Store,
    tone: "amber",
  },
  {
    title: "Sales Overview",
    description: "Review sales, reports, purchases, and supplier performance.",
    href: "/login",
    icon: TrendingUp,
    tone: "sky",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#ecfccb_0%,_#f8fafc_36%,_#dcfce7_100%)] text-slate-900">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-500 text-white shadow-lg shadow-emerald-200">
              <ShoppingBasket className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold">Fresh Harvest</p>
              <p className="text-sm text-slate-500">Fruit Store System</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
            >
              Admin Login
            </Link>
          </div>
        </header>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm backdrop-blur">
              Frontend landing page
            </div>

            <h1 className="mt-6 text-5xl font-semibold leading-[1.04] tracking-tight text-slate-950 sm:text-6xl">
              Welcome first. Manage the backend only when you choose to.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Your project now opens on a clean frontend screen instead of jumping straight into the backend admin.
              When you need the management area, you can open it separately from here.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700"
              >
                Open Admin Panel
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                Open Dashboard
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur">
                <p className="text-3xl font-semibold text-slate-900">24/7</p>
                <p className="mt-2 text-sm text-slate-500">Frontend landing ready before admin access</p>
              </div>
              <div className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur">
                <p className="text-3xl font-semibold text-slate-900">Atlas</p>
                <p className="mt-2 text-sm text-slate-500">MongoDB cluster support already connected</p>
              </div>
              <div className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur">
                <p className="text-3xl font-semibold text-slate-900">CMS</p>
                <p className="mt-2 text-sm text-slate-500">Inventory, orders, reports, settings, and suppliers</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-emerald-200/60 via-lime-100/40 to-white blur-3xl" />
            <div className="relative overflow-hidden rounded-[36px] border border-white/70 bg-white/85 p-6 shadow-2xl shadow-emerald-100 backdrop-blur">
              <div className="rounded-[28px] bg-[linear-gradient(160deg,#14532d_0%,#22c55e_45%,#f0fdf4_100%)] p-6 text-white">
                <p className="text-sm uppercase tracking-[0.28em] text-emerald-50/90">Store Preview</p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight">
                  Fresh fruit operations in one modern system.
                </h2>
                <p className="mt-4 text-sm leading-7 text-emerald-50/90">
                  Start from the frontend welcome page, then move into backend admin only when you want to manage the store.
                </p>
              </div>

              <div className="mt-6 grid gap-4">
                {quickLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="flex items-start gap-4 rounded-[28px] border border-slate-200 bg-slate-50/80 p-5 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white"
                    >
                      <div
                        className={
                          item.tone === "amber"
                            ? "flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700"
                            : item.tone === "sky"
                              ? "flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700"
                              : "flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"
                        }
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-base font-semibold text-slate-900">{item.title}</p>
                          <ArrowRight className="h-4 w-4 text-slate-400" />
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
