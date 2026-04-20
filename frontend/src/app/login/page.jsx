"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Copy, LockKeyhole, Mail, Store, UserRound } from "lucide-react";
import { loginAdmin } from "@/lib/authClient";
import { useFrontendContent } from "@/hooks/useFrontendContent";

const DEFAULT_ADMIN = {
  name: "Fruit Store Admin",
  email: "admin@fruitstore.com",
  password: "admin12345",
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { content } = useFrontendContent();
  const [showLocalCredentials, setShowLocalCredentials] = useState(false);
  const [form, setForm] = useState({
    email: DEFAULT_ADMIN.email,
    password: DEFAULT_ADMIN.password,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setShowLocalCredentials(["localhost", "127.0.0.1"].includes(window.location.hostname));
  }, []);

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

  async function copyCredentials() {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(
      `Email: ${DEFAULT_ADMIN.email}\nPassword: ${DEFAULT_ADMIN.password}`
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#ecfccb,_#f8fafc_40%,_#dcfce7_100%)] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-white/60 bg-white shadow-2xl shadow-green-100 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="hidden bg-gradient-to-br from-green-600 via-lime-500 to-emerald-700 p-10 text-white lg:block">
            <div className="flex items-center gap-3 text-lg font-semibold">
              <Store className="h-6 w-6" />
              {content.branding.appName}
            </div>
            <h1 className="mt-16 max-w-md text-5xl font-semibold leading-tight">
              {content.login.heroTitle}
            </h1>
            <p className="mt-6 max-w-md text-sm text-green-50/90">
              {content.login.heroDescription}
            </p>
          </section>

          <section className="p-8 sm:p-12">
            <div className="max-w-md">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-green-600">
                {content.login.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-gray-900">{content.login.title}</h2>
              <p className="mt-2 text-sm text-gray-500">
                {content.login.subtitle}
              </p>

              {showLocalCredentials ? (
                <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50/80 p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                        Default Local Admin
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-slate-900">
                        Sign in with the same backend credentials
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={copyCredentials}
                      className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-700">
                      <UserRound className="h-4 w-4 text-emerald-600" />
                      <span className="font-medium text-slate-500">Admin</span>
                      <span className="ml-auto font-semibold text-slate-900">{DEFAULT_ADMIN.name}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-700">
                      <Mail className="h-4 w-4 text-emerald-600" />
                      <span className="font-medium text-slate-500">Email</span>
                      <span className="ml-auto font-semibold text-slate-900">{DEFAULT_ADMIN.email}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-700">
                      <LockKeyhole className="h-4 w-4 text-emerald-600" />
                      <span className="font-medium text-slate-500">Password</span>
                      <span className="ml-auto font-semibold text-slate-900">{DEFAULT_ADMIN.password}</span>
                    </div>
                  </div>
                </div>
              ) : null}

              <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-gray-700">Email</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      className="w-full border-0 bg-transparent outline-none"
                      value={form.email}
                      onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-gray-700">Password</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3">
                    <LockKeyhole className="h-4 w-4 text-gray-400" />
                    <input
                      type="password"
                      className="w-full border-0 bg-transparent outline-none"
                      value={form.password}
                      onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                    />
                  </div>
                </label>

                {error ? <p className="text-sm text-red-600">{error}</p> : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
