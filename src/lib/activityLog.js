"use client";

const ACTIVITY_KEY = "fruit_store_activity_log";
const MAX_ACTIVITIES = 60;

export function getActivities() {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(ACTIVITY_KEY);
    if (!saved) return [];

    try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function recordActivity(activity) {
    if (typeof window === "undefined") return;
    const entry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: activity.title || "Activity",
        description: activity.description || "",
        type: activity.type || "info",
        timestamp: new Date().toISOString(),
    };

    const current = getActivities();
    const next = [entry, ...current].slice(0, MAX_ACTIVITIES);
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("fruit-store-activity-updated"));
}
