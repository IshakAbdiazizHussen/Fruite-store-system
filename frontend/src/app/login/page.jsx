"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole, Mail, Moon, Store, Sun, UserRound } from "lucide-react";

import { loginAdmin, registerAdmin } from "@/lib/authClient";
import { getBackendOrigin } from "@/lib/apiClient";
import { useFrontendContent } from "@/hooks/useFrontendContent";
import { applyTheme, getInitialTheme, setTheme as persistTheme, subscribeToTheme } from "@/lib/theme";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function AuthInput({ icon: Icon, type = "text", autoComplete = "off", value, onChange }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3.5 shadow-sm shadow-emerald-100/40 transition focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-100 dark:border-emerald-500/20 dark:bg-[#101915] dark:shadow-none dark:focus-within:border-emerald-400/70 dark:focus-within:ring-emerald-500/15">
      <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
      <input
        type={type}
        autoComplete={autoComplete}
        className="w-full border-0 bg-transparent text-gray-900 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-slate-500"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.72-.06-1.25-.19-1.8H12v3.4h5.52c-.11.84-.7 2.1-2.02 2.95l-.02.11 2.73 2.11.19.02c1.77-1.63 3.2-4.03 3.2-6.79Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.97-.89 6.62-2.42l-3.15-2.44c-.84.59-1.97 1-3.47 1-2.65 0-4.9-1.73-5.71-4.13l-.1.01-2.84 2.19-.03.1C4.96 19.55 8.2 22 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.29 14.01A5.92 5.92 0 0 1 5.97 12c0-.69.12-1.35.31-1.99l-.01-.13-2.88-2.22-.09.04A9.95 9.95 0 0 0 2 12c0 1.59.38 3.09 1.3 4.3l2.99-2.29Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.86c1.89 0 3.16.81 3.88 1.48l2.83-2.76C16.96 2.98 14.7 2 12 2 8.2 2 4.96 4.45 3.3 7.7l2.98 2.3C7.1 7.59 9.35 5.86 12 5.86Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M16.7 12.78c.02 2.3 2.01 3.06 2.03 3.07-.02.06-.31 1.07-1.02 2.11-.61.9-1.25 1.8-2.25 1.81-.98.02-1.29-.58-2.41-.58-1.12 0-1.46.56-2.39.6-.96.04-1.69-.96-2.31-1.86-1.27-1.84-2.24-5.18-.94-7.44.65-1.12 1.81-1.83 3.06-1.85.95-.02 1.84.64 2.41.64.57 0 1.65-.79 2.79-.67.48.02 1.82.19 2.69 1.47-.07.04-1.61.94-1.59 2.8ZM14.76 4.73c.51-.62.85-1.48.76-2.33-.73.03-1.62.49-2.14 1.11-.47.54-.88 1.42-.77 2.25.82.06 1.65-.42 2.15-1.03Z" />
    </svg>
  );
}

function SocialButton({ href, label, icon: Icon, className = "" }) {
  return (
    <a
      href={href}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm shadow-emerald-100/40 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-white/10 dark:bg-[#101915] dark:text-slate-100 dark:shadow-none dark:hover:border-emerald-400/40 dark:hover:bg-[#14211b] ${className}`}
    >
      <Icon />
      <span>{label}</span>
    </a>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { content } = useFrontendContent();
  const [theme, setTheme] = useState("light");
  const [mode, setMode] = useState("signin");
  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  });
  const [signUpForm, setSignUpForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [signInError, setSignInError] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const oauthNextPath = searchParams.get("next") || "/dashboard";

  useEffect(() => {
    setSignInForm({
      email: "",
      password: "",
    });
    setSignUpForm({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

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

  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError) {
      setSignInError(oauthError);
      setMode("signin");
    }
  }, [searchParams]);

  function handleThemeToggle() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    persistTheme(nextTheme);
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setSignInError("");
    setSignUpError("");
    if (nextMode === "signup") {
      setSignUpSuccess("");
    }
  }

  async function handleSignInSubmit(event) {
    event.preventDefault();
    setSignInError("");
    setIsSigningIn(true);

    try {
      await loginAdmin(signInForm);
      const nextPath = searchParams.get("next");
      router.replace(nextPath || "/dashboard");
    } catch (submitError) {
      setSignInError(submitError.message || "Invalid email or password.");
    } finally {
      setIsSigningIn(false);
    }
  }

  async function handleSignUpSubmit(event) {
    event.preventDefault();
    setSignUpError("");
    setSignUpSuccess("");

    const normalizedName = signUpForm.fullName.trim();
    const normalizedEmail = signUpForm.email.trim();

    if (!normalizedName) {
      setSignUpError("Full name is required.");
      return;
    }

    if (!normalizedEmail) {
      setSignUpError("Email is required.");
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setSignUpError("Enter a valid email address.");
      return;
    }

    if (!signUpForm.password) {
      setSignUpError("Password is required.");
      return;
    }

    if (signUpForm.password.length < 8) {
      setSignUpError("Password must be at least 8 characters.");
      return;
    }

    if (signUpForm.password !== signUpForm.confirmPassword) {
      setSignUpError("Confirm password must match password.");
      return;
    }

    setIsSigningUp(true);

    try {
      const result = await registerAdmin({
        fullName: normalizedName,
        email: normalizedEmail,
        password: signUpForm.password,
      });

      setSignUpForm({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setSignInForm({
        email: normalizedEmail,
        password: "",
      });
      setSignUpSuccess(result?.message || "Account created successfully. Please sign in.");
      setMode("signin");
    } catch (submitError) {
      setSignUpError(submitError.message || "Unable to create your account.");
    } finally {
      setIsSigningUp(false);
    }
  }

  return (
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
        <div className="absolute left-10 top-[6.5rem] h-44 w-44 rounded-full bg-white/60 blur-3xl dark:bg-white/5" />
        <div className="absolute right-8 bottom-12 h-48 w-48 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-400/10" />
        <div className="absolute inset-y-0 right-0 hidden w-[58%] lg:block">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center opacity-95 dark:opacity-80" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,255,251,0.98)_0%,rgba(248,255,251,0.84)_28%,rgba(248,255,251,0.28)_54%,rgba(220,252,231,0.10)_100%)] dark:bg-[linear-gradient(90deg,rgba(9,17,13,0.98)_0%,rgba(9,17,13,0.88)_28%,rgba(9,17,13,0.34)_56%,rgba(9,17,13,0.12)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_62%,rgba(74,222,128,0.22),transparent_42%)] dark:bg-[radial-gradient(circle_at_72%_62%,rgba(74,222,128,0.14),transparent_42%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0)_22%,rgba(255,255,255,0)_100%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0)_24%,rgba(255,255,255,0)_100%)]" />
        </div>

        <div className="relative flex h-full flex-col">
          <div className="inline-flex items-center gap-3 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm backdrop-blur dark:border-emerald-500/25 dark:bg-white/5 dark:text-emerald-300">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white shadow-[0_10px_24px_rgba(22,163,74,0.25)] dark:bg-emerald-500">
              <Store className="h-5 w-5" />
            </span>
            {content.branding.appName}
          </div>

          <div className="relative mt-6 max-w-[32rem] rounded-[30px] bg-[linear-gradient(90deg,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0.82)_58%,rgba(255,255,255,0.16)_100%)] p-3 sm:p-4 dark:bg-[linear-gradient(90deg,rgba(9,17,13,0.84)_0%,rgba(9,17,13,0.80)_58%,rgba(9,17,13,0.12)_100%)]">
            <div className="absolute left-4 top-3 h-28 w-28 rounded-full bg-white/70 blur-3xl dark:bg-white/5" />
            <div className="relative">
              <h1 className="max-w-lg text-4xl font-semibold leading-[1.08] text-slate-900 dark:text-white sm:text-[3.4rem]">
                {content.login.heroTitle}
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-gray-500 dark:text-slate-400 sm:text-base">
                {content.login.heroDescription}
              </p>
            </div>
          </div>

          <div className="relative mt-auto pt-8 sm:pt-10">
            <div className="absolute inset-x-0 bottom-0 h-[14rem] rounded-[32px] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.16)_100%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.03)_100%)] lg:hidden" />
            <div className="absolute inset-0 overflow-hidden rounded-[32px] lg:hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center opacity-90 dark:opacity-70" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,255,251,0.88)_0%,rgba(248,255,251,0.30)_32%,rgba(248,255,251,0.12)_100%)] dark:bg-[linear-gradient(180deg,rgba(9,17,13,0.88)_0%,rgba(9,17,13,0.38)_36%,rgba(9,17,13,0.14)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_65%,rgba(74,222,128,0.20),transparent_34%)] dark:bg-[radial-gradient(circle_at_70%_65%,rgba(74,222,128,0.12),transparent_34%)]" />
            </div>

            <div className="relative grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-100 bg-white/88 p-4 shadow-sm backdrop-blur dark:border-emerald-500/20 dark:bg-[#101915]/80">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">Inventory</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">Track stock, purchases, and supplier updates from one place.</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-white/88 p-4 shadow-sm backdrop-blur dark:border-emerald-500/20 dark:bg-[#101915]/80">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">Operations</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">Review orders, reports, and settings with a cleaner admin flow.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="p-6 pt-[4.5rem] sm:p-8 sm:pt-[5.5rem] lg:p-10 lg:pt-[5.5rem]">
        <div className="mx-auto max-w-md">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-300">
            {content.login.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-gray-900 dark:text-white sm:text-4xl">
            {mode === "signin" ? content.login.title : "Create your account"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-slate-400">
            {mode === "signin"
              ? "Sign in to continue to your dashboard."
              : "Register with your own email and password to access the dashboard."}
          </p>

          {signUpSuccess && mode === "signin" ? (
            <p className="mt-8 text-sm text-emerald-600 dark:text-emerald-300">{signUpSuccess}</p>
          ) : null}

          {mode === "signin" ? (
            <form className="mt-8 space-y-5" onSubmit={handleSignInSubmit} autoComplete="off">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-200">Email</span>
                <AuthInput
                  icon={Mail}
                  type="email"
                  autoComplete="off"
                  value={signInForm.email}
                  onChange={(event) =>
                    setSignInForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-200">Password</span>
                <AuthInput
                  icon={LockKeyhole}
                  type="password"
                  autoComplete="new-password"
                  value={signInForm.password}
                  onChange={(event) =>
                    setSignInForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                />
              </label>

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="cursor-pointer text-sm font-medium text-emerald-600 transition-colors duration-200 hover:text-emerald-700 hover:underline dark:text-emerald-300 dark:hover:text-emerald-200"
                >
                  Forgot Password?
                </Link>
              </div>

              {signInError ? <p className="text-sm text-red-600">{signInError}</p> : null}

              <button
                type="submit"
                disabled={isSigningIn}
                className="w-full rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(22,163,74,0.22)] transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSigningIn ? "Signing in..." : "Sign In"}
              </button>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="inline-flex items-center gap-2.5 text-sm font-medium text-emerald-600 transition-colors duration-200 hover:text-emerald-700 hover:underline dark:text-emerald-300 dark:hover:text-emerald-200"
                >
                  <span>Don&apos;t have an account?</span>
                  <span>Sign Up</span>
                </button>
              </div>

              <div className="space-y-4 pt-2">
                <div className="relative">
                  <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-emerald-100 dark:bg-white/10" />
                  <p className="relative mx-auto w-fit bg-white px-3 text-xs font-medium text-slate-400 dark:bg-[#09110d] dark:text-slate-500">
                    Or continue with
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <SocialButton
                    href={`${getBackendOrigin()}/api/auth/google?next=${encodeURIComponent(oauthNextPath)}`}
                    label="Google"
                    icon={GoogleIcon}
                  />
                  <SocialButton
                    href={`${getBackendOrigin()}/api/auth/apple?next=${encodeURIComponent(oauthNextPath)}`}
                    label="Apple"
                    icon={AppleIcon}
                    className="dark:text-white"
                  />
                </div>
              </div>
            </form>
          ) : (
            <form className="mt-8 space-y-5" onSubmit={handleSignUpSubmit} autoComplete="off">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-200">Full Name</span>
                <AuthInput
                  icon={UserRound}
                  autoComplete="name"
                  value={signUpForm.fullName}
                  onChange={(event) =>
                    setSignUpForm((prev) => ({ ...prev, fullName: event.target.value }))
                  }
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-200">Email</span>
                <AuthInput
                  icon={Mail}
                  type="email"
                  autoComplete="off"
                  value={signUpForm.email}
                  onChange={(event) =>
                    setSignUpForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-200">Password</span>
                <AuthInput
                  icon={LockKeyhole}
                  type="password"
                  autoComplete="new-password"
                  value={signUpForm.password}
                  onChange={(event) =>
                    setSignUpForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-200">Confirm Password</span>
                <AuthInput
                  icon={LockKeyhole}
                  type="password"
                  autoComplete="new-password"
                  value={signUpForm.confirmPassword}
                  onChange={(event) =>
                    setSignUpForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
                  }
                />
              </label>

              {signUpError ? <p className="text-sm text-red-600">{signUpError}</p> : null}

              <button
                type="submit"
                disabled={isSigningUp}
                className="w-full rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(22,163,74,0.22)] transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSigningUp ? "Creating account..." : "Sign Up"}
              </button>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className="text-sm font-medium text-emerald-600 transition-colors duration-200 hover:text-emerald-700 hover:underline dark:text-emerald-300 dark:hover:text-emerald-200"
                >
                  Already have an account? Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-green-50 to-emerald-100/60 px-4 py-5 dark:bg-[linear-gradient(180deg,#07110c_0%,#0c1812_48%,#10231a_100%)] sm:px-6 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-7xl items-center justify-center sm:min-h-[calc(100vh-4rem)]">
        <Suspense fallback={<div className="h-[560px] w-full rounded-[32px] border border-emerald-100 bg-white shadow-[0_24px_80px_rgba(22,101,52,0.12)] dark:border-emerald-500/25 dark:bg-[#09110d] dark:shadow-[0_28px_90px_rgba(0,0,0,0.45)]" />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
