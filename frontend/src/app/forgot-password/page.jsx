"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Mail, Moon, Store, Sun } from "lucide-react";

import { requestPasswordReset } from "@/lib/authClient";
import { useFrontendContent } from "@/hooks/useFrontendContent";
import { applyTheme, getInitialTheme, setTheme as persistTheme, subscribeToTheme } from "@/lib/theme";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

export default function ForgotPasswordPage() {
  const { content } = useFrontendContent();
  const [theme, setTheme] = useState("light");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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

  const canSubmit = useMemo(() => !isSubmitting, [isSubmitting]);

  async function handleSubmit(event) {
    event.preventDefault();
    const normalizedEmail = email.trim();

    setError("");
    setSuccess("");

    if (!normalizedEmail) {
      setError("Email is required.");
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await requestPasswordReset({ email: normalizedEmail });
      setSuccess(
        result?.message ||
          "If an account exists for this email, a reset link or OTP has been sent."
      );
    } catch (submitError) {
      setError(submitError.message || "Unable to send a reset link right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-green-50 to-emerald-100/60 px-4 py-5 dark:bg-[linear-gradient(180deg,#07110c_0%,#0c1812_48%,#10231a_100%)] sm:px-6 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-7xl items-center justify-center sm:min-h-[calc(100vh-4rem)]">
        <div className="relative grid w-full overflow-hidden rounded-[32px] border border-emerald-100 bg-white shadow-[0_24px_80px_rgba(22,101,52,0.12)] dark:border-emerald-500/25 dark:bg-[#09110d] dark:shadow-[0_28px_90px_rgba(0,0,0,0.45)] lg:min-h-[560px] lg:grid-cols-[1.2fr_1fr]">
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

          <section className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50 to-green-100/80 p-6 sm:p-8 lg:p-10 dark:bg-[linear-gradient(145deg,#0d1712_0%,#102019_55%,#163524_100%)]">
            <div className="absolute inset-x-6 top-4 h-24 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-500/10 sm:inset-x-10" />
            <div className="absolute left-8 top-20 h-32 w-32 rounded-full bg-white/55 blur-3xl dark:bg-white/5" />
            <div className="absolute right-8 bottom-12 h-48 w-48 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-400/10" />

            <div className="relative flex h-full flex-col">
              <div className="inline-flex items-center gap-3 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm backdrop-blur dark:border-emerald-500/25 dark:bg-white/5 dark:text-emerald-300">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white shadow-[0_10px_24px_rgba(22,163,74,0.25)] dark:bg-emerald-500">
                  <Store className="h-5 w-5" />
                </span>
                {content.branding.appName}
              </div>

              <div className="relative mt-6 max-w-[32rem] rounded-[30px] bg-[linear-gradient(90deg,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0.82)_58%,rgba(255,255,255,0.16)_100%)] p-3 sm:p-4 dark:bg-[linear-gradient(90deg,rgba(9,17,13,0.84)_0%,rgba(9,17,13,0.80)_58%,rgba(9,17,13,0.12)_100%)]">
                <div className="relative">
                  <h1 className="max-w-lg text-4xl font-semibold leading-[1.08] text-slate-900 dark:text-white sm:text-[3.4rem]">
                    Secure account recovery
                  </h1>
                  <p className="mt-4 max-w-md text-sm leading-6 text-gray-500 dark:text-slate-400 sm:text-base">
                    Request a one-time password reset link and get back to your admin dashboard safely.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="p-6 pt-[4.5rem] sm:p-8 sm:pt-[5.5rem] lg:p-10 lg:pt-[5.5rem]">
            <div className="mx-auto max-w-md">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-300">
                Account Recovery
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-gray-900 dark:text-white sm:text-4xl">
                Forgot Password
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-slate-400">
                Enter your email address and we&apos;ll send you a password reset link.
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit} autoComplete="off">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-200">
                    Email
                  </span>
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3.5 shadow-sm shadow-emerald-100/40 transition focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-100 dark:border-emerald-500/20 dark:bg-[#101915] dark:shadow-none dark:focus-within:border-emerald-400/70 dark:focus-within:ring-emerald-500/15">
                    <Mail className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                    <input
                      type="email"
                      autoComplete="email"
                      className="w-full border-0 bg-transparent text-gray-900 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-slate-500"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                </label>

                {error ? <p className="text-sm text-red-600">{error}</p> : null}
                {success ? <p className="text-sm text-emerald-600 dark:text-emerald-300">{success}</p> : null}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(22,163,74,0.22)] transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-emerald-500 dark:hover:bg-emerald-400"
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>

                <div className="flex justify-start">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 transition-colors duration-200 hover:text-emerald-700 hover:underline dark:text-emerald-300 dark:hover:text-emerald-200"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </Link>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
