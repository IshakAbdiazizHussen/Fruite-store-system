"use client";

import { useState, useCallback, useEffect } from "react";
import { recordActivity } from "@/lib/activityLog";

const initialSettings = {
    profile: {
        name: "Ilwaad Mohamed",
        email: "ilwaad@admin.com",
        role: "Administrator",
    },
    notifications: {
        email: true,
        push: true,
        lowStock: true,
        expiry: true,
    },
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
        const saved = localStorage.getItem("fruit_store_settings");
        if (saved) {
            const parsed = JSON.parse(saved);
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
        setSettings((prev) => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [id]: !prev.notifications[id],
            },
        }));
        recordActivity({
            type: "update",
            title: "Notification setting changed",
            description: `${id} notifications were toggled.`,
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

    const changePassword = useCallback((currentPassword, newPassword) => {
        let didChange = false;
        let error = "";

        setSettings((prev) => {
            const existingPassword = prev.security?.password || initialSettings.security.password;
            if (existingPassword !== currentPassword) {
                error = "Current password is incorrect.";
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
        updateRegional,
        changePassword,
    };
}
