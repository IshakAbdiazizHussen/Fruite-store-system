"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Database,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Mail,
  Save,
  User,
} from "lucide-react";
import { useFrontendContent } from "@/hooks/useFrontendContent";
import { useOrders } from "@/hooks/useOrders";
import { usePurchases } from "@/hooks/usePurchases";
import { useSales } from "@/hooks/useSales";
import { useSettings } from "@/hooks/useSettings";
import { openEmailDraft } from "@/lib/emailNotifications";
import { defaultAvatarPosition, getAvatarImageStyle, normalizeAvatarPosition } from "@/lib/avatarStyle";

function SectionCard({ icon: Icon, iconClassName, title, headerContent, children }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
      <div className="mb-8 flex items-center gap-4">
        {headerContent || (
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconClassName}`}>
            <Icon size={24} />
          </div>
        )}
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition-all focus:border-emerald-400 dark:border-white/10 dark:bg-slate-950 dark:text-white ${className}`}
    />
  );
}

function Select({ className = "", children, ...props }) {
  return (
    <select
      {...props}
      className={`w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition-all focus:border-emerald-400 dark:border-white/10 dark:bg-slate-950 dark:text-white ${className}`}
    >
      {children}
    </select>
  );
}

function Textarea({ className = "", ...props }) {
  return (
    <textarea
      {...props}
      className={`min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition-all focus:border-emerald-400 dark:border-white/10 dark:bg-slate-950 dark:text-white ${className}`}
    />
  );
}

function downloadFile(filename, content, type = "application/json") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function AdminSettingsPage() {
  const {
    settings,
    updateProfile,
    toggleNotification,
    setAllNotifications,
    updateNotificationEmail,
    updateRegional,
    changePassword,
  } = useSettings();
  const { content, updateContent } = useFrontendContent({ authenticated: true });
  const { orders } = useOrders();
  const { purchases } = usePurchases();
  const { sales, analytics } = useSales();

  const [profileForm, setProfileForm] = useState(settings.profile);
  const [notificationEmail, setNotificationEmail] = useState(settings.notificationEmail || "");
  const [passwordForm, setPasswordForm] = useState({ next: "", confirm: "" });
  const [showPassword, setShowPassword] = useState({ next: false, confirm: false });
  const [contentForm, setContentForm] = useState(content);
  const [profileStatus, setProfileStatus] = useState("");
  const [notificationStatus, setNotificationStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [contentStatus, setContentStatus] = useState("");

  const roleOptions = ["Administrator", "Store Admin", "Manager", "Supervisor", "Sales Manager", "Inventory Manager", "Cashier"];

  useEffect(() => {
    setProfileForm({
      ...settings.profile,
      avatarPosition: normalizeAvatarPosition(settings.profile?.avatarPosition),
    });
  }, [settings.profile]);

  useEffect(() => {
    setNotificationEmail(settings.notificationEmail || "");
  }, [settings.notificationEmail]);

  useEffect(() => {
    setContentForm(content);
  }, [content]);

  const reportSummary = useMemo(() => {
    const delivered = orders.filter((order) => order.status === "Delivered").length;
    const processing = orders.filter((order) => order.status === "Processing").length;
    const pending = orders.filter((order) => order.status === "Pending").length;
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
  }, [analytics, orders, purchases, sales, settings.profile]);

  async function handleProfileSubmit(event) {
    event.preventDefault();
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
  }

  function handleAvatarChange(event) {
    const file = event.target.files?.[0];
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
      setProfileStatus("Photo selected. Save profile to apply.");
    };
    reader.readAsDataURL(file);
  }

  function handleAvatarPositionChange(key, value) {
    setProfileForm((prev) => ({
      ...prev,
      avatarPosition: {
        ...normalizeAvatarPosition(prev.avatarPosition),
        [key]: Number(value),
      },
    }));
  }

  async function handleToggleNotification(id, label) {
    const next = !settings.notifications[id];
    await toggleNotification(id);
    setNotificationStatus(`${label} ${next ? "enabled" : "disabled"}.`);
  }

  async function handleAllNotifications(enabled) {
    await setAllNotifications(enabled);
    setNotificationStatus(`All notifications ${enabled ? "enabled" : "disabled"}.`);
  }

  async function handleNotificationEmailSave() {
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
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
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
  }

  function updateContentSection(section, key, value) {
    setContentForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  }

  async function handleContentSubmit(event) {
    event.preventDefault();
    setContentStatus("");
    await updateContent(contentForm);
    setContentStatus("Backend text settings saved.");
  }

  function handleExportData() {
    const payload = {
      exportedAt: new Date().toISOString(),
      settings,
      orders,
      purchases,
      sales,
      analytics,
    };
    downloadFile("fruit-store-data-export.json", JSON.stringify(payload, null, 2));
  }

  function handleBackup() {
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
  }

  function handleDownloadReport() {
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
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600 dark:text-emerald-300">Settings Control</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Control backend settings</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Manage profile, notifications, security, regional preferences, exports, and backend-managed text from one admin page.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <SectionCard
          icon={User}
          iconClassName="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200"
          title="Profile"
          headerContent={
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 via-white to-cyan-100 p-1.5 shadow-[0_12px_28px_rgba(15,23,42,0.14)] ring-1 ring-slate-200/80 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 dark:ring-white/10">
              <img
                src={profileForm.avatar || "/Ilwaad-manager.png"}
                alt="Profile"
                className="h-full w-full rounded-[14px] object-cover object-center"
                style={getAvatarImageStyle(profileForm.avatarPosition)}
              />
            </div>
          }
        >
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
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Profile Photo</label>
                <Input type="file" accept="image/*" onChange={handleAvatarChange} className="file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-100 file:px-3 file:py-1.5 file:text-emerald-700 dark:file:bg-emerald-500/10 dark:file:text-emerald-200" />
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-950/70">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Adjust photo position</p>
                <button
                  type="button"
                  onClick={() => setProfileForm((prev) => ({ ...prev, avatarPosition: defaultAvatarPosition }))}
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200"
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
                  <label className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Left / Right</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={normalizeAvatarPosition(profileForm.avatarPosition).x}
                    onChange={(e) => handleAvatarPositionChange("x", e.target.value)}
                    className="w-full accent-emerald-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Up / Down</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={normalizeAvatarPosition(profileForm.avatarPosition).y}
                    onChange={(e) => handleAvatarPositionChange("y", e.target.value)}
                    className="w-full accent-emerald-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Zoom</label>
                  <input
                    type="range"
                    min="1"
                    max="2.2"
                    step="0.05"
                    value={normalizeAvatarPosition(profileForm.avatarPosition).scale}
                    onChange={(e) => handleAvatarPositionChange("scale", e.target.value)}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Full Name</label>
              <Input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
              <Input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Role</label>
              <Select value={profileForm.role} onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Select>
            </div>
            <button type="submit" className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
              Save Profile
            </button>
            {profileStatus ? <p className="text-sm text-emerald-600 dark:text-emerald-300">{profileStatus}</p> : null}
          </form>
        </SectionCard>

        <SectionCard icon={Bell} iconClassName="bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-200" title="Notifications">
          <div className="space-y-6">
            <div className="flex gap-2">
              <button onClick={() => handleAllNotifications(true)} className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-200">
                Enable all
              </button>
              <button onClick={() => handleAllNotifications(false)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                Disable all
              </button>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Notification Email</label>
              <div className="flex gap-2">
                <Input type="email" value={notificationEmail} onChange={(e) => setNotificationEmail(e.target.value)} placeholder="email@example.com" />
                <button onClick={handleNotificationEmailSave} className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-200">
                  Save
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => openEmailDraft(notificationEmail.trim() || "admin@fruitstore.com", "Fruit Store Notifications")}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200"
              >
                <Mail className="h-4 w-4" />
                Open queued email draft
              </button>
              <button
                onClick={() => openEmailDraft(notificationEmail.trim() || "admin@fruitstore.com", "Fruit Store Test Notification")}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              >
                Send test email
              </button>
            </div>

            {[
              { id: "email", label: "Email Notifications" },
              { id: "push", label: "Push Notifications" },
              { id: "lowStock", label: "Low Stock Alerts" },
              { id: "expiry", label: "Expiry Alerts" },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <p className="font-medium text-slate-700 dark:text-slate-200">{item.label}</p>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={settings.notifications[item.id]}
                    onChange={() => handleToggleNotification(item.id, item.label)}
                  />
                  <div className="relative h-7 w-12 rounded-full bg-slate-200 transition-colors peer-checked:bg-blue-500 after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-5 dark:bg-slate-700" />
                </label>
              </div>
            ))}

            {notificationStatus ? <p className="text-sm text-blue-600 dark:text-blue-300">{notificationStatus}</p> : null}
          </div>
        </SectionCard>

        <SectionCard icon={Lock} iconClassName="bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-200" title="Security">
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {settings.security?.lastChanged
                ? `Last changed: ${new Date(settings.security.lastChanged).toLocaleString()}`
                : "Password has not been changed yet."}
            </p>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">New Password</label>
              <div className="relative">
                <Input
                  type={showPassword.next ? "text" : "password"}
                  value={passwordForm.next}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, next: e.target.value }))}
                  placeholder="••••••••"
                  className="pr-11"
                />
                <button type="button" onClick={() => setShowPassword((prev) => ({ ...prev, next: !prev.next }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white">
                  {showPassword.next ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Confirm New Password</label>
              <div className="relative">
                <Input
                  type={showPassword.confirm ? "text" : "password"}
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirm: e.target.value }))}
                  placeholder="••••••••"
                  className="pr-11"
                />
                <button type="button" onClick={() => setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white">
                  {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full rounded-2xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-700">
              Update Password
            </button>
            {passwordStatus ? <p className="text-sm text-violet-600 dark:text-violet-300">{passwordStatus}</p> : null}
          </form>
        </SectionCard>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionCard icon={Globe} iconClassName="bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-200" title="Regional">
          <div className="space-y-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Language</label>
              <Select value={settings.regional.language} onChange={(e) => updateRegional("language", e.target.value)}>
                <option value="en-us">English (US)</option>
                <option value="so">Somali</option>
                <option value="ar">Arabic</option>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Currency</label>
              <Select value={settings.regional.currency} onChange={(e) => updateRegional("currency", e.target.value)}>
                <option value="usd">USD ($)</option>
                <option value="eur">EUR (€)</option>
                <option value="sos">SOS (Shilling)</option>
              </Select>
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={Database} iconClassName="bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200" title="Data & System">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button onClick={handleExportData} className="rounded-2xl border border-slate-200 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5">
              Export data
            </button>
            <button onClick={handleBackup} className="rounded-2xl border border-slate-200 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5">
              Backup
            </button>
            <button onClick={handleDownloadReport} className="sm:col-span-2 rounded-2xl border border-emerald-500 py-3 text-sm font-medium text-emerald-600 hover:bg-emerald-50 dark:border-emerald-400/40 dark:text-emerald-300 dark:hover:bg-emerald-500/10">
              Download reports
            </button>
          </div>
        </SectionCard>
      </section>

      <form onSubmit={handleContentSubmit}>
        <SectionCard icon={Save} iconClassName="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200" title="Backend Text Control">
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Branding</h3>
                <div className="mt-4 grid gap-4">
                  <Input value={contentForm.branding?.appName || ""} onChange={(e) => updateContentSection("branding", "appName", e.target.value)} placeholder="App name" />
                  <Input value={contentForm.branding?.sidebarTitle || ""} onChange={(e) => updateContentSection("branding", "sidebarTitle", e.target.value)} placeholder="Sidebar title" />
                  <Input value={contentForm.branding?.sidebarSubtitle || ""} onChange={(e) => updateContentSection("branding", "sidebarSubtitle", e.target.value)} placeholder="Sidebar subtitle" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Login Text</h3>
                <div className="mt-4 grid gap-4">
                  <Input value={contentForm.login?.eyebrow || ""} onChange={(e) => updateContentSection("login", "eyebrow", e.target.value)} placeholder="Eyebrow" />
                  <Input value={contentForm.login?.title || ""} onChange={(e) => updateContentSection("login", "title", e.target.value)} placeholder="Title" />
                  <Textarea value={contentForm.login?.subtitle || ""} onChange={(e) => updateContentSection("login", "subtitle", e.target.value)} placeholder="Subtitle" />
                  <Textarea value={contentForm.login?.heroTitle || ""} onChange={(e) => updateContentSection("login", "heroTitle", e.target.value)} placeholder="Hero title" />
                  <Textarea value={contentForm.login?.heroDescription || ""} onChange={(e) => updateContentSection("login", "heroDescription", e.target.value)} placeholder="Hero description" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
              <Save className="h-4 w-4" />
              Save Text Settings
            </button>
            {contentStatus ? <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-300">{contentStatus}</p> : null}
          </div>
        </SectionCard>
      </form>
    </div>
  );
}
