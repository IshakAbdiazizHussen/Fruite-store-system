"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { clearAuthSession, storeAuthSession } from "@/lib/authClient";

function decodeUserPayload(rawValue) {
  if (!rawValue) {
    return null;
  }

  try {
    const normalized = rawValue.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
    return JSON.parse(atob(`${normalized}${padding}`));
  } catch {
    return null;
  }
}

function getSafeNextPath(value) {
  const rawValue = String(value || "/dashboard").trim();
  if (!rawValue.startsWith("/") || rawValue.startsWith("//")) {
    return "/dashboard";
  }
  return rawValue;
}

export default function OauthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      clearAuthSession();
      router.replace("/login?error=oauth_failed");
      return;
    }

    const token = searchParams.get("token");
    const encodedUser = searchParams.get("user");
    const user = decodeUserPayload(encodedUser);
    const nextPath = getSafeNextPath(searchParams.get("next"));

    if (!token || !user) {
      clearAuthSession();
      router.replace("/login?error=oauth_failed");
      return;
    }

    storeAuthSession({ token, user });
    router.replace(nextPath);
  }, [router, searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] dark:bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)]">
      <div className="rounded-2xl border border-white/60 bg-white px-6 py-4 text-sm text-slate-600 shadow-xl dark:border-white/10 dark:bg-slate-900 dark:text-slate-200">
        Completing sign in...
      </div>
    </main>
  );
}
