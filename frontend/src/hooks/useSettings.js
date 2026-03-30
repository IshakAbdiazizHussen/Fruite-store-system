"use client";

import { useState, useCallback, useEffect } from "react";
import { recordActivity } from "@/lib/activityLog";
import { apiRequest } from "@/lib/apiClient";

const STORAGE_KEY = "fruit_store_settings";

const initialSettings = {
  profile: {
    name: "Ilwaad Mohamed",
    email: "ilwaad@admin.com",
    role: "Administrator",
    avatar: "/Ilwaad-manager.png",
  },
  notifications: {
    email: true,
    push: true,
    lowStock: true,
    expiry: true,
  },
  notificationEmail: "ishakabdiaziz9060@gmail.com",
  regional: {
    language: "en-us",
    currency: "usd",
  },
  security: {
    password: "admin12345",
    lastChanged: null,
  },
};

function mergeSettings(settings) {
  return {
    ...initialSettings,
    ...(settings || {}),
    profile: {
      ...initialSettings.profile,
      ...((settings && settings.profile) || {}),
    },
    notifications: {
      ...initialSettings.notifications,
      ...((settings && settings.notifications) || {}),
    },
    regional: {
      ...initialSettings.regional,
      ...((settings && settings.regional) || {}),
    },
    security: {
      ...initialSettings.security,
      ...((settings && settings.security) || {}),
    },
  };
}

export function useSettings() {
  const [settings, setSettings] = useState(initialSettings);

  const syncSettings = useCallback((nextSettings) => {
    const merged = mergeSettings(nextSettings);
    setSettings(merged);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new Event("fruit-store-settings-updated"));
    return merged;
  }, []);

  const loadSettings = useCallback(async () => {
    const data = await apiRequest("/settings");
    syncSettings(data);
  }, [syncSettings]);

  useEffect(() => {
    loadSettings().catch((error) => {
      console.error("Failed to load settings", error);
    });
  }, [loadSettings]);

  const patchSettings = useCallback(async (patch) => {
    const nextSettings = await apiRequest("/settings", {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    return syncSettings(nextSettings);
  }, [syncSettings]);

  const updateProfile = useCallback(async (profile) => {
    const next = await patchSettings({ profile });
    recordActivity({
      type: "update",
      title: "Profile updated",
      description: `Manager profile updated to ${profile.name}.`,
    });
    return next;
  }, [patchSettings]);

  const toggleNotification = useCallback(async (id) => {
    const nextValue = !settings.notifications[id];
    await patchSettings({
      notifications: {
        ...settings.notifications,
        [id]: nextValue,
      },
    });
    recordActivity({
      type: "update",
      title: "Notification setting changed",
      description: `${id} notifications were ${nextValue ? "enabled" : "disabled"}.`,
    });
    return nextValue;
  }, [patchSettings, settings.notifications]);

  const setAllNotifications = useCallback(async (enabled) => {
    const nextNotifications = Object.keys(settings.notifications || {}).reduce((acc, key) => {
      acc[key] = enabled;
      return acc;
    }, {});

    await patchSettings({ notifications: nextNotifications });
    recordActivity({
      type: "update",
      title: "Notification settings updated",
      description: `All notifications were ${enabled ? "enabled" : "disabled"}.`,
    });
  }, [patchSettings, settings.notifications]);

  const updateRegional = useCallback(async (key, value) => {
    await patchSettings({
      regional: {
        ...settings.regional,
        [key]: value,
      },
    });
    recordActivity({
      type: "update",
      title: "Regional setting changed",
      description: `${key} updated to ${value}.`,
    });
  }, [patchSettings, settings.regional]);

  const updateNotificationEmail = useCallback(async (email) => {
    await patchSettings({ notificationEmail: email });
    recordActivity({
      type: "update",
      title: "Notification email updated",
      description: `Notification email set to ${email}.`,
    });
  }, [patchSettings]);

  const changePassword = useCallback(async (newPassword) => {
    const existingPassword = settings.security?.password || initialSettings.security.password;
    if (existingPassword === newPassword) {
      return {
        ok: false,
        error: "New password must be different from old password.",
      };
    }

    await patchSettings({
      security: {
        ...settings.security,
        password: newPassword,
        lastChanged: new Date().toISOString(),
      },
    });

    recordActivity({
      type: "security",
      title: "Password changed",
      description: "Manager password was updated successfully.",
    });

    return {
      ok: true,
      error: "",
    };
  }, [patchSettings, settings.security]);

  return {
    settings,
    updateProfile,
    toggleNotification,
    setAllNotifications,
    updateNotificationEmail,
    updateRegional,
    changePassword,
  };
}
