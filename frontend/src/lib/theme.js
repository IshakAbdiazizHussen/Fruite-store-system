"use client";

const THEME_KEY = "fruit_store_theme";
const THEME_CHANGED_EVENT = "fruit-store-theme-updated";

export function getInitialTheme() {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem(THEME_KEY);
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function setTheme(theme) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
  window.dispatchEvent(new CustomEvent(THEME_CHANGED_EVENT, { detail: theme }));
}

export function subscribeToTheme(callback) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleCustomEvent = (event) => {
    callback(event.detail || getInitialTheme());
  };

  const handleStorage = (event) => {
    if (event.key === THEME_KEY) {
      callback(event.newValue || getInitialTheme());
    }
  };

  window.addEventListener(THEME_CHANGED_EVENT, handleCustomEvent);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(THEME_CHANGED_EVENT, handleCustomEvent);
    window.removeEventListener("storage", handleStorage);
  };
}
