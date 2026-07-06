"use client";

import { apiRequest } from "@/lib/apiClient";

const TOKEN_KEY = "fruit_store_token";
const USER_KEY = "fruit_store_user";
const AUTH_UPDATED_EVENT = "fruit-store-auth-updated";

function emitAuthUpdated(user) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(AUTH_UPDATED_EVENT, { detail: { user } }));
}

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
  emitAuthUpdated(session.user);
}

export function updateStoredUser(user) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  emitAuthUpdated(user);
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  emitAuthUpdated(null);
}

export function subscribeToAuthSession(callback) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleUpdate = (event) => {
    callback(event.detail?.user ?? null);
  };

  window.addEventListener(AUTH_UPDATED_EVENT, handleUpdate);
  return () => window.removeEventListener(AUTH_UPDATED_EVENT, handleUpdate);
}

export async function loginAdmin(credentials) {
  const session = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  storeAuthSession(session);
  return session;
}

export async function requestPasswordReset(payload) {
  return apiRequest("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function validatePasswordResetToken(token) {
  return apiRequest(`/auth/reset-password/${encodeURIComponent(token)}`);
}

export async function resetPasswordWithToken(token, payload) {
  return apiRequest(`/auth/reset-password/${encodeURIComponent(token)}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchCurrentUser() {
  const payload = await apiRequest("/auth/me");
  if (payload?.user) {
    updateStoredUser(payload.user);
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

export async function uploadProfileImage(file) {
  const formData = new FormData();
  formData.append("profile_image", file);

  const payload = await apiRequest("/auth/me/profile-image", {
    method: "POST",
    body: formData,
  });

  if (payload?.user) {
    updateStoredUser(payload.user);
  }

  return payload?.user || null;
}

export async function replaceProfileImage(file) {
  const formData = new FormData();
  formData.append("profile_image", file);

  const payload = await apiRequest("/auth/me/profile-image", {
    method: "PUT",
    body: formData,
  });

  if (payload?.user) {
    updateStoredUser(payload.user);
  }

  return payload?.user || null;
}

export async function removeProfileImage() {
  const payload = await apiRequest("/auth/me/profile-image", {
    method: "DELETE",
  });

  if (payload?.user) {
    updateStoredUser(payload.user);
  }

  return payload?.user || null;
}
