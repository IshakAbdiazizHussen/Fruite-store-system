"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { getStoredUser, logoutAdmin } from "@/lib/authClient";

export default function AdminTopbar() {
  const router = useRouter();
  const user = getStoredUser();

  async function handleLogout() {
    await logoutAdmin();
    router.replace("/login");
  }

  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">Admin Panel</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Manage backend data</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">{user?.name || "Admin User"}</p>
          <p className="text-xs text-slate-500">{user?.email || "admin@fruitstore.com"}</p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
