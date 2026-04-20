"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, Menu, X, Moon, Sun, LogOut } from "lucide-react";
import { getActivities } from "@/lib/activityLog";
import { applyTheme, getInitialTheme, setTheme as persistTheme, subscribeToTheme } from "@/lib/theme";
import { defaultAvatarPosition, getAvatarImageStyle } from "@/lib/avatarStyle";
import { getAvatarSource } from "@/lib/avatarUpload";
import { logoutAdmin } from "@/lib/authClient";

const LAST_SEEN_KEY = "fruit_store_activity_seen_at";

export default function Topper({ onToggleSidebar, isSidebarOpen }) {
  const router = useRouter();
  const bellRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [activities, setActivities] = useState([]);
  const [profile, setProfile] = useState({
    name: "Ilwaad Manager",
    role: "Store Admin",
    avatar: "/Ilwaad-manager.png",
  });
  const [lastSeenAt, setLastSeenAt] = useState(0);

  const loadProfile = () => {
    const saved = localStorage.getItem("fruit_store_settings");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (!parsed?.profile) return;
      setProfile({
        name: parsed.profile.name || "Ilwaad Manager",
        role: parsed.profile.role || "Store Admin",
        avatar: parsed.profile.avatar || "/Ilwaad-manager.png",
        avatarPosition: parsed.profile.avatarPosition || defaultAvatarPosition,
      });
    } catch {
      // keep defaults if localStorage is malformed
    }
  };

  const loadActivities = () => {
    setActivities(getActivities());
    const seen = Number(localStorage.getItem(LAST_SEEN_KEY) || 0);
    setLastSeenAt(seen);
  };

  useEffect(() => {
    loadProfile();
    loadActivities();
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);

    const onActivity = () => loadActivities();
    const onSettings = () => loadProfile();
    const onClickOutside = (event) => {
      if (!bellRef.current?.contains(event.target)) {
        setIsBellOpen(false);
      }
    };

    window.addEventListener("fruit-store-activity-updated", onActivity);
    window.addEventListener("fruit-store-settings-updated", onSettings);
    window.addEventListener("storage", onActivity);
    document.addEventListener("mousedown", onClickOutside);
    const unsubscribeTheme = subscribeToTheme((nextTheme) => {
      setTheme(nextTheme);
      applyTheme(nextTheme);
    });

    return () => {
      window.removeEventListener("fruit-store-activity-updated", onActivity);
      window.removeEventListener("fruit-store-settings-updated", onSettings);
      window.removeEventListener("storage", onActivity);
      document.removeEventListener("mousedown", onClickOutside);
      unsubscribeTheme();
    };
  }, []);

  const hasUnread = useMemo(() => {
    if (!activities.length) return false;
    return new Date(activities[0].timestamp).getTime() > lastSeenAt;
  }, [activities, lastSeenAt]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchText.trim();
    if (!query) return;
    router.push(`/dashboard/inventory?search=${encodeURIComponent(query)}`);
  };

  const handleBellClick = () => {
    const next = !isBellOpen;
    setIsBellOpen(next);
    if (next) {
      const now = Date.now();
      localStorage.setItem(LAST_SEEN_KEY, String(now));
      setLastSeenAt(now);
    }
  };

  const handleThemeToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    persistTheme(nextTheme);
  };

  async function handleLogout() {
    await logoutAdmin();
    router.replace("/login");
  }

  const formatTime = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

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

        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 w-full max-w-md"
        >
          <Search className="text-gray-400 dark:text-gray-500 shrink-0" size={16} />
          <input
            className="w-full outline-none text-sm text-gray-600 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-transparent"
            placeholder="Search fruits..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </form>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          title="Logout"
        >
          <LogOut size={16} />
          Logout
        </button>

        <button
          onClick={handleThemeToggle}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-300"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative" ref={bellRef}>
          <button
            onClick={handleBellClick}
            className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-300"
            title="Notifications"
          >
            <Bell size={18} />
            {hasUnread ? <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" /> : null}
          </button>

          {isBellOpen ? (
            <div className="absolute right-0 mt-2 w-[360px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Recent Updates</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {activities.length ? (
                  activities.slice(0, 12).map((activity) => (
                    <div key={activity.id} className="px-4 py-3 border-b border-gray-50 dark:border-gray-800">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{activity.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{activity.description}</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">{formatTime(activity.timestamp)}</p>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                    No recent updates yet.
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div className="h-7 w-px bg-gray-200 dark:bg-gray-700" />

        <div className="flex items-center gap-2.5 rounded-2xl border border-gray-200/80 bg-white/80 px-2.5 py-1.5 shadow-[0_8px_24px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-none">
          <div className="text-right hidden sm:block leading-tight">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{profile.name}</p>
            <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">{profile.role}</p>
          </div>
          <Link href="/dashboard/settings">
            <div className="relative shrink-0 cursor-pointer transition-transform duration-200 hover:scale-[1.02]">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-100 via-white to-cyan-100 p-1.5 shadow-[0_14px_30px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/80 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 dark:ring-white/10">
                <img
                  src={getAvatarSource(profile.avatar) || "/manager-profile.png"}
                  alt="Manager"
                  className="h-full w-full rounded-full object-cover object-center"
                  style={getAvatarImageStyle(profile.avatarPosition)}
                />
              </div>
              <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-gray-900" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
