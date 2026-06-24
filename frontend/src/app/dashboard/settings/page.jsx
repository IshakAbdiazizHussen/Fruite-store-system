"use client";

import { Bell, Camera, Database, Eye, EyeOff, Globe, LoaderCircle, Lock, Trash2, UserCircle2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import ProfileAvatar from "@/components/ProfileAvatar";
import { useSettings } from "@/hooks/useSettings";
import { useOrders } from "@/hooks/useOrders";
import { usePurchases } from "@/hooks/usePurchases";
import { useSales } from "@/hooks/useSales";
import { openEmailDraft } from "@/lib/emailNotifications";
import {
  fetchCurrentUser,
  getStoredUser,
  removeProfileImage,
  replaceProfileImage,
  subscribeToAuthSession,
  uploadProfileImage,
} from "@/lib/authClient";
const MAX_PROFILE_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

export default function SettingsPage() {
  const {
    settings,
    toggleNotification,
    setAllNotifications,
    updateNotificationEmail,
    updateRegional,
    changePassword,
    updateSecurity,
  } = useSettings();
  const { orders } = useOrders();
  const { purchases } = usePurchases();
  const { sales, analytics } = useSales();
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isRemovingImage, setIsRemovingImage] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [profileStatus, setProfileStatus] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    next: "",
    confirm: "",
  });
  const [notificationStatus, setNotificationStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [notificationEmail, setNotificationEmail] = useState(settings.notificationEmail || "ishakabdiaziz9060@gmail.com");
  const [showPassword, setShowPassword] = useState({
    next: false,
    confirm: false,
  });
  const notificationItems = [
    { id: "email", label: "Email Notifications", description: "Receive store updates and summaries in your inbox." },
    { id: "push", label: "Push Notifications", description: "Show instant alerts while you are using the dashboard." },
    { id: "lowStock", label: "Low Stock Alerts", description: "Warn you when products are running out." },
    { id: "expiry", label: "Expiry Alerts", description: "Remind you before items reach their expiry date." },
  ];
  const securityItems = [
    { id: "loginAlerts", label: "Login Alerts", description: "Email me whenever a new sign-in is detected." },
    { id: "rememberDevice", label: "Remember Trusted Device", description: "Reduce repeated verification on this device." },
    { id: "twoFactorEnabled", label: "Two-Step Verification", description: "Add an extra step before account access." },
  ];

  useEffect(() => {
    setNotificationEmail(settings.notificationEmail || "ishakabdiaziz9060@gmail.com");
  }, [settings.notificationEmail]);

  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);

  useEffect(() => {
    let isMounted = true;

    fetchCurrentUser()
      .then((user) => {
        if (isMounted) {
          setCurrentUser(user);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setProfileStatus(error.message || "Unable to load your profile.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingProfile(false);
        }
      });

    const unsubscribe = subscribeToAuthSession((user) => {
      setCurrentUser(user);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordStatus("");

    if (!passwordForm.next || !passwordForm.confirm) {
      setPasswordStatus("Fill all password fields.");
      return;
    }

    if (passwordForm.next.length < 8) {
      setPasswordStatus("New password must be at least 8 characters.");
      return;
    }
    if (!/[A-Za-z]/.test(passwordForm.next) || !/\d/.test(passwordForm.next)) {
      setPasswordStatus("New password must include at least one letter and one number.");
      return;
    }

    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordStatus("New password and confirm password do not match.");
      return;
    }

    const result = await changePassword(passwordForm.next);
    if (!result.ok) {
      setPasswordStatus(result.error);
      return;
    }

    setPasswordForm({ next: "", confirm: "" });
    setPasswordStatus("Password changed successfully.");
  };

  const handleToggleNotification = async (id, label) => {
    const next = !settings.notifications[id];
    await toggleNotification(id);
    setNotificationStatus(`${label} ${next ? "enabled" : "disabled"}.`);
  };

  const handleAllNotifications = async (enabled) => {
    await setAllNotifications(enabled);
    setNotificationStatus(`All notifications ${enabled ? "enabled" : "disabled"}.`);
  };

  const handleNotificationEmailSave = async () => {
    if (!notificationEmail.trim()) {
      setNotificationStatus("Notification email is required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(notificationEmail)) {
      setNotificationStatus("Please enter a valid email address.");
      return;
    }
    await updateNotificationEmail(notificationEmail.trim());
    setNotificationStatus(`Notification email saved: ${notificationEmail.trim()}`);
  };

  const handleEmailDraft = () => {
    const recipient = notificationEmail.trim() || "ishakabdiaziz9060@gmail.com";
    openEmailDraft(recipient, "Fruit Store Notifications");
  };

  const handleSecurityToggle = async (id) => {
    const nextValue = !settings.security?.[id];
    await updateSecurity({ [id]: nextValue });
    setPasswordStatus(`${securityItems.find((item) => item.id === id)?.label || "Security setting"} ${nextValue ? "enabled" : "disabled"}.`);
  };

  const handleSessionTimeoutChange = async (value) => {
    await updateSecurity({ sessionTimeoutMinutes: Number(value) });
    setPasswordStatus(`Session timeout set to ${value} minutes.`);
  };

  async function handleProfileImageSelection(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setProfileStatus("Only jpg, jpeg, png, and webp images are allowed.");
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE_BYTES) {
      setProfileStatus("Profile image must be 5MB or smaller.");
      return;
    }

    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl);
    }

    const nextPreviewImageUrl = URL.createObjectURL(file);
    setPreviewImageUrl(nextPreviewImageUrl);
    setIsUploadingImage(true);
    setProfileStatus("Live preview ready. Uploading your new profile photo...");

    try {
      const nextUser = currentUser?.profile_image_url
        ? await replaceProfileImage(file)
        : await uploadProfileImage(file);

      setCurrentUser(nextUser);
      URL.revokeObjectURL(nextPreviewImageUrl);
      setPreviewImageUrl(null);
      setProfileStatus(currentUser?.profile_image_url ? "Profile picture updated." : "Profile picture uploaded.");
    } catch (error) {
      setProfileStatus(error.message || "Unable to upload your profile picture.");
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function handleRemoveImage() {
    if (!currentUser?.profile_image_url) {
      setProfileStatus("There is no profile picture to remove.");
      return;
    }

    setIsRemovingImage(true);
    setProfileStatus("");

    try {
      const nextUser = await removeProfileImage();
      setCurrentUser(nextUser);
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
      setPreviewImageUrl(null);
      setProfileStatus("Profile picture removed.");
    } catch (error) {
      setProfileStatus(error.message || "Unable to remove your profile picture.");
    } finally {
      setIsRemovingImage(false);
    }
  }

  const reportSummary = useMemo(() => {
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    const processing = orders.filter((o) => o.status === "Processing").length;
    const pending = orders.filter((o) => o.status === "Pending").length;
    const totalSales = sales.reduce((sum, item) => sum + Number(item.total || 0), 0);
    const totalPurchases = purchases.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    return {
      generatedAt: new Date().toISOString(),
      profile: settings.profile,
      orders: {
        total: orders.length,
        delivered,
        processing,
        pending,
      },
      purchases: {
        total: purchases.length,
        amount: totalPurchases,
      },
      sales: {
        total: sales.length,
        amount: totalSales,
      },
      analytics,
    };
  }, [orders, purchases, sales, analytics, settings.profile]);

  const downloadFile = (filename, content, type = "application/json") => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const handleExportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      settings,
      orders,
      purchases,
      sales,
      analytics,
    };
    downloadFile("fruit-store-data-export.json", JSON.stringify(payload, null, 2));
  };

  const handleBackup = () => {
    const payload = {
      backupAt: new Date().toISOString(),
      data: {
        settings,
        orders,
        purchases,
        sales,
        analytics,
      },
    };
    downloadFile(`fruit-store-backup-${Date.now()}.json`, JSON.stringify(payload, null, 2));
  };

  const handleDownloadReport = () => {
    const rows = [
      ["Metric", "Value"],
      ["Generated At", reportSummary.generatedAt],
      ["Profile Name", reportSummary.profile.name],
      ["Profile Email", reportSummary.profile.email],
      ["Orders Total", String(reportSummary.orders.total)],
      ["Orders Delivered", String(reportSummary.orders.delivered)],
      ["Orders Processing", String(reportSummary.orders.processing)],
      ["Orders Pending", String(reportSummary.orders.pending)],
      ["Purchases Total", String(reportSummary.purchases.total)],
      ["Purchases Amount", String(reportSummary.purchases.amount)],
      ["Sales Total", String(reportSummary.sales.total)],
      ["Sales Amount", String(reportSummary.sales.amount)],
    ];

    const csv = rows.map((row) => row.map((col) => `"${String(col).replaceAll('"', '""')}"`).join(",")).join("\n");
    downloadFile(`fruit-store-report-${Date.now()}.csv`, csv, "text/csv;charset=utf-8");
  };

  const profileImageUrl = previewImageUrl || currentUser?.profile_image_url || null;

  return (
    <>
      <div className="p-6">
        <h1 className="text-3xl font-medium text-slate-900 dark:text-white">Settings</h1>
        <p className="font-light text-gray-500 dark:text-slate-400">Manage your application preferences and account settings</p>
      </div>

      <section className="px-6">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900/80">
          <div className="bg-[linear-gradient(135deg,#f8fafc_0%,#ffffff_52%,#eef2ff_100%)] p-8 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(17,24,39,0.92),rgba(30,41,59,0.94))]">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-5">
                <ProfileAvatar
                  src={profileImageUrl}
                  alt={currentUser?.name || "Profile picture"}
                  sizeClassName="h-32 w-32"
                  frameClassName="bg-white p-3"
                />
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                    <UserCircle2 className="h-3.5 w-3.5" />
                    Profile Picture
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">
                    {currentUser?.name || "Your account"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {currentUser?.email || "Loading account information..."}
                  </p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {currentUser?.role || "Administrator"}
                  </p>
                </div>
              </div>

              <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-white/10 dark:bg-slate-950/50">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Profile Picture</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Your profile photo will be visible across your account.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
                    {isUploadingImage ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                    Upload New Photo
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleProfileImageSelection}
                      disabled={isUploadingImage || isRemovingImage || isLoadingProfile}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={!currentUser?.profile_image_url || isUploadingImage || isRemovingImage || isLoadingProfile}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                  >
                    {isRemovingImage ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    Remove image
                  </button>
                </div>
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  JPG, PNG, or WebP. Max 5MB.
                </p>
                {profileStatus ? (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                    {profileStatus}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 px-6 pt-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-md dark:border-white/10 dark:bg-slate-900/80">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
              <Bell className="text-blue-600" size={26} />
            </div>
            <h4 className="text-xl font-medium text-slate-900 dark:text-white">Notifications</h4>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-blue-100 bg-[linear-gradient(135deg,#eff6ff,white_55%,#f0fdf4)] p-4 dark:border-blue-400/20 dark:bg-[linear-gradient(135deg,rgba(30,41,59,0.85),rgba(15,23,42,0.92))]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Notification Center</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Choose how you want the store to contact you.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAllNotifications(true)}
                    className="rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-700 shadow-sm hover:bg-blue-50 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-200"
                  >
                    Enable all
                  </button>
                  <button
                    onClick={() => handleAllNotifications(false)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                  >
                    Disable all
                  </button>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/60">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-slate-300">Notification Email</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                  placeholder="email@example.com"
                />
                <button
                  onClick={handleNotificationEmailSave}
                  className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-200 dark:hover:bg-blue-500/15"
                >
                  Save
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleEmailDraft}
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200"
              >
                Open queued email draft
              </button>
              <button
                onClick={() => openEmailDraft(notificationEmail.trim() || "ishakabdiaziz9060@gmail.com", "Fruit Store Test Notification")}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Send test email
              </button>
            </div>
            <div className="space-y-3">
              {notificationItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-slate-50/70 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                  <div>
                    <p className="font-medium text-gray-700 dark:text-slate-200">{item.label}</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">{item.description}</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center self-start">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={settings.notifications[item.id]}
                      onChange={() => handleToggleNotification(item.id, item.label)}
                    />
                    <div className="relative h-7 w-12 rounded-full bg-gray-200 transition-colors peer-checked:bg-blue-500 after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-5 dark:bg-slate-700" />
                  </label>
                </div>
              ))}
            </div>
            {notificationStatus ? (
              <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-200">
                {notificationStatus}
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-md dark:border-white/10 dark:bg-slate-900/80">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100">
              <Lock className="text-purple-600" size={26} />
            </div>
            <h4 className="text-xl font-medium text-slate-900 dark:text-white">Security</h4>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div className="rounded-2xl border border-purple-100 bg-[linear-gradient(135deg,#faf5ff,white_55%,#f8fafc)] p-4 dark:border-purple-400/20 dark:bg-[linear-gradient(135deg,rgba(51,16,79,0.35),rgba(15,23,42,0.92))]">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Password Protection</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {settings.security?.lastChanged
                  ? `Last changed: ${new Date(settings.security.lastChanged).toLocaleString()}`
                  : "Password has not been changed yet."}
              </p>
              <div className="mt-3 rounded-xl border border-purple-100 bg-white/80 px-3 py-2 text-xs text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                Use at least 8 characters with both letters and numbers for a stronger password.
              </div>
            </div>
            <div className="space-y-3">
              {securityItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl border border-purple-100 bg-purple-50/60 px-4 py-3 dark:border-purple-400/20 dark:bg-purple-500/10">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{item.label}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center self-start">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={Boolean(settings.security?.[item.id])}
                      onChange={() => handleSecurityToggle(item.id)}
                    />
                    <div className="relative h-7 w-12 rounded-full bg-purple-100 transition-colors peer-checked:bg-purple-600 after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-5 dark:bg-slate-700" />
                  </label>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/60">
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Session Timeout</label>
              <div className="flex items-center gap-3">
                <select
                  value={settings.security?.sessionTimeoutMinutes || 30}
                  onChange={(e) => handleSessionTimeoutChange(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-purple-500 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="120">120 minutes</option>
                </select>
                <span className="rounded-xl bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700 dark:bg-purple-500/10 dark:text-purple-200">
                  {settings.security?.sessionTimeoutMinutes || 30} min
                </span>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-slate-300">New Password</label>
              <div className="relative">
                <input
                  type={showPassword.next ? "text" : "password"}
                  value={passwordForm.next}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, next: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-11 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => ({ ...prev, next: !prev.next }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-white"
                >
                  {showPassword.next ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-slate-300">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirm: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-11 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-white"
                >
                  {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full rounded-2xl bg-purple-600 py-3 text-white font-medium transition-all hover:bg-purple-700 shadow-lg shadow-purple-100 dark:shadow-purple-950/40">
              Update Password
            </button>
            {passwordStatus ? (
              <div className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-purple-700 dark:border-purple-400/20 dark:bg-purple-500/10 dark:text-purple-200">
                {passwordStatus}
              </div>
            ) : null}
          </form>
        </div>
      </section>

      <section className="mb-12 mt-6 grid grid-cols-1 gap-6 px-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-md dark:border-white/10 dark:bg-slate-900/80">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
              <Globe className="text-orange-600" size={26} />
            </div>
            <h4 className="text-xl font-medium text-slate-900 dark:text-white">Regional</h4>
          </div>

          <div className="space-y-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-slate-300">Language</label>
              <select
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                value={settings.regional.language}
                onChange={(e) => updateRegional("language", e.target.value)}
              >
                <option value="en-us">English (US)</option>
                <option value="so">Somali</option>
                <option value="ar">Arabic</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-slate-300">Currency</label>
              <select
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                value={settings.regional.currency}
                onChange={(e) => updateRegional("currency", e.target.value)}
              >
                <option value="usd">USD ($)</option>
                <option value="eur">EUR (€)</option>
                <option value="sos">SOS (Shilling)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-md dark:border-white/10 dark:bg-slate-900/80">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
              <Database className="text-red-600" size={26} />
            </div>
            <h4 className="text-xl font-medium text-slate-900 dark:text-white">Data & System</h4>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleExportData}
              className="rounded-xl border border-gray-200 py-3 font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
            >
              Export data
            </button>
            <button
              onClick={handleBackup}
              className="rounded-xl border border-gray-200 py-3 font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
            >
              Backup
            </button>
            <button
              onClick={handleDownloadReport}
              className="col-span-2 rounded-xl border border-green-500 py-3 font-medium text-green-600 transition-all hover:bg-green-50 dark:text-green-300 dark:hover:bg-green-500/10"
            >
              Download reports
            </button>
            <button className="col-span-2 mt-4 rounded-xl border-2 border-red-500 py-3 font-medium text-red-500 transition-all hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10">
              Delete Account
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
