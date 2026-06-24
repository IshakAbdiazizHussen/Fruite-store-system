"use client";

import { useCallback } from "react";
import { apiRequest } from "@/lib/apiClient";
import { primeCachedResource } from "@/lib/resourceCache";
import { useCachedCollection } from "@/lib/useCachedCollection";

const defaultFrontendContent = {
  branding: {
    appName: "Fruit Store CMS",
    sidebarTitle: "Fresh Harvest",
    sidebarSubtitle: "Fruits Management",
  },
  login: {
    eyebrow: "Admin Login",
    title: "Sign in to CMS",
    subtitle: "Use the project admin email and password to continue.",
    heroTitle: "Control your store from one secure dashboard.",
    heroDescription: "Inventory, orders, purchases, suppliers, reports, and settings are available after you sign in.",
  },
  dashboard: {
    title: "Dashboard Overview",
    subtitle: "Real-time performance metrics for your fruit store",
    quickActionsTitle: "Quick Actions",
    quickActionsSubtitle: "Run common operations directly from dashboard",
    actions: [
      { label: "Manage Inventory", href: "/dashboard/inventory", tone: "neutral" },
      { label: "Create Purchase", href: "/dashboard/purchases", tone: "success" },
      { label: "Manage Orders", href: "/dashboard/orders", tone: "info" },
    ],
  },
};

function mergeContent(content) {
  return {
    ...defaultFrontendContent,
    ...(content || {}),
    branding: {
      ...defaultFrontendContent.branding,
      ...(content?.branding || {}),
    },
    login: {
      ...defaultFrontendContent.login,
      ...(content?.login || {}),
    },
    dashboard: {
      ...defaultFrontendContent.dashboard,
      ...(content?.dashboard || {}),
      actions: Array.isArray(content?.dashboard?.actions)
        ? content.dashboard.actions
        : defaultFrontendContent.dashboard.actions,
    },
  };
}

export function useFrontendContent({ authenticated = false } = {}) {
  const loadContent = useCallback(async () => {
    try {
      const data = await apiRequest("/frontend-content", {
        cache: authenticated ? "no-store" : "force-cache",
        headers: authenticated ? undefined : {},
      });
      return data;
    } catch {
      return defaultFrontendContent;
    }
  }, [authenticated]);

  const {
    data,
    error,
    isLoading,
    isRefreshing,
    refresh,
    updateCachedData,
  } = useCachedCollection({
    cacheKey: "frontend-content",
    fetcher: loadContent,
    normalize: mergeContent,
    initialData: defaultFrontendContent,
    staleTimeMs: 60_000,
    persist: authenticated ? "none" : "session",
  });

  const updateContent = useCallback(async (patch) => {
    const next = await apiRequest("/frontend-content", {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    updateCachedData(next);
    primeCachedResource("frontend-content", next, { persist: "session" });
    return next;
  }, [updateCachedData]);

  return {
    content: data,
    error,
    isBackendAvailable: !error,
    isLoading,
    isRefreshing,
    updateContent,
    reloadContent: refresh,
  };
}
