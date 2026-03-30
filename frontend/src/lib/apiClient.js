"use client";

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
}

export async function apiRequest(path, options = {}) {
  const authToken =
    typeof window !== "undefined" ? window.localStorage.getItem("fruit_store_token") : null;

  let response;

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      cache: "no-store",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
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
