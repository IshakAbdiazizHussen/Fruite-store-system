"use client";

import { apiRequest } from "@/lib/apiClient";

const TOKEN_KEY = "fruit_store_token";
const USER_KEY = "fruit_store_user";

export function getStoredUser() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function storeAuthSession(session) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, session.token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(session.user));
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export async function loginAdmin(credentials) {
  const session = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  storeAuthSession(session);
  return session;
}

export async function fetchCurrentUser() {
  const payload = await apiRequest("/auth/me");
  if (payload?.user && typeof window !== "undefined") {
    window.localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
  }
  return payload?.user || null;
}

export async function logoutAdmin() {
  try {
    await apiRequest("/auth/logout", {
      method: "POST",
    });
  } finally {
    clearAuthSession();
  }
}
