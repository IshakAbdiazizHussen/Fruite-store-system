"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { fetchCurrentUser, getStoredUser } from "@/lib/authClient";
import Sidebar from "./components/Sidebar";
import Topper from "./components/Topper";

export default function DashboardLayout({ children }) {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!getStoredUser()) {
      setIsCheckingAuth(true);
    }

    fetchCurrentUser()
      .catch(() => {
        router.replace(`/login?next=${encodeURIComponent(pathname || "/dashboard")}`);
      })
      .finally(() => {
        setIsCheckingAuth(false);
      });
  }, [pathname, router]);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#ecfccb,_#f8fafc_40%,_#dcfce7_100%)] dark:bg-[radial-gradient(circle_at_top,_#0f172a,_#111827_45%,_#052e16_100%)]">
        <div className="rounded-2xl border border-white/60 bg-white px-6 py-4 text-sm text-slate-600 shadow-xl dark:border-white/10 dark:bg-slate-900 dark:text-slate-200">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden flex bg-[radial-gradient(circle_at_top,_#ecfccb,_#f8fafc_40%,_#dcfce7_100%)] dark:bg-[radial-gradient(circle_at_top,_#0f172a,_#111827_45%,_#052e16_100%)]">
      {/* Sidebar fixed */}
      <aside className={`${isSidebarOpen ? "w-64" : "w-0"} shrink-0 overflow-hidden transition-all duration-300`}>
        <Sidebar />
      </aside>

      {/* Right side */}
      <div className="flex-1 flex flex-col">
        {/* Topper fixed */}
        <div className="shrink-0">
          <Topper
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          />
        </div>

        {/* Only this part scrolls */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      
    </div>
  );
}
