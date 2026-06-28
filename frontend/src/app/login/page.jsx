"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole, Mail, Moon, Store, Sun } from "lucide-react";
import { loginAdmin } from "@/lib/authClient";
import { useFrontendContent } from "@/hooks/useFrontendContent";
import { applyTheme, getInitialTheme, setTheme as persistTheme, subscribeToTheme } from "@/lib/theme";

const DEFAULT_ADMIN = {
  email: "admin@fruitstore.com",
  password: "admin12345",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { content } = useFrontendContent();
  const [theme, setTheme] = useState("light");
  const [form, setForm] = useState({
    email: DEFAULT_ADMIN.email,
    password: DEFAULT_ADMIN.password,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);

    const unsubscribeTheme = subscribeToTheme((nextTheme) => {
      setTheme(nextTheme);
      applyTheme(nextTheme);
    });

    return () => {
      unsubscribeTheme();
    };
  }, []);

  function handleThemeToggle() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    persistTheme(nextTheme);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await loginAdmin(form);
      const nextPath = searchParams.get("next");
      router.replace(nextPath || "/dashboard");
    } catch (submitError) {
      setError(submitError.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative grid w-full overflow-hidden rounded-[32px] border border-emerald-100 bg-white shadow-[0_24px_80px_rgba(22,101,52,0.12)] dark:border-emerald-500/25 dark:bg-[#09110d] dark:shadow-[0_28px_90px_rgba(0,0,0,0.45)] lg:grid-cols-[1.05fr_0.95fr]">
      <div className="absolute right-5 top-5 z-20 sm:right-6 sm:top-6">
        <button
          type="button"
          onClick={handleThemeToggle}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white/90 p-1 text-slate-600 shadow-lg shadow-emerald-100/60 backdrop-blur transition-all hover:border-emerald-300 hover:bg-white dark:border-emerald-500/25 dark:bg-[#101915]/90 dark:text-slate-200 dark:shadow-[0_12px_30px_rgba(0,0,0,0.32)] dark:hover:border-emerald-400/40 dark:hover:bg-[#15211b]"
        >
          <span className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${theme === "light" ? "bg-emerald-600 text-white shadow-[0_10px_24px_rgba(22,163,74,0.28)]" : "text-slate-400 dark:text-slate-300"}`}>
            <Sun className="h-4 w-4" />
          </span>
          <span className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${theme === "dark" ? "bg-emerald-500 text-white shadow-[0_10px_24px_rgba(16,185,129,0.24)]" : "text-slate-400"}`}>
            <Moon className="h-4 w-4" />
          </span>
        </button>
      </div>

      <section className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50 to-green-100/80 p-8 sm:p-10 lg:p-12 dark:bg-[linear-gradient(145deg,#0d1712_0%,#102019_55%,#163524_100%)]">
        <div className="absolute inset-x-6 top-6 h-28 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-500/10 sm:inset-x-10" />
        <div className="absolute -bottom-12 right-0 h-40 w-40 rounded-full bg-green-200/40 blur-3xl dark:bg-green-400/10" />

        <div className="relative">
          <div className="inline-flex items-center gap-3 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm backdrop-blur dark:border-emerald-500/25 dark:bg-white/5 dark:text-emerald-300">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white shadow-[0_10px_24px_rgba(22,163,74,0.25)] dark:bg-emerald-500">
              <Store className="h-5 w-5" />
            </span>
            {content.branding.appName}
          </div>

          <h1 className="mt-10 max-w-lg text-4xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-5xl">
            {content.login.heroTitle}
          </h1>
          <p className="mt-5 max-w-md text-sm leading-6 text-gray-500 dark:text-slate-400 sm:text-base">
            {content.login.heroDescription}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-emerald-500/20 dark:bg-white/6 dark:shadow-none">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">Inventory</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">Track stock, purchases, and supplier updates from one place.</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-emerald-500/20 dark:bg-white/6 dark:shadow-none">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">Operations</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">Review orders, reports, and settings with a cleaner admin flow.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="p-8 pt-20 sm:p-10 sm:pt-24 lg:p-12 lg:pt-24">
        <div className="mx-auto max-w-md">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-300">
            {content.login.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-gray-900 dark:text-white sm:text-4xl">{content.login.title}</h2>
          <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-slate-400">
            Sign in to continue to your dashboard.
          </p>

          <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-200">Email</span>
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3.5 shadow-sm shadow-emerald-100/40 transition focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-100 dark:border-emerald-500/20 dark:bg-[#101915] dark:shadow-none dark:focus-within:border-emerald-400/70 dark:focus-within:ring-emerald-500/15">
                <Mail className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                <input
                  type="email"
                  className="w-full border-0 bg-transparent text-gray-900 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-slate-500"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-200">Password</span>
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3.5 shadow-sm shadow-emerald-100/40 transition focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-100 dark:border-emerald-500/20 dark:bg-[#101915] dark:shadow-none dark:focus-within:border-emerald-400/70 dark:focus-within:ring-emerald-500/15">
                <LockKeyhole className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                <input
                  type="password"
                  className="w-full border-0 bg-transparent text-gray-900 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-slate-500"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                />
              </div>
            </label>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(22,163,74,0.22)] transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-green-50 to-emerald-100/60 px-4 py-6 dark:bg-[linear-gradient(180deg,#07110c_0%,#0c1812_48%,#10231a_100%)] sm:px-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center justify-center sm:min-h-[calc(100vh-5rem)]">
        <Suspense fallback={<div className="h-[720px] w-full rounded-[32px] border border-emerald-100 bg-white shadow-[0_24px_80px_rgba(22,101,52,0.12)] dark:border-emerald-500/25 dark:bg-[#09110d] dark:shadow-[0_28px_90px_rgba(0,0,0,0.45)]" />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
