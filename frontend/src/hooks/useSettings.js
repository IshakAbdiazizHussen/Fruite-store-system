"use client";

import { useCallback } from "react";
import { recordActivity } from "@/lib/activityLog";
import { apiRequest } from "@/lib/apiClient";
import { useCachedCollection } from "@/lib/useCachedCollection";

const initialSettings = {
  profile: {
    name: "Ilwaad Mohamed",
    email: "ilwaad@admin.com",
    role: "Administrator",
    avatar: "/Ilwaad-manager.png",
    avatarPosition: {
      x: 50,
      y: 50,
      scale: 1,
    },
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
    loginAlerts: true,
    rememberDevice: true,
    twoFactorEnabled: false,
    sessionTimeoutMinutes: 30,
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
  const loadSettings = useCallback(async () => {
    return apiRequest("/settings");
  }, []);

  const { data, error, isLoading, isRefreshing, refresh, updateCachedData } = useCachedCollection({
    cacheKey: "settings",
    fetcher: loadSettings,
    normalize: mergeSettings,
    initialData: initialSettings,
    staleTimeMs: 45_000,
  });

  const patchSettings = useCallback(async (patch) => {
    const nextSettings = await apiRequest("/settings", {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    const merged = updateCachedData(nextSettings);
    window.dispatchEvent(new Event("fruit-store-settings-updated"));
    return merged;
  }, [updateCachedData]);

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
    const nextValue = !data.notifications[id];
    await patchSettings({
      notifications: {
        ...data.notifications,
        [id]: nextValue,
      },
    });
    recordActivity({
      type: "update",
      title: "Notification setting changed",
      description: `${id} notifications were ${nextValue ? "enabled" : "disabled"}.`,
    });
    return nextValue;
  }, [data.notifications, patchSettings]);

  const setAllNotifications = useCallback(async (enabled) => {
    const nextNotifications = Object.keys(data.notifications || {}).reduce((acc, key) => {
      acc[key] = enabled;
      return acc;
    }, {});

    await patchSettings({ notifications: nextNotifications });
    recordActivity({
      type: "update",
      title: "Notification settings updated",
      description: `All notifications were ${enabled ? "enabled" : "disabled"}.`,
    });
  }, [data.notifications, patchSettings]);

  const updateRegional = useCallback(async (key, value) => {
    await patchSettings({
      regional: {
        ...data.regional,
        [key]: value,
      },
    });
    recordActivity({
      type: "update",
      title: "Regional setting changed",
      description: `${key} updated to ${value}.`,
    });
  }, [data.regional, patchSettings]);

  const updateNotificationEmail = useCallback(async (email) => {
    await patchSettings({ notificationEmail: email });
    recordActivity({
      type: "update",
      title: "Notification email updated",
      description: `Notification email set to ${email}.`,
    });
  }, [patchSettings]);

  const changePassword = useCallback(async (newPassword) => {
    const existingPassword = data.security?.password || initialSettings.security.password;
    if (existingPassword === newPassword) {
      return {
        ok: false,
        error: "New password must be different from old password.",
      };
    }

    await patchSettings({
      security: {
        ...data.security,
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
  }, [data.security, patchSettings]);

  const updateSecurity = useCallback(async (patch) => {
    await patchSettings({
      security: {
        ...data.security,
        ...patch,
      },
    });
    recordActivity({
      type: "security",
      title: "Security settings updated",
      description: "Account protection preferences were updated.",
    });
  }, [data.security, patchSettings]);

  return {
    settings: data,
    updateProfile,
    toggleNotification,
    setAllNotifications,
    updateNotificationEmail,
    updateRegional,
    changePassword,
    updateSecurity,
    error,
    isLoading,
    isRefreshing,
    reload: refresh,
  };
}
