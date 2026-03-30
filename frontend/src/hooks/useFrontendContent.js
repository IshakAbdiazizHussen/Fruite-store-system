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

  const loadContent = useCallback(async () => {
    const data = await apiRequest("/frontend-content", {
      headers: authenticated ? undefined : {},
    });
    setContent(mergeContent(data));
  }, [authenticated]);

  useEffect(() => {
    loadContent().catch((error) => {
      console.error("Failed to load frontend content", error);
    });
  }, [loadContent]);

  const updateContent = useCallback(async (patch) => {
    const next = await apiRequest("/frontend-content", {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    setContent(mergeContent(next));
    return next;
  }, []);

  return {
    content,
    updateContent,
    reloadContent: loadContent,
  };
}
