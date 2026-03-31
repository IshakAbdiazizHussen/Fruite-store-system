"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { getStoredUser, logoutAdmin } from "@/lib/authClient";
import { applyTheme, getInitialTheme, setTheme as persistTheme, subscribeToTheme } from "@/lib/theme";

export default function AdminTopbar({ onToggleSidebar, isSidebarOpen }) {
  const router = useRouter();
  const user = getStoredUser();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);

    return subscribeToTheme((nextTheme) => {
      setTheme(nextTheme);
      applyTheme(nextTheme);
    });
  }, []);

  async function handleLogout() {
    await logoutAdmin();
    router.replace("/login");
  }

  function handleThemeToggle() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    persistTheme(nextTheme);
  }

  const initials = (user?.name || "Admin User")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center justify-between border-b border-gray-100 bg-white px-5 py-2.5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3 w-full">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-300"
          title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
        >
          {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600 dark:text-emerald-300">Admin Panel</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">Manage backend data</h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 rounded-2xl border border-gray-200/80 bg-white/80 px-2.5 py-1.5 shadow-[0_8px_24px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-none">
          <div className="text-right leading-tight">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name || "Admin User"}</p>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{user?.email || "admin@fruitstore.com"}</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(16,185,129,0.28)]">
            {initials}
          </div>
        </div>
        <button
          onClick={handleThemeToggle}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-300"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <div className="h-7 w-px bg-gray-200 dark:bg-gray-700" />
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
