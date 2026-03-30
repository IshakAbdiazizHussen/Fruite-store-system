"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Topper from "./components/Topper";
import { fetchCurrentUser, getStoredUser } from "@/lib/authClient";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-4 text-sm text-gray-500 shadow-sm">
          Checking admin session...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden flex">
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
