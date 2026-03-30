"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/lib/apiClient";

const defaultFrontendContent = {
  branding: {
    appName: "Fruit Store CMS",
    sidebarTitle: "Fresh Harvest",
    sidebarSubtitle: "Fruits Management",
  },
  login: {
    eyebrow: "Admin Login",
    title: "Sign in to CMS",
    subtitle: "Use the admin email and password you configured in `backend/.env`.",
    heroTitle: "Control your store from one secure dashboard.",
    heroDescription: "Inventory, orders, purchases, suppliers, reports, and settings now run through your backend.",
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
  const [content, setContent] = useState(defaultFrontendContent);
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);
  const [error, setError] = useState("");

  const loadContent = useCallback(async () => {
    try {
      const data = await apiRequest("/frontend-content", {
        headers: authenticated ? undefined : {},
      });
      setContent(mergeContent(data));
      setIsBackendAvailable(true);
      setError("");
      return data;
    } catch {
      // Keep the UI usable with local defaults while the backend is offline.
      setContent(mergeContent(defaultFrontendContent));
      setIsBackendAvailable(false);
      setError("Backend content service is unavailable.");
      return defaultFrontendContent;
    }
  }, [authenticated]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const updateContent = useCallback(async (patch) => {
    try {
      const next = await apiRequest("/frontend-content", {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      setContent(mergeContent(next));
      setIsBackendAvailable(true);
      setError("");
      return next;
    } catch (updateError) {
      setIsBackendAvailable(false);
      setError(updateError.message || "Unable to save backend content.");
      throw updateError;
    }
  }, []);

  return {
    content,
    error,
    isBackendAvailable,
    updateContent,
    reloadContent: loadContent,
  };
}
