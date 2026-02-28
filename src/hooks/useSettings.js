"use client";

import { useState, useCallback, useEffect } from "react";
import { recordActivity } from "@/lib/activityLog";
import { readStorageJson } from "@/lib/safeStorage";

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

export function useSettings() {
    const [settings, setSettings] = useState(initialSettings);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage
    useEffect(() => {
        const parsed = readStorageJson("fruit_store_settings", null);
        if (parsed && typeof parsed === "object") {
            setSettings({
                ...initialSettings,
                ...parsed,
                profile: {
                    ...initialSettings.profile,
                    ...(parsed.profile || {}),
                },
                notifications: {
                    ...initialSettings.notifications,
                    ...(parsed.notifications || {}),
                },
                notificationEmail: parsed.notificationEmail || initialSettings.notificationEmail,
                regional: {
                    ...initialSettings.regional,
                    ...(parsed.regional || {}),
                },
                security: {
                    ...initialSettings.security,
                    ...(parsed.security || {}),
                },
            });
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("fruit_store_settings", JSON.stringify(settings));
            window.dispatchEvent(new Event("fruit-store-settings-updated"));
        }
    }, [settings, isLoaded]);

    const updateProfile = useCallback((profile) => {
        setSettings((prev) => ({ ...prev, profile }));
        recordActivity({
            type: "update",
            title: "Profile updated",
            description: `Manager profile updated to ${profile.name}.`,
        });
    }, []);

    const toggleNotification = useCallback((id) => {
        let nextValue = false;
        setSettings((prev) => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [id]: (() => {
                    nextValue = !prev.notifications[id];
                    return nextValue;
                })(),
            },
        }));
        recordActivity({
            type: "update",
            title: "Notification setting changed",
            description: `${id} notifications were ${nextValue ? "enabled" : "disabled"}.`,
        });
        return nextValue;
    }, []);

    const setAllNotifications = useCallback((enabled) => {
        setSettings((prev) => {
            const keys = Object.keys(prev.notifications || {});
            const nextNotifications = keys.reduce((acc, key) => {
                acc[key] = enabled;
                return acc;
            }, {});
            return {
                ...prev,
                notifications: nextNotifications,
            };
        });

        recordActivity({
            type: "update",
            title: "Notification settings updated",
            description: `All notifications were ${enabled ? "enabled" : "disabled"}.`,
        });
    }, []);

    const updateRegional = useCallback((key, value) => {
        setSettings((prev) => ({
            ...prev,
            regional: {
                ...prev.regional,
                [key]: value,
            },
        }));
        recordActivity({
            type: "update",
            title: "Regional setting changed",
            description: `${key} updated to ${value}.`,
        });
    }, []);

    const updateNotificationEmail = useCallback((email) => {
        setSettings((prev) => ({
            ...prev,
            notificationEmail: email,
        }));
        recordActivity({
            type: "update",
            title: "Notification email updated",
            description: `Notification email set to ${email}.`,
        });
    }, []);

    const changePassword = useCallback((newPassword) => {
        let didChange = false;
        let error = "";

        setSettings((prev) => {
            const existingPassword = prev.security?.password || initialSettings.security.password;
            if (existingPassword === newPassword) {
                error = "New password must be different from old password.";
                return prev;
            }

            didChange = true;
            return {
                ...prev,
                security: {
                    ...(prev.security || {}),
                    password: newPassword,
                    lastChanged: new Date().toISOString(),
                },
            };
        });

        if (didChange) {
            recordActivity({
                type: "security",
                title: "Password changed",
                description: "Manager password was updated successfully.",
            });
        }

        return {
            ok: didChange,
            error,
        };
    }, []);

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
