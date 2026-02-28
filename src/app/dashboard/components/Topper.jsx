"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, Menu, X } from "lucide-react";
import { getActivities } from "@/lib/activityLog";

const LAST_SEEN_KEY = "fruit_store_activity_seen_at";

export default function Topper({ onToggleSidebar, isSidebarOpen }) {
  const router = useRouter();
  const bellRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [isBellOpen, setIsBellOpen] = useState(false);
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

    return () => {
      window.removeEventListener("fruit-store-activity-updated", onActivity);
      window.removeEventListener("fruit-store-settings-updated", onSettings);
      window.removeEventListener("storage", onActivity);
      document.removeEventListener("mousedown", onClickOutside);
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

  const formatTime = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="flex items-center justify-between bg-white px-6 py-3.5 shadow-sm border-b border-gray-100">
      <div className="flex items-center gap-3 w-full">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
          title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
        >
          {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 w-full max-w-md"
        >
          <Search className="text-gray-400 shrink-0" size={16} />
          <input
            className="w-full outline-none text-sm text-gray-600 placeholder:text-gray-400 bg-transparent"
            placeholder="Search fruits..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </form>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative" ref={bellRef}>
          <button
            onClick={handleBellClick}
            className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
            title="Notifications"
          >
            <Bell size={18} />
            {hasUnread ? <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" /> : null}
          </button>

          {isBellOpen ? (
            <div className="absolute right-0 mt-2 w-[360px] bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">Recent Updates</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {activities.length ? (
                  activities.slice(0, 12).map((activity) => (
                    <div key={activity.id} className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-semibold text-gray-800">{activity.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
                      <p className="text-[11px] text-gray-400 mt-1">{formatTime(activity.timestamp)}</p>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-gray-400">
                    No recent updates yet.
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div className="h-8 w-px bg-gray-200" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">{profile.name}</p>
            <p className="text-xs text-gray-500">{profile.role}</p>
          </div>
          <Link href="/dashboard/settings">
            <div className="relative shrink-0 cursor-pointer">
              <img
                src={profile.avatar || "/Ilwaad-manager.png"}
                alt="Manager"
                className="w-10 h-10 rounded-full object-cover shadow-sm"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
