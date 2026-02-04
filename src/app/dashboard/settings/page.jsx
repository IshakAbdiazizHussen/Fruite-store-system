"use client";

import { Bell, User, Lock, Globe, Database } from 'lucide-react'
import React, { useMemo, useState, useEffect } from 'react'
import { useSettings } from "@/hooks/useSettings";
import { useOrders } from "@/hooks/useOrders";
import { usePurchases } from "@/hooks/usePurchases";
import { useSales } from "@/hooks/useSales";

export default function SettingsPage() {
  const { settings, updateProfile, toggleNotification, updateRegional, changePassword } = useSettings();
  const { orders } = useOrders();
  const { purchases } = usePurchases();
  const { sales, analytics } = useSales();
  const [profileForm, setProfileForm] = useState(settings.profile);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [profileStatus, setProfileStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");

  useEffect(() => {
    setProfileForm(settings.profile);
  }, [settings.profile]);

  const handleProfileSubmit = (e) => {
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

    updateProfile(profileForm);
    setProfileStatus("Profile updated successfully.");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordStatus("");

    if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
      setPasswordStatus("Fill all password fields.");
      return;
    }

    if (passwordForm.next.length < 8) {
      setPasswordStatus("New password must be at least 8 characters.");
      return;
    }

    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordStatus("New password and confirm password do not match.");
      return;
    }

    const result = changePassword(passwordForm.current, passwordForm.next);
    if (!result.ok) {
      setPasswordStatus(result.error);
      return;
    }

    setPasswordForm({ current: "", next: "", confirm: "" });
    setPasswordStatus("Password changed successfully.");
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
        <h1 className='text-3xl font-medium'>Settings</h1>
        <p className='font-light text-gray-500'>Manage your application preferences and account settings</p>
      </div>

      <section className='grid grid-cols-1 lg:grid-cols-3 gap-6 px-6'>
        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-14 w-14 rounded-2xl bg-green-100 flex items-center justify-center">
              <User className="text-green-600" size={26} />
            </div>
            <h4 className="text-xl font-medium">Profile</h4>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
              <input
                type="text"
                value={profileForm.role}
                readOnly
                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 outline-none text-gray-500 cursor-not-allowed"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-green-500 py-3 text-white font-medium hover:bg-green-600 transition-all shadow-lg shadow-green-100"
            >
              Save Changes
            </button>
            {profileStatus ? <p className="text-sm text-green-600">{profileStatus}</p> : null}
          </form>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center">
              <Bell className="text-blue-600" size={26} />
            </div>
            <h4 className="text-xl font-medium">Notifications</h4>
          </div>

          <div className="space-y-6">
            {[
              { id: 'email', label: 'Email Notifications' },
              { id: 'push', label: 'Push Notifications' },
              { id: 'lowStock', label: 'Low Stock Alerts' },
              { id: 'expiry', label: 'Expiry Alerts' },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <p className="text-gray-700 font-medium">{item.label}</p>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.notifications[item.id]}
                    onChange={() => toggleNotification(item.id)}
                  />
                  <div className="relative h-7 w-12 rounded-full bg-gray-200 transition-colors peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-6 after:w-6 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-14 w-14 rounded-2xl bg-purple-100 flex items-center justify-center">
              <Lock className="text-purple-600" size={26} />
            </div>
            <h4 className="text-xl font-medium">Security</h4>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
              <input
                type="password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, current: e.target.value }))}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
              <input
                type="password"
                value={passwordForm.next}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, next: e.target.value }))}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirm: e.target.value }))}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>
            <button type="submit" className="w-full rounded-xl bg-purple-600 py-3 text-white font-medium hover:bg-purple-700 transition-all shadow-lg shadow-purple-100">
              Update Password
            </button>
            {passwordStatus ? <p className="text-sm text-purple-600">{passwordStatus}</p> : null}
          </form>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 mt-6 mb-12">
        {/* Regional Settings */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-14 w-14 rounded-2xl bg-orange-100 flex items-center justify-center">
              <Globe className="text-orange-600" size={26} />
            </div>
            <h4 className="text-xl font-medium">Regional</h4>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Language</label>
              <select
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                value={settings.regional.language}
                onChange={(e) => updateRegional('language', e.target.value)}
              >
                <option value="en-us">English (US)</option>
                <option value="so">Somali</option>
                <option value="ar">Arabic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
              <select
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
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
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-14 w-14 rounded-2xl bg-red-100 flex items-center justify-center">
              <Database className="text-red-600" size={26} />
            </div>
            <h4 className="text-xl font-medium">Data & System</h4>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleExportData}
              className="rounded-xl border border-gray-200 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-all"
            >
              Export data
            </button>
            <button
              onClick={handleBackup}
              className="rounded-xl border border-gray-200 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-all"
            >
              Backup
            </button>
            <button
              onClick={handleDownloadReport}
              className="col-span-2 rounded-xl border border-green-500 py-3 text-green-600 font-medium hover:bg-green-50 transition-all"
            >
              Download reports
            </button>
            <button className="col-span-2 rounded-xl border-2 border-red-500 py-3 text-red-500 font-medium hover:bg-red-50 transition-all mt-4">
              Delete Account
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
