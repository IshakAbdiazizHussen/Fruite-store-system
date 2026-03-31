"use client";

import { Bell, User, Lock, Globe, Database, Eye, EyeOff } from 'lucide-react';
import React, { useMemo, useState, useEffect } from 'react';
import { useSettings } from "@/hooks/useSettings";
import { useOrders } from "@/hooks/useOrders";
import { usePurchases } from "@/hooks/usePurchases";
import { useSales } from "@/hooks/useSales";
import { openEmailDraft } from "@/lib/emailNotifications";
import { defaultAvatarPosition, getAvatarImageStyle, normalizeAvatarPosition } from "@/lib/avatarStyle";

export default function SettingsPage() {
  const { settings, updateProfile, toggleNotification, setAllNotifications, updateNotificationEmail, updateRegional, changePassword } = useSettings();
  const { orders } = useOrders();
  const { purchases } = usePurchases();
  const { sales, analytics } = useSales();
  const [profileForm, setProfileForm] = useState(settings.profile);
  const [passwordForm, setPasswordForm] = useState({
    next: "",
    confirm: "",
  });
  const [profileStatus, setProfileStatus] = useState("");
  const [notificationStatus, setNotificationStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [notificationEmail, setNotificationEmail] = useState(settings.notificationEmail || "ishakabdiaziz9060@gmail.com");
  const [showPassword, setShowPassword] = useState({
    next: false,
    confirm: false,
  });
  
  const roleOptions = [ "Administrator", "Store Admin", "Manager", "Supervisor", "Sales Manager", "Inventory Manager", "Cashier" ];

  useEffect(() => {
    setProfileForm({
      ...settings.profile,
      avatarPosition: normalizeAvatarPosition(settings.profile?.avatarPosition),
    });
  }, [settings.profile]);

  useEffect(() => {
    setNotificationEmail(settings.notificationEmail || "ishakabdiaziz9060@gmail.com");
  }, [settings.notificationEmail]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileStatus("");

    if (!profileForm.name.trim()) {
      setProfileStatus("Name is required.");
      return;
    }

    if (!profileForm.email.trim()) {
      setProfileStatus("Email is required.");
      return;
    }

    await updateProfile(profileForm);
    setProfileStatus("Profile updated successfully.");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileStatus("Please choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProfileStatus("Image size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfileForm((prev) => ({
        ...prev,
        avatar: String(reader.result),
        avatarPosition: prev.avatarPosition || defaultAvatarPosition,
      }));
      setProfileStatus("Photo selected. Click Save Changes to apply.");
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarPositionChange = (key, value) => {
    setProfileForm((prev) => ({
      ...prev,
      avatarPosition: {
        ...normalizeAvatarPosition(prev.avatarPosition),
        [key]: Number(value),
      },
    }));
  };

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

  return (
    <>
      <div className='p-6'>
        <h1 className='text-3xl font-medium text-slate-900 dark:text-white'>Settings</h1>
        <p className='font-light text-gray-500 dark:text-slate-400'>Manage your application preferences and account settings</p>
      </div>

      <section className='grid grid-cols-1 lg:grid-cols-3 gap-6 px-6'>
        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 dark:border-white/10 dark:bg-slate-900/80 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 via-white to-cyan-100 p-1.5 shadow-[0_12px_28px_rgba(15,23,42,0.14)] ring-1 ring-slate-200/80 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 dark:ring-white/10">
              <img
                src={profileForm.avatar || "/Ilwaad-manager.png"}
                alt="Profile"
                className="h-full w-full rounded-[14px] object-cover object-center"
                style={getAvatarImageStyle(profileForm.avatarPosition)}
              />
            </div>
            <h4 className="text-xl font-medium text-slate-900 dark:text-white">Profile</h4>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-100 via-white to-cyan-100 p-1.5 shadow-[0_14px_30px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/80 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 dark:ring-white/10">
                  <img
                    src={profileForm.avatar || "/Ilwaad-manager.png"}
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover object-center"
                    style={getAvatarImageStyle(profileForm.avatarPosition)}
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 dark:bg-slate-950 px-3 py-2 text-sm text-gray-600 dark:text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-green-100 file:px-3 file:py-1.5 file:text-green-700 dark:file:bg-green-500/10 dark:file:text-green-300"
                />
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-4 dark:border-white/10 dark:bg-slate-950/70">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700 dark:text-slate-200">Adjust photo position</p>
                <button
                  type="button"
                  onClick={() => setProfileForm((prev) => ({ ...prev, avatarPosition: defaultAvatarPosition }))}
                  className="rounded-lg border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-100 dark:border-green-400/20 dark:bg-green-500/10 dark:text-green-300"
                >
                  Reset
                </button>
              </div>
              <div className="mb-4 flex justify-center">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-100 via-white to-cyan-100 p-2 shadow-[0_16px_36px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/80 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 dark:ring-white/10">
                  <img
                    src={profileForm.avatar || "/Ilwaad-manager.png"}
                    alt="Profile preview"
                    className="h-full w-full rounded-full object-cover object-center"
                    style={getAvatarImageStyle(profileForm.avatarPosition)}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-slate-400">Left / Right</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={normalizeAvatarPosition(profileForm.avatarPosition).x}
                    onChange={(e) => handleAvatarPositionChange("x", e.target.value)}
                    className="w-full accent-green-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-slate-400">Up / Down</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={normalizeAvatarPosition(profileForm.avatarPosition).y}
                    onChange={(e) => handleAvatarPositionChange("y", e.target.value)}
                    className="w-full accent-green-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-slate-400">Zoom</label>
                  <input
                    type="range"
                    min="1"
                    max="2.2"
                    step="0.05"
                    value={normalizeAvatarPosition(profileForm.avatarPosition).scale}
                    onChange={(e) => handleAvatarPositionChange("scale", e.target.value)}
                    className="w-full accent-green-500"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full rounded-xl border border-gray-200 dark:border-white/10 dark:bg-slate-950 dark:text-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full rounded-xl border border-gray-200 dark:border-white/10 dark:bg-slate-950 dark:text-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Role</label>
              <select
                value={profileForm.role}
                onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                className="w-full rounded-xl border border-gray-200 dark:border-white/10 dark:bg-slate-950 dark:text-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-green-500 py-3 text-white font-medium hover:bg-green-600 transition-all shadow-lg shadow-green-100 dark:shadow-green-950/40"
            >
              Save Changes
            </button>
            {profileStatus ? <p className="text-sm text-green-600 dark:text-green-300">{profileStatus}</p> : null}
          </form>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 dark:border-white/10 dark:bg-slate-900/80 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center">
              <Bell className="text-blue-600" size={26} />
            </div>
            <h4 className="text-xl font-medium text-slate-900 dark:text-white">Notifications</h4>
          </div>

          <div className="space-y-6">
            <div className="flex gap-2">
              <button
                onClick={() => handleAllNotifications(true)}
                className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-200 dark:hover:bg-blue-500/15"
              >
                Enable all
              </button>
              <button
                onClick={() => handleAllNotifications(false)}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Disable all
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Notification Email</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 dark:bg-slate-950 dark:text-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
            <div className="flex gap-2">
              <button
                onClick={handleEmailDraft}
                className="rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 dark:border-green-400/20 dark:bg-green-500/10 dark:text-green-200 dark:hover:bg-green-500/15"
              >
                Open queued email draft
              </button>
              <button
                onClick={() => openEmailDraft(notificationEmail.trim() || "ishakabdiaziz9060@gmail.com", "Fruit Store Test Notification")}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Send test email
              </button>
            </div>
            {[
              { id: 'email', label: 'Email Notifications' },
              { id: 'push', label: 'Push Notifications' },
              { id: 'lowStock', label: 'Low Stock Alerts' },
              { id: 'expiry', label: 'Expiry Alerts' },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <p className="font-medium text-gray-700 dark:text-slate-200">{item.label}</p>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.notifications[item.id]}
                    onChange={() => handleToggleNotification(item.id, item.label)}
                  />
                  <div className="relative h-7 w-12 rounded-full bg-gray-200 dark:bg-slate-700 transition-colors peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-6 after:w-6 after:rounded-full after:bg-white dark:after:bg-slate-100 after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>
            ))}
            {notificationStatus ? <p className="text-sm text-blue-600 dark:text-blue-300">{notificationStatus}</p> : null}
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 dark:border-white/10 dark:bg-slate-900/80 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-14 w-14 rounded-2xl bg-purple-100 flex items-center justify-center">
              <Lock className="text-purple-600" size={26} />
            </div>
            <h4 className="text-xl font-medium text-slate-900 dark:text-white">Security</h4>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <p className="text-xs text-gray-500 dark:text-slate-400">
              {settings.security?.lastChanged
                ? `Last changed: ${new Date(settings.security.lastChanged).toLocaleString()}`
                : "Password has not been changed yet."}
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={showPassword.next ? "text" : "password"}
                  value={passwordForm.next}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, next: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 dark:bg-slate-950 dark:text-white px-4 pr-11 py-2.5 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirm: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 dark:bg-slate-950 dark:text-white px-4 pr-11 py-2.5 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
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
            <button type="submit" className="w-full rounded-xl bg-purple-600 py-3 text-white font-medium hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 dark:shadow-purple-950/40">
              Update Password
            </button>
            {passwordStatus ? <p className="text-sm text-purple-600 dark:text-purple-300">{passwordStatus}</p> : null}
          </form>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 mt-6 mb-12">
        {/* Regional Settings */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 dark:border-white/10 dark:bg-slate-900/80 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-14 w-14 rounded-2xl bg-orange-100 flex items-center justify-center">
              <Globe className="text-orange-600" size={26} />
            </div>
            <h4 className="text-xl font-medium text-slate-900 dark:text-white">Regional</h4>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Language</label>
              <select
                className="w-full rounded-xl border border-gray-200 dark:border-white/10 dark:bg-slate-950 dark:text-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                value={settings.regional.language}
                onChange={(e) => updateRegional('language', e.target.value)}
              >
                <option value="en-us">English (US)</option>
                <option value="so">Somali</option>
                <option value="ar">Arabic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Currency</label>
              <select
                className="w-full rounded-xl border border-gray-200 dark:border-white/10 dark:bg-slate-950 dark:text-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                value={settings.regional.currency}
                onChange={(e) => updateRegional('currency', e.target.value)}
              >
                <option value="usd">USD ($)</option>
                <option value="eur">EUR (€)</option>
                <option value="sos">SOS (Shilling)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 dark:border-white/10 dark:bg-slate-900/80 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-14 w-14 rounded-2xl bg-red-100 flex items-center justify-center">
              <Database className="text-red-600" size={26} />
            </div>
            <h4 className="text-xl font-medium text-slate-900 dark:text-white">Data & System</h4>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleExportData}
              className="rounded-xl border border-gray-200 dark:border-white/10 py-3 text-gray-700 dark:text-slate-200 font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              Export data
            </button>
            <button
              onClick={handleBackup}
              className="rounded-xl border border-gray-200 dark:border-white/10 py-3 text-gray-700 dark:text-slate-200 font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              Backup
            </button>
            <button
              onClick={handleDownloadReport}
              className="col-span-2 rounded-xl border border-green-500 py-3 text-green-600 dark:text-green-300 font-medium hover:bg-green-50 dark:hover:bg-green-500/10 transition-all"
            >
              Download reports
            </button>
            <button className="col-span-2 mt-4 rounded-xl border-2 border-red-500 py-3 text-red-500 dark:text-red-300 font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
              Delete Account
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
