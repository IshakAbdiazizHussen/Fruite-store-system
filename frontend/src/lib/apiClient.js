"use client";

const DEFAULT_LOCAL_API_URL = "http://localhost:5000/api";

function normalizeApiBaseUrl(value) {
  if (!value) {
    return DEFAULT_LOCAL_API_URL;
  }

  const trimmed = String(value).trim().replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

export function getApiBaseUrl() {
  return normalizeApiBaseUrl(
    process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || DEFAULT_LOCAL_API_URL
  );
}

export function getBackendOrigin() {
  const apiBaseUrl = getApiBaseUrl();
  return apiBaseUrl.replace(/\/api$/, "");
}

export function resolveBackendAssetUrl(value) {
  if (!value) return value;
  if (/^https?:\/\//i.test(value)) return value;
  return `${getBackendOrigin()}${value.startsWith("/") ? value : `/${value}`}`;
}

export async function apiRequest(path, options = {}) {
  const authToken =
    typeof window !== "undefined" ? window.localStorage.getItem("fruit_store_token") : null;
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  let response;

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      cache: "no-store",
      credentials: "include",
      headers: {
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch {
    throw new Error("Cannot connect to the backend server. Start the backend and try again.");
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const payload = await response.json();
      if (payload?.message || payload?.error) {
        message = payload.message || payload.error;
      }
    } catch {
      // Ignore non-JSON error responses.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
