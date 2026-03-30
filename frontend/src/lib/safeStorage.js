"use client";

export function readStorageJson(key, fallback) {
    if (typeof window === "undefined") return fallback;

    const raw = localStorage.getItem(key);
    if (!raw) return fallback;

    try {
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
}
