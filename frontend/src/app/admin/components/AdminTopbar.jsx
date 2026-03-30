"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { getStoredUser, logoutAdmin } from "@/lib/authClient";

const THEME_KEY = "fruit_store_theme";

export default function AdminTopbar({ onToggleSidebar, isSidebarOpen }) {
  const router = useRouter();
  const user = getStoredUser();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme =
      savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : prefersDark
          ? "dark"
          : "light";
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  async function handleLogout() {
    await logoutAdmin();
    router.replace("/login");
  }

  function handleThemeToggle() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }

  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-900 px-6 py-3.5 shadow-sm border-b border-gray-100 dark:border-gray-800">
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

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name || "Admin User"}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email || "admin@fruitstore.com"}</p>
        </div>
        <button
          onClick={handleThemeToggle}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-300"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
