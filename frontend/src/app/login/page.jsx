"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, Store } from "lucide-react";
import { loginAdmin } from "@/lib/authClient";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "admin@fruitstore.com",
    password: "admin12345",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await loginAdmin(form);
      router.replace("/dashboard");
    } catch (submitError) {
      setError(submitError.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#ecfccb,_#f8fafc_40%,_#dcfce7_100%)] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-white/60 bg-white shadow-2xl shadow-green-100 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="hidden bg-gradient-to-br from-green-600 via-lime-500 to-emerald-700 p-10 text-white lg:block">
            <div className="flex items-center gap-3 text-lg font-semibold">
              <Store className="h-6 w-6" />
              Fruit Store CMS
            </div>
            <h1 className="mt-16 max-w-md text-5xl font-semibold leading-tight">
              Control your store from one secure dashboard.
            </h1>
            <p className="mt-6 max-w-md text-sm text-green-50/90">
              Inventory, orders, purchases, suppliers, reports, and settings now run through your backend.
            </p>
          </section>

          <section className="p-8 sm:p-12">
            <div className="max-w-md">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-green-600">
                Admin Login
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-gray-900">Sign in to CMS</h2>
              <p className="mt-2 text-sm text-gray-500">
                Use the admin email and password you configured in `backend/.env`.
              </p>

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
