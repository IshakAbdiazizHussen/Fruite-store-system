"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { fetchCurrentUser, getStoredUser } from "@/lib/authClient";
import AdminSidebar from "./components/AdminSidebar";
import AdminTopbar from "./components/AdminTopbar";

export default function AdminLayout({ children }) {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!getStoredUser()) {
      setIsCheckingAuth(true);
    }

    fetchCurrentUser()
      .catch(() => {
        router.replace(`/login?next=${encodeURIComponent(pathname || "/admin")}`);
      })
      .finally(() => {
        setIsCheckingAuth(false);
      });
  }, [pathname, router]);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-200">
          Loading admin panel...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
