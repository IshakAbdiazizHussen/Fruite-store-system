"use client";

const BACKEND_UPDATED_EVENT = "fruit-store-backend-updated";
const BACKEND_UPDATED_AT_KEY = "fruit_store_backend_updated_at";

export function notifyBackendDataChanged() {
  if (typeof window === "undefined") return;

  const timestamp = String(Date.now());
  window.dispatchEvent(new Event(BACKEND_UPDATED_EVENT));
  window.localStorage.setItem(BACKEND_UPDATED_AT_KEY, timestamp);
}

export function subscribeToBackendDataChanged(callback) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleCustomEvent = () => {
    callback();
  };

  const handleStorage = (event) => {
    if (event.key === BACKEND_UPDATED_AT_KEY) {
      callback();
    }
  };

  const handleVisibility = () => {
    if (document.visibilityState === "visible") {
      callback();
    }
  };

  const handleFocus = () => {
    callback();
  };

  window.addEventListener(BACKEND_UPDATED_EVENT, handleCustomEvent);
  window.addEventListener("storage", handleStorage);
  window.addEventListener("focus", handleFocus);
  document.addEventListener("visibilitychange", handleVisibility);

  return () => {
    window.removeEventListener(BACKEND_UPDATED_EVENT, handleCustomEvent);
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("focus", handleFocus);
    document.removeEventListener("visibilitychange", handleVisibility);
  };
}
